/*
 * Mini sistema da vitrine "Veja por dentro" (conheca-o-sistema.html).
 *
 * O que este arquivo faz (o porquê completo está no topo do CLAUDE.md):
 *  - Cria UM Shadow DOM dentro de #gcDemo. É o isolamento: o CSS do site
 *    (`.btn`, `.modal`, `.container`...) não entra no demo, e o CSS do
 *    sistema (`*{margin:0}`, `button`, `.modal`...) não vaza pro site.
 *    Não é iframe - é DOM real, mesmo documento.
 *  - Monta a tela ativa sob demanda (fetch do fragmento + <style> + JS
 *    da tela) e DESMONTA a anterior: remove DOM/estilo, limpa timers e
 *    descarta o `window` fake onde as `vit*` da tela viviam (várias
 *    funções se repetem entre telas com implementações diferentes).
 *  - Executa os handlers `data-gc-click/input/change` por delegação,
 *    com uma GRAMÁTICA FECHADA (sem eval/new Function). O CSP do nginx
 *    não tem 'unsafe-inline'/'unsafe-eval' em script, e os HTMLs de
 *    origem usam `onclick="..."` - o build (tools/build-demo.js) troca o
 *    nome do atributo e usa `parseHandler` daqui pra falhar cedo se
 *    aparecer sintaxe nova.
 *  - Escala o wrapper (layout desenhado pra ~1680px) via transform.
 *
 * Nada aqui é salvo: os dados são fictícios e vivem só na memória da
 * tela montada (trocar de tela reinicia, recarregar a página reinicia).
 */
(function (root) {
  'use strict';

  // ===================== gramática dos handlers =====================
  var S = String.raw`(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")`;
  var RE_STR = new RegExp('^' + S + '$');
  var RE_CLASSLIST = new RegExp('^document\\.getElementById\\(\\s*(' + S + ')\\s*\\)\\.classList\\.(toggle|remove|add)\\(\\s*(' + S + ')\\s*\\)$');
  var RE_SCROLL = new RegExp('^document\\.getElementById\\(\\s*(' + S + ')\\s*\\)\\.scrollIntoView\\(\\s*\\{([^}]*)\\}\\s*\\)$');
  var RE_VALUE = new RegExp('^document\\.getElementById\\(\\s*(' + S + ')\\s*\\)\\.value\\s*=\\s*(' + S + ')$');
  var RE_IFSELF = /^if\s*\(\s*event\.target\s*===\s*this\s*\)\s*([\s\S]+)$/;
  var RE_CALL = /^([A-Za-z_$][\w$]*)\(([\s\S]*)\)$/;

  function splitTop(src, sep) {
    var out = [], cur = '', depth = 0, q = null, i, c;
    for (i = 0; i < src.length; i++) {
      c = src[i];
      if (q) {
        cur += c;
        if (c === '\\') cur += src[++i] || '';
        else if (c === q) q = null;
        continue;
      }
      if (c === "'" || c === '"') { q = c; cur += c; continue; }
      if (c === '(' || c === '{' || c === '[') depth++;
      else if (c === ')' || c === '}' || c === ']') depth--;
      if (c === sep && depth === 0) { out.push(cur); cur = ''; continue; }
      cur += c;
    }
    out.push(cur);
    return out.map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function unquote(s) { return s.slice(1, -1).replace(/\\(.)/g, '$1'); }
  function parseArg(a) {
    a = a.trim();
    if (RE_STR.test(a)) return { k: 'lit', v: unquote(a) };
    if (/^-?\d+(\.\d+)?$/.test(a)) return { k: 'lit', v: parseFloat(a) };
    if (a === 'this') return { k: 'this' };
    if (/^this\.(value|checked|textContent)$/.test(a)) return { k: 'thisProp', p: a.slice(5) };
    if (a === 'event') return { k: 'event' };
    if (a === 'true') return { k: 'lit', v: true };
    if (a === 'false') return { k: 'lit', v: false };
    if (a === 'null') return { k: 'lit', v: null };
    throw new Error('argumento não suportado: ' + a);
  }
  function parseStmt(s) {
    var m;
    if (/^return\s+false$/.test(s)) return { t: 'prevent' };
    if (s === 'event.stopPropagation()') return { t: 'stop' };
    if ((m = RE_IFSELF.exec(s))) return { t: 'ifSelf', then: parseStmt(m[1].trim()) };
    if ((m = RE_CLASSLIST.exec(s))) return { t: 'cls', id: unquote(m[1]), op: m[2], cls: unquote(m[3]) };
    if ((m = RE_SCROLL.exec(s))) {
      var opts = {};
      splitTop(m[2], ',').forEach(function (p) {
        var kv = /^(\w+)\s*:\s*(.+)$/.exec(p);
        if (!kv || !RE_STR.test(kv[2].trim())) throw new Error('opção de scrollIntoView não suportada: ' + p);
        opts[kv[1]] = unquote(kv[2].trim());
      });
      return { t: 'scroll', id: unquote(m[1]), opts: opts };
    }
    if ((m = RE_VALUE.exec(s))) return { t: 'value', id: unquote(m[1]), v: unquote(m[2]) };
    if ((m = RE_CALL.exec(s))) return { t: 'call', name: m[1], args: splitTop(m[2], ',').map(parseArg) };
    throw new Error('sintaxe não suportada: ' + s);
  }
  var parseCache = Object.create(null);
  function parseHandler(src) {
    if (parseCache[src]) return parseCache[src];
    return (parseCache[src] = splitTop(src, ';').map(parseStmt));
  }

  function run(ops, el, ev, env, st) {
    ops.forEach(function (op) {
      switch (op.t) {
        case 'prevent': ev.preventDefault(); break;
        case 'stop': st.stopped = true; break;
        case 'ifSelf': if (ev.target === el) run([op.then], el, ev, env, st); break;
        case 'cls': { var t = env.byId(op.id); if (t) t.classList[op.op](op.cls); break; }
        case 'scroll': { var s = env.byId(op.id); if (s) s.scrollIntoView(op.opts); break; }
        case 'value': { var v = env.byId(op.id); if (v) v.value = op.v; break; }
        case 'call': {
          var fn = env.fn(op.name);
          if (!fn) { console.warn('[demo] função não encontrada:', op.name); break; }
          fn.apply(null, op.args.map(function (a) {
            return a.k === 'lit' ? a.v : a.k === 'this' ? el : a.k === 'thisProp' ? el[a.p] : ev;
          }));
          break;
        }
      }
    });
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { parseHandler: parseHandler };
  if (typeof document === 'undefined') return; // carregado pelo build (Node): só a gramática

  // ===================== app =====================
  var factories = Object.create(null);
  root.GCDemo = { define: function (key, factory) { factories[key] = factory; } };

  var host = document.getElementById('gcDemo');
  if (!host || !host.attachShadow) return;

  var BASE = host.getAttribute('data-src') || 'demo/';
  var shadow = host.attachShadow({ mode: 'open' });
  var manifest, ver = '';
  var defaultTail = '', defaultUser = ''; // shell padrão: telas que mexem nele (Perfil) são revertidas ao sair
  var els = {}; // rootEl, content, actions, head, tail, subnav, sidemenu, scroll, toast
  var current = null; // { key, ctx }
  var token = 0;
  var loadCache = Object.create(null);
  var textCache = Object.create(null);

  function fetchText(path) {
    if (!textCache[path]) {
      textCache[path] = fetch(BASE + path + ver).then(function (r) {
        if (!r.ok) throw new Error(path + ' -> ' + r.status);
        return r.text();
      });
      textCache[path].catch(function () { delete textCache[path]; });
    }
    return textCache[path];
  }
  function loadScript(path) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = BASE + path + ver;
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error('script ' + path)); };
      document.head.appendChild(s);
    });
  }
  function loadScreen(key) {
    if (!loadCache[key]) {
      var sc = manifest.screens[key];
      loadCache[key] = Promise.all([
        fetchText(sc.html),
        Promise.all(sc.css.map(fetchText)),
        factories[key] ? null : loadScript(sc.js),
      ]).then(function (r) { return { html: r[0], css: r[1] }; });
      loadCache[key].catch(function () { delete loadCache[key]; });
    }
    return loadCache[key];
  }

  function makeCtx() {
    var timers = new Set(), dead = false;
    function track(setter, clearer) {
      return function (fn, ms) {
        if (dead) return 0;
        var extra = Array.prototype.slice.call(arguments, 2);
        var id = setter(function () { timers.delete(id); if (!dead) fn.apply(null, extra); }, ms);
        timers.add(id);
        return id;
      };
    }
    var ctx = {
      window: {}, // as `window.vit*` da tela moram aqui e morrem com ela
      document: {
        getElementById: function (id) { return shadow.getElementById(id); },
        querySelector: function (s) { return shadow.querySelector(s); },
        querySelectorAll: function (s) { return shadow.querySelectorAll(s); },
        createElement: function (t) { return document.createElement(t); },
        createTextNode: function (t) { return document.createTextNode(t); },
      },
      setTimeout: track(function (f, m) { return window.setTimeout(f, m); }),
      setInterval: track(function (f, m) { return window.setInterval(f, m); }),
      clearTimeout: function (id) { window.clearTimeout(id); timers.delete(id); },
      clearInterval: function (id) { window.clearInterval(id); timers.delete(id); },
      dispose: function () {
        dead = true;
        timers.forEach(function (id) { window.clearTimeout(id); window.clearInterval(id); });
        timers.clear();
        ctx.window = {};
      },
    };
    return ctx;
  }

  // ---- navegação / montagem ----
  function navKeyOf(key) { var sc = manifest.screens[key]; return sc.group || key; }

  function renderSubnav(key) {
    var sc = manifest.screens[key];
    var g = sc.group ? manifest.groups[sc.group] : null;
    els.subnav.hidden = !(g && g.layout === 'tabs');
    els.sidemenu.hidden = !(g && g.layout === 'side');
    els.scroll.classList.toggle('gc-side', !!(g && g.layout === 'side'));
    els.subnav.textContent = '';
    els.sidemenu.textContent = '';
    if (!g) return;
    var target = g.layout === 'tabs' ? els.subnav : els.sidemenu;
    g.items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = (g.layout === 'tabs' ? 'gc-tab' : 'gc-sidebtn') + (it.screen === key ? ' active' : '');
      b.setAttribute('data-gc-go', it.screen);
      b.textContent = it.label;
      target.appendChild(b);
    });
  }

  function go(key, opts) {
    if (!manifest.screens[key]) return Promise.resolve();
    var my = ++token;
    return loadScreen(key).then(function (bundle) {
      if (my !== token) return; // clique mais novo já pediu outra tela
      var sc = manifest.screens[key];
      // desmonta a anterior (timers + window fake; DOM/estilo saem abaixo)
      if (current) current.ctx.dispose();
      var u = shadow.querySelector('.sidebar-user');
      if (u) u.innerHTML = defaultUser; // ex: o Perfil troca nome/iniciais na sidebar; sair da tela desfaz
      shadow.querySelectorAll('style[data-gc-css]').forEach(function (n) { n.remove(); });
      bundle.css.forEach(function (c) {
        var st = document.createElement('style');
        st.setAttribute('data-gc-css', '');
        st.textContent = c;
        shadow.appendChild(st);
      });
      els.content.innerHTML = bundle.html;
      els.actions.innerHTML = sc.actions;
      els.head.innerHTML = sc.head;
      els.tail.innerHTML = sc.tail || defaultTail;
      els.scroll.scrollTop = 0;
      renderSubnav(key);
      var nk = navKeyOf(key);
      shadow.querySelectorAll('[data-gc-nav]').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('data-gc-nav') === nk);
      });
      var ctx = makeCtx();
      current = { key: key, ctx: ctx };
      try { factories[key](ctx); } catch (e) { console.error('[demo] erro ao montar', key, e); }
      if (!(opts && opts.silent)) {
        try { history.replaceState(null, '', '#' + key); } catch (e) { /* file:// etc. */ }
      }
    });
  }

  function toast(msg) {
    els.toast.querySelector('[data-gc-toast-msg]').textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { els.toast.classList.remove('show'); }, 2600);
  }

  var shellFns = {
    gcTema: function () {
      var r = els.rootEl;
      r.setAttribute('data-tema', r.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro');
    },
  };
  var env = {
    byId: function (id) { return shadow.getElementById(id); },
    fn: function (name) { return (current && current.ctx.window[name]) || shellFns[name]; },
  };

  function onEvent(type) {
    return function (ev) {
      var path = ev.composedPath(), st = { stopped: false }, i, el, src;
      if (type === 'click') {
        for (i = 0; i < path.length; i++) {
          el = path[i];
          if (!(el instanceof Element)) continue;
          if (el.hasAttribute('data-gc-nav')) {
            ev.preventDefault();
            var nav = manifest.nav[el.getAttribute('data-gc-nav')];
            var dest = nav.screen || manifest.groups[nav.group].default;
            go(dest);
            return;
          }
          if (el.hasAttribute('data-gc-go')) { ev.preventDefault(); go(el.getAttribute('data-gc-go')); return; }
          if (el.hasAttribute('data-gc-locked')) {
            ev.preventDefault();
            toast('"' + el.getAttribute('data-gc-locked-label') + '" está no sistema completo. Aqui é só uma demonstração.');
            return;
          }
        }
      }
      for (i = 0; i < path.length && !st.stopped; i++) {
        el = path[i];
        if (!(el instanceof Element)) continue;
        src = el.getAttribute('data-gc-' + type);
        if (!src) continue;
        try { run(parseHandler(src), el, ev, env, st); } catch (e) { console.error('[demo] handler falhou:', src, e); }
      }
      if (type === 'click') { // <a href="#"> solto nunca pode mexer no hash/scroll do site
        var a = ev.target instanceof Element && ev.target.closest('a[href="#"]');
        if (a) ev.preventDefault();
      }
    };
  }

  // ---- escala ----
  var viewport, scaler, hint;
  function layout() {
    var W = host.clientWidth;
    if (!W || !els.rootEl) return;
    var L, s;
    if (W >= 1680) { L = W; s = 1; } // monitor grande: usa a largura toda, sem ampliar
    else if (W >= 1120) { L = 1680; s = W / 1680; }
    else { L = 1120; s = Math.max(W / 1120, 0.55); } // celular: rolagem horizontal controlada abaixo de 55%
    var top = host.getBoundingClientRect().top + window.scrollY;
    var H = Math.min(1200, Math.max(640, (window.innerHeight - top - 44) / s));
    els.rootEl.style.width = L + 'px';
    els.rootEl.style.height = H + 'px';
    els.rootEl.style.transform = 'scale(' + s + ')';
    scaler.style.width = L * s + 'px';
    scaler.style.height = H * s + 'px';
    viewport.style.height = H * s + 'px';
    hint.hidden = L * s <= W + 1;
  }

  function fail(e) {
    console.error('[demo]', e);
    host.textContent = 'Não foi possível carregar a demonstração agora. Recarregue a página ou volte ao site.';
  }

  // ---- init ----
  fetch(BASE + 'manifest.json', { cache: 'no-cache' }).then(function (r) {
    if (!r.ok) throw new Error('manifest ' + r.status);
    return r.json();
  }).then(function (m) {
    manifest = m;
    ver = '?v=' + m.version;
    return Promise.all([fetchText('base.css'), fetchText('shell.frag')]);
  }).then(function (r) {
    var st = document.createElement('style');
    st.textContent = r[0];
    shadow.appendChild(st);
    viewport = document.createElement('div');
    viewport.className = 'gc-viewport';
    scaler = document.createElement('div');
    scaler.className = 'gc-scaler';
    scaler.innerHTML = r[1];
    viewport.appendChild(scaler);
    hint = document.createElement('p');
    hint.className = 'gc-hint';
    hint.hidden = true;
    hint.textContent = 'Arraste para o lado para ver a tela toda.';
    shadow.appendChild(viewport);
    shadow.appendChild(hint);
    var q = function (s) { return shadow.querySelector(s); };
    els = {
      rootEl: q('#gcRoot'), content: q('[data-gc-content]'), actions: q('[data-gc-actions]'),
      head: q('[data-gc-head]'), tail: q('[data-gc-tail]'), subnav: q('[data-gc-subnav]'),
      sidemenu: q('[data-gc-sidemenu]'), scroll: q('[data-gc-scroll]'), toast: q('[data-gc-toast]'),
    };
    defaultUser = (shadow.querySelector('.sidebar-user') || { innerHTML: '' }).innerHTML;
    defaultTail = els.tail.innerHTML; // sino + avatar padrão (o Início traz os próprios)
    // rótulo dos itens bloqueados pro aviso
    shadow.querySelectorAll('[data-gc-locked]').forEach(function (a) {
      a.setAttribute('data-gc-locked-label', manifest.nav[a.getAttribute('data-gc-locked')].label);
    });
    ['click', 'input', 'change'].forEach(function (t) { shadow.addEventListener(t, onEvent(t)); });
    layout();
    // celular: começa com a sidebar recolhida (o sistema já tem esse modo de 64px) pra sobrar
    // mais área de conteúdo na janela de 55% de escala; o hambúrguer reabre.
    if (host.clientWidth < 768) shadow.getElementById('sidebar').classList.add('collapsed');
    if (window.ResizeObserver) new ResizeObserver(layout).observe(host);
    window.addEventListener('resize', layout);

    // #tela (ou #chave-da-sidebar) escolhe a tela; hash desconhecido/bloqueado cai no padrão
    var fromHash = function () {
      var h = (location.hash || '').slice(1), n = manifest.nav[h];
      return manifest.screens[h] ? h : (n && (n.screen || (n.group && manifest.groups[n.group].default))) || null;
    };
    window.addEventListener('hashchange', function () { // voltar/avançar do navegador, links com #
      var k = fromHash();
      if (k && (!current || current.key !== k)) go(k, { silent: true });
    });
    var first = fromHash() || manifest.default;
    return go(first, { silent: true });
  }).then(function () {
    layout();
    host.setAttribute('data-ready', '');
    // pré-carrega o resto em segundo plano (HTML/JS/CSS pequenos, cache HTTP)
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 800); };
    idle(function () { Object.keys(manifest.screens).forEach(function (k) { loadScreen(k).catch(function () {}); }); });
  }).catch(fail);
})(typeof window !== 'undefined' ? window : globalThis);

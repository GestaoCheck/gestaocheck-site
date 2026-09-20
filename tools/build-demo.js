/*
 * Gera o mini sistema da vitrine ("Veja por dentro") a partir das telas
 * congeladas em tools/demo-src/vitrine_<tela>.html (só as versões
 * ESCURAS - a clara é idêntica, muda apenas `data-tema` no <html>; o
 * tema é alternado em runtime pelo wrapper).
 *
 * Saída (tudo em demo/, código legível, nada minificado à mão):
 *   demo/manifest.json        telas, grupos (abas/menu), navegação, versão
 *   demo/shell.frag           sidebar + topbar + áreas (montado UMA vez)
 *   demo/base.css             CSS base + tema + shell, reescrito pro wrapper
 *   demo/css/<hash>.css       CSS específico de tela (deduplicado por hash)
 *   demo/screens/<tela>.frag  só a área de conteúdo da tela
 *   demo/screens/<tela>.js    factory `GCDemo.define(...)` da tela
 *
 * Rodar (na pasta tools/):  npm install && npm run build
 *
 * Regras que o build garante (o porquê está no CLAUDE.md, no topo):
 *  - ZERO handler inline (`onclick=`...) e ZERO eval: todo `onclick/
 *    oninput/onchange` vira `data-gc-click/input/change` e é executado
 *    por um interpretador de gramática fechada (js/demo.js). O build
 *    FALHA se achar handler estático fora da gramática, em vez de
 *    deixar quebrar em produção por causa do CSP (`script-src` sem
 *    'unsafe-inline'/'unsafe-eval').
 *  - CSS reescrito: `:root`/`body`/`html`/`[data-tema]` -> `.gc-demo`,
 *    `vh/vw` -> valores relativos ao wrapper, `@media (max-width)`
 *    removidas (o layout é fixo em ~1680px e escalado por transform).
 *    O isolamento em si (site <-> demo) é Shadow DOM, ver js/demo.js.
 *  - Cada script de tela vira uma factory que recebe `ctx` com
 *    `window`/`document`/timers PRÓPRIOS - as `window.vit*` (que se
 *    repetem entre telas com implementações diferentes) morrem junto
 *    com a tela, sem vazar nada pro global.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const postcss = require('postcss');
const { parseHandler } = require('../js/demo.js');

const SRC = path.join(__dirname, 'demo-src');
const OUT = path.join(__dirname, '..', 'demo');
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 10);
const warnings = [];

// ---- catálogo: arquivo de origem -> tela/grupo ---------------------------
// `group` = a tela vive como aba/item de menu dentro de outra área (no
// sistema real Caixa é aba do CMC, DRE/Curva ABC/Insights são abas de
// Relatórios, e as 3 de Configurações são sub-seções). As telas de
// origem NÃO têm esse menu interno, então o shell gera.
const SCREENS = {
  inicio:      { src: 'inicio' },
  estoque:     { src: 'estoque' },
  cmv:         { src: 'cmv', group: 'cmv', label: 'Visão geral' },
  cmv_vendas:  { src: 'cmv_vendas', group: 'cmv', label: 'Vendas' },
  cmo:         { src: 'cmo' },
  cmc:         { src: 'cmc', group: 'cmc', label: 'Visão geral' },
  caixa:       { src: 'caixa', group: 'cmc', label: 'Caixa' },
  despesas:    { src: 'despesas' },
  beneficiamento: { src: 'beneficiamento' },
  avarias:     { src: 'avarias' },
  ocorrencias: { src: 'ocorrencias' },
  checklists:  { src: 'checklists' },
  manutencao:  { src: 'manutencao' },
  requisicao:  { src: 'requisicao' },
  patrimonio:  { src: 'patrimonio' },
  dre:         { src: 'dre', group: 'relatorios', label: 'DRE completa' },
  curva_abc:   { src: 'curva_abc', group: 'relatorios', label: 'Curva ABC' },
  insights:    { src: 'relatorio_insights', group: 'relatorios', label: 'Insights' },
  config_perfil:    { src: 'config_perfil', group: 'config', label: 'Perfil' },
  config_notificacoes: { src: 'config_notificacoes', group: 'config', label: 'Notificações' },
  config_setores:   { src: 'config_setores', group: 'config', label: 'Setores e categorias' },
  config_usuarios:  { src: 'config_usuarios', group: 'config', label: 'Usuários' },
  config_ia:        { src: 'config_ia', group: 'config', label: 'Inteligência Artificial' },
};
const GROUPS = {
  cmv: { layout: 'tabs', default: 'cmv' },
  cmc: { layout: 'tabs', default: 'cmc' },
  relatorios: { layout: 'tabs', default: 'dre' },
  config: { layout: 'side', default: 'config_perfil' },
};
// título da sidebar (atributo title=) -> chave de navegação
const NAV = {
  'Início': { key: 'inicio', screen: 'inicio' },
  'Estoque': { key: 'estoque', screen: 'estoque' },
  'CMV': { key: 'cmv', group: 'cmv' },
  'CMO': { key: 'cmo', screen: 'cmo' },
  'CMC': { key: 'cmc', group: 'cmc' },
  'Despesas': { key: 'despesas', screen: 'despesas' },
  'Beneficiamento': { key: 'beneficiamento', screen: 'beneficiamento' },
  'Avarias': { key: 'avarias', screen: 'avarias' },
  'Ocorrências': { key: 'ocorrencias', screen: 'ocorrencias' },
  'Checklists': { key: 'checklists', screen: 'checklists' },
  'Manutenção': { key: 'manutencao', screen: 'manutencao' },
  'Requisição': { key: 'requisicao', screen: 'requisicao' },
  'Patrimônio': { key: 'patrimonio', screen: 'patrimonio' },
  'Relatórios': { key: 'relatorios', group: 'relatorios' },
  'Configurações': { key: 'config', group: 'config' },
};
const LOCK_SVG = '<svg class="gc-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>';

// ---- helpers --------------------------------------------------------------
const blocks = (html, tag) => [...html.matchAll(new RegExp('<' + tag + '\\b[^>]*>([\\s\\S]*?)</' + tag + '>', 'g'))].map((m) => m[1]);

// onclick="..." -> data-gc-click="..." (HTML estático e HTML montado dentro
// dos scripts - la o valor pode ter concatenacao, entao so troca o NOME
// do atributo; a gramatica e validada em runtime tambem).
function rewriteHandlers(text) {
  return text.replace(/(?<![.\w])on(click|input|change)=(?=\\?["'])/g, 'data-gc-$1=');
}

function unescapeAttr(v) {
  return v.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

const validated = new Set();
function validateHandlers(text, where, { skipConcat }) {
  for (const m of text.matchAll(/data-gc-(?:click|input|change)=(?:\\?")([^"]*?)(?:\\?")/g)) {
    let v = unescapeAttr(m[1]).replace(/\\'/g, "'");
    if (skipConcat && /'\s*\+|\+\s*'/.test(v)) continue; // montado em runtime
    try { parseHandler(v); validated.add(v); } catch (e) { throw new Error(`[${where}] handler fora da gramática: ${v}\n  ${e.message}`); }
  }
}

// ---- CSS --------------------------------------------------------------
const seenAt = new Set();
function mapSelector(sel) {
  let s = sel.trim();
  if (/^html\s*$/.test(s)) return null; // html{scrollbar-gutter} nao faz sentido no wrapper
  s = s.replace(/^:root\b/, '.gc-demo');
  s = s.replace(/^html\[data-tema="escuro"\]/, '.gc-demo[data-tema="escuro"]');
  s = s.replace(/^html\.([\w-]+)/, '.gc-demo.$1');
  s = s.replace(/^\[data-tema="escuro"\]\s*body\b/, '.gc-demo[data-tema="escuro"]');
  s = s.replace(/^\[data-tema="escuro"\]/, '.gc-demo[data-tema="escuro"]');
  s = s.replace(/^body\b/, '.gc-demo');
  if (/(^|[\s>+~])(html|body|:root)\b/.test(s)) warnings.push('seletor global sobrou: ' + s);
  return s;
}

function scopeCss(css, label) {
  const root = postcss.parse(css);
  root.walkAtRules((at) => {
    seenAt.add('@' + at.name + ' ' + (at.name === 'media' ? at.params : ''));
    if (at.name === 'view-transition') at.remove();
    // layout fixo em ~1680px + transform:scale -> variantes mobile por
    // largura de VIEWPORT nunca podem disparar (o "viewport" do demo e o wrapper)
    else if (at.name === 'media' && /(max|min)-width|(max|min)-height/.test(at.params)) at.remove();
  });
  root.walkRules((rule) => {
    if (rule.parent && rule.parent.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
    const sels = rule.selectors.map(mapSelector).filter(Boolean);
    if (!sels.length) return rule.remove();
    rule.selectors = sels;
  });
  root.walkDecls((d) => {
    d.value = d.value
      .replace(/(-?\d*\.?\d+)vh\b/g, '$1%') // relativo ao wrapper (containing block dos fixed)
      .replace(/(-?\d*\.?\d+)vw\b/g, (m, n) => +(parseFloat(n) * 16.8).toFixed(2) + 'px'); // 1% de 1680
  });
  return root.toString();
}

// ---- carrega telas ----------------------------------------------------
const files = {}; // nome-de-saida -> conteudo
const manifest = { default: 'inicio', nav: {}, groups: {}, screens: {} };
let sidebarHtml = '';
const tails = {}; // sino + avatar por tela (iguais em todas, exceto Início que tem handlers próprios)
let baseCss = '';

for (const [key, def] of Object.entries(SCREENS)) {
  const html = fs.readFileSync(path.join(SRC, `vitrine_${def.src}.html`), 'utf8');
  if (!/<html[^>]*data-tema="escuro"/.test(html)) throw new Error(key + ': esperava a versão ESCURA');
  const styles = blocks(html, 'style');
  const scripts = blocks(html, 'script');
  if (scripts.length !== 1) throw new Error(`${key}: esperava 1 <script>, achou ${scripts.length}`);

  // base + tema: idênticos em todas as telas (conferido por hash)
  const base = scopeCss(styles[0] + '\n' + styles[1], 'base');
  if (!baseCss) baseCss = base;
  else if (baseCss !== base) throw new Error(key + ': base CSS difere das outras telas - o shell compartilhado quebraria');

  // sidebar: idêntica em todas (só muda .active) - pega da primeira
  if (!sidebarHtml) sidebarHtml = html.match(/<aside class="sidebar" id="sidebar">[\s\S]*?<\/aside>/)[0];

  // topbar: cabeçalho (título/subtítulo - o Início tem saudação no lugar), ações
  // extras da tela (ex: "+ Registrar compra") e "rabo" (sino + avatar)
  const top = html.match(/<header class="topbar">([\s\S]*?)<\/header>/)[1];
  const head0 = top.match(/<div class="topbar-titulo-grupo">([\s\S]*?)<\/div>\s*<div class="topbar-right">/)[1]
    .replace(/<button class="topbar-hamburguer"[\s\S]*?<\/button>/, '').trim();
  const head = head0
    .replace('class="page-title"', 'class="page-title" data-gc-title').replace('class="page-sub"', 'class="page-sub" data-gc-sub')
    .replace('class="greeting"', 'class="greeting" data-gc-title').replace('class="subgreeting"', 'class="subgreeting" data-gc-sub');
  if (!/data-gc-title/.test(head)) throw new Error(key + ': topbar sem título reconhecível');
  const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const title = strip((head.match(/data-gc-title[^>]*>([\s\S]*?)<\/(?:h1|p)>/) || [])[1] || key);
  const sub = strip((head.match(/data-gc-sub[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '');
  const rightHtml = top.slice(top.indexOf('<div class="topbar-right">') + '<div class="topbar-right">'.length);
  const notifAt = rightHtml.indexOf('<div class="topbar-notif"');
  const actions = rewriteHandlers(rightHtml.slice(0, notifAt).trim());
  tails[key] = rewriteHandlers(rightHtml.slice(notifAt).replace(/<\/div>\s*$/, '').trim());
  validateHandlers(tails[key], key + ' topbar-tail', { skipConcat: false });

  // conteúdo
  const cStart = html.indexOf('<div class="content">') + '<div class="content">'.length;
  const cEnd = html.lastIndexOf('</div>', html.indexOf('</main>'));
  let content = rewriteHandlers(html.slice(cStart, cEnd)).trim();
  validateHandlers(content, key + '.frag', { skipConcat: false });
  validateHandlers(actions, key + ' topbar', { skipConcat: false });
  if (/<script|javascript:/i.test(content)) throw new Error(key + ': script/javascript: no conteúdo');
  if (/\d(vh|vw)\b/.test(content)) warnings.push(key + ': vh/vw em style inline do conteúdo');

  // css da tela (1 arquivo por <style>, deduplicado por hash)
  const css = styles.slice(2).map((c) => scopeCss(c, key)).filter((c) => c.trim());
  const cssRefs = css.map((c) => {
    const name = 'css/' + md5(c) + '.css';
    files[name] = c;
    return name;
  });

  // js -> factory
  const js = rewriteHandlers(scripts[0]);
  validateHandlers(js, key + '.js', { skipConcat: true });
  const globals = [...new Set([...js.matchAll(/window\.(_?vit\w+)\s*=/g)].map((m) => m[1]))];
  files[`screens/${key}.js`] =
    `/* GERADO por tools/build-demo.js a partir de vitrine_${def.src}.html - não editar à mão. */\n` +
    `GCDemo.define(${JSON.stringify(key)}, function (ctx) {\n` +
    `  var window = ctx.window, document = ctx.document,\n` +
    `      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,\n` +
    `      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;\n` +
    // `with`: nas telas originais `window.vitX = fn` vira global implícito e
    // OUTRAS funções chamam `vitX()` SEM `window.` (achado testando
    // config_setores: vitCriarItem chama vitRenomear). Aqui o `window` é
    // por tela, então o `with` mantém essa resolução - e só enxerga as
    // funções DESTA tela.
    `  with (window) {\n` + js.trim() + '\n  }\n});\n';
  files[`screens/${key}.frag`] = content + '\n';

  manifest.screens[key] = {
    title, sub, head: rewriteHandlers(head), actions,
    group: def.group || null, label: def.label || title,
    html: `screens/${key}.frag`, js: `screens/${key}.js`, css: cssRefs, globals,
  };
}
for (const [k, sc] of Object.entries(manifest.screens)) sc.tail = tails[k] !== tails.estoque ? tails[k] : null;
Object.assign(manifest.groups, GROUPS);
for (const [g, def] of Object.entries(GROUPS)) {
  manifest.groups[g] = { ...def, items: Object.entries(SCREENS).filter(([, s]) => s.group === g).map(([k, s]) => ({ screen: k, label: s.label })) };
}

// ---- sidebar / shell ------------------------------------------------------
let side = sidebarHtml.replace(/<a href="#" class="nav-item( active)?" title="([^"]+)" onclick="return false;">/g, (m, a, t) => {
  const n = NAV[t];
  if (!n) throw new Error('item de sidebar sem mapeamento: ' + t);
  manifest.nav[n.key] = n.locked ? { locked: true, label: t } : { screen: n.screen || null, group: n.group || null, label: t };
  if (n.locked) return `<a href="#" class="nav-item gc-locked" title="Disponível no sistema completo" aria-disabled="true" data-gc-locked="${n.key}">`;
  return `<a href="#" class="nav-item" title="${t}" data-gc-nav="${n.key}">`;
});
// selo de cadeado no fim dos itens bloqueados
side = side.replace(/(<a [^>]*gc-locked[^>]*>[\s\S]*?)(<\/a>)/g, (m, a, b) => a + LOCK_SVG + b);
side = rewriteHandlers(side);
validateHandlers(side, 'sidebar', { skipConcat: false });
if (Object.keys(manifest.nav).length !== Object.keys(NAV).length) throw new Error('sidebar com itens faltando/sobrando');

const shell = `<div class="gc-demo" data-tema="escuro" id="gcRoot">
  <div class="layout">
    ${side}
    <main class="main">
      <header class="topbar">
        <div class="topbar-titulo-grupo" data-gc-head></div>
        <div class="topbar-right">
          <span class="gc-actions" data-gc-actions></span>
          <button type="button" class="topbar-notif" id="temaToggleRapido" title="Alternar tema claro/escuro" aria-label="Alternar tema claro/escuro" data-gc-click="gcTema()">
            <span class="icone-sol"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg></span>
            <span class="icone-lua"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg></span>
          </button>
          <span class="gc-tail" data-gc-tail>${tails.estoque}</span>
        </div>
      </header>
      <div class="gc-subnav" data-gc-subnav hidden></div>
      <div class="gc-scroll" data-gc-scroll>
        <nav class="gc-sidemenu" data-gc-sidemenu hidden></nav>
        <div class="content" data-gc-content></div>
      </div>
    </main>
    <div class="toast aviso" data-gc-toast role="status" aria-live="polite"><span data-gc-toast-msg></span></div>
  </div>
</div>
`;
files['shell.frag'] = shell;
validateHandlers(shell, 'shell', { skipConcat: false });

// base.css = CSS do sistema reescrito + shell (à mão, tools/demo-shell.css)
const shellCss = fs.readFileSync(path.join(__dirname, 'demo-shell.css'), 'utf8');
files['base.css'] = '/* GERADO por tools/build-demo.js - não editar à mão (fonte do shell: tools/demo-shell.css). */\n' + baseCss + '\n' + shellCss;

// ---- escreve ---------------------------------------------------------
manifest.version = md5(JSON.stringify(manifest) + Object.values(files).join(''));
files['manifest.json'] = JSON.stringify(manifest, null, 2) + '\n';

for (const sub of ['screens', 'css']) fs.rmSync(path.join(OUT, sub), { recursive: true, force: true });
for (const f of ['manifest.json', 'shell.frag', 'shell.html', 'base.css']) fs.rmSync(path.join(OUT, f), { force: true });
for (const [name, body] of Object.entries(files)) {
  const p = path.join(OUT, name);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body);
}

console.log(`demo/ gerado: ${Object.keys(SCREENS).length} telas, ${Object.keys(files).filter((f) => f.startsWith('css/')).length} css únicos, versão ${manifest.version}`);
console.log(`handlers estáticos validados (únicos): ${validated.size}`);
console.log('at-rules vistas:', [...seenAt].join(' | '));
if (warnings.length) console.log('AVISOS:\n - ' + [...new Set(warnings)].join('\n - '));

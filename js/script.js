// Abertura (splash) - zoom no logo ao rolar, revela o Hero. JS puro,
// fora do bloco condicionado ao GSAP (não depende dele) - roda mesmo se
// GSAP/Lenis falharem em carregar. IIFE própria + try/catch por fora:
// se algo aqui falhar mesmo assim, não pode travar o resto do
// script.js (menu, modais etc. vêm depois neste arquivo).
//
// Só existe a zona de ABERTURA agora - a versão espelhada no fim da
// página (zona de fechamento, "se afastando" de volta pro logo) foi
// removida a pedido do Carlos: ele gostou do efeito de abrir o site,
// mas achou o de fechar desnecessário. Tirar ela também encurta o site
// em ~200vh (2 telas) e derruba um contexto WebGL a menos rodando -
// ajuda direto o fix do scroll de âncora (menos distância/trabalho por
// salto grande) e a performance geral.
(function initSplash() {
    const zoneTop = document.getElementById('splashZoneTop');
    if (!zoneTop) return;

    const logoTop = document.getElementById('splashLogoTop');
    const blackTop = document.getElementById('splashBlackTop');
    const dotsTop = document.getElementById('splashDotsTop');
    const starsTop = document.getElementById('splashStarsTop');
    const canvasTop = document.getElementById('splash-3d-top');
    const decorTop = document.getElementById('splashDecorTop');
    const hint = document.getElementById('splashHint');

    // Starfield - espalha pontinhos por TODA a tela (0-100% em x e y),
    // ao contrário da rede de pontos/3D que fica concentrada perto do
    // centro (onde o logo está) - sem isso os cantos/bordas da tela
    // ficavam vazios, principalmente em monitor largo.
    function buildStarfield(container) {
        for (let i = 0; i < 45; i++) {
            const star = document.createElement('div');
            const size = 1 + Math.round(Math.random() * 2);
            star.className = 'splash-star' + (Math.random() < 0.2 ? ' coral' : '');
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = (Math.random() * 100) + '%';
            star.style.top = (Math.random() * 100) + '%';
            star.style.animationDuration = (2.5 + Math.random() * 3.5) + 's';
            star.style.animationDelay = (Math.random() * 4) + 's';
            container.appendChild(star);
        }
    }
    if (starsTop) buildStarfield(starsTop);

    function buildDots(container) {
        const pts = [[15, 25], [35, 15], [55, 30], [75, 18], [25, 60], [50, 68], [70, 55], [85, 40], [10, 70], [45, 45]];
        const pairs = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 7], [2, 5], [8, 4], [9, 2], [9, 5]];
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'splash-lines');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        pairs.forEach(([a, b]) => {
            const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            l.setAttribute('x1', pts[a][0]);
            l.setAttribute('y1', pts[a][1]);
            l.setAttribute('x2', pts[b][0]);
            l.setAttribute('y2', pts[b][1]);
            svg.appendChild(l);
        });
        container.appendChild(svg);
        pts.forEach((p, i) => {
            const d = document.createElement('div');
            d.className = 'splash-dot' + (i % 3 === 0 ? ' coral' : '');
            d.style.left = p[0] + '%';
            d.style.top = p[1] + '%';
            d.style.animation = `splashDrift${(i % 3) + 1} ${6 + i}s ease-in-out infinite`;
            container.appendChild(d);
        });
    }
    buildDots(dotsTop);

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    // Suaviza a progressão (início e fim mais devagar, meio mais
    // rápido) em vez de uma reta crua - pedido do Carlos pra deixar a
    // abertura "mais fluida": sem isso o zoom começava a acelerar
    // desde o primeiro pixel de scroll, o que lê como brusco.
    function smoothstep(t) { return t * t * (3 - 2 * t); }

    // ZONA DE ABERTURA (topo): zoom pra dentro da logo, prende no
    // preto sólido por um trecho bom (não é só um degradê que nunca
    // fica 100% opaco - isso já tinha sido corrigido antes), e só
    // clareia rápido no fim. É de ida só - depois de clarear, revela o
    // Hero por trás e não volta.
    function applyOpenCurve(p, logoEl, blackEl, dotsEl, canvasEl, decorEl) {
        const zoomP = smoothstep(clamp(p / 0.55, 0, 1));
        const scale = 1 + zoomP * zoomP * 50;
        const blur = zoomP * 14;
        logoEl.style.transform = `scale(${scale})`;
        logoEl.style.filter = `blur(${blur}px)`;
        dotsEl.style.opacity = 1 - zoomP * 0.7;
        if (canvasEl) canvasEl.style.opacity = 0.8 * (1 - zoomP * 0.6);

        const darkP = clamp((p - 0.4) / 0.15, 0, 1);
        // Bug real corrigido - "buga"/tela vazia ao rolar de volta pro
        // topo: essa janela era (p-0.85)/0.15 (15% da zona) - só que
        // durante todo esse trecho o `.splash-sticky` AINDA está preso
        // (só solta em p=1, quando o Hero passa a existir de verdade na
        // tela) - clarear a cena 15% antes do sticky soltar abria um
        // vão onde não tem NEM o preto/logo (já clareando) NEM o Hero
        // (ainda não chegou, o sticky ainda cobre a tela) - só a cor de
        // fundo lisa da `.splash-sticky` aparecendo, lendo como "bugado"
        // (pedido do Carlos: "assim que sair do preto já quero estar no
        // começo do site", não nesse vão). Janela estreitada pra 3% bem
        // no fim (0.97-1.0) - o clareamento agora é rápido o bastante
        // pra terminar praticamente junto do instante em que o sticky
        // solta e o Hero passa a estar mesmo ali atrás.
        const clearP = clamp((p - 0.97) / 0.03, 0, 1);
        blackEl.style.opacity = darkP * (1 - clearP);
        logoEl.style.opacity = 1 - clearP;
        // Bug real corrigido (achado junto): o fade de "some tudo" (rede
        // de pontos, canvas 3D, pulsos, cantos, starfield) era aplicado
        // direto no `.splash-sticky` - como isso é o PAI do
        // `.splash-blackout` também, a opacidade do preto acabava
        // MULTIPLICADA pela do pai (cascata de opacity), esvaziando o
        // preto bem antes da hora (uma lavagem fraca em vez de preto de
        // verdade). Agora o fade mira só `.splash-decor` (novo wrapper
        // em volta de tudo, MENOS o preto - ver index.html/style.css) -
        // o preto calcula a própria opacidade sozinho, sem interferência.
        if (decorEl) decorEl.style.opacity = 1 - clearP;
    }

    function update() {
        const vh = window.innerHeight;

        const topRect = zoneTop.getBoundingClientRect();
        const topScrollable = zoneTop.offsetHeight - vh;
        const pTop = clamp((0 - topRect.top) / Math.max(topScrollable, 1), 0, 1);
        applyOpenCurve(pTop, logoTop, blackTop, dotsTop, canvasTop, decorTop);

        if (hint) hint.style.opacity = window.scrollY > 40 ? 0 : 1;

        // Header some enquanto o zoom da abertura está em curso (fica
        // esquisito um menu de navegação por cima da tela cheia do
        // logo) - volta já sincronizado com o instante em que o preto
        // começa a clarear, não só no fim exato da zona.
        document.documentElement.classList.toggle('intro-active', pTop < 0.97);
    }

    // Listener nativo como base (funciona mesmo sem Lenis carregar) +
    // conecta no evento de scroll do PRÓPRIO Lenis quando ele existir
    // (ver bloco do GSAP mais abaixo, que expõe `window.__splashUpdate`
    // pra isso) - o evento do Lenis dispara a cada frame já interpolado
    // do scroll suave, mais fino que só reagir ao evento nativo por
    // cima do scroll virtual dele. Pedido do Carlos: deixar a abertura
    // "mais fluida".
    window.__splashUpdate = update;
    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Ano dinâmico no rodapé
const anoAtualEl = document.getElementById('ano-atual');
if (anoAtualEl) {
    anoAtualEl.textContent = new Date().getFullYear();
}

// Menu Mobile (hambúrguer)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navToggle.innerHTML = isOpen ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Fecha o menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Dropdown "Funcionalidades" no menu (14/09/2026) - por clique, não
// hover (mais previsível em mega-menu, e funciona igual em mouse/touch
// sem precisar de duas lógicas diferentes).
document.querySelectorAll('.nav-dropdown-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = toggle.closest('.nav-dropdown');
        const isOpen = dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
});
document.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    link.addEventListener('click', () => {
        const dropdown = link.closest('.nav-dropdown');
        dropdown.classList.remove('open');
        dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
});
document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dropdown.open').forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
            dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
    });
});

// "Voltar ao site" do modo app (conheca-o-sistema.html) - o link
// normal (`href="index.html"`) sempre pousa no topo do zero, perdendo
// onde a pessoa estava rolando antes de clicar em "Conhecer o
// sistema". Se realmente existe histórico de navegação vindo do
// próprio site (não é link direto/favorito caindo aqui sem passar
// pelo site antes), usa `history.back()` em vez do link - é
// exatamente o que aperta o botão Voltar do navegador faria, e o
// navegador já restaura a posição de scroll sozinho nesse caso.
const appBackLink = document.querySelector('.app-topbar-back');
if (appBackLink) {
    appBackLink.addEventListener('click', (e) => {
        const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
        if (window.history.length > 1 && cameFromSite) {
            e.preventDefault();
            window.history.back();
        }
    });
}

// Modal "com quem você quer falar" (Solicitar demonstração) e também os
// popups de módulo (grid #modulos) - mesmo mecanismo pros dois, só o
// conteúdo interno muda por `id`. `MODULE_CURSOR_TIMELINES` é populado
// mais abaixo (perto do resto do cursor de demonstração) - cada popup
// com screenshot ganha uma entrada lá, tocada/pausada aqui.
const MODULE_CURSOR_TIMELINES = {};

// Mensagem do WhatsApp dentro do #contactModal é dinâmica agora - os
// 3 cards de plano (#planos) abrem o MESMO modal de sempre, só que com
// a mensagem já mencionando qual plano interessou, em vez de duplicar
// o modal 3 vezes. Guarda a URL base (sem `?text=`) de cada link uma
// vez só, no carregamento - `setContactModalMessage()` reescreve só a
// parte do texto sempre que o modal abre (com mensagem custom vinda de
// `data-plan-message`, ou a mensagem padrão de "Solicitar demonstração"
// quando abre pelos botões genéricos).
const CONTACT_OPTION_BASE_HREFS = new Map();
document.querySelectorAll('#contactModal .contact-option').forEach((a) => {
    CONTACT_OPTION_BASE_HREFS.set(a, a.href.split('?')[0]);
});
const DEFAULT_CONTACT_MESSAGE = 'Olá, gostaria de solicitar uma demonstração do GestãoCheck';
function setContactModalMessage(text) {
    CONTACT_OPTION_BASE_HREFS.forEach((base, a) => {
        a.href = `${base}?text=${encodeURIComponent(text)}`;
    });
}

// Alternância claro/escuro das telas do sistema embutidas (17/09/2026)
// - Carlos pediu algo "bacana" usando o modo claro, que os 23 arquivos
// de origem sempre tiveram mas nunca chegaram a ser usados no site (só
// o escuro). Só as TELAS do sistema trocam de tema - o site em volta
// continua sempre escuro. A convenção de nome já garante a contraparte
// de cada arquivo (todo `X.html`/`X.gif` escuro tem um par claro
// `X-branco.html`/`X-branco.gif`) - não precisa de atributo novo em
// cada `<iframe>`/`<img>` do HTML, só derivar pelo nome do arquivo já
// carregado. Sem persistência entre visitas de propósito (o site não
// usa nenhum tipo de armazenamento local hoje, ver privacidade.html) -
// volta pro escuro a cada carregamento de página.
function sysThemeSrc(url, theme) {
    if (!url) return url;
    const isLight = /-branco\.svg(\?|$)/i.test(url);
    if (theme === 'light' && !isLight) return url.replace(/\.svg(\?|$)/i, '-branco.svg$1');
    if (theme === 'dark' && isLight) return url.replace(/-branco\.svg/i, '.svg');
    return url;
}

// Troca o par claro/escuro de toda imagem SVG do sistema no site (seções e
// popups, inclusive a tela "antes" do cursor). Trocar o `src` de um SVG
// animado reinicia a animação dele - esperado. Popups ainda não abertos só
// têm `data-src` (lazy, ver `abrirModal`): atualiza os dois.
function applySysTheme(theme) {
    document.body.dataset.sysTheme = theme;
    document.querySelectorAll('img.sys-theme-img').forEach((img) => {
        if (img.dataset.src) img.dataset.src = sysThemeSrc(img.dataset.src, theme);
        if (img.hasAttribute('src')) img.setAttribute('src', sysThemeSrc(img.getAttribute('src'), theme));
    });
}

const sysThemeToggleBtn = document.getElementById('sysThemeToggle');
if (sysThemeToggleBtn) {
    sysThemeToggleBtn.addEventListener('click', () => {
        const next = document.body.dataset.sysTheme === 'light' ? 'dark' : 'light';
        applySysTheme(next);
        sysThemeToggleBtn.setAttribute('aria-pressed', String(next === 'light'));
        sysThemeToggleBtn.innerHTML = next === 'light'
            ? '<i class="fas fa-moon"></i> <span>Ver as telas do sistema em modo escuro</span>'
            : '<i class="fas fa-sun"></i> <span>Ver as telas do sistema em modo claro</span>';
    });
}

// SVGs ANIMADOS (Multi-IA, Segurança, Beneficiamento - SMIL dentro de <img>)
// rodam pra sempre enquanto a imagem existe, mesmo fora da tela, brigando por
// CPU/GPU com as cenas 3D e o scroll (engasgo em máquina real). Por isso o SVG
// real fica em `data-src` (`data-anim`) e o `src` só aponta pra ele enquanto
// está VISÍVEL (seção na tela / popup aberto); saindo, volta pra um GIF
// transparente. Bônus: toda vez que entra a animação recomeça do INÍCIO (antes
// a pessoa rolava e pegava o loop no meio). O SVG é o mesmo URL, então volta
// do cache do navegador (sem novo download). O tema (`applySysTheme`) só troca
// o `data-src`/`src`, funciona igual.
const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
function playAnim(img) {
    if (img.dataset.src && img.getAttribute('src') !== img.dataset.src) img.src = img.dataset.src;
}
function parkAnim(img) {
    if (img.getAttribute('src') !== BLANK_IMG) img.src = BLANK_IMG;
}
if ('IntersectionObserver' in window) {
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? playAnim(entry.target) : parkAnim(entry.target)));
    }, { threshold: 0.15 });
    document.querySelectorAll('img[data-anim]').forEach((img) => {
        if (!img.closest('.contact-modal')) animObserver.observe(img);
    });
} else {
    // sem IntersectionObserver: comportamento antigo (roda sempre)
    document.querySelectorAll('img[data-anim]').forEach((img) => { if (!img.closest('.contact-modal')) playAnim(img); });
}

const abrirModal = (id, planMessage) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (id === 'contactModal') setContactModalMessage(planMessage || DEFAULT_CONTACT_MESSAGE);
    // Imagens dos popups de módulo usam `data-src` em vez de `src`
    // (carregam só na primeira abertura, nunca antes) - como o modal é
    // `visibility:hidden` (não `display:none`, pra permitir a transição
    // de abrir/fechar), ele já tem geometria de tela cheia mesmo
    // fechado, e o navegador consideraria as imagens "perto da tela"
    // cedo demais pro `loading="lazy"` nativo sozinho resolver isso -
    // daí o controle manual aqui. (São SVGs animados: a animação SMIL
    // só começa quando o `src` é apontado, ou seja, quando a pessoa abre.)
    modal.querySelectorAll('img[data-src]:not([data-anim])').forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
    modal.querySelectorAll('img[data-anim]').forEach(playAnim);
    if (MODULE_CURSOR_TIMELINES[id]) MODULE_CURSOR_TIMELINES[id].play();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const fecharModal = (modal) => {
    modal.querySelectorAll('img[data-anim]').forEach(parkAnim);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (MODULE_CURSOR_TIMELINES[modal.id]) MODULE_CURSOR_TIMELINES[modal.id].pause();
};

document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => abrirModal(trigger.getAttribute('data-modal-open'), trigger.dataset.planMessage));
});

document.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', () => {
        const modal = el.closest('.contact-modal');
        if (modal) fecharModal(modal);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.contact-modal.open').forEach(fecharModal);
});

// (A vitrine "Veja por dentro" agora é o mini sistema de js/demo.js - Shadow DOM,
// sem iframe. O antigo troca-de-pane por classe e o recorte de iframe saíram daqui.)

// Camada decorativa de fundo em toda <section> - CSS puro (keyframes em
// style.css), não depende do GSAP, pra dar vida ao fundo mesmo fora do
// Hero mesmo se alguma lib externa falhar. 4 seções de destaque (que o
// Carlos pediu pra ficarem diferentes das outras) ganham um estilo
// próprio - o resto continua com o brilho suave padrão.
function buildWavesFx() {
    const w1 = '<svg class="bg-wave bg-wave-1" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10 V20 H0 Z" fill="var(--primary)"/></svg>';
    const w2 = '<svg class="bg-wave bg-wave-2" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M0,10 Q25,20 50,10 T100,10 T150,10 T200,10 V20 H0 Z" fill="var(--secondary)"/></svg>';
    return w1 + w2;
}

const PRODUCT_ICONS = ['📦', '💰', '📊', '✅', '📋', '🔒'];
function buildIconsFx() {
    let html = '';
    for (let i = 0; i < 12; i++) {
        const icon = PRODUCT_ICONS[i % PRODUCT_ICONS.length];
        const left = Math.round(Math.random() * 100);
        // `top` espalhado pela altura inteira da seção (antes os ícones só
        // nasciam perto do rodapé e subiam um pouco - numa seção alta,
        // tipo "Nosso Propósito" com 2 grids empilhados, o topo inteiro
        // ficava sem nenhum ícone visível).
        const top = Math.round(Math.random() * 100);
        const duration = (9 + Math.random() * 7).toFixed(1);
        const delay = (Math.random() * 9).toFixed(1);
        html += `<span class="bg-icon" style="left:${left}%;top:${top}%;animation-duration:${duration}s;animation-delay:${delay}s;">${icon}</span>`;
    }
    return html;
}

function buildFlowFx() {
    const paths = [
        'M-10,40 C60,10 100,80 160,50 S260,10 330,40',
        'M-10,90 C50,130 110,60 170,100 S260,140 330,90',
        'M-10,140 C70,110 120,180 180,150 S250,110 330,150',
        'M-10,190 C60,220 130,170 190,200 S260,230 330,190',
        'M-10,15 C80,45 140,-10 200,25 S280,55 330,20',
    ];
    const lines = paths.map((d, i) => `<path class="bg-flow-line${i % 3 === 0 ? ' coral' : ''}" d="${d}" style="animation-duration:${5 + i * 1.3}s; animation-delay:${i * 0.4}s;"/>`).join('');
    return `<svg class="bg-flow-svg" viewBox="0 0 320 240" preserveAspectRatio="none">${lines}</svg>`;
}

function buildTopoFx() {
    let paths = '';
    for (let i = 0; i < 9; i++) {
        const y = 10 + i * 26;
        const wobble = 14 + (i % 3) * 6;
        paths += `<path class="bg-topo-line" d="M-10,${y} Q60,${y - wobble} 130,${y} T270,${y} T350,${y}"/>`;
    }
    return `<div class="bg-topo-wrap"><svg class="bg-topo-svg" viewBox="0 0 320 240" preserveAspectRatio="none">${paths}</svg></div>`;
}

function buildGhostFx(words) {
    const positions = [
        { top: '12%', left: '6%', size: '2.4rem' },
        { top: '55%', left: '55%', size: '3.2rem' },
        { top: '75%', left: '10%', size: '1.8rem' },
        { top: '20%', left: '62%', size: '2.8rem' },
    ];
    return words.map((w, i) => {
        const p = positions[i % positions.length];
        const coral = i % 2 === 1 ? ' coral' : '';
        return `<span class="bg-ghost-word${coral}" style="top:${p.top};left:${p.left};font-size:${p.size};animation-duration:${20 + i * 3}s;">${w}</span>`;
    }).join('');
}

// Estilo por seção - Carlos escolheu 10 estilos no total ao longo de 3
// rodadas de decisão; distribuídos aqui por toda seção do site (repetem
// ciclicamente, nunca em seções vizinhas) em vez de só nas 4 originais.
// Podado - as 16 seções de funcionalidade que tinham entrada própria
// aqui (estoque, cmv, cmo, cmc, multi-ia, beneficiamento, ocorrencias,
// checklists, caixa, despesas, patrimonio, requisicoes, relatorios,
// dre, curva-abc) viraram cards estáticos dentro de popup (#modulos) -
// não tem sentido fundo animado de scroll num popup que não rola.
const BG_FX_VARIANTS = {
    experiencia: { className: 'bg-fx-aurora', html: () => '<span class="bg-blob bg-blob-1"></span><span class="bg-blob bg-blob-2"></span><span class="bg-blob bg-blob-3"></span>' },
    diferenciais: { className: 'bg-fx-grid', html: () => '<div class="bg-grid-lines"></div><div class="bg-grid-glow"></div>' },
    'como-funciona': { className: 'bg-fx-icons', html: buildIconsFx },
    modulos: { className: 'bg-fx-topo', html: buildTopoFx },
    estoque: { className: 'bg-fx-flow', html: buildFlowFx },
    cmv: { className: 'bg-fx-topo', html: buildTopoFx },
    'multi-ia': { className: 'bg-fx-ghost', html: () => buildGhostFx(['IA', 'Insights']) },
    'veja-por-dentro-teaser': { className: 'bg-fx-ghost', html: () => buildGhostFx(['Sistema', 'Telas']) },
    paraquem: { className: 'bg-fx-waves', html: buildWavesFx },
    // As 2 entradas abaixo (proposito/fundadores) não aparecem mais no
    // index.html (viraram `quem-somos-nos.html`), mas continuam aqui
    // porque essa página nova também carrega `script.js` inteiro - sem
    // elas, essas 2 seções lá cairiam no fundo genérico em vez do
    // estilo próprio de sempre. `sobre` NÃO entra mais aqui - ganhou
    // cena 3D própria (ver skip-list abaixo).
    proposito: { className: 'bg-fx-icons', html: buildIconsFx },
    fundadores: { className: 'bg-fx-flow', html: buildFlowFx },
};

document.querySelectorAll('section').forEach((section) => {
    // Hero, CTA final, Segurança, Problemas, Indicadores e (14/09/2026)
    // Sobre/Nossa história já têm cena 3D própria (three-hero.js) -
    // fundo genérico por cima ali seria só poluição visual.
    if (section.classList.contains('hero') || section.classList.contains('final-cta') || section.id === 'seguranca' || section.id === 'problemas' || section.id === 'indicadores' || section.id === 'sobre') return;
    const variant = BG_FX_VARIANTS[section.id];
    const fx = document.createElement('div');
    fx.className = 'section-bg-fx' + (variant ? ` ${variant.className}` : '');
    fx.setAttribute('aria-hidden', 'true');
    fx.innerHTML = variant ? variant.html() : '<span class="bg-blob bg-blob-1"></span><span class="bg-blob bg-blob-2"></span>';
    section.prepend(fx);
});

// Animações (GSAP + ScrollTrigger) - só roda se as duas libs carregaram.
// Se falhar (CDN fora, bloqueador de script etc.), o CSS já deixa tudo
// visível por padrão (ver .reveal em style.css) - nada fica escondido.
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add('js-anim-ready');

    // Lenis (scroll com inércia suave) - só entra se carregou; o site
    // funciona normal com scroll nativo do navegador se não carregar.
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            // Por padrão o Lenis "sequestra" todo scroll da rolinha pra
            // suavizar a página inteira - inclusive dentro de áreas com
            // scroll interno próprio, tipo o mini sistema da vitrine
            // ("Veja por dentro", #gcDemo, Shadow DOM: o alvo do evento
            // vem de DENTRO do shadow root, então `closest` sozinho não
            // acha o host - por isso o getRootNode().host). Sem isso, a
            // rodinha em cima do demo rolaria a PÁGINA, não a tela dele.
            prevent: (node) => {
                const host = node.getRootNode && node.getRootNode().host;
                return !!(host && host.id === 'gcDemo') || !!node.closest('#gcDemo');
            },
        });
        // Exposta pra `initSplash()` (fora deste bloco, roda mesmo sem
        // GSAP/Lenis) poder se conectar no evento de scroll do PRÓPRIO
        // Lenis quando ele existe - ver `initSplash` pro motivo.
        window.__lenisInstance = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        if (window.__splashUpdate) lenis.on('scroll', window.__splashUpdate);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // Bug real corrigido junto (era a outra ponta do mesmo problema
        // documentado em style.css sobre `scroll-behavior:smooth`): os
        // links de âncora (nav, logo) usavam o salto nativo do
        // navegador, que o Lenis não sabe que aconteceu - ele continua
        // achando que o scroll está em outro lugar e briga pra "corrigir"
        // de volta, travando a página numa posição de scroll errada
        // (reportado como "trava ao clicar na logo"). Agora todo clique
        // em âncora passa por `lenis.scrollTo()`, que é a MESMA fonte de
        // verdade do resto do scroll - nunca mais desincroniza.
        //
        // Segundo bug real, achado junto (era a causa de o clique "cair"
        // dentro da abertura em vez de voltar pro topo de sempre): o
        // alvo do clique na logo (`href="#"`) era `scrollTo(0)` -
        // scrollY 0 é literalmente o topo da `.splash-zone` (a
        // abertura), que agora é o primeiro elemento do body. A logo
        // devia voltar pra onde o site SEMPRE começou visualmente (a
        // Hero, logo abaixo do header fixo) - não pra dentro da
        // abertura de novo. `.hero` não pode ser usado como offset via
        // rect porque o header é `position:fixed` (rect.top não reflete
        // posição real no documento), mas a `.hero` em si é flow normal
        // logo depois da `.splash-zone`, então serve como alvo direto.
        const siteTop = document.querySelector('.hero');
        // Bug real crítico corrigido - travamento de verdade (não só
        // visual) ao clicar na logo vindo do fim da página: o Carlos
        // reportou "buga e trava" depois de ir até o fim e clicar na
        // logo pra voltar. Reproduzido e confirmado que é travamento de
        // verdade - depois do salto, `requestAnimationFrame` para de
        // disparar completamente (testado com uma promise esperando
        // só 20 frames, nunca resolveu). Causa: `lenis.scrollTo()` sem
        // `immediate` anima o scroll suavemente ao longo do caminho
        // inteiro - descendo do fim da página até o Hero, isso significa
        // atravessar as ~28 seções do meio (cada uma com reveal via
        // ScrollTrigger, fundo animado próprio, e a zona do splash com
        // canvas WebGL pausando/retomando) em menos de 1 segundo de
        // scroll simulado. Esse tanto de trabalho de composição/pintura
        // de uma vez é demais pro navegador engolir e ele trava de
        // verdade (não é só o teste automatizado - o print do Carlos
        // mostrou exatamente a mesma tela vazia que reproduzi aqui).
        // Corrigido na hora: saltos de distância grande usavam
        // `{ immediate: true }` (pulo instantâneo, sem animação) -
        // resolvia o travamento, mas como o site tinha ~28 seções,
        // praticamente TODO clique de menu (sempre visível no header
        // fixo) caía nesse caso - o site inteiro passou a pular seco em
        // vez de rolar, regressão reportada pelo Carlos. **Tentativa
        // errada, corrigida de novo**: troquei `immediate:true` por uma
        // `duration:2.2` (animar mais devagar em vez de pular) achando
        // que isso evitaria a sobrecarga - reproduzi de verdade (testei
        // com uma promise esperando só 5 frames de rAF, nunca resolveu
        // em mais de 20s) e confirmei que o travamento VOLTOU exatamente
        // igual: o problema nunca foi a VELOCIDADE da animação, é
        // animar o caminho inteiro de qualquer jeito - atravessar dezenas
        // de seções (reveal, fundo animado, cursor de demonstração,
        // WebGL) é pesado demais pro navegador processar em qualquer
        // duração de animação, só o pulo instantâneo evita isso de
        // verdade. Voltou a ser `immediate:true` pra saltos grandes.
        // Como o site ficou bem mais curto depois da condensação em
        // blocos, a maioria dos cliques de menu no dia a dia continua
        // curta o bastante pra não cair nesse caso e rolar suave - só
        // saltos realmente grandes (fim da página até o topo, por
        // exemplo) pulam direto, o que é uma troca aceitável (site
        // funcionando > animação num caso raro).
        // Segundo bug real, achado testando a correção acima (mesmo
        // sintoma - trava de vez - mas causa DIFERENTE, não é sobre
        // duração/distância): se o scroll nativo do navegador e o
        // estado interno do Lenis desincronizam - acontece com scroll
        // por teclado (Home/End/Page Down/barra de espaço, que o Lenis
        // não intercepta do mesmo jeito que intercepta a rodinha do
        // mouse) ou inércia de touch em alguns aparelhos - qualquer
        // `lenis.scrollTo()` depois disso fica preso pra sempre: ele
        // anima a partir de onde ACHA que está (o `lenis.scroll`
        // interno), não de onde a página realmente está, e nunca
        // alcança o destino de verdade. Reproduzido de propósito
        // (forçando um scroll nativo direto) e confirmado: `lenis.scroll`
        // ficava travado em 0 com a página de verdade no fim (17599px)
        // - depois disso nenhum clique de âncora conseguia mover a
        // página nunca mais, mesmo com `immediate:true`. Corrigido
        // ressincronizando o Lenis com a posição real
        // (`window.scrollY`) antes de qualquer salto, sempre que os
        // dois estiverem diferentes - `force:true` porque o Lenis
        // ignora um `scrollTo` pro mesmo valor que ele JÁ ACHA que
        // está por padrão.
        // 17/09/2026 - o `isBigJump`/`immediate:true` pra saltos grandes
        // (ex: clicar na logo vindo do fim da página) foi removido.
        // Carlos pediu de volta a animação rolando mesmo em saltos
        // longos (comparando com o site oficial no ar, que sempre
        // anima) - o pulo seco incomodava mais do que o travamento raro
        // que motivou a trava original. Re-testado se o travamento de
        // verdade (documentado acima) ainda acontece: forcei um scroll
        // animado completo do fim ao início da página (mesmo cenário do
        // bug original) com `PerformanceObserver({entryTypes:
        // ['longtask']})` rodando (sinal de verdade - trava de main
        // thread por >50ms - diferente de contar frames de rAF, que
        // esta sessão descobriu ser pouco confiável no ambiente de
        // teste) - zero tarefa longa detectada. As duas otimizações
        // feitas DEPOIS daquele bug original (cenas 3D só renderizam
        // quando visíveis via `IntersectionObserver`, e a maioria do
        // conteúdo pesado - popups de módulo, telas da vitrine - só
        // carrega sob demanda) parecem ter resolvido a causa raiz de
        // verdade. Se o travamento voltar a acontecer de verdade (não
        // só no ambiente de teste), o `force:true` de resincronização
        // abaixo continua intacto - ele resolve um bug DIFERENTE
        // (Lenis/scroll nativo desincronizados), sem relação com isso.
        function scrollToTarget(target) {
            if (Math.abs(lenis.scroll - window.scrollY) > 2) {
                lenis.scrollTo(window.scrollY, { immediate: true, force: true });
            }
            lenis.scrollTo(target);
        }
        // As 16 seções de funcionalidade viraram cards em #modulos (cada
        // uma abre um popup em vez de ter âncora própria) - mas os links
        // que já existiam pra elas (chips de #funcionalidades, rodapé
        // etc.) continuam com `href="#cmo"` etc., sem precisar mexer em
        // cada um. Esse mapa traduz o id antigo pro id do popup novo;
        // ao clicar, rola até #modulos E já abre o popup certo. Estoque/
        // CMV/Multi-IA/Segurança NÃO entram aqui - voltaram a ser seção
        // própria com âncora normal (`href="#estoque"` etc. já funciona
        // sozinho via `document.querySelector`, mais abaixo).
        const MODULE_ANCHORS = {
            cmo: 'modulo-cmo',
            cmc: 'modulo-cmc',
            'funcionalidades-beneficiamento': 'modulo-beneficiamento',
            ocorrencias: 'modulo-ocorrencias',
            checklists: 'modulo-checklists',
            caixa: 'modulo-caixa',
            despesas: 'modulo-despesas',
            patrimonio: 'modulo-patrimonio',
            requisicoes: 'modulo-requisicoes',
            relatorios: 'modulo-relatorios',
            dre: 'modulo-dre',
            'curva-abc': 'modulo-curva-abc',
        };
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') {
                    e.preventDefault();
                    scrollToTarget(siteTop || 0);
                } else if (href.length > 1) {
                    const key = href.slice(1);
                    if (MODULE_ANCHORS[key]) {
                        e.preventDefault();
                        const modulosSection = document.getElementById('modulos');
                        scrollToTarget(modulosSection || 0);
                        abrirModal(MODULE_ANCHORS[key]);
                        return;
                    }
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        scrollToTarget(target);
                    }
                }
            });
        });
        // Rodapé (13/09/2026) ganhou uma coluna "Funcionalidades" com
        // link direto pra cada módulo - em páginas como planos.html/
        // quem-somos-nos.html esses links apontam pra
        // `index.html#cmo` etc. (não dá pra interceptar o clique, a
        // navegação já troca de página) - sem isso, o navegador
        // carregava o index.html e não fazia nada com o hash (não
        // existe elemento com esse id pros 13 módulos que viraram
        // popup). Resolvido conferindo `location.hash` uma vez ao
        // carregar a página - mesma lógica do clique acima, só que
        // disparada no load em vez de num evento de clique.
        if (window.location.hash) {
            const hashKey = window.location.hash.slice(1);
            if (MODULE_ANCHORS[hashKey]) {
                const modulosSection = document.getElementById('modulos');
                if (modulosSection) {
                    scrollToTarget(modulosSection);
                    abrirModal(MODULE_ANCHORS[hashKey]);
                }
            } else {
                const target = document.querySelector(window.location.hash);
                if (target) scrollToTarget(target);
            }
        }
    }

    // Barra de progresso de scroll no topo da página
    const scrollProgressEl = document.getElementById('scroll-progress');
    if (scrollProgressEl) {
        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
                scrollProgressEl.style.width = `${self.progress * 100}%`;
            },
        });
    }

    // Reveal com stagger (agrupado por seção, pra elementos da mesma
    // seção entrarem em sequência em vez de todos de uma vez).
    document.querySelectorAll('section, header').forEach((section) => {
        const items = section.querySelectorAll(':scope .reveal');
        if (!items.length) return;
        ScrollTrigger.batch(items, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    stagger: 0.12,
                });
            },
        });
    });

    // Título do Hero revelando palavra por palavra
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const words = heroTitle.textContent.trim().split(' ');
        heroTitle.innerHTML = words
            .map((w) => `<span class="split-word"><span class="split-word-inner">${w}</span></span>`)
            .join(' ');
        const wordEls = heroTitle.querySelectorAll('.split-word-inner');
        gsap.set(wordEls, { yPercent: 100 });
        gsap.to(wordEls, {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.2,
        });
    }

    // Cursor de demonstração sobre as telas em SVG (19/09/2026). Antes lia
    // o DOM de um iframe vivo; agora as telas são SVGs vetoriais (imagem),
    // então o alvo vem de uma tabela medida nos próprios SVGs (`getBBox()`
    // dos `<text>` do item da sidebar / da aba, em px do espaço 1680x1050
    // do SVG - as molduras mostram a largura toda e cortam embaixo, com
    // `object-position:top`, então % = x/1680 e y/1050). A sidebar é a
    // mesma em todas as telas (itens a cada 42px), por isso um alvo por
    // arquivo basta. Se o menu real do sistema mudar, remedir (ver
    // CLAUDE.md, "Como remedir os alvos do cursor").
    //   before = tela mostrada por cima e dissolvida no clique ("veio de
    //   outra tela"): quase todas partem do Início; as ABAS (Caixa, DRE,
    //   Curva ABC) partem da tela-mãe onde a aba fica.
    const demoCursorSvg = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L4 20.5L8.5 16.5L11.5 22.5L14.5 21L11.5 15L18 15L4 2Z" fill="white" stroke="#0a3540" stroke-width="1.2" stroke-linejoin="round"/></svg><span class="demo-cursor-ring"></span>';
    const CURSOR_HOME = '09_inicio';
    const CURSOR_TARGET = {
        '10_estoque': { x: 100, y: 126, before: CURSOR_HOME },
        '11_cmv_visaogeral': { x: 100, y: 168, before: CURSOR_HOME },
        '12_cmo': { x: 100, y: 210, before: CURSOR_HOME },
        '13_cmc_visaogeral': { x: 100, y: 252, before: CURSOR_HOME },
        '06_despesas': { x: 100, y: 294, before: CURSOR_HOME },
        '15_avarias': { x: 100, y: 378, before: CURSOR_HOME },
        '17_checklists': { x: 100, y: 462, before: CURSOR_HOME },
        '19_requisicao': { x: 100, y: 546, before: CURSOR_HOME },
        '05_patrimonio': { x: 100, y: 588, before: CURSOR_HOME },
        '01_relatorio_composicao_primecost': { x: 100, y: 630, before: CURSOR_HOME },
        '04_caixa_fechamento': { x: 729.6, y: 459.9, before: '13_cmc_visaogeral' },
        '02_dre_completa': { x: 1432.1, y: 130, before: '01_relatorio_composicao_primecost' },
        '03_curva_abc': { x: 1515, y: 130, before: '01_relatorio_composicao_primecost' },
    };

    // Monta o cursor (+ a tela "antes" que desaparece) pra um
    // `.screenshot-frame` e devolve a timeline (pausada) - quem chama
    // decide COMO tocar/pausar (scroll ou abrir/fechar de popup).
    function attachDemoCursor(frame) {
        const mainImg = frame.querySelector('img.sys-theme-img');
        if (!mainImg) return null;
        const ownSrc = mainImg.dataset.src || mainImg.getAttribute('src') || '';
        const ownFileRaw = ownSrc.split('/').pop();
        // Normaliza pro nome ESCURO (a tabela só tem entrada por nome
        // escuro) - se o tema claro já estiver ativo quando isso roda
        // (popup aberto pela 1a vez depois de alternar o tema), o par
        // claro é remontado pra tela "antes" abaixo.
        const isLightNow = /-branco\.svg$/i.test(ownFileRaw);
        const target = CURSOR_TARGET[ownFileRaw.replace(/(-branco)?\.svg$/i, '')];
        if (!target) return null;

        let overlay = null;
        if (target.before) {
            overlay = document.createElement('img');
            overlay.className = 'sys-theme-img demo-cursor-before';
            overlay.alt = '';
            overlay.setAttribute('aria-hidden', 'true');
            overlay.decoding = 'async';
            const beforeSrc = ownSrc.replace(ownFileRaw, `${target.before}${isLightNow ? '-branco' : ''}.svg`);
            // Dentro de popup, `data-src` (só carrega quando o popup abre,
            // `abrirModal` já trata `img[data-src]`).
            if (frame.closest('.contact-modal')) {
                overlay.dataset.src = beforeSrc;
            } else {
                overlay.src = beforeSrc;
                overlay.loading = 'lazy';
            }
            // Se a tela "antes" não carregar (arquivo faltando no servidor, rede),
            // some por completo - sem ícone de imagem quebrada por cima da tela
            // de verdade; a animação segue só com o cursor.
            overlay.addEventListener('error', () => { overlay.style.display = 'none'; });
            frame.insertBefore(overlay, mainImg.nextSibling);
            gsap.set(overlay, { opacity: 1 });
        }

        const cursor = document.createElement('div');
        cursor.className = 'demo-cursor';
        cursor.innerHTML = demoCursorSvg;
        frame.appendChild(cursor);
        const ring = cursor.querySelector('.demo-cursor-ring');

        const startPoint = { left: '46%', top: '58%' };
        const goPoint = {
            left: `${(target.x / 1680 * 100).toFixed(2)}%`,
            top: `${(target.y / 1050 * 100).toFixed(2)}%`,
        };

        gsap.set(cursor, { ...startPoint, opacity: 0 });

        // Timeline única - TUDO (cursor, ripple, crossfade) fica dentro
        // dela, nenhuma tween "solta" por fora, pra pause/play sempre
        // pegar um estado visual coerente, em qualquer ponto.
        const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.6 })
            .to(cursor, { opacity: 1, duration: 0.3 })
            .to(cursor, { ...goPoint, duration: 1.1, ease: 'power2.inOut' }, '+=0.3')
            .to(cursor, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' })
            .fromTo(ring, { opacity: 0.7, scale: 0.3 }, { opacity: 0, scale: 2.2, duration: 0.6, ease: 'power2.out' }, '<');

        // Dissolução CURTA (0.3s) e hold longo na tela de destino: entre duas
        // telas totalmente diferentes, um crossfade lento (0.7s) mostra as
        // duas sobrepostas ("duplo" embolado) - curto, lê como troca de tela.
        // Tempos calculados pro SVG ANIMADO do Beneficiamento (loop de 6,6s:
        // em branco até 0,7s, cresce até 2,0s, SEGURA cheio de 2,0s a 5,9s,
        // some e recomeça): a tela de destino aparece em ~2,6s e o Início
        // volta em ~5,2s, dentro da janela em que o SVG está cheio. O SVG é
        // reiniciado a cada ciclo do cursor (`onRepeat` abaixo) pros dois
        // relógios partirem juntos - sem isso, ciclos de ~7,6s (cursor) e
        // 6,6s (SVG) desalinham e a dissolução cai numa fase em BRANCO.
        if (overlay) {
            tl.to(overlay, { opacity: 0, duration: 0.3, ease: 'power1.out' }, '+=0.35')
                .to({}, { duration: 2.6 })
                .to(overlay, { opacity: 1, duration: 0.3, ease: 'power1.in' });
        } else {
            tl.to({}, { duration: 0.6 });
        }

        tl.to(cursor, { opacity: 0, duration: 0.35 }, '+=0.3')
            .set(cursor, startPoint);

        // Só começa quando os SVGs (~100KB cada, com fontes embutidas)
        // terminaram de carregar E decodificar. Sem isso a timeline rodava
        // antes das imagens: a tela de destino aparecia em branco ou
        // "pipocava" por cima do Início no meio da transição. Enquanto não
        // está pronto, o frame fica com as imagens escondidas
        // (`.demo-loading`, ver style.css). `play`/`pause` de quem chama
        // (scroll ou popup) continuam iguais - só passam pelo portão.
        const imgs = [mainImg, overlay].filter(Boolean);
        const whenDecoded = (img) => new Promise((resolve) => {
            const done = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(resolve);
            // já terminou: com largura = carregou; sem largura = FALHOU (o
            // `error` já disparou antes de alguém escutar, então esperar os
            // eventos travaria o portão até o timeout de 8s com o frame escondido)
            if (img.complete) { if (img.naturalWidth) done(); else resolve(); }
            else {
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', resolve, { once: true });
            }
        });
        let readyPromise = null;
        let wantPlay = false;
        const whenReady = () => {
            if (!readyPromise) {
                frame.classList.add('demo-loading');
                const timeout = new Promise((resolve) => setTimeout(resolve, 8000));
                readyPromise = Promise.race([
                    Promise.all(imgs.map((img) => (img.getAttribute('src') ? whenDecoded(img) : Promise.resolve()))),
                    timeout,
                ]).then(() => frame.classList.remove('demo-loading'));
            }
            return readyPromise;
        };
        // SVG animado (SMIL em <img>): recomeça do zero a cada ciclo do cursor.
        // Estaciona (GIF transparente) e religa em seguida - mesmo URL, sai do
        // cache. O Início (overlay) está cobrindo nesse instante.
        if (mainImg.hasAttribute('data-anim')) {
            tl.eventCallback('onRepeat', () => {
                parkAnim(mainImg);
                setTimeout(() => { if (wantPlay) playAnim(mainImg); }, 60);
            });
        }
        const rawPlay = tl.play.bind(tl);
        const rawPause = tl.pause.bind(tl);
        tl.play = () => {
            wantPlay = true;
            whenReady().then(() => { if (wantPlay) rawPlay(); });
            return tl;
        };
        tl.pause = () => {
            wantPlay = false;
            return rawPause();
        };

        return tl;
    }

    // Frames FORA de popup (Estoque, CMV - Multi-IA e Segurança ficam de
    // fora: o próprio SVG animado já mostra a navegação de verdade) -
    // toca/pausa com o scroll, como sempre.
    document.querySelectorAll('.screenshot-frame').forEach((frame) => {
        if (frame.closest('#multi-ia') || frame.closest('#seguranca') || frame.closest('.contact-modal')) return;
        const tl = attachDemoCursor(frame);
        if (!tl) return;
        ScrollTrigger.create({
            trigger: frame,
            start: 'top 85%',
            end: 'bottom 15%',
            onEnter: () => tl.play(),
            onEnterBack: () => tl.play(),
            onLeave: () => tl.pause(),
            onLeaveBack: () => tl.pause(),
        });
    });

    // Frames DENTRO de popup de módulo - toca/pausa junto com abrir/
    // fechar o popup (`MODULE_CURSOR_TIMELINES`, lido em `abrirModal`/
    // `fecharModal` no topo do arquivo).
    document.querySelectorAll('.contact-modal.module-modal .screenshot-frame').forEach((frame) => {
        const modal = frame.closest('.contact-modal');
        const tl = attachDemoCursor(frame);
        if (tl) MODULE_CURSOR_TIMELINES[modal.id] = tl;
    });

    // MULTI-IA: até essa rodada, era um GESTO FALSO (bolha de chat
    // digitando por cima de uma screenshot estática) - o Carlos achou
    // estranho ter uma animação fingindo pergunta/resposta em cima de
    // uma imagem parada, quando o resto do site já usa capturas 100%
    // reais. Trocado pela gravação de tela de verdade do Multi-IA
    // (`multi_ia_chat_fullpage.gif`, mandada por ele) - já mostra a
    // pergunta sendo digitada e a resposta aparecendo de verdade, sem
    // precisar de nenhuma encenação em cima. Por isso essa demo (GSAP
    // timeline com balão fake) foi removida - o `<img>` sozinho já
    // basta (GIF já é nativamente autoplay+loop no navegador).

    // Efeito de tilt 3D (segue o mouse) em cartões pela página inteira -
    // reforça a sensação "3D" fora só do Hero/CTA, e é bem barato (só
    // reage no hover, sem loop/RAF quando o mouse não está em cima).
    document.querySelectorAll('.feature-card, .step-card, .segment-card, .indicator-card, .founder-card, .value-card, .module-card, .plan-card').forEach((card) => {
        gsap.set(card, { transformPerspective: 700 });
        // atenção: a propriedade do GSAP é "rotationX"/"rotationY", não
        // "rotateX"/"rotateY" (esse nome é o da propriedade CSS nativa
        // "rotate" - usar o nome errado faz o GSAP tentar mexer na
        // propriedade CSS individual em vez da rotação 3D de verdade, e
        // avisa "not eligible for reset" no console sem girar nada).
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(card, { rotationY: px * 10, rotationX: -py * 10, scale: 1.03, duration: 0.4, ease: 'power2', overwrite: 'auto' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.4, ease: 'power2', overwrite: 'auto' });
        });
    });

    // Removido - botão magnético (CTA "Solicitar demonstração" seguindo
    // o cursor). Carlos achou "exagerado demais" - o botão principal do
    // site não precisa desse efeito, fica só o hover padrão (CSS).

    // Contadores animados (mockup do Hero)
    document.querySelectorAll('[data-count]').forEach((el) => {
        const target = parseFloat(el.getAttribute('data-count'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const counter = { value: 0 };
        ScrollTrigger.create({
            trigger: el,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    value: target,
                    duration: 1.6,
                    ease: 'power1.out',
                    onUpdate: () => {
                        const formatted = counter.value.toLocaleString('pt-BR', {
                            minimumFractionDigits: decimals,
                            maximumFractionDigits: decimals,
                        });
                        el.textContent = `${prefix}${formatted}${suffix}`;
                    },
                });
            },
        });
    });

    // Barras de gráfico e barra de progresso (crescem até o valor alvo,
    // guardado em --bar-h/--bar-w no style inline de cada elemento)
    document.querySelectorAll('.chart-bars').forEach((wrap) => {
        const bars = wrap.querySelectorAll('.chart-bar');
        ScrollTrigger.create({
            trigger: wrap,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                bars.forEach((bar, i) => {
                    const target = bar.style.getPropertyValue('--bar-h') || '0%';
                    gsap.to(bar, {
                        height: target,
                        duration: 1,
                        delay: i * 0.08,
                        ease: 'power2.out',
                    });
                });
            },
        });
    });

    document.querySelectorAll('.mini-progress-bar').forEach((bar) => {
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 95%',
            once: true,
            onEnter: () => {
                const target = bar.style.getPropertyValue('--bar-w') || '0%';
                gsap.to(bar, {
                    width: target,
                    duration: 1.2,
                    delay: 0.2,
                    ease: 'power2.out',
                });
            },
        });
    });
}

// SEGURANÇA - cadeado + chave (20/09/2026). O cadeado 3D vivia atrás do
// texto/cards e ninguém via. Agora: palco com o cadeado grande e uma chave;
// arrastar a chave até o cadeado (ou tocar/Enter nela = voa sozinha) abre o
// cadeado e revela a imagem (a animação real do 2FA); clicar na imagem
// tranca de novo e volta aos cards. Repete quantas vezes quiser.
// Estados na <section>: `sec-interactive` (modo chave ligado: palco + cards)
// e `sec-open` (imagem aberta). Sem Web Animations/JS o CSS deixa o layout
// de sempre (imagem + cards). O 3D lê `is-open` do palco (three-hero.js).
(function initSecurityLock() {
    const section = document.getElementById('seguranca');
    const stage = document.getElementById('secStage');
    const key = document.getElementById('secKey');
    const hint = document.getElementById('secHint');
    const drop = stage && stage.querySelector('.sec-drop');
    const visual = section && section.querySelector('.security-visual');
    const frame = visual && visual.querySelector('.screenshot-frame');
    if (!section || !stage || !key || !hint || !drop || !visual || !frame || !key.animate) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HINT_LOCKED = 'Arraste a chave até o cadeado (ou toque nela)';
    const pos = { x: 0, y: 0, rot: 0, scale: 1 };
    let drag = null;
    let busy = false;
    let lastSpark = 0;

    const render = () => {
        key.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rot}deg) scale(${pos.scale})`;
    };
    const center = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const dist = () => {
        const k = center(key), d = center(drop);
        return Math.hypot(k.x - d.x, k.y - d.y);
    };
    const refresh = () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); };
    const wait = (ms) => new Promise((res) => setTimeout(res, reduce ? Math.min(ms, 60) : ms));
    const enter = (el) => {
        if (reduce) return;
        el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'ease-out' });
    };

    // faíscas que a chave solta enquanto é arrastada
    const spark = (x, y) => {
        if (reduce) return;
        const now = performance.now();
        if (now - lastSpark < 45) return;
        lastSpark = now;
        const s = document.createElement('span');
        s.className = 'sec-spark';
        const sr = stage.getBoundingClientRect();
        s.style.left = `${x - sr.left}px`;
        s.style.top = `${y - sr.top}px`;
        stage.appendChild(s);
        s.animate(
            [{ opacity: 0.9, transform: 'scale(1)' }, { opacity: 0, transform: `translate(${(Math.random() - 0.5) * 30}px, ${10 + Math.random() * 16}px) scale(0.2)` }],
            { duration: 550, easing: 'ease-out' }
        ).onfinish = () => s.remove();
    };

    async function unlock() {
        busy = true;
        // chave "entra" no cadeado: vai pro centro do alvo, encolhe e some
        const k = center(key), d = center(drop);
        key.classList.remove('is-dragging');
        key.classList.add('is-flying', 'is-used');
        pos.x += d.x - k.x;
        pos.y += d.y - k.y;
        pos.rot = 90;
        pos.scale = 0.25;
        render();
        stage.classList.add('is-open'); // 3D: argola abre; SVG: idem
        hint.textContent = 'Destrancado!';
        await wait(1300);
        section.classList.add('sec-open');
        if (!reduce) {
            visual.animate(
                [{ opacity: 0, transform: 'scale(0.93)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
                { duration: 650, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
            );
        }
        refresh();
        busy = false;
    }

    async function relock() {
        if (busy) return;
        busy = true;
        if (!reduce) {
            const out = visual.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.96)' }], { duration: 280, easing: 'ease-in', fill: 'forwards' });
            await new Promise((res) => { out.onfinish = res; out.oncancel = res; });
            out.cancel();
        }
        section.classList.remove('sec-open');
        // chave volta pro lugar sem animação de retorno, cadeado fecha
        key.style.transition = 'none';
        key.classList.remove('is-flying', 'is-used', 'is-dragging');
        Object.assign(pos, { x: 0, y: 0, rot: 0, scale: 1 });
        key.style.transform = '';
        void key.offsetWidth;
        key.style.transition = '';
        stage.classList.remove('is-open');
        stage.style.setProperty('--near', 0);
        hint.textContent = HINT_LOCKED;
        enter(stage);
        const grid = section.querySelector('.security-grid');
        if (grid) enter(grid);
        refresh();
        busy = false;
    }

    // toque / Enter: a chave voa sozinha até o cadeado
    async function flyToLock() {
        if (busy) return;
        busy = true;
        const k = center(key), d = center(drop);
        key.classList.add('is-flying');
        pos.x += d.x - k.x;
        pos.y += d.y - k.y;
        pos.rot = -20;
        render();
        await wait(720);
        busy = false;
        unlock();
    }

    function goHome() {
        key.classList.remove('is-dragging', 'is-flying');
        Object.assign(pos, { x: 0, y: 0, rot: 0, scale: 1 });
        key.style.transform = '';
        stage.style.setProperty('--near', 0);
    }

    key.addEventListener('pointerdown', (e) => {
        if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
        e.preventDefault();
        try { key.setPointerCapture(e.pointerId); } catch (err) { /* sem captura: segue */ }
        const c = center(key);
        drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, bx: pos.x, by: pos.y, baseX: c.x - pos.x, baseY: c.y - pos.y, lastX: e.clientX, moved: false };
        key.classList.add('is-dragging');
    });

    key.addEventListener('pointermove', (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
        if (Math.hypot(dx, dy) > 6) drag.moved = true;
        const sr = stage.getBoundingClientRect();
        const cx = Math.min(Math.max(drag.baseX + drag.bx + dx, sr.left + 36), sr.right - 36);
        const cy = Math.min(Math.max(drag.baseY + drag.by + dy, sr.top + 36), sr.bottom - 36);
        pos.x = cx - drag.baseX;
        pos.y = cy - drag.baseY;
        pos.rot += (Math.max(-25, Math.min(25, (e.clientX - drag.lastX) * 1.8)) - pos.rot) * 0.35;
        drag.lastX = e.clientX;
        pos.scale = 1.12;
        render();
        const R = drop.offsetWidth / 2;
        stage.style.setProperty('--near', Math.max(0, Math.min(1, 1 - (dist() - R * 0.4) / (R * 1.6))).toFixed(2));
        spark(cx, cy);
    });

    const release = (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag;
        drag = null;
        key.classList.remove('is-dragging');
        stage.style.setProperty('--near', 0);
        if (!d.moved) { goHome(); flyToLock(); return; } // toque simples
        if (dist() < drop.offsetWidth * 0.375) unlock(); else goHome();
    };
    key.addEventListener('pointerup', release);
    key.addEventListener('pointercancel', release);
    key.addEventListener('click', (e) => e.preventDefault());
    key.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flyToLock(); }
    });

    // imagem aberta: clicar (ou Enter/Espaço) tranca de novo e volta aos cards
    frame.setAttribute('role', 'button');
    frame.setAttribute('tabindex', '0');
    frame.setAttribute('aria-label', 'Trancar o cadeado de novo e voltar aos recursos de segurança');
    frame.addEventListener('click', () => { if (section.classList.contains('sec-open')) relock(); });
    frame.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && section.classList.contains('sec-open')) { e.preventDefault(); relock(); }
    });

    section.classList.add('sec-interactive');
})();

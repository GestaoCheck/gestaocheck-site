var WHATSAPP_NUMERO = '85999817221';
var WHATSAPP_MENSAGEM = 'Olá! Quero saber mais sobre o Gestão Check.';

function linkWhatsapp() {
    return 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(WHATSAPP_MENSAGEM);
}

document.querySelectorAll('.gc-cta').forEach(function(el) {
    el.setAttribute('href', linkWhatsapp());
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
});

/* ── Navbar: ganha fundo ao rolar ──────────────────── */
var navbar = document.getElementById('navbar');

function atualizarNavbar() {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}
atualizarNavbar();
window.addEventListener('scroll', atualizarNavbar);

/* ── Menu mobile ─────────────────────────────────────── */
var mobileMenuBtn = document.getElementById('mobileMenuBtn');
var mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
});

// Fecha o menu mobile ao clicar em qualquer link dele
mobileMenu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
    });
});

/* ── Tabs de funcionalidades ─────────────────────────── */
var tabs = document.querySelectorAll('.gc-tab');
var panels = document.querySelectorAll('.gc-tab-panel');

tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        var alvo = tab.dataset.tab;

        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');

        panels.forEach(function(p) {
            p.classList.toggle('active', p.dataset.panel === alvo);
        });
    });
});

/* ── FAQ (acordeão) ──────────────────────────────────── */
document.querySelectorAll('.gc-faq-item').forEach(function(item) {
    var btn = item.querySelector('.gc-faq-btn');
    var answer = item.querySelector('.gc-faq-answer');

    btn.addEventListener('click', function() {
        var estavaAberto = item.classList.contains('open');

        // Fecha todos antes de abrir o clicado
        document.querySelectorAll('.gc-faq-item').forEach(function(i) {
            i.classList.remove('open');
            i.querySelector('.gc-faq-answer').style.maxHeight = null;
        });

        if (!estavaAberto) {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

/* ── Ícones Lucide ───────────────────────────────────── */
lucide.createIcons();

/* ── Animações GSAP + ScrollTrigger ──────────────────── */
var prefereReduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && window.ScrollTrigger && !prefereReduzirMovimento) {
    document.documentElement.classList.add('js-gsap-ready');
    gsap.registerPlugin(ScrollTrigger);

    // Elementos com .gc-reveal entram com fade + slide sutil
    // conforme entram na viewport.
    document.querySelectorAll('.gc-reveal').forEach(function(el) {
        gsap.fromTo(el, { opacity: 0, y: 28 }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Cards dentro de grids entram com um leve efeito escalonado
    // (stagger), item por item, em vez de todos juntos.
    document.querySelectorAll('.gc-grid').forEach(function(grid) {
        var itens = grid.children;
        if (!itens.length) return;

        gsap.fromTo(itens, { opacity: 0, y: 24 }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Mockup do dashboard: leve flutuação contínua + entrada com
    // profundidade (glow discreto via sombra ao aparecer).
    document.querySelectorAll('.gc-dash-mockup').forEach(function(mock) {
        gsap.to(mock, {
            y: -12,
            duration: 3.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });

        gsap.fromTo(mock, { opacity: 0, scale: 0.94, y: 40 }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: mock,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Timeline "Como funciona": cada etapa entra deslizando
    // levemente da esquerda, uma após a outra.
    gsap.fromTo('.gc-timeline-item', { opacity: 0, x: -24 }, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.gc-timeline',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
} else {
    // Sem GSAP (ou usuário prefere menos movimento): garante que
    // todo o conteúdo continue visível normalmente.
    document.querySelectorAll('.gc-reveal').forEach(function(el) {
        el.style.opacity = '1';
    });
}
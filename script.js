// ═══════════════════════════════════════════════════
// GESTÃOPRO — script.js
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {

    if (window.lucide) lucide.createIcons();

    // ── Menu mobile ──────────────────────────────────
    var menuBtn = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    function closeMenu() {
        mobileMenu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Abrir menu');
    }

    function openMenu() {
        mobileMenu.hidden = false;
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Fechar menu');
    }

    menuBtn.addEventListener('click', function() {
        var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    mobileMenu.querySelectorAll('a, button').forEach(function(el) {
        el.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(e) {
        var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        if (!isOpen) return;
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    // ── Header: estado de scroll ─────────────────────
    var header = document.getElementById('site-header');

    function updateHeaderState() {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    }
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    // ── FAQ (accordion acessível) ────────────────────
    document.querySelectorAll('.faq-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var answer = document.getElementById(btn.getAttribute('aria-controls'));
            var isOpen = btn.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.faq-btn').forEach(function(b) {
                b.setAttribute('aria-expanded', 'false');
            });
            document.querySelectorAll('.faq-answer').forEach(function(a) {
                a.hidden = true;
            });

            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
            }
        });
    });

    // ── Tabs de demonstração dos módulos (carrossel) ──
    var tabs = document.querySelectorAll('.demo-tab');
    var track = document.querySelector('.demo-track');

    tabs.forEach(function(tab, index) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) {
                t.classList.remove('is-active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');

            if (track) {
                track.style.transform = 'translateX(-' + (index * 100) + '%)';
            }
        });
    });

    // ── Toggle de planos (mensal / anual) ────────────
    var toggleButtons = document.querySelectorAll('.toggle-option');
    var periodLabels = document.querySelectorAll('[data-period-label]');

    toggleButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            toggleButtons.forEach(function(b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');

            var period = btn.getAttribute('data-period');
            periodLabels.forEach(function(label) {
                label.textContent = period === 'anual' ? '/mês no plano anual' : '/mês';
            });
        });
    });

    // ── Scroll reveal ─────────────────────────────────
    var revealTargets = document.querySelectorAll(
        '.problem-card, .how-step, .module-group, .demo, .diff-feature, .diff-card, .benefit, .segment-card, .plan-card, .faq-item'
    );
    revealTargets.forEach(function(el) { el.classList.add('reveal'); });

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealTargets.forEach(function(el) { revealObserver.observe(el); });
    } else {
        revealTargets.forEach(function(el) { el.classList.add('is-visible'); });
    }

});
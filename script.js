// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Reveal on Scroll Animation
const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
// Trigger on load
revealOnScroll();

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

// Modal "com quem você quer falar" (Solicitar demonstração)
const abrirModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const fecharModal = (modal) => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => abrirModal(trigger.getAttribute('data-modal-open')));
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
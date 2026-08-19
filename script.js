const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const year = document.getElementById('currentYear');
let scrollFrame;

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 40);
  scrollFrame = undefined;
};
window.addEventListener('scroll', () => {
  if (scrollFrame === undefined) scrollFrame = requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();

const setMenu = (open) => {
  menuToggle?.classList.toggle('open', open);
  mobileNav?.classList.toggle('open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
};
menuToggle?.addEventListener('click', () => setMenu(!mobileNav?.classList.contains('open')));
mobileNav?.querySelectorAll('a, button').forEach((item) => item.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth > 1180) setMenu(false); });

const revealItems = document.querySelectorAll('.reveal');
const dashboardThemeToggle = document.querySelector('.app-theme-toggle');
const heroDashboard = document.querySelector('.hero-app');

dashboardThemeToggle?.addEventListener('click', () => {
  const lightMode = heroDashboard?.classList.toggle('light-mode') ?? false;
  dashboardThemeToggle.setAttribute('aria-pressed', String(lightMode));
  dashboardThemeToggle.setAttribute('aria-label', lightMode ? 'Ativar modo escuro' : 'Ativar modo claro');
  const icon = dashboardThemeToggle.querySelector('i');
  icon?.classList.toggle('fa-moon', !lightMode);
  icon?.classList.toggle('fa-sun', lightMode);
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      instance.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -80px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('active'));
}

let modalTrigger;
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const openModal = (id, trigger) => {
  const modal = document.getElementById(id);
  if (!modal) return;
  modalTrigger = trigger;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const focusClose = () => modal.querySelector('.modal-close')?.focus();
  setTimeout(focusClose, 30);
  setTimeout(focusClose, 120);
};
const closeModal = (modal) => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalTrigger?.focus();
  modalTrigger = undefined;
};
document.querySelectorAll('[data-modal-open]').forEach((trigger) => trigger.addEventListener('click', () => openModal(trigger.dataset.modalOpen, trigger)));
document.querySelectorAll('[data-modal-close]').forEach((trigger) => trigger.addEventListener('click', () => {
  const modal = trigger.closest('.contact-modal');
  if (modal) closeModal(modal);
}));

document.addEventListener('keydown', (event) => {
  const modal = document.querySelector('.contact-modal.open');
  if (modal) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal(modal);
      return;
    }
    if (event.key === 'Tab') {
      const items = [...modal.querySelectorAll(focusableSelector)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    return;
  }
  if (event.key === 'Escape' && mobileNav?.classList.contains('open')) {
    setMenu(false);
    menuToggle?.focus();
  }
});

document.addEventListener('focusin', (event) => {
  const modal = document.querySelector('.contact-modal.open');
  if (modal && !modal.contains(event.target)) modal.querySelector('.modal-close')?.focus();
});

// Só o essencial pra `privacidade.html`/`termos.html` (menu mobile +
// dropdown "Funcionalidades" + ano do rodapé) - essas páginas não
// carregam `script.js` inteiro de propósito (ele assume vários
// elementos - splash, modais de módulo, cenas 3D - que não existem
// aqui). Era um `<script>` inline em cada página (bloco idêntico
// duplicado nas duas) - virou arquivo externo (14/09/2026): o CSP
// (`nginx.conf`) só libera o ÚNICO script inline do site por hash
// exato (o JSON-LD de `index.html`), então esse bloco inline aqui
// estava sendo BLOQUEADO silenciosamente em produção desde que essas
// páginas existem (bug real achado testando com CSP de verdade num
// container Docker, não só olhando o código - o menu mobile e o
// dropdown nunca funcionaram nessas 2 páginas). Arquivo externo
// same-origin já é coberto por `script-src 'self'`, sem precisar de
// hash nenhum - mais simples e não quebra a cada edição.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navToggle.innerHTML = isOpen ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
    });
}
// Dropdown "Funcionalidades" (mesma lógica de script.js).
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
const anoAtualEl = document.getElementById('ano-atual');
if (anoAtualEl) anoAtualEl.textContent = new Date().getFullYear();

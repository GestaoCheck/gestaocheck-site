/* GERADO por tools/build-demo.js a partir de vitrine_curva_abc.html - não editar à mão. */
GCDemo.define("curva_abc", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    window.vitFiltrarClasse = function (classe, btn) {
        document.querySelectorAll('.vit-classe-chip').forEach(function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        document.querySelectorAll('#vitTbody tr').forEach(function (tr) {
            tr.style.display = (classe === 'todas' || tr.getAttribute('data-classe') === classe) ? '' : 'none';
        });
    };
})();
  }
});

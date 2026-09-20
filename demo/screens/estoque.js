/* GERADO por tools/build-demo.js a partir de vitrine_estoque.html - não editar à mão. */
GCDemo.define("estoque", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var qtds = {"6": 25, "8": 12, "10": 24, "13": 9, "17": 2, "20": 1};

    window.vitQtdMenos = function (id) { vitAjustarQtd(id, -1); };
    window.vitQtdMais = function (id) { vitAjustarQtd(id, 1); };

    function vitAjustarQtd(id, delta) {
        qtds[id] = Math.max(0, (qtds[id] || 0) + delta);
        var unidade = document.getElementById('vitQtd' + id).textContent.trim().split(' ').slice(1).join(' ');
        document.getElementById('vitQtd' + id).textContent = qtds[id] + ' ' + unidade;
        var badge = document.getElementById('vitBadge' + id);
        var item = document.getElementById('vitItem' + id);
        if (qtds[id] <= 0) {
            badge.textContent = 'Ausente';
            badge.className = 'check-status-badge badge-ausente';
            item.classList.remove('status-ok');
            item.classList.add('status-ausente');
        } else {
            badge.textContent = 'OK';
            badge.className = 'check-status-badge badge-ok';
            item.classList.remove('status-ausente');
            item.classList.add('status-ok');
        }
    };
})();
  }
});

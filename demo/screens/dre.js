/* GERADO por tools/build-demo.js a partir de vitrine_dre.html - não editar à mão. */
GCDemo.define("dre", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var DADOS = {"ano": {"receita": 670778.6, "cmv": 234414.5, "cmo": 78538.35, "cmc": 35579.31, "despesas": 55607.15, "avarias": 379.0}, "mes": {"receita": 74530.0, "cmv": 26160.03, "cmo": 12615.55, "cmc": 3953.26, "despesas": 9114.31, "avarias": 45.0}};

    function fmt(v) { return v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }
    function pct(v, total) { return (v / total * 100).toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1}); }

    function render(periodo) {
        var d = DADOS[periodo];
        var receita = d.receita;
        var lucroBruto = receita - d.cmv;
        var resultado = lucroBruto - d.cmo - d.cmc - d.despesas - d.avarias;
        var linhas = [
            {nome: 'Receita Bruta', valor: receita, total: false},
            {nome: '(-) CMV', valor: -d.cmv, total: false},
            {nome: '(=) Lucro Bruto', valor: lucroBruto, total: true},
            {nome: '(-) CMO', valor: -d.cmo, total: false},
            {nome: '(-) CMC', valor: -d.cmc, total: false},
            {nome: '(-) Despesas', valor: -d.despesas, total: false},
            {nome: '(-) Avarias', valor: -d.avarias, total: false},
            {nome: '(=) Resultado Operacional', valor: resultado, total: true}
        ];
        document.getElementById('vitTabelaDre').innerHTML = linhas.map(function (l) {
            var cor = l.valor < 0 ? 'color:var(--vermelho)' : '';
            var peso = l.total ? 'font-weight:700' : '';
            var fundo = l.total ? 'background:var(--page-bg);font-weight:700' : '';
            var valorFmt = (l.valor < 0 ? '-' : '') + 'R$ ' + fmt(Math.abs(l.valor));
            return '<tr style="' + fundo + '"><td>' + l.nome + '</td><td style="' + cor + ';' + peso + '">' + valorFmt + '</td><td>' + pct(l.valor, receita) + '%</td></tr>';
        }).join('');
    }

    window.vitSetPeriodo = function (periodo, btn) {
        document.querySelectorAll('.period-tabs .period-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        render(periodo);
    };

    render('ano');
})();
  }
});

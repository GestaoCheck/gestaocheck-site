/* GERADO por tools/build-demo.js a partir de vitrine_cmv.html - não editar à mão. */
GCDemo.define("cmv", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var estado = { faturamento: 670779.0, custo: 234414.5, vendas: 2399 };

    function fmt(v) { return v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }

    function render() {
        var pct = estado.custo / estado.faturamento * 100;
        var margem = 100 - pct;
        var lucro = estado.faturamento - estado.custo;
        var ticket = estado.faturamento / estado.vendas;

        document.getElementById('vitCmvPct').textContent = pct.toFixed(1);
        document.getElementById('vitHeroFaturamento').textContent = 'R$ ' + fmt(estado.faturamento);
        document.getElementById('vitHeroCusto').textContent = 'R$ ' + fmt(estado.custo);
        document.getElementById('vitHeroMargem').textContent = margem.toFixed(1) + '%';
        document.getElementById('vitMFaturamento').textContent = 'R$ ' + fmt(estado.faturamento);
        document.getElementById('vitMCusto').textContent = 'R$ ' + fmt(estado.custo);
        document.getElementById('vitMTicket').textContent = 'R$ ' + fmt(ticket);
        document.getElementById('vitMLucro').textContent = 'R$ ' + fmt(lucro);
        document.getElementById('vitMVendas').textContent = estado.vendas;

        var badge = document.getElementById('vitCmvBadge');
        var txt = document.getElementById('vitCmvStatusTxt');
        if (pct <= 30) { badge.className = 'cmv-status ok'; txt.textContent = 'Dentro da meta'; }
        else if (pct <= 40) { badge.className = 'cmv-status warn'; txt.textContent = 'Atenção: próximo do limite'; }
        else { badge.className = 'cmv-status bad'; txt.textContent = 'Acima da meta'; }
    }

    window.vitRegistrarVenda = function () {
        var sel = document.getElementById('vitItemVenda');
        var opt = sel.options[sel.selectedIndex];
        var preco = parseFloat(opt.getAttribute('data-preco'));
        var cmvPct = parseFloat(opt.getAttribute('data-cmv'));
        var qtd = Math.max(1, parseInt(document.getElementById('vitQtdVenda').value, 10) || 1);

        var valorVenda = preco * qtd;
        var custoVenda = valorVenda * cmvPct;
        estado.faturamento += valorVenda;
        estado.custo += custoVenda;
        estado.vendas += qtd;
        render();
        vitToast(qtd + 'x "' + opt.textContent.split(' — ')[0] + '" registrada(s) — R$ ' + fmt(valorVenda) + ' no faturamento.', 'sucesso');
    };

    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + tipo;
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3600);
    }

    render();
})();
  }
});

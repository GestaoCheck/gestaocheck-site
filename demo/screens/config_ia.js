/* GERADO por tools/build-demo.js a partir de vitrine_config_ia.html - não editar à mão. */
GCDemo.define("config_ia", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var periodoAtual = 'mes';
    var insightsPorPeriodo = {
        mes: [
            '<strong>CMV em 34,9%</strong>, acima da meta de 30% — vale revisar o custo de Picanha na Brasa e Salmão Grelhado, os itens com maior CMV do período.',
            '<strong>2 avarias registradas</strong> na Cozinha somando R$ 271,00 — a maior parte por vencimento de produto, um ajuste na frequência de conferência do estoque pode reduzir essa perda.',
            '<strong>Faturamento estável</strong> em relação ao mês anterior, com o Bar puxando o crescimento nas vendas de bebidas.'
        ],
        ano: [
            '<strong>CMV médio de 35,1%</strong> no acumulado do ano, levemente acima da meta — sem grandes variações mês a mês, o que indica um problema estrutural de precificação, não pontual.',
            '<strong>CMO em 11,7% do faturamento</strong>, dentro da meta de 18% — a equipe está com bom custo relativo mesmo com o quadro atual de 5 colaboradores.',
            '<strong>Setembro</strong> foi o mês com maior número de avarias registradas no ano — vale revisar o que mudou na operação nesse período.'
        ]
    };

    window.vitSetPeriodo = function (btn) {
        document.querySelectorAll('.period-tabs .period-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        periodoAtual = btn.textContent.trim() === 'Ano' ? 'ano' : 'mes';
        document.getElementById('vitInsightsLista').innerHTML = '';
        document.getElementById('vitGeradoEm').textContent = '';
    };

    window.vitGerarInsights = function () {
        var btn = document.getElementById('vitBtnGerar');
        var status = document.getElementById('vitInsightsStatus');
        var lista = document.getElementById('vitInsightsLista');
        btn.disabled = true;
        btn.textContent = 'Analisando...';
        lista.innerHTML = '';
        status.textContent = 'Analisando os dados do período (faturamento, CMV, CMO, avarias)...';

        setTimeout(function () {
            var itens = insightsPorPeriodo[periodoAtual];
            lista.innerHTML = itens.map(function (texto) {
                return '<div class="vit-insight-item">' + texto + '</div>';
            }).join('');
            status.textContent = 'Gera um resumo em texto do período — o que está indo bem, o que merece atenção.';
            var agora = new Date();
            function p(n) { return String(n).padStart(2, '0'); }
            document.getElementById('vitGeradoEm').textContent = 'Gerado agora, ' + p(agora.getHours()) + ':' + p(agora.getMinutes());
            btn.disabled = false;
            btn.textContent = 'Gerar insights';
        }, 1100);
    };
})();
  }
});

/* GERADO por tools/build-demo.js a partir de vitrine_relatorio_insights.html - não editar à mão. */
GCDemo.define("insights", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var CARDS = [{"badge": "badge-red", "sev": "Alta", "titulo": "Custo total elevado", "texto": "O custo total (CMV + CMO) representa 46,6% do faturamento de R$ 670.778,60, acima da margem ideal de 40%. Avalie renegociar fornecedores ou otimizar o menu."}, {"badge": "badge-green", "sev": "Baixa", "titulo": "Avarias geram perdas", "texto": "Foram registradas 4 avarias que custaram R$ 379,00. Embora o valor seja pequeno, reduzir essas ocorrências pode melhorar a margem."}, {"badge": "badge-orange", "sev": "Média", "titulo": "Pendências em manutenção", "texto": "1 das 2 solicitações de manutenção está aberta. Resolva-a rapidamente para evitar interrupções que impactem a produção."}, {"badge": "badge-orange", "sev": "Média", "titulo": "Backlog de requisições", "texto": "2 das 3 requisições estão pendentes, indicando um acúmulo de demandas que pode atrasar entregas e afetar o serviço."}, {"badge": "badge-orange", "sev": "Média", "titulo": "Checklist diário não concluído", "texto": "Nenhum dos 2 checklists programados foi concluído hoje. Implementar o cumprimento diário ajuda a garantir a qualidade e a segurança."}];

    window.vitGerarInsights = function () {
        var btn = document.getElementById('vitBtnGerar');
        var grid = document.getElementById('vitCardsGrid');
        var geradoEm = document.getElementById('vitGeradoEm');
        btn.disabled = true;
        var textoOriginal = btn.innerHTML;
        btn.innerHTML = 'Analisando o período...';
        grid.innerHTML = '';
        geradoEm.textContent = '';

        setTimeout(function () {
            grid.innerHTML = CARDS.map(function (c) {
                return '<div class="insight-card"><span class="badge ' + c.badge + '">' + c.sev + '</span>' +
                    '<div class="insight-card-titulo">' + c.titulo + '</div>' +
                    '<div class="insight-card-texto">' + c.texto + '</div></div>';
            }).join('');
            var agora = new Date();
            function p(n) { return String(n).padStart(2, '0'); }
            geradoEm.textContent = 'Gerado em ' + p(agora.getDate()) + '/' + p(agora.getMonth() + 1) + '/' + agora.getFullYear();
            btn.disabled = false;
            btn.innerHTML = textoOriginal;
        }, 1300);
    };
})();
  }
});

<div class="vitrine-aviso">Demonstração interativa — clique em "Gerar insights" e veja a IA analisar o período de verdade.</div>
<div class="painel" style="padding:18px">
    <div class="painel-titulo-linha">
        <div>
            <div class="secao-titulo">Insights automáticos</div>
            <p style="font-size:12.5px;color:var(--texto-muted);margin:4px 0 0">A IA analisa os números do período/setor selecionado e sugere de 3 a 6 observações curtas — nunca substitui seu julgamento, é só um apoio.</p>
        </div>
        <button class="btn-gerar-insights" id="vitBtnGerar" data-gc-click="vitGerarInsights()">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 2l1.8 5.6L19 9l-5.2 1.4L12 16l-1.8-5.6L5 9l5.2-1.4L12 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"></path></svg>
            Gerar insights
        </button>
    </div>
    <p id="vitGeradoEm" style="font-size:11.5px;color:var(--texto-muted);margin:2px 0 14px"></p>
    <div id="vitCardsGrid" class="insights-grid"></div>
</div>

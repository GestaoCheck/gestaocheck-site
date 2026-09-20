<div class="vitrine-aviso">Demonstração interativa — troque entre Mês e Ano; toda a DRE recalcula linha a linha.</div>
<div class="filtros-rel">
    <div class="period-tabs">
        <button class="period-tab" data-gc-click="vitSetPeriodo('mes', this)">Mês</button>
        <button class="period-tab active" data-gc-click="vitSetPeriodo('ano', this)">Ano</button>
    </div>
</div>

<div class="painel" style="padding:18px">
    <div class="painel-titulo-linha"><div class="secao-titulo">DRE completa</div></div>
    <p style="font-size:12.5px;color:var(--texto-muted);margin:6px 0 12px">Demonstrativo de resultado do período — receita bruta até o resultado operacional, linha a linha.</p>
    <div class="tabela-scroll">
        <table class="tabela">
            <thead><tr><th>Linha</th><th>Valor</th><th>% da receita</th></tr></thead>
            <tbody id="vitTabelaDre"></tbody>
        </table>
    </div>
</div>

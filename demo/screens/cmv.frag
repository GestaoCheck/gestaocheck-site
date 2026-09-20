<div class="vitrine-aviso">Demonstração interativa — registre uma venda; faturamento, custo, lucro e o contador recalculam de verdade.</div>

<div class="cmv-status-row">
    <div class="cmv-status-card">
        <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="50" fill="none" stroke="var(--borda)" stroke-width="14"></circle>
            <text x="65" y="60" text-anchor="middle" class="cmv-ring-num"><tspan id="vitCmvPct">34.9</tspan>%</text>
            <text x="65" y="78" text-anchor="middle" font-size="10" fill="var(--texto-muted)">CMV atual</text>
        </svg>
        <span class="cmv-status warn" id="vitCmvBadge"><span id="vitCmvStatusTxt">Atenção: próximo do limite</span></span>
        <span class="cmv-status-meta">Meta configurada: <strong>30%</strong></span>
    </div>
    <div class="cmv-hero">
        <div class="cmv-hero-card"><span class="lbl">Faturamento no período</span><span class="val accent" id="vitHeroFaturamento">R$ 670.779,00</span></div>
        <div class="cmv-hero-card"><span class="lbl">Custo no período</span><span class="val" id="vitHeroCusto">R$ 234.414,50</span></div>
        <div class="cmv-hero-card"><span class="lbl">Margem de lucro</span><span class="val" id="vitHeroMargem">65.1%</span></div>
    </div>
</div>

<div class="metrics-cmv" style="margin-top:14px">
    <div class="metric-card"><div class="metric-card-top"><span class="metric-label">Faturamento</span><div class="metric-icon purple"><svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" stroke-width="1.8"></rect><line x1="1" y1="10" x2="23" y2="10" stroke-width="1.8"></line></svg></div></div><span class="metric-value" id="vitMFaturamento">R$ 670.779,00</span></div>
    <div class="metric-card"><div class="metric-card-top"><span class="metric-label">Custo total</span><div class="metric-icon red"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" stroke-width="1.8" stroke-linecap="round"></line><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke-width="1.8" stroke-linecap="round"></path></svg></div></div><span class="metric-value" id="vitMCusto">R$ 234.414,50</span></div>
    <div class="metric-card"><div class="metric-card-top"><span class="metric-label">Ticket médio</span><div class="metric-icon blue"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="1.8"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke-width="1.8" stroke-linecap="round"></path><line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.4" stroke-linecap="round"></line></svg></div></div><span class="metric-value" id="vitMTicket">R$ 279,61</span></div>
    <div class="metric-card"><div class="metric-card-top"><span class="metric-label">Lucro bruto</span><div class="metric-icon green"><svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" stroke-width="1.8" stroke-linecap="round"></line><line x1="12" y1="20" x2="12" y2="4" stroke-width="1.8" stroke-linecap="round"></line><line x1="6" y1="20" x2="6" y2="14" stroke-width="1.8" stroke-linecap="round"></line></svg></div></div><span class="metric-value" id="vitMLucro">R$ 436.364,50</span></div>
    <div class="metric-card"><div class="metric-card-top"><span class="metric-label">Vendas no período</span><div class="metric-icon teal"><svg viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div><span class="metric-value" id="vitMVendas">2399</span></div>
</div>

<div class="card" style="margin-top:14px">
    <div class="card-header"><div class="card-title">Registrar venda</div></div>
    <div class="vit-venda-form">
        <div class="form-group"><label>Item de Venda</label><select id="vitItemVenda"><option value="0" data-preco="38.0" data-cmv="0.388">Picanha na Brasa (300g) — R$ 38,00</option><option value="1" data-preco="29.5" data-cmv="0.36">Salmão Grelhado com Legumes — R$ 29,50</option><option value="2" data-preco="32.0" data-cmv="0.356">Filé Mignon ao Molho Madeira — R$ 32,00</option><option value="3" data-preco="6.5" data-cmv="0.342">Chopp Artesanal (500ml) — R$ 6,50</option></select></div>
        <div class="form-group" style="min-width:100px"><label>Qtd.</label><input type="number" id="vitQtdVenda" min="1" value="1"></div>
        <button class="btn btn-primary" data-gc-click="vitRegistrarVenda()">+ Registrar venda</button>
    </div>
</div>

<div class="bottom-row" style="margin-top:14px">
    <div class="card">
        <div class="card-header"><div><div class="card-title">Evolução do CMV</div><div class="card-sub">Últimos meses</div></div></div>
        <div><div class="bar-row"><div class="bar-label">Abr</div><div class="bar-track"><div class="bar-fill orange" style="width:58.0%"></div></div><div class="bar-val">34.8%</div></div><div class="bar-row"><div class="bar-label">Mai</div><div class="bar-track"><div class="bar-fill orange" style="width:58.0%"></div></div><div class="bar-val">34.8%</div></div><div class="bar-row"><div class="bar-label">Jun</div><div class="bar-track"><div class="bar-fill orange" style="width:58.3%"></div></div><div class="bar-val">35.0%</div></div><div class="bar-row"><div class="bar-label">Jul</div><div class="bar-track"><div class="bar-fill orange" style="width:58.3%"></div></div><div class="bar-val">35.0%</div></div><div class="bar-row"><div class="bar-label">Ago</div><div class="bar-track"><div class="bar-fill orange" style="width:58.2%"></div></div><div class="bar-val">34.9%</div></div><div class="bar-row"><div class="bar-label">Set</div><div class="bar-track"><div class="bar-fill red" style="width:58.5%"></div></div><div class="bar-val">35.1%</div></div></div>
    </div>
    <div class="card">
        <div class="card-header"><div class="card-title">Composição de custos por categoria</div></div>
        <div class="donut-wrap">
            <svg class="donut-svg-sm" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" style="fill:var(--card-bg)"></circle><circle cx="21" cy="21" r="15.9" fill="transparent" style="stroke:var(--borda)" stroke-width="8"></circle><circle cx="21" cy="21" r="15.9" fill="transparent" style="stroke:var(--accent)" stroke-width="8" stroke-dasharray="78.82231837789867 21.08032800625675" stroke-dashoffset="0" transform="rotate(-90,21,21)"></circle><circle cx="21" cy="21" r="15.9" fill="transparent" style="stroke:var(--verde)" stroke-width="8" stroke-dasharray="5.395005857474787 94.50764052668063" stroke-dashoffset="-78.82231837789867" transform="rotate(-90,21,21)"></circle><circle cx="21" cy="21" r="15.9" fill="transparent" style="stroke:var(--laranja)" stroke-width="8" stroke-dasharray="12.685871068530156 87.21677531562526" stroke-dashoffset="-84.21732423537345" transform="rotate(-90,21,21)"></circle><circle cx="21" cy="21" r="15.9" fill="transparent" style="stroke:var(--dourado)" stroke-width="8" stroke-dasharray="2.9994510802518013 96.90319530390362" stroke-dashoffset="-96.90319530390362" transform="rotate(-90,21,21)"></circle></svg>
            <div class="donut-legend"><div class="donut-leg-item"><div class="donut-leg-dot" style="background:var(--accent)"></div><div class="donut-leg-name">Pratos Principais</div><div class="donut-leg-val">78.9%</div></div><div class="donut-leg-item"><div class="donut-leg-dot" style="background:var(--verde)"></div><div class="donut-leg-name">Entradas</div><div class="donut-leg-val">5.4%</div></div><div class="donut-leg-item"><div class="donut-leg-dot" style="background:var(--laranja)"></div><div class="donut-leg-name">Bebidas</div><div class="donut-leg-val">12.7%</div></div><div class="donut-leg-item"><div class="donut-leg-dot" style="background:var(--dourado)"></div><div class="donut-leg-name">Sobremesas</div><div class="donut-leg-val">3.0%</div></div></div>
        </div>
    </div>
</div>

<div class="bottom-row" style="margin-top:14px">
    <div class="card">
        <div class="card-header"><div class="card-title">Alertas</div></div>
        <div id="vitAlertasList"><div class="alert-item bad"><div class="alert-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"></circle><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line></svg></div><div><div class="alert-text">CMV 34.9% acima da meta (30%)</div><div class="alert-sub">Revise o custo dos principais itens de venda</div></div></div></div>
    </div>
    <div class="card">
        <div class="card-header"><div class="card-title">Itens de venda com maior CMV</div></div>
        <div id="vitRankingCMV"><div class="rank-item"><div class="rank-pos top">1</div><div class="rank-info"><div class="rank-name">Picanha na Brasa (300g)</div><div class="rank-cat">Pratos Principais</div></div><div style="text-align:right"><div class="rank-val">R$ 38,00</div><div class="rank-cmv bad">38.8% CMV</div></div></div><div class="rank-item"><div class="rank-pos top">2</div><div class="rank-info"><div class="rank-name">Salmão Grelhado com Legumes</div><div class="rank-cat">Pratos Principais</div></div><div style="text-align:right"><div class="rank-val">R$ 29,50</div><div class="rank-cmv bad">36.0% CMV</div></div></div><div class="rank-item"><div class="rank-pos "></div><div class="rank-info"><div class="rank-name">Filé Mignon ao Molho Madeira</div><div class="rank-cat">Pratos Principais</div></div><div style="text-align:right"><div class="rank-val">R$ 32,00</div><div class="rank-cmv bad">35.6% CMV</div></div></div></div>
    </div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

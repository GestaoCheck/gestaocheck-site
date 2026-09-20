<div class="vitrine-aviso">Demonstração interativa — registre uma venda (o CMV é calculado na hora), filtre a lista ou exclua uma venda do mês aberto.</div>

<nav class="tabs-nav">
    <button class="tab" data-gc-click="vitAviso('Essa aba fica na tela completa do CMV.')">Visão Geral</button>
    <button class="tab" data-gc-click="vitAviso('Essa aba fica na tela completa do CMV.')">Itens de Venda</button>
    <button class="tab" data-gc-click="vitAviso('Essa aba fica na tela completa do CMV.')">Ficha Técnica</button>
    <button class="tab" data-gc-click="vitAviso('Essa aba fica na tela completa do CMV.')">Promoções</button>
    <button class="tab active">Vendas</button>
</nav>

<div class="cmv-hero">
    <div class="cmv-hero-card"><span class="lbl">Vendas listadas</span><span class="val" id="vitHQtd">—</span></div>
    <div class="cmv-hero-card"><span class="lbl">Faturamento listado</span><span class="val accent" id="vitHFat">—</span></div>
    <div class="cmv-hero-card"><span class="lbl">CMV médio</span><span class="val" id="vitHCmv">—</span></div>
</div>

<div class="card">
    <div class="card-header">
        <div class="card-title">Vendas registradas</div>
        <div class="card-actions">
            <button class="btn btn-primary" data-gc-click="vitAbrirModal()">+ Registrar venda</button>
            <div class="menu-dropdown">
                <button class="btn-exportar" data-gc-click="document.getElementById('vitMenuExp').classList.toggle('show')">Exportar ▾</button>
                <div class="menu-dropdown-lista" id="vitMenuExp">
                    <button data-gc-click="vitExportar('CSV')">CSV</button>
                    <button data-gc-click="vitExportar('PDF')">PDF</button>
                </div>
            </div>
        </div>
    </div>
    <p class="ficha-ajuda">Vendas ficam abertas pra editar ou excluir até o dia 5 do mês seguinte — depois disso o mês fecha e elas viram só consulta.</p>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap">
        <input type="text" class="input-busca" id="vitBusca" placeholder="Buscar item..." data-gc-input="vitFiltrar()">
        <select class="select-filtro" id="vitTipoF" data-gc-change="vitFiltrar()"><option value="">Todos os tipos</option><option>Mesa</option><option>Balcão</option><option>Delivery</option></select>
    </div>
    <div class="table-wrap">
        <table>
            <thead><tr><th>Data</th><th>Item</th><th>Qtd</th><th>Tipo</th><th>Valor</th><th>Pagamento</th><th>CMV</th><th>Ações</th></tr></thead>
            <tbody id="vitTbody"></tbody>
        </table>
    </div>
</div>

<div class="modal-overlay" id="vitModalVenda" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-header"><span class="modal-title">Registrar Venda</span>
            <button class="modal-close" data-gc-click="vitFecharModal()"><svg viewBox="0 0 24 24" fill="none" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg></button></div>
        <div class="form-grid">
            <div class="form-group full"><label>Item de Venda</label><select id="vitItem" data-gc-change="vitTrocaItem()"></select></div>
            <div class="form-group"><label>Quantidade</label><input type="number" id="vitQtd" value="1" min="1" data-gc-input="vitCalcVenda()"></div>
            <div class="form-group"><label>Valor unitário de venda (R$)</label><input type="text" inputmode="numeric" id="vitValor" placeholder="0,00" data-gc-input="vitMascararMoeda(this); vitCalcVenda()"></div>
            <div class="form-group"><label>Tipo de pedido</label><select id="vitTipo"><option>Balcão</option><option>Mesa</option><option>Delivery</option></select></div>
            <div class="form-group"><label>Pagamento</label><select id="vitPag"><option>Pix</option><option>Dinheiro</option><option>Cartão crédito</option><option>Cartão débito</option></select></div>
            <div class="form-group full"><label>CMV desta venda</label><input type="text" id="vitCmvCalc" readonly placeholder="-"></div>
        </div>
        <p class="form-erro" id="vitErro" style="color:var(--vermelho);font-size:12px;min-height:14px"></p>
        <div class="modal-footer">
            <button class="btn btn-outline" data-gc-click="vitFecharModal()">Cancelar</button>
            <button class="btn btn-primary" data-gc-click="vitSalvar()">Registrar</button>
        </div>
    </div>
</div>
<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

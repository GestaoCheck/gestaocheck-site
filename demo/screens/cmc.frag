<div class="vitrine-aviso">Demonstração interativa — registre uma compra nova (botão "+ Registrar compra") e veja os números recalcularem.</div>

<div class="hero-cmo">
    <div class="hero-main">
        <span class="hero-label">CMC do período</span>
        <span class="hero-valor">R$ <span id="vitHeroValorTotal">35.579,31</span></span>
        <span class="hero-meta">Meta: <strong>Não definida</strong> | Fornecedores: <strong id="vitHeroFornec">4</strong></span>
        <span class="hero-badge">Meta não definida</span>
    </div>
    <div class="hero-divider"></div>
    <div class="hero-stat"><span class="hero-stat-val" id="vitHeroCompras">22</span><span class="hero-stat-lbl">Compras</span></div>
    <div class="hero-divider"></div>
    <div class="hero-stat"><span class="hero-stat-val" id="vitHeroTicketMedio">R$ 1.617,24</span><span class="hero-stat-lbl">Ticket médio</span></div>
    <div class="hero-divider"></div>
    <div class="hero-stat"><span class="hero-stat-val" id="vitHeroMaiorCompra">R$ 2.305,47</span><span class="hero-stat-lbl">Maior compra</span></div>
</div>

<div class="kgrid">
    <div class="kcard"><div class="kcard-icon kcard-blue"><svg viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><span class="kcard-val" id="vitMTotalCMC">R$ 35.579,31</span><span class="kcard-lbl">Total de compras</span></div>
    <div class="kcard"><div class="kcard-icon kcard-green"><svg viewBox="0 0 24 24" fill="none"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline><polyline points="16,7 22,7 22,13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline></svg></div><span class="kcard-val" id="vitMQtdCompras">22</span><span class="kcard-lbl">Qtd. de compras</span></div>
    <div class="kcard"><div class="kcard-icon kcard-teal"><svg viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"></circle></svg></div><span class="kcard-val" id="vitMFornecedores">4</span><span class="kcard-lbl">Fornecedores</span></div>
    <div class="kcard"><div class="kcard-icon kcard-orange"><svg viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></div><span class="kcard-val" id="vitMTicketMedio">R$ 1.617,24</span><span class="kcard-lbl">Ticket médio</span></div>
    <div class="kcard"><div class="kcard-icon kcard-purple"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><span class="kcard-val" id="vitMMaiorCompra">R$ 2.305,47</span><span class="kcard-lbl">Maior compra</span></div>
</div>

<div class="painel" style="margin-top:14px">
    <div class="painel-titulo">Últimas compras</div>
    <div id="vitUltimasCompras"><div class="cmc-linha-item"><div><div class="cmc-linha-nome">Distribuidora Bom Preço</div><div class="cmc-linha-sub">Mercearia</div></div><div class="cmc-linha-valor">R$ 2.305,47</div></div><div class="cmc-linha-item"><div><div class="cmc-linha-nome">Hortifruti Central</div><div class="cmc-linha-sub">Hortifruti</div></div><div class="cmc-linha-valor">R$ 640,20</div></div><div class="cmc-linha-item"><div><div class="cmc-linha-nome">Bebidas Express</div><div class="cmc-linha-sub">Bebidas</div></div><div class="cmc-linha-valor">R$ 1.180,90</div></div></div>
</div>

<div class="modal-overlay" id="vitModalOverlay" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-header"><span class="modal-title">Registrar compra</span>
            <button class="modal-close" data-gc-click="vitFecharModal()">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group full"><label>Fornecedor *</label><input type="text" id="vitFornecedor" list="vitListaFornec" placeholder="Ex: Distribuidora ABC">
                <datalist id="vitListaFornec"><option>Distribuidora Bom Preço</option><option>Hortifruti Central</option><option>Bebidas Express</option><option>Frigorífico Sul</option></datalist>
            </div>
            <div class="form-group full"><label>Categoria</label><select id="vitCategoria"><option>Mercearia</option><option>Hortifruti</option><option>Bebidas</option><option>Carnes</option><option>Limpeza</option></select></div>
            <div class="form-group full"><label>Valor (R$) *</label><input type="text" inputmode="numeric" id="vitValor" placeholder="0,00" data-gc-input="vitMascararMoeda(this)"></div>
        </div>
        <div class="modal-footer">
            <button class="btn-outline" data-gc-click="vitFecharModal()">Cancelar</button>
            <button class="btn btn-primary" data-gc-click="vitSalvarCompra()">Salvar compra</button>
        </div>
    </div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

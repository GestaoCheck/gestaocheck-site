<div class="vitrine-aviso">Demonstração interativa — registre um beneficiamento, clique num motivo da rosca pra filtrar, confirme ou exclua um registro.</div>

<div class="metrics-benef">
    <div class="bmetric-card acc-green"><div class="bmetric-icon green"><svg viewBox="0 0 24 24" fill="none"><path d="M12 22V12M12 12L7 17M12 12l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 12a8 8 0 1 0-16 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></div><div class="bmetric-body"><span class="bmetric-value" id="vitMProd">—</span><span class="bmetric-label">Total produzido</span></div><div class="bmetric-trend up" id="vitTProd">—</div></div>
    <div class="bmetric-card acc-red"><div class="bmetric-icon red"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"></circle><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line></svg></div><div class="bmetric-body"><span class="bmetric-value" id="vitMPerda">—</span><span class="bmetric-label">Total de perdas</span></div><div class="bmetric-trend down" id="vitTPerda">—</div></div>
    <div class="bmetric-card acc-orange"><div class="bmetric-icon orange"><svg viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><div class="bmetric-body"><span class="bmetric-value" id="vitMAprov">—</span><span class="bmetric-label">Aproveitamento</span></div><div class="bmetric-trend up" id="vitTAprov">—</div></div>
    <div class="bmetric-card acc-teal"><div class="bmetric-icon teal"><svg viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></div><div class="bmetric-body"><span class="bmetric-value" id="vitMConf">—</span><span class="bmetric-label">Confirmados</span></div><div class="bmetric-trend" id="vitTConf">—</div></div>
</div>

<div class="graficos-row">
    <div class="grafico-card">
        <div class="grafico-header">
            <div><h3>Produção vs Perdas</h3><p>Comparativo por dia</p></div>
            <div class="legenda">
                <span class="leg-item"><span class="leg-dot green"></span>Produzido</span>
                <span class="leg-item"><span class="leg-dot red"></span>Perda</span>
                <button class="vit-replay" data-gc-click="vitReplay()" title="Rever a animação">↻</button>
            </div>
        </div>
        <div id="vitBarras"></div>
    </div>
    <div class="grafico-card grafico-card-sm">
        <div class="grafico-header"><div><h3>Perdas por motivo</h3><p>Clique num motivo pra filtrar</p></div></div>
        <div class="rosca-wrap" id="vitRoscaWrap"></div>
        <div class="rosca-legenda" id="vitRoscaLeg" style="max-height:none"></div>
    </div>
</div>

<div class="bottom-row">
    <div class="filtros-bar">
        <div class="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><circle cx="11" cy="11" r="8" stroke-width="1.8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="1.8" stroke-linecap="round"></line></svg>
            <input type="text" placeholder="Buscar produto..." id="vitBusca" data-gc-input="vitFiltrar()">
        </div>
        <select class="filtro-select" id="vitStatus" data-gc-change="vitFiltrar()">
            <option value="">Todos os status</option><option value="pendente">Pendente</option><option value="confirmado">Confirmado</option>
        </select>
        <span class="vit-chip" id="vitChipMotivo" style="display:none"><span id="vitChipTxt"></span><button data-gc-click="vitLimparMotivo()">✕</button></span>
        <div class="menu-dropdown">
            <button class="btn-exportar" data-gc-click="document.getElementById('vitMenuExp').classList.toggle('show')">Exportar ▾</button>
            <div class="menu-dropdown-lista" id="vitMenuExp">
                <button data-gc-click="vitExportar('CSV')">CSV (todos os registros)</button>
                <button data-gc-click="vitExportar('PDF')">PDF (todos os registros)</button>
            </div>
        </div>
    </div>
    <div class="timeline-wrap" id="vitTimeline"></div>
</div>

<div class="modal-overlay" id="vitModalNovo" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-header"><div><span class="modal-title">Novo registro</span><p class="modal-subtitulo">Ficha de produção</p></div>
            <button class="modal-close" data-gc-click="vitFecharModal()"><svg viewBox="0 0 24 24" fill="none" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg></button></div>
        <div class="modal-body">
            <div class="form-row">
                <div class="form-group"><label>Produto / Receita *</label><input type="text" id="vitFProduto" placeholder="Ex: Molho de pimenta"></div>
                <div class="form-group"><label>Responsável *</label><input type="text" id="vitFResp" placeholder="Nome do colaborador"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Quantidade produzida (Kg) *</label><input type="number" id="vitFQtd" min="0" step="0.1" placeholder="Ex: 3" data-gc-input="vitCalc()"></div>
                <div class="form-group"><label>Perda (Kg)</label><input type="number" id="vitFPerda" min="0" step="0.1" placeholder="Ex: 0.2" data-gc-input="vitCalc()"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Motivo da perda</label>
                    <select id="vitFMotivo"><option>Aparas do preparo</option><option>Sobra de corte</option><option>Erro de preparo</option><option>Validade vencida</option></select></div>
                <div class="form-group"><label>Aproveitamento</label><div class="aprov-display" id="vitAprovPrev">—</div></div>
            </div>
            <p class="form-erro" id="vitErro" style="color:var(--vermelho);font-size:12px;min-height:14px"></p>
        </div>
        <div class="modal-footer">
            <button class="btn-outline" data-gc-click="vitFecharModal()">Cancelar</button>
            <button class="btn-primary" data-gc-click="vitSalvar()">Salvar registro</button>
        </div>
    </div>
</div>
<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

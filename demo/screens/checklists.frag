<div class="vitrine-aviso">Demonstração interativa — os dados são fictícios e não são salvos em lugar nenhum.</div>
<div class="vitrine-wrap">
<div class="metrics metrics-checklist">
    <div class="metric-card">
        <div class="metric-card-top"><span class="metric-label">Concluídos hoje</span>
            <div class="metric-icon green"><svg viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>
        </div>
        <span class="metric-value" id="vConcluidos">1</span>
    </div>
    <div class="metric-card">
        <div class="metric-card-top"><span class="metric-label">Pendentes</span>
            <div class="metric-icon orange"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"></circle><polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline></svg></div>
        </div>
        <span class="metric-value" id="vPendentes">1</span>
    </div>
    <div class="metric-card">
        <div class="metric-card-top"><span class="metric-label">Total de checklists</span>
            <div class="metric-icon teal"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.8"></rect><path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></div>
        </div>
        <span class="metric-value">2</span>
    </div>
    <div class="metric-card">
        <div class="metric-card-top"><span class="metric-label">Setores ativos</span>
            <div class="metric-icon red"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"></circle><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></line></svg></div>
        </div>
        <span class="metric-value">2</span>
    </div>
</div>

<div class="checklists-grid">
    <div class="checklist-card">
        <div class="card-header"><div><div class="card-titulo">Abertura da Cozinha</div><div class="card-setor">Cozinha</div></div><span class="card-turno-badge">Abertura</span></div>
        <div class="card-progresso"><div class="progresso-info"><span>4 de 4 tarefas</span><span>100%</span></div><div class="progresso-bar"><div class="progresso-fill completo" style="width:100%"></div></div></div>
        <div class="card-footer"><span class="card-criador">Marina · hoje</span></div>
    </div>
    <div class="checklist-card">
        <div class="card-header"><div><div class="card-titulo">Fechamento do Salão</div><div class="card-setor">Salão</div></div><span class="card-turno-badge">Fechamento</span></div>
        <div class="card-progresso"><div class="progresso-info"><span id="vitTxt">0 de 5 tarefas</span><span id="vitPct">0%</span></div><div class="progresso-bar"><div class="progresso-fill" id="vitBar" style="width:0%"></div></div></div>
        <div class="card-footer"><span class="card-criador">Diego · hoje</span>
            <div class="card-acoes"><button class="btn-executar" data-gc-click="document.getElementById('vitExecCard').scrollIntoView({behavior:'smooth',block:'start'})"><svg viewBox="0 0 24 24" fill="none" width="14" height="14"><polygon points="5,3 19,12 5,21" fill="currentColor"></polygon></svg> Executar</button></div>
        </div>
    </div>
</div>

<div class="vitrine-exec-card" id="vitExecCard">
    <div class="modal-header"><div><span class="modal-title">Fechamento do Salão</span><span class="exec-setor">Salão</span></div><button class="vitrine-reset" data-gc-click="vitReiniciar()">Reiniciar demonstração</button></div>
    <div class="exec-progresso" style="padding:0 20px;">
        <div class="exec-progresso-info"><span>Progresso</span><span id="vitTxt2">0 / 5</span></div>
        <div class="progresso-bar"><div class="progresso-fill" id="vitBar2" style="width:0%"></div></div>
    </div>
    <div class="modal-body exec-body" id="vitLista" style="padding:16px 20px;"></div>
    <div class="modal-footer">
        <button class="btn-primary" id="vitBtnConcluir" disabled>Concluir checklist</button>
    </div>
</div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

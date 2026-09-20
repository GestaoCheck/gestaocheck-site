<div class="vitrine-aviso">Demonstração interativa — troque o status pelo seletor ou clique numa linha pra ver o detalhe.</div>
<div class="kgrid">
    <div class="kcard"><div class="kcard-icon purple"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.8"></rect><path d="M9 9h6M9 12h6M9 15h4" stroke-width="1.8" stroke-linecap="round"></path></svg></div><span class="kcard-val" id="vReqTotal">5</span><span class="kcard-lbl">Total de requisições</span></div>
    <div class="kcard"><div class="kcard-icon orange"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke-width="1.8"></circle><polyline points="12,6 12,12 16,14" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline></svg></div><span class="kcard-val" id="vReqPendentes">3</span><span class="kcard-lbl">Pendentes</span></div>
    <div class="kcard"><div class="kcard-icon blue"><svg viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke-width="1.8"></path></svg></div><span class="kcard-val" id="vReqSeparacao">1</span><span class="kcard-lbl">Em separação</span></div>
    <div class="kcard"><div class="kcard-icon green"><svg viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke-width="1.8" stroke-linecap="round"></path></svg></div><span class="kcard-val" id="vReqEntregues">1</span><span class="kcard-lbl">Entregues</span></div>
</div>

<div class="filtros-bar">
    <div class="search-wrap">
        <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><circle cx="11" cy="11" r="8" stroke-width="1.8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="1.8" stroke-linecap="round"></line></svg>
        <input type="text" placeholder="Buscar item ou setor..." id="vitBusca" data-gc-input="vitFiltrar()">
    </div>
    <select class="filtro-select" id="vitFiltroStatus" data-gc-change="vitFiltrar()">
        <option value="">Todos os status</option>
        <option value="Pendente">Pendente</option>
        <option value="Em separação">Em separação</option>
        <option value="Entregue">Entregue</option>
    </select>
    <button class="btn-primary" data-gc-click="vitToastGenerico()">
        <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></line><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></line></svg>
        Nova requisição
    </button>
</div>

<div class="painel">
    <div class="tabela-scroll">
        <table class="tabela">
            <thead><tr><th>Item</th><th>Qtd.</th><th>Setor</th><th>Urgência</th><th>Data</th><th>Status</th></tr></thead>
            <tbody id="vitTbody"><tr data-gc-click="vitAbrirDetalhe(1)"><td>Copos descartáveis</td><td>20 Pacote</td><td>Bar</td><td><span class="tag-urg tag-urg-baixa">Baixa</span></td><td>19:04 - 11/09/2026</td><td><select class="tag-status tag-pendente" id="vitStatus1" data-gc-click="event.stopPropagation()" data-gc-change="vitMudarStatus(1, this.value)" style="border:none;cursor:pointer;font-family:inherit;"><option value="Pendente" selected>Pendente</option><option value="Em separação">Em separação</option><option value="Entregue">Entregue</option></select></td></tr><tr data-gc-click="vitAbrirDetalhe(2)"><td>Carvão para churrasqueira</td><td>10 Kg</td><td>Cozinha</td><td><span class="tag-urg tag-urg-alta">Alta</span></td><td>19:04 - 11/09/2026</td><td><select class="tag-status tag-pendente" id="vitStatus2" data-gc-click="event.stopPropagation()" data-gc-change="vitMudarStatus(2, this.value)" style="border:none;cursor:pointer;font-family:inherit;"><option value="Pendente" selected>Pendente</option><option value="Em separação">Em separação</option><option value="Entregue">Entregue</option></select></td></tr><tr data-gc-click="vitAbrirDetalhe(3)"><td>Guardanapos</td><td>5 Pacote</td><td>Salão</td><td><span class="tag-urg tag-urg-normal">Normal</span></td><td>18:40 - 12/09/2026</td><td><select class="tag-status tag-separacao" id="vitStatus3" data-gc-click="event.stopPropagation()" data-gc-change="vitMudarStatus(3, this.value)" style="border:none;cursor:pointer;font-family:inherit;"><option value="Pendente">Pendente</option><option value="Em separação" selected>Em separação</option><option value="Entregue">Entregue</option></select></td></tr><tr data-gc-click="vitAbrirDetalhe(4)"><td>Papel higiênico</td><td>12 Pacote</td><td>Salão</td><td><span class="tag-urg tag-urg-normal">Normal</span></td><td>09:15 - 10/09/2026</td><td><select class="tag-status tag-entregue" id="vitStatus4" data-gc-click="event.stopPropagation()" data-gc-change="vitMudarStatus(4, this.value)" style="border:none;cursor:pointer;font-family:inherit;"><option value="Pendente">Pendente</option><option value="Em separação">Em separação</option><option value="Entregue" selected>Entregue</option></select></td></tr><tr data-gc-click="vitAbrirDetalhe(5)"><td>Botijão de gás</td><td>1 Un</td><td>Cozinha</td><td><span class="tag-urg tag-urg-alta">Alta</span></td><td>08:02 - 13/09/2026</td><td><select class="tag-status tag-pendente" id="vitStatus5" data-gc-click="event.stopPropagation()" data-gc-change="vitMudarStatus(5, this.value)" style="border:none;cursor:pointer;font-family:inherit;"><option value="Pendente" selected>Pendente</option><option value="Em separação">Em separação</option><option value="Entregue">Entregue</option></select></td></tr></tbody>
        </table>
    </div>
</div>

<div class="painel-overlay" id="vitPainelOverlay" data-gc-click="if(event.target===this) vitFecharDetalhe()">
    <aside class="painel-avaria">
        <div class="painel-head">
            <h2>Detalhes da requisição</h2>
            <button class="painel-close" data-gc-click="vitFecharDetalhe()">
                <svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="painel-body">
            <div class="painel-secao">
                <p class="painel-secao-titulo">Detalhes</p>
                <div class="painel-grid">
                    <div class="painel-campo"><span class="campo-label">Item</span><span class="campo-valor" id="vd-item">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Quantidade</span><span class="campo-valor" id="vd-qtd">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Setor</span><span class="campo-valor" id="vd-setor">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Urgência</span><span class="campo-valor" id="vd-urgencia">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Status</span><span class="campo-valor" id="vd-status">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Pedido por</span><span class="campo-valor" id="vd-autor">—</span></div>
                    <div class="painel-campo full"><span class="campo-label">Observação</span><span class="campo-valor" id="vd-observacao">—</span></div>
                </div>
            </div>
        </div>
    </aside>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

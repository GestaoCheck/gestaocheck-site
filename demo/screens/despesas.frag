<div class="vitrine-aviso">Demonstração interativa — lance uma despesa nova (botão "+ Nova despesa") ou exclua uma da lista.</div>
<div class="filtros-box">
    <div class="period-tabs">
        <button class="period-tab" data-gc-click="vitSetPeriodo(this)">Hoje</button>
        <button class="period-tab" data-gc-click="vitSetPeriodo(this)">Semana</button>
        <button class="period-tab active" data-gc-click="vitSetPeriodo(this)">Mês</button>
        <button class="period-tab" data-gc-click="vitSetPeriodo(this)">Ano</button>
    </div>
</div>

<div class="desp-resumo">
    <div class="desp-total-card">
        <span class="desp-total-label">TOTAL NO PERÍODO</span>
        <span class="desp-total-valor" id="vitDespTotal">R$ 0,00</span>
        <span class="desp-total-sub" id="vitDespQtd">0 lançamento(s) no período</span>
    </div>
    <div class="desp-categorias-card">
        <h3 class="card-titulo">Por categoria</h3>
        <div id="vitDespCatBars" class="desp-cat-bars"></div>
    </div>
</div>

<div class="tabela-wrap">
    <table class="tabela">
        <thead><tr><th>Data</th><th>Categoria</th><th>Descrição</th><th>Valor</th><th></th></tr></thead>
        <tbody id="vitTbody"><tr id="vitDespRow1"><td>10/09/2026</td><td>Aluguel</td><td>Aluguel do salão</td><td>R$ 6.411,36</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirDespesa(1)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitDespRow2"><td>06/09/2026</td><td>Marketing</td><td>Anúncios redes sociais</td><td>R$ 664,64</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirDespesa(2)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitDespRow3"><td>06/09/2026</td><td>Internet</td><td>Internet + telefonia</td><td>R$ 220,27</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirDespesa(3)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitDespRow4"><td>04/09/2026</td><td>Contador</td><td>Honorários contábeis</td><td>R$ 471,67</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirDespesa(4)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitDespRow5"><td>02/09/2026</td><td>Água</td><td>Conta de água</td><td>R$ 328,69</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirDespesa(5)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitDespRow6"><td>02/09/2026</td><td>Luz</td><td>Conta de energia</td><td>R$ 1.017,68</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirDespesa(6)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr></tbody>
    </table>
</div>

<div class="modal-overlay" id="vitModalOverlay" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-header"><span class="modal-title">Nova despesa</span>
            <button class="modal-close" data-gc-click="vitFecharModal()">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-grid">
                <div class="form-group"><label>Valor (R$) *</label><input type="text" inputmode="numeric" id="vitValor" placeholder="0,00" data-gc-input="vitMascararMoeda(this)"></div>
                <div class="form-group"><label>Data *</label><input type="date" id="vitData"></div>
                <div class="form-group full"><label>Categoria</label><select id="vitCategoria"><option>Aluguel</option><option>Luz</option><option>Água</option><option>Internet</option><option>Marketing</option><option>Contador</option><option>Outra</option></select></div>
                <div class="form-group full"><label>Descrição <span style="font-weight:400;color:var(--texto-muted)">(opcional)</span></label><input type="text" id="vitDescricao" placeholder="Ex: Aluguel de setembro"></div>
            </div>
            <p class="form-erro" id="vitErro"></p>
        </div>
        <div class="modal-footer">
            <button class="btn-outline" data-gc-click="vitFecharModal()">Cancelar</button>
            <button class="btn-salvar" data-gc-click="vitSalvarDespesa()">Salvar despesa</button>
        </div>
    </div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

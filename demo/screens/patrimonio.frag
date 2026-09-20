<div class="vitrine-aviso">Demonstração interativa — cadastre um item novo (botão "+ Novo item") ou exclua um da lista.</div>
<div class="patr-resumo">
    <div class="patr-total-card">
        <span class="patr-total-label">VALOR TOTAL INVESTIDO</span>
        <span class="patr-total-valor" id="vitPatrTotal">R$ 0,00</span>
        <span class="patr-total-sub" id="vitPatrCount">0 item(ns) cadastrado(s)</span>
    </div>
    <div class="patr-categorias-card">
        <h3 class="card-titulo">Por categoria</h3>
        <div id="vitPatrCatBars" class="patr-cat-bars"></div>
    </div>
</div>

<div class="filtros-box">
    <div class="filtro-busca">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke-width="1.8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="1.8" stroke-linecap="round"></line></svg>
        <input type="text" id="vitBusca" placeholder="Buscar por nome ou código..." data-gc-input="vitFiltrar()">
    </div>
    <button class="btn-outline" data-gc-click="vitLimparBusca()">Limpar</button>
    <button class="btn-novo-item" data-gc-click="vitAbrirModal()">
        <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></line><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></line></svg>
        Novo item
    </button>
</div>

<div class="tabela-wrap">
    <table class="tabela">
        <thead><tr><th></th><th>Item</th><th>Categoria</th><th>Código</th><th>Qtd.</th><th>Vlr. unit.</th><th>Vlr. total</th><th>Setor</th><th>Aquisição</th><th></th></tr></thead>
        <tbody id="vitTbody"><tr id="vitPatrRow1"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Sistema de Som Ambiente</td><td>Eletrônico</td><td>-</td><td>1</td><td>R$ 3.600,00</td><td>R$ 3.600,00</td><td>Salão</td><td>02/12/2025</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(1)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitPatrRow2"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Ar Condicionado Split 24000 BTUs (x4)</td><td>Equipamento</td><td>-</td><td>1</td><td>R$ 12.800,00</td><td>R$ 12.800,00</td><td>Salão</td><td>02/12/2025</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(2)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitPatrRow3"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Câmara Fria 4m³</td><td>Equipamento</td><td>-</td><td>1</td><td>R$ 22.000,00</td><td>R$ 22.000,00</td><td>Cozinha</td><td>10/11/2025</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(3)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitPatrRow4"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Forno Industrial Combinado</td><td>Equipamento</td><td>-</td><td>1</td><td>R$ 18.500,00</td><td>R$ 18.500,00</td><td>Cozinha</td><td>10/11/2025</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(4)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitPatrRow5"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Fritadeira Elétrica Industrial</td><td>Equipamento</td><td>-</td><td>1</td><td>R$ 4.200,00</td><td>R$ 4.200,00</td><td>Cozinha</td><td>15/01/2026</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(5)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitPatrRow6"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Geladeira Comercial 4 Portas</td><td>Equipamento</td><td>-</td><td>1</td><td>R$ 9.800,00</td><td>R$ 9.800,00</td><td>Cozinha</td><td>15/01/2026</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(6)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitPatrRow7"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Máquina de Café Profissional</td><td>Equipamento</td><td>-</td><td>1</td><td>R$ 8.900,00</td><td>R$ 8.900,00</td><td>Bar</td><td>05/02/2026</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(7)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr><tr id="vitPatrRow8"><td><div class="patr-foto-mini patr-foto-vazia"></div></td><td>Mobiliário de Salão (mesas e cadeiras)</td><td>Mobília</td><td>-</td><td>1</td><td>R$ 27.500,00</td><td>R$ 27.500,00</td><td>Salão</td><td>20/10/2025</td><td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(8)" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></td></tr></tbody>
    </table>
</div>

<div class="modal-overlay" id="vitModalOverlay" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-header"><span class="modal-title">Novo item de patrimônio</span>
            <button class="modal-close" data-gc-click="vitFecharModal()">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group full"><label>Nome do item *</label><input type="text" id="vitNome" placeholder="Ex: Liquidificador industrial"></div>
            <div class="form-group"><label>Categoria</label>
                <select id="vitCategoria"><option>Equipamento</option><option>Mobília</option><option>Eletrônico</option><option>Utensílio</option><option>Outro</option></select>
            </div>
            <div class="form-group"><label>Setor</label>
                <select id="vitSetor"><option>Cozinha</option><option>Salão</option><option>Bar</option></select>
            </div>
            <div class="form-group"><label>Valor unitário (R$) *</label><input type="text" inputmode="numeric" id="vitValor" placeholder="0,00" data-gc-input="vitMascararMoeda(this)"></div>
            <div class="form-group"><label>Quantidade</label><input type="number" id="vitQtd" min="1" value="1"></div>
        </div>
        <div class="modal-footer">
            <button class="btn-outline" data-gc-click="vitFecharModal()">Cancelar</button>
            <button class="btn-primary" data-gc-click="vitSalvarItem()">Salvar item</button>
        </div>
    </div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

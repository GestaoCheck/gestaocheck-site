<div class="vitrine-aviso">Demonstração interativa — clique numa avaria pra ver o detalhe, marcar como resolvida ou comentar.</div>
<div class="resumo-cards">
    <div class="resumo-card"><div class="resumo-icon orange"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"></circle><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"></line></svg></div><div><span class="resumo-label">Avarias hoje</span><span class="resumo-valor">4</span></div></div>
    <div class="resumo-card"><div class="resumo-icon red"><svg viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></div><div><span class="resumo-label">Valor total perdido</span><span class="resumo-valor" id="vitValorPerdido">R$ 424.00</span></div></div>
    <div class="resumo-card"><div class="resumo-icon yellow"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="14" rx="1" stroke="currentColor" stroke-width="1.8"></rect><rect x="3" y="3" width="18" height="4" rx="1" stroke="currentColor" stroke-width="1.8"></rect></svg></div><div><span class="resumo-label">Setor crítico</span><span class="resumo-valor">Cozinha</span></div></div>
    <div class="resumo-card"><div class="resumo-icon green"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"></circle><polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline></svg></div><div><span class="resumo-label">Última atualização</span><span class="resumo-valor" id="vitUltimaAtt">18:28</span></div></div>
</div>

<div class="filtros-box">
    <div class="filtro-busca">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke-width="1.8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="1.8" stroke-linecap="round"></line></svg>
        <input type="text" id="vitBusca" placeholder="Buscar avaria..." data-gc-input="vitFiltrar()">
    </div>
</div>

<div class="tabela-wrap">
    <table class="tabela-avarias">
        <thead><tr><th>Produto</th><th>Setor</th><th>Qtd.</th><th>Vlr. total</th><th>Motivo</th><th>Responsável</th><th>Data</th><th>Prioridade</th><th>Status</th></tr></thead>
        <tbody id="vitTbody"><tr id="vitAvariaRow1" data-gc-click="vitAbrirDetalheAvaria(1)"><td>Filé Mignon</td><td>Cozinha</td><td>2 Kg</td><td>R$ 136.00</td><td>Produto estragado</td><td>Bruno Carvalho</td><td>18:28 - 11/09/2026</td><td><span class="tag-prioridade tag-media">Média</span></td><td><span class="tag-status tag-resolvida" id="vitAvariaTag1">Resolvida</span></td></tr><tr id="vitAvariaRow2" data-gc-click="vitAbrirDetalheAvaria(2)"><td>Taça de vinho</td><td>Bar</td><td>6 Un</td><td>R$ 108.00</td><td>Quebra de material</td><td>Diego Ferreira</td><td>18:28 - 11/09/2026</td><td><span class="tag-prioridade tag-media">Média</span></td><td><span class="tag-status tag-resolvida" id="vitAvariaTag2">Resolvida</span></td></tr><tr id="vitAvariaRow3" data-gc-click="vitAbrirDetalheAvaria(3)"><td>Camarão congelado</td><td>Cozinha</td><td>3 Kg</td><td>R$ 135.00</td><td>Vencimento</td><td>Bruno Carvalho</td><td>18:28 - 11/09/2026</td><td><span class="tag-prioridade tag-media">Média</span></td><td><span class="tag-status tag-resolvida" id="vitAvariaTag3">Resolvida</span></td></tr><tr id="vitAvariaRow4" data-gc-click="vitAbrirDetalheAvaria(4)"><td>Queijo Mascarpone</td><td>Cozinha</td><td>1 Kg</td><td>R$ 45.00</td><td>Queda de energia no freezer durante a madrugada</td><td>Bruno Carvalho</td><td>09:12 - 13/09/2026</td><td><span class="tag-prioridade tag-alta">Alta</span></td><td><span class="tag-status tag-pendente" id="vitAvariaTag4">Pendente</span></td></tr></tbody>
    </table>
</div>

<div class="painel-overlay" id="vitPainelOverlay" data-gc-click="if(event.target===this) vitFecharDetalhe()">
    <aside class="painel-avaria">
        <div class="painel-head">
            <h2>Detalhes da avaria</h2>
            <button class="painel-close" data-gc-click="vitFecharDetalhe()">
                <svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="painel-body">
            <div class="painel-secao">
                <p class="painel-secao-titulo">Informações</p>
                <div class="painel-grid">
                    <div class="painel-campo"><span class="campo-label">Setor</span><span class="campo-valor" id="vd-setor">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Motivo</span><span class="campo-valor" id="vd-motivo">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Responsável</span><span class="campo-valor" id="vd-responsavel">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Prioridade</span><span class="campo-valor" id="vd-prioridade">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Status</span><span class="campo-valor" id="vd-status">—</span></div>
                    <div class="painel-campo"><span class="campo-label">Valor total</span><span class="campo-valor" id="vd-valor">—</span></div>
                </div>
            </div>
            <div class="painel-secao">
                <p class="painel-secao-titulo">Comentários</p>
                <div class="comentarios-wrap" id="vd-comentarios"></div>
                <div class="comentario-input-row">
                    <input type="text" id="vitNovoComentario" placeholder="Adicionar comentário...">
                    <button data-gc-click="vitEnviarComentario()">Enviar</button>
                </div>
            </div>
            <div class="painel-acoes">
                <button class="btn-acao resolver" id="vitBtnResolver" data-gc-click="vitMarcarResolvida()">
                    <svg viewBox="0 0 24 24" fill="none"><polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline></svg>
                    Marcar resolvida
                </button>
            </div>
        </div>
    </aside>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

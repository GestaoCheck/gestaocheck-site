<div class="vitrine-aviso">Demonstração interativa — adicione um usuário novo (botão "+ Adicionar usuário") ou exclua um da lista.</div>
<div class="usuarios-bloco">
    <div class="usuarios-bloco-header"><h2>Usuários cadastrados</h2><button class="btn-novo-item" data-gc-click="vitAbrirModal()">+ Adicionar usuário</button></div>
    <p class="usuarios-bloco-sub">Todo mundo que já acessa o sistema.</p>
    <p class="usuarios-bloco-sub" id="vitLimiteInfo" style="font-weight:600">4 de 20 usuários usados — Plano Premium</p>
    <div id="vitListaUsuarios" class="usuarios-lista"><div class="usuario-item" id="vitUsuario1"><div class="usuario-avatar">MT</div><div class="usuario-info"><span class="usuario-nome">Marina Torres</span><span class="usuario-sub">contato@saborurbano.app</span><span class="usuario-sub usuario-sub-meta">Todos os setores</span></div><div class="usuario-tags"><span class="papel-badge papel-dono">Dono</span></div></div><div class="usuario-item" id="vitUsuario2"><div class="usuario-avatar">DF</div><div class="usuario-info"><span class="usuario-nome">Diego Ferreira</span><span class="usuario-sub">diego.ferreira@saborurbano.app</span><span class="usuario-sub usuario-sub-meta">Bar</span></div><div class="usuario-tags"><span class="usuario-pendente">Aguardando 1º acesso</span><span class="papel-badge papel-gerente">Gerente</span><button class="btn-editar-usuario btn-excluir-usuario" title="Excluir" data-gc-click="vitExcluirUsuario(2)"><svg viewBox="0 0 24 24" fill="none" width="15" height="15"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></div><div class="usuario-item" id="vitUsuario3"><div class="usuario-avatar">BC</div><div class="usuario-info"><span class="usuario-nome">Bruno Carvalho</span><span class="usuario-sub">bruno.carvalho@saborurbano.app</span><span class="usuario-sub usuario-sub-meta">Cozinha</span></div><div class="usuario-tags"><span class="usuario-pendente">Aguardando 1º acesso</span><span class="papel-badge papel-gerente">Gerente</span><button class="btn-editar-usuario btn-excluir-usuario" title="Excluir" data-gc-click="vitExcluirUsuario(3)"><svg viewBox="0 0 24 24" fill="none" width="15" height="15"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></div><div class="usuario-item" id="vitUsuario4"><div class="usuario-avatar">CS</div><div class="usuario-info"><span class="usuario-nome">Camila Souza</span><span class="usuario-sub">camila.souza@saborurbano.app</span><span class="usuario-sub usuario-sub-meta">Salão</span></div><div class="usuario-tags"><span class="usuario-pendente">Aguardando 1º acesso</span><span class="papel-badge papel-gerente">Gerente</span><button class="btn-editar-usuario btn-excluir-usuario" title="Excluir" data-gc-click="vitExcluirUsuario(4)"><svg viewBox="0 0 24 24" fill="none" width="15" height="15"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button></div></div></div>
</div>

<div class="modal-overlay" id="vitModalOverlay" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-head"><h2>Adicionar usuário</h2>
            <button class="modal-close" data-gc-click="vitFecharModal()">
                <svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group"><label>E-mail *</label><input type="email" id="vitEmail" placeholder="nome@empresa.com"></div>
            <div class="form-group"><label>Nome completo *</label><input type="text" id="vitNome" placeholder="Ex: João Silva"></div>
            <div class="form-group"><label>Função</label>
                <select id="vitPapel"><option value="peao">Peão</option><option value="gerente" selected>Gerente</option><option value="admin_operacional">Admin. Operacional</option></select>
            </div>
            <div class="form-group"><label>Setor *</label>
                <select id="vitSetor"><option>Cozinha</option><option>Bar</option><option>Salão</option><option>Almoxarifado</option></select>
            </div>
            <p class="usuarios-senha-padrao">Uma senha temporária é gerada automaticamente — aparece na tela só desta vez, pra você repassar por fora.</p>
            <p class="msg-erro" id="vitErro"></p>
            <button class="btn-salvar" data-gc-click="vitSalvarUsuario()">Adicionar</button>
        </div>
    </div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

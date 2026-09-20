/* GERADO por tools/build-demo.js a partir de vitrine_config_usuarios.html - não editar à mão. */
GCDemo.define("config_usuarios", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var proximoId = 100;
    var totalUsuarios = 4;
    var papelLabel = {peao: 'Peão', gerente: 'Gerente', admin_operacional: 'Admin. Operacional'};

    function iniciais(nome) {
        var partes = nome.trim().split(/\s+/);
        return ((partes[0] || '')[0] || '').toUpperCase() + ((partes[1] || '')[0] || '').toUpperCase();
    }

    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + tipo;
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3400);
    }

    window.vitAbrirModal = function () {
        document.getElementById('vitEmail').value = '';
        document.getElementById('vitNome').value = '';
        document.getElementById('vitErro').textContent = '';
        document.getElementById('vitModalOverlay').classList.add('show');
    };
    window.vitFecharModal = function () {
        document.getElementById('vitModalOverlay').classList.remove('show');
    };

    window.vitSalvarUsuario = function () {
        var email = document.getElementById('vitEmail').value.trim();
        var nome = document.getElementById('vitNome').value.trim();
        if (!email || !nome) {
            document.getElementById('vitErro').textContent = 'Preencha e-mail e nome completo.';
            return;
        }
        var papel = document.getElementById('vitPapel').value;
        var setor = document.getElementById('vitSetor').value;
        var id = proximoId++;
        var html = '<div class="usuario-item" id="vitUsuario' + id + '">' +
            '<div class="usuario-avatar">' + iniciais(nome) + '</div>' +
            '<div class="usuario-info"><span class="usuario-nome">' + nome + '</span><span class="usuario-sub">' + email + '</span><span class="usuario-sub usuario-sub-meta">' + setor + '</span></div>' +
            '<div class="usuario-tags"><span class="usuario-pendente">Aguardando 1º acesso</span><span class="papel-badge papel-' + papel + '">' + papelLabel[papel] + '</span>' +
            '<button class="btn-editar-usuario btn-excluir-usuario" title="Excluir" data-gc-click="vitExcluirUsuario(' + id + ')"><svg viewBox="0 0 24 24" fill="none" width="15" height="15"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button>' +
            '</div></div>';
        document.getElementById('vitListaUsuarios').insertAdjacentHTML('beforeend', html);
        totalUsuarios++;
        document.getElementById('vitLimiteInfo').textContent = totalUsuarios + ' de 20 usuários usados — Plano Premium';
        vitFecharModal();
        vitToast('Usuário "' + nome + '" adicionado. Senha temporária gerada (só aparece agora).', 'sucesso');
    };

    window.vitExcluirUsuario = function (id) {
        var item = document.getElementById('vitUsuario' + id);
        if (!item) return;
        var nome = item.querySelector('.usuario-nome').textContent;
        item.style.transition = 'opacity .3s';
        item.style.opacity = '0';
        setTimeout(function () { item.remove(); }, 300);
        totalUsuarios--;
        document.getElementById('vitLimiteInfo').textContent = totalUsuarios + ' de 20 usuários usados — Plano Premium';
        vitToast('Usuário "' + nome + '" excluído (só nesta demonstração).', 'aviso');
    };
})();
  }
});

/* GERADO por tools/build-demo.js a partir de vitrine_config_setores.html - não editar à mão. */
GCDemo.define("config_setores", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + tipo;
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
    }

    window.vitRenomear = function (btn) {
        var item = btn.closest('.config-item');
        var span = item.querySelector('.config-item-nome');
        var nomeAntigo = span.textContent;
        var input = document.createElement('input');
        input.type = 'text';
        input.value = nomeAntigo;
        input.className = 'vit-rename-input';
        span.replaceWith(input);
        input.focus();
        input.select();

        var feito = false;
        function confirmar() {
            if (feito) return;
            feito = true;
            var novoNome = input.value.trim() || nomeAntigo;
            var novoSpan = document.createElement('span');
            novoSpan.className = 'config-item-nome';
            novoSpan.textContent = novoNome;
            if (input.parentNode) input.replaceWith(novoSpan);
            if (novoNome !== nomeAntigo) vitToast('"' + nomeAntigo + '" renomeado para "' + novoNome + '".', 'sucesso');
        }
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') confirmar();
            if (e.key === 'Escape') { input.value = nomeAntigo; confirmar(); }
        });
        input.addEventListener('blur', confirmar);
    };

    window.vitExcluirItem = function (btn) {
        var item = btn.closest('.config-item');
        var nome = item.querySelector('.config-item-nome').textContent;
        item.style.transition = 'opacity .25s';
        item.style.opacity = '0';
        setTimeout(function () { item.remove(); }, 250);
        vitToast('"' + nome + '" excluído (só nesta demonstração).', 'aviso');
    };

    window.vitCriarItem = function (listaId, tipo) {
        var nome = tipo === 'setor' ? 'Novo setor' : 'Nova categoria';
        var html = '<div class="config-item"><div style="display:flex;align-items:center;gap:8px;min-width:0"><span class="config-item-nome">' + nome + '</span></div>' +
            '<div class="config-item-acoes">' +
            '<button class="btn-config-acao" title="Renomear" data-gc-click="vitRenomear(this)"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>' +
            '<button class="btn-config-acao excluir" title="Excluir" data-gc-click="vitExcluirItem(this)"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button>' +
            '</div></div>';
        var lista = document.getElementById(listaId);
        lista.insertAdjacentHTML('beforeend', html);
        var novoItem = lista.lastElementChild;
        vitRenomear(novoItem.querySelector('.btn-config-acao'));
    };
})();
  }
});

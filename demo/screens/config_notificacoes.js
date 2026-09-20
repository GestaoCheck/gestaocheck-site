/* GERADO por tools/build-demo.js a partir de vitrine_config_notificacoes.html - não editar à mão. */
GCDemo.define("config_notificacoes", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {

    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + (tipo || 'sucesso');
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3400);
    }
    window.vitAviso = function (msg) { vitToast(msg, 'aviso'); };

    var CHAVES = ["suporte", "ocorrencia", "ruptura", "preco", "manut", "email"];
    var NOMES = {"suporte": "Aviso de chamado respondido", "ocorrencia": "Nova ocorrência aberta", "ruptura": "Ruptura de estoque", "preco": "Preço aguardando aprovação", "manut": "Chamado de manutenção resolvido", "email": "Resumo semanal por e-mail"};
    function resumo() {
        var n = 0;
        CHAVES.forEach(function (k) { if (document.getElementById('vitSw_' + k).checked) n++; });
        document.getElementById('vitResumo').textContent = n + ' de ' + CHAVES.length + ' ativas';
    }
    window.vitToggle = function (k, el) {
        resumo();
        vitToast((el.checked ? 'Ligado: ' : 'Desligado: ') + NOMES[k] + '.', el.checked ? 'sucesso' : 'aviso');
    };
    window.vitTodos = function (ligar) {
        CHAVES.forEach(function (k) { document.getElementById('vitSw_' + k).checked = ligar; });
        resumo();
        vitToast(ligar ? 'Todas as notificações ligadas.' : 'Todas as notificações desligadas.', ligar ? 'sucesso' : 'aviso');
    };
    resumo();
})();
  }
});

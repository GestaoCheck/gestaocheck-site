/* GERADO por tools/build-demo.js a partir de vitrine_manutencao.html - não editar à mão. */
GCDemo.define("manutencao", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var dados = [{"id": 1, "local": "Ar condicionado - Salão", "extra": "", "setor": "Salão", "urg": "normal", "urgLabel": "Normal", "status": "Aberta", "data": "19:04 - 11/09/2026"}, {"id": 2, "local": "Câmara fria - Cozinha", "extra": "🔧 Câmara Fria 4m³ (R$ 22.000,00)", "setor": "Cozinha", "urg": "alta", "urgLabel": "Alta", "status": "Em andamento", "data": "19:04 - 11/09/2026"}, {"id": 3, "local": "Máquina de café - Salão", "extra": "", "setor": "Salão", "urg": "baixa", "urgLabel": "Baixa", "status": "Aberta", "data": "09:20 - 12/09/2026"}, {"id": 4, "local": "Freezer horizontal - Bar", "extra": "", "setor": "Bar", "urg": "urgente", "urgLabel": "Urgente", "status": "Em andamento", "data": "07:55 - 13/09/2026"}];
    var tagStatus = {Aberta: 'tag-aberta', 'Em andamento': 'tag-andamento', Resolvida: 'tag-resolvida'};

    function recalcular() {
        var vivos = dados.filter(function (d) { return !d.excluido; });
        document.getElementById('vManTotal').textContent = vivos.length;
        document.getElementById('vManAbertas').textContent = vivos.filter(function (d) { return d.status === 'Aberta'; }).length;
        document.getElementById('vManAndamento').textContent = vivos.filter(function (d) { return d.status === 'Em andamento'; }).length;
        document.getElementById('vManResolvidas').textContent = vivos.filter(function (d) { return d.status === 'Resolvida'; }).length;
    }

    window.vitMudarStatusManut = function (id, novoStatus, sel) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        if (!item) return;
        item.status = novoStatus;
        sel.className = 'tag-status ' + tagStatus[novoStatus];
        recalcular();
        vitToast('Chamado de "' + item.local + '" marcado como ' + novoStatus + '.', 'sucesso');
    };

    window.vitExcluirManut = function (id) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        var row = document.getElementById('vitManutRow' + id);
        if (!item || !row) return;
        item.excluido = true;
        row.classList.add('vit-saindo');
        setTimeout(function () { row.style.display = 'none'; }, 300);
        recalcular();
        vitToast('Chamado de "' + item.local + '" excluído (só nesta demonstração).', 'aviso');
    };

    window.vitFiltrarManut = function () {
        var termo = document.getElementById('vitBuscaManut').value.trim().toLowerCase();
        document.querySelectorAll('#vitTbodyManut tr').forEach(function (tr, i) {
            var d = dados[i];
            if (d.excluido) return;
            tr.style.display = (!termo || tr.textContent.toLowerCase().indexOf(termo) !== -1) ? '' : 'none';
        });
    };

    window.vitToastGenericoManut = function () {
        vitToast('No sistema completo, isso abre o formulário de nova manutenção.', 'aviso');
    };

    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + tipo;
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3400);
    }
})();
  }
});

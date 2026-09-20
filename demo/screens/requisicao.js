/* GERADO por tools/build-demo.js a partir de vitrine_requisicao.html - não editar à mão. */
GCDemo.define("requisicao", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var dados = [{"id": 1, "item": "Copos descartáveis", "qtd": "20 Pacote", "setor": "Bar", "urg": "baixa", "urgLabel": "Baixa", "status": "Pendente", "data": "19:04 - 11/09/2026", "autor": "Diego Ferreira", "obs": "Para o movimento do fim de semana."}, {"id": 2, "item": "Carvão para churrasqueira", "qtd": "10 Kg", "setor": "Cozinha", "urg": "alta", "urgLabel": "Alta", "status": "Pendente", "data": "19:04 - 11/09/2026", "autor": "Bruno Carvalho", "obs": "Estoque zerou no último final de semana."}, {"id": 3, "item": "Guardanapos", "qtd": "5 Pacote", "setor": "Salão", "urg": "normal", "urgLabel": "Normal", "status": "Em separação", "data": "18:40 - 12/09/2026", "autor": "Camila Souza", "obs": ""}, {"id": 4, "item": "Papel higiênico", "qtd": "12 Pacote", "setor": "Salão", "urg": "normal", "urgLabel": "Normal", "status": "Entregue", "data": "09:15 - 10/09/2026", "autor": "Camila Souza", "obs": "Entregue direto no banheiro dos clientes."}, {"id": 5, "item": "Botijão de gás", "qtd": "1 Un", "setor": "Cozinha", "urg": "alta", "urgLabel": "Alta", "status": "Pendente", "data": "08:02 - 13/09/2026", "autor": "Bruno Carvalho", "obs": "Reserva também baixa, pedir 2 se possível."}];
    var statusTag = {Pendente: 'tag-pendente', 'Em separação': 'tag-separacao', Entregue: 'tag-entregue'};

    function recalcular() {
        var total = dados.length;
        var pend = dados.filter(function (d) { return d.status === 'Pendente'; }).length;
        var sep = dados.filter(function (d) { return d.status === 'Em separação'; }).length;
        var ent = dados.filter(function (d) { return d.status === 'Entregue'; }).length;
        document.getElementById('vReqTotal').textContent = total;
        document.getElementById('vReqPendentes').textContent = pend;
        document.getElementById('vReqSeparacao').textContent = sep;
        document.getElementById('vReqEntregues').textContent = ent;
    }

    window.vitMudarStatus = function (id, novoStatus) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        if (!item) return;
        item.status = novoStatus;
        var sel = document.getElementById('vitStatus' + id);
        sel.className = 'tag-status ' + statusTag[novoStatus];
        recalcular();
        vitToast('Status de "' + item.item + '" alterado para ' + novoStatus + '.', 'sucesso');
    };

    window.vitFiltrar = function () {
        var termo = document.getElementById('vitBusca').value.trim().toLowerCase();
        var statusF = document.getElementById('vitFiltroStatus').value;
        document.querySelectorAll('#vitTbody tr').forEach(function (tr, i) {
            var d = dados[i];
            var passaTermo = !termo || tr.textContent.toLowerCase().indexOf(termo) !== -1;
            var passaStatus = !statusF || d.status === statusF;
            tr.style.display = (passaTermo && passaStatus) ? '' : 'none';
        });
    };

    window.vitAbrirDetalhe = function (id) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        if (!item) return;
        document.getElementById('vd-item').textContent = item.item;
        document.getElementById('vd-qtd').textContent = item.qtd;
        document.getElementById('vd-setor').textContent = item.setor;
        document.getElementById('vd-urgencia').textContent = item.urgLabel;
        document.getElementById('vd-status').textContent = item.status;
        document.getElementById('vd-autor').textContent = item.autor;
        document.getElementById('vd-observacao').textContent = item.obs || 'Sem observação.';
        document.getElementById('vitPainelOverlay').classList.add('show');
    };

    window.vitFecharDetalhe = function () {
        document.getElementById('vitPainelOverlay').classList.remove('show');
    };

    window.vitToastGenerico = function () {
        vitToast('No sistema completo, isso abre o formulário de nova requisição.', 'aviso');
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

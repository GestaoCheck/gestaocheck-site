/* GERADO por tools/build-demo.js a partir de vitrine_ocorrencias.html - não editar à mão. */
GCDemo.define("ocorrencias", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var dados = [{"id": 1, "status": "Aberta", "titulo": "Checklist \"Abertura da Cozinha\": Verificar validade dos insumos — 2 caixas de tomate vencidas encontradas", "sub": "Cozinha • Outro", "data": "19:04 - 11/09/2026", "detalhe": "Encontradas 2 caixas de tomate com validade vencida durante a conferencia de abertura. Produto separado e descartado, fornecedor avisado no mesmo dia."}, {"id": 2, "status": "Em andamento", "titulo": "Reclamacao: Prato voltou frio (mesa 12)", "sub": "Salao • Reclamacao", "data": "20:12 - 12/09/2026", "detalhe": "Cliente da mesa 12 relatou que o prato principal chegou frio. Cozinha refez o prato na hora; gerente de turno acompanhou o atendimento."}, {"id": 3, "status": "Aguardando origem", "titulo": "Avaria registrada: Camarao congelado", "sub": "Cozinha • Avaria de produto", "data": "18:28 - 11/09/2026", "detalhe": "Espelho automatico de uma Avaria ainda em analise. Editar so e possivel pela tela de Avarias, nao por aqui."}, {"id": 4, "status": "Resolvida", "titulo": "Avaria registrada: Filé Mignon", "sub": "Cozinha • Avaria de produto", "data": "18:28 - 11/09/2026", "detalhe": "Avaria de 1,2 Kg de File Mignon por queda de energia no freezer. Resolvida apos ajuste do estoque."}, {"id": 5, "status": "Resolvida", "titulo": "Falta de produto: Taça de vinho", "sub": "Bar • Falta de produto", "data": "18:28 - 11/09/2026", "detalhe": "Taca de vinho quebrada durante o servico. Reposicao feita no mesmo turno."}, {"id": 6, "status": "Aberta", "titulo": "Divergencia na contagem: Farinha de trigo", "sub": "Cozinha • Divergencia na contagem", "data": "09:41 - 13/09/2026", "detalhe": "Contagem do estoque apontou 3 Kg de diferenca a menos do que o esperado no sistema. Aguardando conferencia do gerente."}];
    var filtroAtual = 'todos';

    function aplicarFiltros() {
        var termo = document.getElementById('vitBusca').value.trim().toLowerCase();
        var algumVisivel = false;
        document.querySelectorAll('#vitLista .oc-card').forEach(function (card) {
            var status = card.getAttribute('data-status');
            var texto = card.textContent.toLowerCase();
            var passaFiltro = filtroAtual === 'todos' || status === filtroAtual;
            var passaBusca = !termo || texto.indexOf(termo) !== -1;
            var mostra = passaFiltro && passaBusca;
            card.style.display = mostra ? '' : 'none';
            if (mostra) algumVisivel = true;
        });
        document.getElementById('vitVazio').style.display = algumVisivel ? 'none' : 'block';
    }

    window.vitFiltrar = function (status, btn) {
        filtroAtual = status;
        document.querySelectorAll('.filtros .filtro').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        aplicarFiltros();
    };

    window.vitBuscar = aplicarFiltros;

    window.vitAbrirDetalhe = function (id) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        if (!item) return;
        document.getElementById('vitDetTitulo').textContent = item.titulo;
        document.getElementById('vitDetSub').textContent = item.sub + ' - ' + item.data;
        document.getElementById('vitDetTexto').textContent = item.detalhe;
        var badge = document.getElementById('vitDetBadge');
        badge.textContent = item.status;
        badge.className = 'badge badge-' + ({Aberta: 'red', 'Em andamento': 'yellow', 'Aguardando origem': 'blue', Resolvida: 'green'})[item.status];
        document.getElementById('vitModalOverlay').classList.add('show');
    };

    window.vitFecharDetalhe = function () {
        document.getElementById('vitModalOverlay').classList.remove('show');
    };
})();
  }
});

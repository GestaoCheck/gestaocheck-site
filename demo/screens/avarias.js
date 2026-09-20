/* GERADO por tools/build-demo.js a partir de vitrine_avarias.html - não editar à mão. */
GCDemo.define("avarias", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var dados = [{"id": 1, "produto": "Filé Mignon", "setor": "Cozinha", "qtd": "2 Kg", "valor": 136.0, "motivo": "Produto estragado", "responsavel": "Bruno Carvalho", "data": "18:28 - 11/09/2026", "prioridade": "Média", "status": "Resolvida", "comentarios": [{"autor": "Bruno Carvalho", "texto": "Já fizemos o descarte e ajustamos o estoque."}]}, {"id": 2, "produto": "Taça de vinho", "setor": "Bar", "qtd": "6 Un", "valor": 108.0, "motivo": "Quebra de material", "responsavel": "Diego Ferreira", "data": "18:28 - 11/09/2026", "prioridade": "Média", "status": "Resolvida", "comentarios": []}, {"id": 3, "produto": "Camarão congelado", "setor": "Cozinha", "qtd": "3 Kg", "valor": 135.0, "motivo": "Vencimento", "responsavel": "Bruno Carvalho", "data": "18:28 - 11/09/2026", "prioridade": "Média", "status": "Resolvida", "comentarios": []}, {"id": 4, "produto": "Queijo Mascarpone", "setor": "Cozinha", "qtd": "1 Kg", "valor": 45.0, "motivo": "Queda de energia no freezer durante a madrugada", "responsavel": "Bruno Carvalho", "data": "09:12 - 13/09/2026", "prioridade": "Alta", "status": "Pendente", "comentarios": []}];
    var abertoId = null;
    var tagStatus = {Pendente: 'tag-pendente', 'Em análise': 'tag-analise', Resolvida: 'tag-resolvida'};

    function agora() {
        var d = new Date();
        function p(n) { return String(n).padStart(2, '0'); }
        return p(d.getHours()) + ':' + p(d.getMinutes());
    }

    function renderComentarios(item) {
        var wrap = document.getElementById('vd-comentarios');
        if (!item.comentarios.length) {
            wrap.innerHTML = '<p class="sem-comentarios">Nenhum comentário ainda.</p>';
            return;
        }
        wrap.innerHTML = item.comentarios.map(function (c) {
            return '<div class="comentario-item"><strong>' + c.autor + ':</strong> ' + c.texto + '</div>';
        }).join('');
    }

    window.vitAbrirDetalhe = function () {};

    window.vitAbrirDetalheAvaria = function (id) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        if (!item) return;
        abertoId = id;
        document.getElementById('vd-setor').textContent = item.setor;
        document.getElementById('vd-motivo').textContent = item.motivo;
        document.getElementById('vd-responsavel').textContent = item.responsavel;
        document.getElementById('vd-prioridade').textContent = item.prioridade;
        document.getElementById('vd-status').textContent = item.status;
        document.getElementById('vd-valor').textContent = 'R$ ' + item.valor.toFixed(2);
        renderComentarios(item);
        var btn = document.getElementById('vitBtnResolver');
        btn.style.display = item.status === 'Resolvida' ? 'none' : '';
        document.getElementById('vitPainelOverlay').classList.add('show');
    };

    window.vitFecharDetalhe = function () {
        document.getElementById('vitPainelOverlay').classList.remove('show');
        abertoId = null;
    };

    window.vitMarcarResolvida = function () {
        var item = dados.filter(function (d) { return d.id === abertoId; })[0];
        if (!item) return;
        item.status = 'Resolvida';
        document.getElementById('vd-status').textContent = 'Resolvida';
        document.getElementById('vitBtnResolver').style.display = 'none';
        var tagEl = document.getElementById('vitAvariaTag' + item.id);
        tagEl.textContent = 'Resolvida';
        tagEl.className = 'tag-status tag-resolvida';
        document.getElementById('vitUltimaAtt').textContent = agora();
        vitToast('Avaria de "' + item.produto + '" marcada como resolvida.', 'sucesso');
    };

    window.vitEnviarComentario = function () {
        var input = document.getElementById('vitNovoComentario');
        var texto = input.value.trim();
        if (!texto || abertoId === null) return;
        var item = dados.filter(function (d) { return d.id === abertoId; })[0];
        item.comentarios.push({autor: 'Você', texto: texto});
        renderComentarios(item);
        input.value = '';
        document.getElementById('vitUltimaAtt').textContent = agora();
    };

    window.vitFiltrar = function () {
        var termo = document.getElementById('vitBusca').value.trim().toLowerCase();
        document.querySelectorAll('#vitTbody tr').forEach(function (tr) {
            tr.style.display = (!termo || tr.textContent.toLowerCase().indexOf(termo) !== -1) ? '' : 'none';
        });
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

/* GERADO por tools/build-demo.js a partir de vitrine_cmv_vendas.html - não editar à mão. */
GCDemo.define("cmv_vendas", function (ctx) {
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

    var ITENS = [{"nome": "Filé Mignon ao Molho Madeira", "preco": 89.9, "cmv": 35.6}, {"nome": "Picanha na Brasa (300g)", "preco": 98.0, "cmv": 38.8}, {"nome": "Risoto de Camarão", "preco": 76.5, "cmv": 35.3}, {"nome": "Salmão Grelhado com Legumes", "preco": 82.0, "cmv": 36.0}, {"nome": "Espaguete à Bolonhesa", "preco": 54.9, "cmv": 31.0}, {"nome": "Carpaccio de Filé Mignon", "preco": 45.0, "cmv": 33.3}, {"nome": "Taça de Vinho Tinto", "preco": 38.0, "cmv": 31.6}, {"nome": "Chopp Artesanal (500ml)", "preco": 19.0, "cmv": 34.2}, {"nome": "Petit Gateau com Sorvete", "preco": 32.0, "cmv": 31.3}, {"nome": "Refrigerante Lata", "preco": 9.0, "cmv": 33.3}, {"nome": "Água com Gás", "preco": 8.0, "cmv": 25.0}];
    var VENDAS = [[1, "18/09/2026", 1, 7, "Mesa", "Pix", true], [2, "18/09/2026", 0, 8, "Balcão", "Dinheiro", true], [3, "18/09/2026", 6, 4, "Delivery", "Cartão crédito", true], [4, "18/09/2026", 9, 8, "Balcão", "Cartão crédito", true], [5, "17/09/2026", 2, 6, "Delivery", "Cartão crédito", true], [6, "17/09/2026", 4, 4, "Mesa", "Pix", true], [7, "17/09/2026", 7, 6, "Mesa", "Dinheiro", true], [8, "17/09/2026", 8, 5, "Delivery", "Pix", true], [9, "01/08/2026", 5, 6, "Delivery", "Dinheiro", false], [10, "01/08/2026", 3, 5, "Mesa", "Cartão débito", false]].map(function (v) {
        return {id: v[0], data: v[1], item: v[2], qtd: v[3], tipo: v[4], pag: v[5], aberta: v[6]};
    });
    var proximoId = 100;

    function brl(v) { return 'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }
    function pct(v) { return v.toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1}) + '%'; }
    function cls(c) { return c <= 30 ? 'ok' : (c <= 36 ? 'warn' : 'bad'); }

    function render() {
        var termo = document.getElementById('vitBusca').value.trim().toLowerCase();
        var tipo = document.getElementById('vitTipoF').value;
        var lista = VENDAS.filter(function (v) {
            return (!termo || ITENS[v.item].nome.toLowerCase().indexOf(termo) !== -1) && (!tipo || v.tipo === tipo);
        });
        var fat = 0, custo = 0;
        var linhas = lista.map(function (v) {
            var it = ITENS[v.item];
            var valor = (v.valorUn || it.preco) * v.qtd;
            fat += valor; custo += valor * it.cmv / 100;
            var acao = v.aberta
                ? '<button class="btn btn-outline btn-sm" data-gc-click="vitExcluir(' + v.id + ')">Excluir</button>'
                : '<span class="tag" title="Mês fechado, dia 5 do mês seguinte">Mês fechado</span>';
            return '<tr id="vitV' + v.id + '"><td>' + v.data + '</td><td><strong>' + it.nome + '</strong></td><td>' + v.qtd + '</td><td><span class="tag">' + v.tipo + '</span></td><td>' + brl(valor) + '</td><td>' + v.pag + '</td><td><span class="badge ' + cls(it.cmv) + '">' + pct(it.cmv) + '</span></td><td>' + acao + '</td></tr>';
        });
        document.getElementById('vitTbody').innerHTML = linhas.length ? linhas.join('') : '<tr><td colspan="8" style="text-align:center;color:var(--texto-muted);padding:24px">Nenhuma venda encontrada.</td></tr>';
        document.getElementById('vitHQtd').textContent = lista.length;
        document.getElementById('vitHFat').textContent = brl(fat);
        document.getElementById('vitHCmv').textContent = fat ? pct(custo / fat * 100) : '—';
    }

    window.vitFiltrar = function () { render(); };
    window.vitExportar = function (f) {
        document.getElementById('vitMenuExp').classList.remove('show');
        vitToast('Exportação ' + f + ' gerada (só nesta demonstração).', 'aviso');
    };
    window.vitMascararMoeda = function (input) {
        var d = input.value.replace(/\D/g, '');
        if (!d) { input.value = ''; return; }
        var v = (parseInt(d, 10) / 100).toFixed(2).split('.');
        input.value = v[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + v[1];
    };
    function num(s) { return s ? parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0 : 0; }

    window.vitAbrirModal = function () {
        var sel = document.getElementById('vitItem');
        sel.innerHTML = '<option value="">Selecione</option>' + ITENS.map(function (it, i) { return '<option value="' + i + '">' + it.nome + '</option>'; }).join('');
        document.getElementById('vitQtd').value = '1';
        document.getElementById('vitValor').value = '';
        document.getElementById('vitCmvCalc').value = '';
        document.getElementById('vitErro').textContent = '';
        document.getElementById('vitModalVenda').classList.add('show');
    };
    window.vitFecharModal = function () { document.getElementById('vitModalVenda').classList.remove('show'); };
    window.vitTrocaItem = function () {
        document.getElementById('vitValor').value = '';
        vitCalcVenda();
    };
    window.vitCalcVenda = function () {
        var i = document.getElementById('vitItem').value;
        var out = document.getElementById('vitCmvCalc');
        var campoV = document.getElementById('vitValor');
        if (i === '') { out.value = ''; return; }
        var it = ITENS[parseInt(i, 10)];
        if (!campoV.value) {
            campoV.value = it.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        var qtd = parseInt(document.getElementById('vitQtd').value, 10) || 1;
        var valor = num(campoV.value) * qtd;
        out.value = pct(it.cmv) + '  —  custo estimado ' + brl(valor * it.cmv / 100) + ' sobre ' + brl(valor);
    };
    window.vitSalvar = function () {
        var i = document.getElementById('vitItem').value;
        if (i === '') { document.getElementById('vitErro').textContent = 'Selecione o item de venda.'; return; }
        var qtd = parseInt(document.getElementById('vitQtd').value, 10) || 0;
        if (qtd < 1) { document.getElementById('vitErro').textContent = 'Informe a quantidade.'; return; }
        var d = new Date();
        function p2(n) { return String(n).padStart(2, '0'); }
        var it = ITENS[parseInt(i, 10)];
        VENDAS.unshift({id: proximoId++, data: p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear(), item: parseInt(i, 10), qtd: qtd, tipo: document.getElementById('vitTipo').value, pag: document.getElementById('vitPag').value, aberta: true, valorUn: num(document.getElementById('vitValor').value) || it.preco});
        vitFecharModal();
        render();
        vitToast(qtd + 'x "' + it.nome + '" registrada(s). Estoque descontado pela ficha técnica.', 'sucesso');
    };
    window.vitExcluir = function (id) {
        var linha = document.getElementById('vitV' + id);
        if (linha) { linha.style.transition = 'opacity .25s'; linha.style.opacity = '0'; }
        setTimeout(function () {
            VENDAS = VENDAS.filter(function (v) { return v.id !== id; });
            render();
            vitToast('Venda excluída (só nesta demonstração).', 'aviso');
        }, 250);
    };
    render();
})();
  }
});

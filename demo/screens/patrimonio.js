/* GERADO por tools/build-demo.js a partir de vitrine_patrimonio.html - não editar à mão. */
GCDemo.define("patrimonio", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var dados = [{"id": 1, "nome": "Sistema de Som Ambiente", "categoria": "Eletrônico", "qtd": 1, "valor": 3600.0, "setor": "Salão", "data": "02/12/2025"}, {"id": 2, "nome": "Ar Condicionado Split 24000 BTUs (x4)", "categoria": "Equipamento", "qtd": 1, "valor": 12800.0, "setor": "Salão", "data": "02/12/2025"}, {"id": 3, "nome": "Câmara Fria 4m³", "categoria": "Equipamento", "qtd": 1, "valor": 22000.0, "setor": "Cozinha", "data": "10/11/2025"}, {"id": 4, "nome": "Forno Industrial Combinado", "categoria": "Equipamento", "qtd": 1, "valor": 18500.0, "setor": "Cozinha", "data": "10/11/2025"}, {"id": 5, "nome": "Fritadeira Elétrica Industrial", "categoria": "Equipamento", "qtd": 1, "valor": 4200.0, "setor": "Cozinha", "data": "15/01/2026"}, {"id": 6, "nome": "Geladeira Comercial 4 Portas", "categoria": "Equipamento", "qtd": 1, "valor": 9800.0, "setor": "Cozinha", "data": "15/01/2026"}, {"id": 7, "nome": "Máquina de Café Profissional", "categoria": "Equipamento", "qtd": 1, "valor": 8900.0, "setor": "Bar", "data": "05/02/2026"}, {"id": 8, "nome": "Mobiliário de Salão (mesas e cadeiras)", "categoria": "Mobília", "qtd": 1, "valor": 27500.0, "setor": "Salão", "data": "20/10/2025"}];
    var proximoId = 100;

    function fmt(v) {
        return v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    function recalcular() {
        var vivos = dados.filter(function (d) { return !d.excluido; });
        var total = vivos.reduce(function (s, d) { return s + d.valor * d.qtd; }, 0);
        document.getElementById('vitPatrTotal').textContent = 'R$ ' + fmt(total);
        document.getElementById('vitPatrCount').textContent = vivos.length + ' item(ns) cadastrado(s)';

        var porCategoria = {};
        vivos.forEach(function (d) {
            porCategoria[d.categoria] = (porCategoria[d.categoria] || 0) + d.valor * d.qtd;
        });
        var entradas = Object.keys(porCategoria).map(function (k) { return [k, porCategoria[k]]; });
        entradas.sort(function (a, b) { return b[1] - a[1]; });
        var maior = entradas.length ? entradas[0][1] : 1;
        var bars = document.getElementById('vitPatrCatBars');
        bars.innerHTML = entradas.map(function (e) {
            var pct = Math.max(4, Math.round(e[1] / maior * 100));
            return '<div class="patr-cat-linha"><div class="patr-cat-topo"><span>' + e[0] + '</span><strong>R$ ' + fmt(e[1]) + '</strong></div>' +
                '<div class="patr-cat-track"><div class="patr-cat-fill" style="width:' + pct + '%"></div></div></div>';
        }).join('');
    }

    window.vitMascararMoeda = function (input) {
        var digitos = input.value.replace(/\D/g, '');
        if (!digitos) { input.value = ''; return; }
        var valor = (parseInt(digitos, 10) / 100).toFixed(2);
        var partes = valor.split('.');
        var inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        input.value = inteiro + ',' + partes[1];
    };

    function paraNumero(valorStr) {
        if (!valorStr) return 0;
        return parseFloat(valorStr.replace(/\./g, '').replace(',', '.')) || 0;
    }

    window.vitAbrirModal = function () {
        document.getElementById('vitNome').value = '';
        document.getElementById('vitValor').value = '';
        document.getElementById('vitQtd').value = '1';
        document.getElementById('vitModalOverlay').classList.add('show');
    };
    window.vitFecharModal = function () {
        document.getElementById('vitModalOverlay').classList.remove('show');
    };

    window.vitSalvarItem = function () {
        var nome = document.getElementById('vitNome').value.trim();
        var valor = paraNumero(document.getElementById('vitValor').value);
        if (!nome || !valor) {
            vitToast('Preencha nome e valor do item.', 'aviso');
            return;
        }
        var categoria = document.getElementById('vitCategoria').value;
        var setor = document.getElementById('vitSetor').value;
        var qtd = parseInt(document.getElementById('vitQtd').value, 10) || 1;
        var id = proximoId++;
        var hoje = new Date();
        function p(n) { return String(n).padStart(2, '0'); }
        var dataStr = p(hoje.getDate()) + '/' + p(hoje.getMonth() + 1) + '/' + hoje.getFullYear();
        dados.push({id: id, nome: nome, categoria: categoria, qtd: qtd, valor: valor, setor: setor, data: dataStr});

        var tbody = document.getElementById('vitTbody');
        var tr = document.createElement('tr');
        tr.id = 'vitPatrRow' + id;
        tr.innerHTML =
            '<td><div class="patr-foto-mini patr-foto-vazia"></div></td>' +
            '<td>' + nome + '</td><td>' + categoria + '</td><td>-</td><td>' + qtd + '</td>' +
            '<td>R$ ' + fmt(valor) + '</td><td>R$ ' + fmt(valor * qtd) + '</td><td>' + setor + '</td><td>' + dataStr + '</td>' +
            '<td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirPatrimonio(' + id + ')" title="Excluir">' +
            '<svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>' +
            '</button></div></td>';
        tbody.insertBefore(tr, tbody.firstChild);

        recalcular();
        vitFecharModal();
        vitToast('Item "' + nome + '" cadastrado no patrimônio.', 'sucesso');
    };

    window.vitExcluirPatrimonio = function (id) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        var row = document.getElementById('vitPatrRow' + id);
        if (!item || !row) return;
        item.excluido = true;
        row.style.transition = 'opacity .3s';
        row.style.opacity = '0';
        setTimeout(function () { row.style.display = 'none'; }, 300);
        recalcular();
        vitToast('Item "' + item.nome + '" removido (só nesta demonstração).', 'aviso');
    };

    window.vitLimparBusca = function () {
        document.getElementById('vitBusca').value = '';
        vitFiltrar();
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

    recalcular();
})();
  }
});

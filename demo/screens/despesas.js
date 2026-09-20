/* GERADO por tools/build-demo.js a partir de vitrine_despesas.html - não editar à mão. */
GCDemo.define("despesas", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var dados = [{"id": 1, "data": "10/09/2026", "categoria": "Aluguel", "descricao": "Aluguel do salão", "valor": 6411.36}, {"id": 2, "data": "06/09/2026", "categoria": "Marketing", "descricao": "Anúncios redes sociais", "valor": 664.64}, {"id": 3, "data": "06/09/2026", "categoria": "Internet", "descricao": "Internet + telefonia", "valor": 220.27}, {"id": 4, "data": "04/09/2026", "categoria": "Contador", "descricao": "Honorários contábeis", "valor": 471.67}, {"id": 5, "data": "02/09/2026", "categoria": "Água", "descricao": "Conta de água", "valor": 328.69}, {"id": 6, "data": "02/09/2026", "categoria": "Luz", "descricao": "Conta de energia", "valor": 1017.68}];
    var proximoId = 100;

    function fmt(v) {
        return v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    function recalcular() {
        var vivos = dados.filter(function (d) { return !d.excluido; });
        var total = vivos.reduce(function (s, d) { return s + d.valor; }, 0);
        document.getElementById('vitDespTotal').textContent = 'R$ ' + fmt(total);
        document.getElementById('vitDespQtd').textContent = vivos.length + ' lançamento(s) no período';

        var porCategoria = {};
        vivos.forEach(function (d) { porCategoria[d.categoria] = (porCategoria[d.categoria] || 0) + d.valor; });
        var entradas = Object.keys(porCategoria).map(function (k) { return [k, porCategoria[k]]; });
        entradas.sort(function (a, b) { return b[1] - a[1]; });
        var maior = entradas.length ? entradas[0][1] : 1;
        document.getElementById('vitDespCatBars').innerHTML = entradas.map(function (e) {
            var pct = Math.max(4, Math.round(e[1] / maior * 100));
            return '<div class="desp-cat-linha"><div class="desp-cat-topo"><span>' + e[0] + '</span><strong>R$ ' + fmt(e[1]) + '</strong></div>' +
                '<div class="desp-cat-track"><div class="desp-cat-fill" style="width:' + pct + '%"></div></div></div>';
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

    window.vitSetPeriodo = function (btn) {
        document.querySelectorAll('.period-tabs .period-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
    };

    window.vitAbrirModal = function () {
        document.getElementById('vitValor').value = '';
        document.getElementById('vitData').value = new Date().toISOString().slice(0, 10);
        document.getElementById('vitDescricao').value = '';
        document.getElementById('vitErro').textContent = '';
        document.getElementById('vitModalOverlay').classList.add('show');
    };
    window.vitFecharModal = function () {
        document.getElementById('vitModalOverlay').classList.remove('show');
    };

    window.vitSalvarDespesa = function () {
        var valor = paraNumero(document.getElementById('vitValor').value);
        if (!valor) {
            document.getElementById('vitErro').textContent = 'Informe o valor da despesa.';
            return;
        }
        var categoria = document.getElementById('vitCategoria').value;
        var descricao = document.getElementById('vitDescricao').value.trim() || '-';
        var dataIso = document.getElementById('vitData').value;
        var partesData = dataIso.split('-');
        var dataStr = partesData.length === 3 ? (partesData[2] + '/' + partesData[1] + '/' + partesData[0]) : dataIso;
        var id = proximoId++;
        dados.push({id: id, data: dataStr, categoria: categoria, descricao: descricao, valor: valor});

        var tbody = document.getElementById('vitTbody');
        var tr = document.createElement('tr');
        tr.id = 'vitDespRow' + id;
        tr.innerHTML =
            '<td>' + dataStr + '</td><td>' + categoria + '</td><td>' + descricao + '</td><td>R$ ' + fmt(valor) + '</td>' +
            '<td><div class="check-acoes"><button class="btn-check-acao excluir" data-gc-click="vitExcluirDespesa(' + id + ')" title="Excluir">' +
            '<svg viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>' +
            '</button></div></td>';
        tbody.insertBefore(tr, tbody.firstChild);

        recalcular();
        vitFecharModal();
        vitToast('Despesa de "' + categoria + '" lançada.', 'sucesso');
    };

    window.vitExcluirDespesa = function (id) {
        var item = dados.filter(function (d) { return d.id === id; })[0];
        var row = document.getElementById('vitDespRow' + id);
        if (!item || !row) return;
        item.excluido = true;
        row.style.transition = 'opacity .3s';
        row.style.opacity = '0';
        setTimeout(function () { row.style.display = 'none'; }, 300);
        recalcular();
        vitToast('Lançamento de "' + item.categoria + '" excluído (só nesta demonstração).', 'aviso');
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

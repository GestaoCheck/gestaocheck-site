/* GERADO por tools/build-demo.js a partir de vitrine_cmc.html - não editar à mão. */
GCDemo.define("cmc", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var total = 35579.31;
    var qtd = 22;
    var maiorCompra = 2305.47;
    var fornecedores = ["Distribuidora Bom Preço", "Hortifruti Central", "Bebidas Express", "Frigorífico Sul"];

    function fmt(v) { return v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }

    function recalcular() {
        var ticket = total / qtd;
        document.getElementById('vitHeroValorTotal').textContent = fmt(total);
        document.getElementById('vitHeroCompras').textContent = qtd;
        document.getElementById('vitHeroTicketMedio').textContent = 'R$ ' + fmt(ticket);
        document.getElementById('vitHeroMaiorCompra').textContent = 'R$ ' + fmt(maiorCompra);
        document.getElementById('vitHeroFornec').textContent = fornecedores.length;
        document.getElementById('vitMTotalCMC').textContent = 'R$ ' + fmt(total);
        document.getElementById('vitMQtdCompras').textContent = qtd;
        document.getElementById('vitMFornecedores').textContent = fornecedores.length;
        document.getElementById('vitMTicketMedio').textContent = 'R$ ' + fmt(ticket);
        document.getElementById('vitMMaiorCompra').textContent = 'R$ ' + fmt(maiorCompra);
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
        document.getElementById('vitFornecedor').value = '';
        document.getElementById('vitValor').value = '';
        document.getElementById('vitModalOverlay').classList.add('show');
    };
    window.vitFecharModal = function () {
        document.getElementById('vitModalOverlay').classList.remove('show');
    };

    window.vitSalvarCompra = function () {
        var fornecedor = document.getElementById('vitFornecedor').value.trim();
        var valor = paraNumero(document.getElementById('vitValor').value);
        if (!fornecedor || !valor) {
            vitToast('Preencha o fornecedor e o valor.', 'aviso');
            return;
        }
        var categoria = document.getElementById('vitCategoria').value;
        total += valor;
        qtd += 1;
        if (valor > maiorCompra) maiorCompra = valor;
        if (fornecedores.indexOf(fornecedor) === -1) fornecedores.push(fornecedor);

        var lista = document.getElementById('vitUltimasCompras');
        var div = document.createElement('div');
        div.className = 'cmc-linha-item';
        div.innerHTML = '<div><div class="cmc-linha-nome">' + fornecedor + '</div><div class="cmc-linha-sub">' + categoria + '</div></div><div class="cmc-linha-valor">R$ ' + fmt(valor) + '</div>';
        lista.insertBefore(div, lista.firstChild);
        if (lista.children.length > 6) lista.removeChild(lista.lastChild);

        recalcular();
        vitFecharModal();
        vitToast('Compra de "' + fornecedor + '" (' + categoria + ') registrada.', 'sucesso');
    };

    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + tipo;
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3600);
    }

    recalcular();
})();
  }
});

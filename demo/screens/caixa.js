/* GERADO por tools/build-demo.js a partir de vitrine_caixa.html - não editar à mão. */
GCDemo.define("caixa", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var ESPERADO = 780.0;

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
        document.getElementById('vitContado').value = '';
        document.getElementById('vitRetiradas').value = '';
        document.getElementById('vitErro').textContent = '';
        document.getElementById('vitResultado').style.display = 'none';
        document.getElementById('vitModalOverlay').classList.add('show');
    };

    window.vitFecharModal = function () {
        document.getElementById('vitModalOverlay').classList.remove('show');
    };

    window.vitRegistrarFechamento = function () {
        var contadoStr = document.getElementById('vitContado').value;
        var contado = paraNumero(contadoStr);
        var retiradas = paraNumero(document.getElementById('vitRetiradas').value);
        if (!contadoStr) {
            document.getElementById('vitErro').textContent = 'Informe o valor contado na gaveta.';
            return;
        }
        document.getElementById('vitErro').textContent = '';
        var diferenca = ESPERADO - contado - retiradas;
        var diferencaAbs = Math.abs(diferenca);
        var explicada = diferencaAbs < 0.01;
        var cor = explicada ? 'var(--verde)' : 'var(--vermelho)';
        var resultado = document.getElementById('vitResultado');
        resultado.style.display = 'block';
        resultado.innerHTML =
            'Esperado: R$ ' + ESPERADO.toFixed(2).replace('.', ',') + '<br>' +
            'Contado: R$ ' + contado.toFixed(2).replace('.', ',') + '<br>' +
            'Retiradas: R$ ' + retiradas.toFixed(2).replace('.', ',') + '<br>' +
            '<strong style="color:' + cor + '">Diferença não-explicada: R$ ' + diferencaAbs.toFixed(2).replace('.', ',') + '</strong>';

        var tbody = document.getElementById('vitCaixaBody');
        var hoje = new Date();
        function p(n) { return String(n).padStart(2, '0'); }
        var dataStr = p(hoje.getDate()) + '/' + p(hoje.getMonth() + 1) + '/' + hoje.getFullYear();
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + dataStr + '</td><td>Cozinha</td>' +
            '<td>R$ ' + ESPERADO.toFixed(2).replace('.', ',') + '</td>' +
            '<td>R$ ' + contado.toFixed(2).replace('.', ',') + '</td>' +
            '<td>R$ ' + retiradas.toFixed(2).replace('.', ',') + '</td>' +
            '<td style="color:' + cor + ';font-weight:700">R$ ' + diferencaAbs.toFixed(2).replace('.', ',') + '</td>' +
            '<td>Marina Torres</td>';
        tbody.insertBefore(tr, tbody.firstChild);

        setTimeout(function () {
            vitFecharModal();
            vitToast(explicada ? 'Caixa fechado sem diferença. Tudo certo!' : 'Caixa fechado com diferença não-explicada de R$ ' + diferencaAbs.toFixed(2).replace('.', ',') + '.', explicada ? 'sucesso' : 'aviso');
        }, 900);
    };

    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + tipo;
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3800);
    }
})();
  }
});

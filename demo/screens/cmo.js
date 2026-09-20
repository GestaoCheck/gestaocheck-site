/* GERADO por tools/build-demo.js a partir de vitrine_cmo.html - não editar à mão. */
GCDemo.define("cmo", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var FATURAMENTO = 670778.6;
    var META_PCT = 18.0;
    var totalSalarios = 78538.35;
    var colaboradoresVistos = ["Rodrigo Alves", "Camila Souza", "Bruno Carvalho", "Diego Ferreira", "Larissa Mendes"];

    function fmt(v) { return v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }

    function recalcular() {
        var pct = totalSalarios / FATURAMENTO * 100;
        document.getElementById('vitHeroCMOValor').textContent = fmt(totalSalarios);
        document.getElementById('vitHeroPct').textContent = pct.toFixed(1) + '%';
        document.getElementById('vitHeroPctHero').textContent = pct.toFixed(1) + '%';
        document.getElementById('vitMSalarios').textContent = 'R$ ' + fmt(totalSalarios);
        document.getElementById('vitMPctFat').textContent = pct.toFixed(1) + '%';
        document.getElementById('vitMCustoMedio').textContent = 'R$ ' + fmt(totalSalarios / colaboradoresVistos.length);
        document.getElementById('vitMColabs').textContent = colaboradoresVistos.length;
        document.getElementById('vitHeroColabs').textContent = colaboradoresVistos.length;
        document.getElementById('vitHeroMedio').textContent = 'R$ ' + fmt(totalSalarios / colaboradoresVistos.length);

        var badge = document.getElementById('vitHeroStatus');
        if (pct <= META_PCT) {
            badge.className = 'hero-badge dourado';
            badge.textContent = 'Dentro da meta (' + META_PCT.toFixed(0) + '%)';
        } else {
            badge.className = 'hero-badge perigo';
            badge.textContent = 'Acima da meta (' + META_PCT.toFixed(0) + '%)';
        }
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
        document.getElementById('vitColab').value = '';
        document.getElementById('vitValor').value = '';
        document.getElementById('vitModalOverlay').classList.add('show');
    };
    window.vitFecharModal = function () {
        document.getElementById('vitModalOverlay').classList.remove('show');
    };

    window.vitSalvarLancamento = function () {
        var nome = document.getElementById('vitColab').value.trim();
        var valor = paraNumero(document.getElementById('vitValor').value);
        if (!nome || !valor) {
            vitToast('Preencha o colaborador e o valor.', 'aviso');
            return;
        }
        var tipo = document.getElementById('vitTipo').value;
        totalSalarios += valor;
        if (colaboradoresVistos.indexOf(nome) === -1) colaboradoresVistos.push(nome);

        var lista = document.getElementById('vitUltimosLancamentos');
        var div = document.createElement('div');
        div.className = 'cmo-linha-item';
        div.innerHTML = '<div><div class="cmo-linha-nome">' + nome + '</div><div class="cmo-linha-sub">' + tipo + '</div></div><div class="cmo-linha-valor">R$ ' + fmt(valor) + '</div>';
        lista.insertBefore(div, lista.firstChild);
        if (lista.children.length > 6) lista.removeChild(lista.lastChild);

        recalcular();
        vitFecharModal();
        vitToast('Lançamento de "' + nome + '" (' + tipo + ') registrado.', 'sucesso');
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

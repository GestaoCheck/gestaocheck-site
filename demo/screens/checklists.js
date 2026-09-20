/* GERADO por tools/build-demo.js a partir de vitrine_checklists.html - não editar à mão. */
GCDemo.define("checklists", function (ctx) {
  var window = ctx.window, document = ctx.document,
      setTimeout = ctx.setTimeout, clearTimeout = ctx.clearTimeout,
      setInterval = ctx.setInterval, clearInterval = ctx.clearInterval;
  with (window) {
(function () {
    var tarefas = [
        "Contar o dinheiro da gaveta e guardar no cofre",
        "Desligar as luzes do salao e da area externa",
        "Trancar a porta principal e o deposito",
        "Recolher e higienizar as mesas",
        "Conferir se todas as comandas do turno foram encerradas"
    ];
    var respostas = tarefas.map(function () { return null; });
    var lista = document.getElementById('vitLista');
    var bar = document.getElementById('vitBar');
    var bar2 = document.getElementById('vitBar2');
    var txt = document.getElementById('vitTxt');
    var txt2 = document.getElementById('vitTxt2');
    var pct = document.getElementById('vitPct');
    var btnConcluir = document.getElementById('vitBtnConcluir');
    var jaAvisouConclusao = false;

    function render() {
        lista.innerHTML = tarefas.map(function (t, i) {
            var r = respostas[i];
            var classe = r === 'sim' ? 'sim' : (r === 'nao' ? 'nao' : '');
            var checkClasse = r === 'sim' ? 'ok' : (r === 'nao' ? 'no' : 'pending');
            var checkConteudo = r === 'sim' ? '&check;' : (r === 'nao' ? '&times;' : String(i + 1));
            var acoes = r ? '' :
                '<div class="exec-acoes">' +
                '<button class="btn-sim" data-gc-click="vitResponder(' + i + ',\'sim\')">Sim</button>' +
                '<button class="btn-nao" data-gc-click="vitResponder(' + i + ',\'nao\')">Nao</button>' +
                '</div>';
            return '<div class="exec-tarefa-item ' + classe + '">' +
                '<div class="exec-check ' + checkClasse + '">' + checkConteudo + '</div>' +
                '<div class="exec-tarefa-info"><div class="exec-tarefa-nome">' + t + '</div></div>' +
                acoes + '</div>';
        }).join('');

        var feitas = respostas.filter(function (r) { return r; }).length;
        var p = Math.round(feitas / tarefas.length * 100);
        bar.style.width = p + '%';
        bar2.style.width = p + '%';
        txt.textContent = feitas + ' de ' + tarefas.length + ' tarefas';
        txt2.textContent = feitas + ' / ' + tarefas.length;
        pct.textContent = p + '%';
        btnConcluir.disabled = feitas < tarefas.length;

        if (feitas === tarefas.length && !jaAvisouConclusao) {
            jaAvisouConclusao = true;
            setTimeout(function () {
                vitToast('Checklist concluido! O contador de "Concluidos hoje" acabou de subir.', 'sucesso');
                var elConc = document.getElementById('vConcluidos');
                var elPend = document.getElementById('vPendentes');
                elConc.textContent = String(parseInt(elConc.textContent, 10) + 1);
                elPend.textContent = String(Math.max(0, parseInt(elPend.textContent, 10) - 1));
            }, 200);
        }
    }

    window.vitResponder = function (i, r) {
        respostas[i] = r;
        render();
    };

    window.vitReiniciar = function () {
        respostas = tarefas.map(function () { return null; });
        jaAvisouConclusao = false;
        document.getElementById('vConcluidos').textContent = '1';
        document.getElementById('vPendentes').textContent = '1';
        render();
    };

    btnConcluir.onclick = function () {
        vitToast('Checklist registrado no historico do turno.', 'sucesso');
    };

    function vitToast(msg, tipo) {
        var t = document.getElementById('vitToast');
        document.getElementById('vitToastMsg').textContent = msg;
        t.className = 'toast show ' + tipo;
        clearTimeout(window._vitToastTimer);
        window._vitToastTimer = setTimeout(function () { t.classList.remove('show'); }, 3400);
    }

    render();
})();
  }
});

/* GERADO por tools/build-demo.js a partir de vitrine_config_perfil.html - não editar à mão. */
GCDemo.define("config_perfil", function (ctx) {
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

    var COR = [["Padrão", "var(--avatar)"], ["Azul", "linear-gradient(135deg,#3b82f6,#1d4ed8)"], ["Verde", "linear-gradient(135deg,#22c55e,#15803d)"], ["Laranja", "linear-gradient(135deg,#f59e0b,#c2410c)"], ["Rosa", "linear-gradient(135deg,#ec4899,#9d174d)"], ["Roxo", "linear-gradient(135deg,#a855f7,#6d28d9)"]];
    var corSel = 0, corAplicada = 0, nome = 'Marina Torres';

    function iniciais(n) {
        var p = n.trim().split(/\s+/).filter(Boolean);
        if (!p.length) return '?';
        return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
    }
    function aplicarAvatar() {
        var fundo = COR[corAplicada][1];
        var av = document.getElementById('vitAvatar');
        av.textContent = iniciais(nome); av.style.background = fundo;
        var s = document.querySelector('.sidebar-user-avatar');
        if (s) { s.textContent = iniciais(nome); s.style.background = fundo; }
        var t = document.querySelector('.avatar-btn span');
        if (t) t.textContent = iniciais(nome);
        var sn = document.querySelector('.sidebar-user-info strong');
        if (sn) sn.textContent = nome.trim().split(/\s+/)[0];
    }
    window.vitLimparErro = function () {
        document.getElementById('vitNomeErro').textContent = '';
        document.getElementById('vitCodigoErro').textContent = '';
    };
    window.vitSalvarNome = function () {
        var v = document.getElementById('vitNome').value.trim();
        if (v.length < 3) { document.getElementById('vitNomeErro').textContent = 'Informe seu nome completo.'; return; }
        nome = v; aplicarAvatar();
        vitToast('Nome atualizado.', 'sucesso');
    };
    window.vitCopiar = function () { vitToast('E-mail copiado.', 'sucesso'); };
    window.vitFecharModais = function () {
        ['vitModalFoto', 'vitModal2fa', 'vitModalDesativar'].forEach(function (id) { document.getElementById(id).classList.remove('show'); });
    };

    function pintarSwatches() {
        for (var i = 0; i < COR.length; i++) document.getElementById('vitSw' + i).classList.toggle('sel', i === corSel);
        var pv = document.getElementById('vitPreview');
        pv.textContent = iniciais(nome); pv.style.background = COR[corSel][1];
    }
    window.vitAbrirFoto = function () { corSel = corAplicada; pintarSwatches(); document.getElementById('vitModalFoto').classList.add('show'); };
    window.vitEscolherCor = function (i) { corSel = i; pintarSwatches(); };
    window.vitSalvarFoto = function () { corAplicada = corSel; aplicarAvatar(); vitFecharModais(); vitToast('Foto de perfil atualizada.', 'sucesso'); };

    function desenharQr() {
        var N = 25, seed = 7, cel = 8, partes = [];
        function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
        function finder(x, y) {
            partes.push('<rect x="' + x * cel + '" y="' + y * cel + '" width="' + 7 * cel + '" height="' + 7 * cel + '" fill="#111"/>');
            partes.push('<rect x="' + (x + 1) * cel + '" y="' + (y + 1) * cel + '" width="' + 5 * cel + '" height="' + 5 * cel + '" fill="#fff"/>');
            partes.push('<rect x="' + (x + 2) * cel + '" y="' + (y + 2) * cel + '" width="' + 3 * cel + '" height="' + 3 * cel + '" fill="#111"/>');
        }
        function reservado(x, y) { return (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9); }
        for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
            if (!reservado(x, y) && rnd() > 0.52) partes.push('<rect x="' + x * cel + '" y="' + y * cel + '" width="' + cel + '" height="' + cel + '" fill="#111"/>');
        }
        finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
        document.getElementById('vitQr').innerHTML = '<svg viewBox="0 0 ' + N * cel + ' ' + N * cel + '" shape-rendering="crispEdges">' + partes.join('') + '</svg>';
    }
    window.vitAbrir2fa = function () {
        desenharQr();
        document.getElementById('vitCodigo').value = '';
        document.getElementById('vitCodigoErro').textContent = '';
        document.getElementById('vitPasso1').style.display = '';
        document.getElementById('vitPasso2').style.display = 'none';
        document.getElementById('vitModal2fa').classList.add('show');
    };
    window.vitConfirmar2fa = function () {
        var c = document.getElementById('vitCodigo').value.trim();
        if (!/^\d{6}$/.test(c)) { document.getElementById('vitCodigoErro').textContent = 'Digite os 6 números do app autenticador.'; return; }
        var codigos = ['7K2M-9QXA', 'B4TR-58LW', 'H9ZC-2DVN', 'P6YE-3JUF', 'X1NG-84KS', 'R7AD-6MWQ', 'C3VB-1TPH', 'L8FJ-5ZEY'];
        document.getElementById('vitBackup').innerHTML = codigos.map(function (k) { return '<span>' + k + '</span>'; }).join('');
        document.getElementById('vitPasso1').style.display = 'none';
        document.getElementById('vitPasso2').style.display = '';
        definirStatus(true);
        vitToast('Verificação em 2 etapas ativada.', 'sucesso');
    };
    function definirStatus(ativo) {
        var b = document.getElementById('vitBadge2fa');
        b.textContent = ativo ? 'Ativada' : 'Desativada';
        b.className = 'vit-status-2fa ' + (ativo ? 'on' : 'off');
        document.getElementById('vitStatusTxt').textContent = ativo
            ? 'A verificação em 2 etapas está ativa — ao entrar, o sistema pede também o código do seu app autenticador.'
            : 'A verificação em 2 etapas está desativada. Ative pra pedir também um código do app autenticador ao entrar.';
        document.getElementById('vitBtnAtivar').style.display = ativo ? 'none' : '';
        document.getElementById('vitBtnDesativar').style.display = ativo ? '' : 'none';
    }
    window.vitAbrirDesativar = function () { document.getElementById('vitModalDesativar').classList.add('show'); };
    window.vitDesativar2fa = function () { definirStatus(false); vitFecharModais(); vitToast('Verificação em 2 etapas desativada.', 'aviso'); };
})();
  }
});

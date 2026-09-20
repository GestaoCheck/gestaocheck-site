/* GERADO por tools/build-demo.js a partir de vitrine_beneficiamento.html - não editar à mão. */
GCDemo.define("beneficiamento", function (ctx) {
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

    var REGS = [{"id": 1, "dia": "13/09", "produto": "Caldo de Legumes", "resp": "Bruno Carvalho", "qtd": 6, "perda": 0.4, "motivo": "Sobra de corte", "status": "confirmado", "hora": "10:20"}, {"id": 2, "dia": "14/09", "produto": "Farofa da Casa", "resp": "Larissa Mendes", "qtd": 4, "perda": 0.6, "motivo": "Erro de preparo", "status": "confirmado", "hora": "16:05"}, {"id": 3, "dia": "15/09", "produto": "Molho Branco", "resp": "Bruno Carvalho", "qtd": 5, "perda": 0.3, "motivo": "Aparas do preparo", "status": "confirmado", "hora": "09:40"}, {"id": 4, "dia": "16/09", "produto": "Massa de Pizza Artesanal", "resp": "Larissa Mendes", "qtd": 12, "perda": 0.5, "motivo": "Aparas do preparo", "status": "confirmado", "hora": "19:04"}, {"id": 5, "dia": "17/09", "produto": "Vinagrete", "resp": "Diego Ferreira", "qtd": 3, "perda": 0.7, "motivo": "Validade vencida", "status": "confirmado", "hora": "11:30"}, {"id": 6, "dia": "18/09", "produto": "Molho de Tomate Caseiro", "resp": "Bruno Carvalho", "qtd": 8, "perda": 0.3, "motivo": "Aparas do preparo", "status": "confirmado", "hora": "19:04"}, {"id": 7, "dia": "19/09", "produto": "Creme de Milho", "resp": "Larissa Mendes", "qtd": 7, "perda": 0.5, "motivo": "Sobra de corte", "status": "pendente", "hora": "08:15"}];
    var DIAS = ["13/09", "14/09", "15/09", "16/09", "17/09", "18/09", "19/09"];
    var DIA_LABEL = {"13/09": "sábado, 13 de setembro", "14/09": "domingo, 14 de setembro", "15/09": "segunda-feira, 15 de setembro", "16/09": "terça-feira, 16 de setembro", "17/09": "quarta-feira, 17 de setembro", "18/09": "quinta-feira, 18 de setembro", "19/09": "sexta-feira, 19 de setembro"};
    var CORES = {"Aparas do preparo": "#3FB37E", "Sobra de corte": "#2E8FE3", "Erro de preparo": "#F59E0B", "Validade vencida": "#EF4444"};
    var proximoId = 100;
    var motivoAtivo = '';

    function n1(v) { return v.toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1}); }
    function n2(v) { return v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }

    function metricas() {
        var prod = 0, perda = 0, conf = 0;
        REGS.forEach(function (r) { prod += r.qtd; perda += r.perda; if (r.status === 'confirmado') conf++; });
        var aprov = prod ? (prod - perda) / prod * 100 : 0;
        document.getElementById('vitMProd').textContent = n1(prod) + ' Kg';
        document.getElementById('vitTProd').textContent = REGS.length + ' registros';
        document.getElementById('vitMPerda').textContent = n2(perda) + ' Kg';
        document.getElementById('vitTPerda').textContent = n2(perda) + ' Kg';
        document.getElementById('vitMAprov').textContent = n1(aprov) + '%';
        var t = document.getElementById('vitTAprov');
        t.textContent = aprov >= 92 ? '↑ Bom' : '↓ Atenção';
        t.className = 'bmetric-trend ' + (aprov >= 92 ? 'up' : 'down');
        document.getElementById('vitMConf').textContent = conf + '/' + REGS.length;
        document.getElementById('vitTConf').textContent = conf + ' confirmados';
    }

    function barras() {
        var W = 900, H = 300, padL = 44, padB = 34, padT = 24;
        var maxV = 0;
        DIAS.forEach(function (d) {
            var p = 0;
            REGS.forEach(function (r) { if (r.dia === d) p += r.qtd; });
            if (p > maxV) maxV = p;
        });
        maxV = Math.max(4, Math.ceil(maxV / 4) * 4);
        var plotH = H - padT - padB;
        var gw = (W - padL) / DIAS.length;
        var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="display:block">';
        for (var g = 0; g <= 4; g++) {
            var y = padT + plotH - plotH * g / 4;
            svg += '<line x1="' + padL + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="var(--borda)" stroke-width="1"/>';
            svg += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="var(--texto-muted)">' + Math.round(maxV * g / 4) + '</text>';
        }
        DIAS.forEach(function (d, i) {
            var p = 0, l = 0;
            REGS.forEach(function (r) { if (r.dia === d) { p += r.qtd; l += r.perda; } });
            var cx = padL + gw * i + gw / 2;
            var hp = plotH * p / maxV, hl = plotH * l / maxV;
            var delay = (i * 90) + 'ms';
            if (p > 0) {
                svg += '<rect class="vit-bar" x="' + (cx - 34) + '" y="' + (padT + plotH - hp) + '" width="30" height="' + hp + '" rx="5" fill="var(--verde)" style="animation-delay:' + delay + '"/>';
                svg += '<text class="vit-bval" x="' + (cx - 19) + '" y="' + (padT + plotH - hp - 6) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--texto)" style="animation-delay:' + (i * 90 + 500) + 'ms">' + n1(p) + '</text>';
            }
            if (l > 0) {
                svg += '<rect class="vit-bar" x="' + (cx + 4) + '" y="' + (padT + plotH - hl) + '" width="30" height="' + Math.max(hl, 3) + '" rx="5" fill="var(--vermelho)" style="animation-delay:' + delay + '"/>';
                svg += '<text class="vit-bval" x="' + (cx + 19) + '" y="' + (padT + plotH - Math.max(hl, 3) - 6) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--vermelho)" style="animation-delay:' + (i * 90 + 500) + 'ms">' + n1(l) + '</text>';
            }
            svg += '<text x="' + cx + '" y="' + (H - 10) + '" text-anchor="middle" font-size="12" fill="var(--texto-muted)">' + d + '</text>';
        });
        svg += '</svg>';
        document.getElementById('vitBarras').innerHTML = svg;
    }

    function rosca() {
        var porMotivo = {}, total = 0, comPerda = 0;
        REGS.forEach(function (r) {
            if (r.perda > 0) { porMotivo[r.motivo] = (porMotivo[r.motivo] || 0) + r.perda; total += r.perda; comPerda++; }
        });
        var ent = Object.keys(porMotivo).map(function (k) { return [k, porMotivo[k]]; });
        ent.sort(function (a, b) { return b[1] - a[1]; });
        var R = 70, C = 2 * Math.PI * R, off = 0;
        var svg = '<svg viewBox="0 0 200 200" width="230" height="230" style="display:block"><circle cx="100" cy="100" r="' + R + '" fill="none" stroke="var(--borda)" stroke-width="28"/>';
        ent.forEach(function (e, i) {
            var len = C * e[1] / total;
            var cor = CORES[e[0]] || '#8B9DA6';
            var op = motivoAtivo && motivoAtivo !== e[0] ? 0.25 : 1;
            svg += '<circle class="vit-arc" cx="100" cy="100" r="' + R + '" fill="none" stroke="' + cor + '" stroke-width="28" stroke-dasharray="' + (len - 1.5) + ' ' + C + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 100 100)" opacity="' + op + '" style="animation-delay:' + (i * 140) + 'ms" data-gc-click="vitMotivo(\'' + e[0] + '\')"/>';
            off += len;
        });
        svg += '</svg><div class="rosca-centro"><span class="rosca-valor">' + comPerda + '</span><span class="rosca-label">registros</span></div>';
        document.getElementById('vitRoscaWrap').innerHTML = svg;
        document.getElementById('vitRoscaLeg').innerHTML = ent.map(function (e) {
            var cor = CORES[e[0]] || '#8B9DA6';
            var sel = motivoAtivo === e[0] ? ' vit-sel' : '';
            return '<div class="rosca-leg-item' + sel + '" data-gc-click="vitMotivo(\'' + e[0] + '\')"><div class="rosca-leg-left"><span class="rosca-leg-dot" style="background:' + cor + '"></span><span>' + e[0] + '</span></div><span class="rosca-leg-pct">' + Math.round(e[1] / total * 100) + '% · ' + n1(e[1]) + ' Kg</span></div>';
        }).join('');
    }

    function timeline() {
        var termo = document.getElementById('vitBusca').value.trim().toLowerCase();
        var st = document.getElementById('vitStatus').value;
        var lista = REGS.filter(function (r) {
            return (!termo || r.produto.toLowerCase().indexOf(termo) !== -1) && (!st || r.status === st) && (!motivoAtivo || r.motivo === motivoAtivo);
        });
        var wrap = document.getElementById('vitTimeline');
        if (!lista.length) {
            wrap.innerHTML = '<div class="empty-state"><p>Nenhum registro encontrado</p><span>Ajuste os filtros ou crie um novo registro de beneficiamento</span></div>';
            return;
        }
        var html = '';
        DIAS.slice().reverse().forEach(function (d) {
            var doDia = lista.filter(function (r) { return r.dia === d; });
            if (!doDia.length) return;
            html += '<div class="tl-grupo"><div class="tl-data-label">' + DIA_LABEL[d] + '</div>';
            doDia.slice().reverse().forEach(function (r) {
                var aprov = (r.qtd - r.perda) / r.qtd * 100;
                var pend = r.status === 'pendente';
                html += '<div class="tl-item" id="vitTl' + r.id + '"><div class="tl-linha"><div class="tl-dot ' + r.status + '"></div><div class="tl-traco"></div></div>' +
                    '<div class="tl-body"><div class="tl-titulo">' + r.produto + '</div>' +
                    '<div class="tl-meta"><span class="tl-meta-item">' + r.resp + '</span><span class="tl-meta-item">' + r.qtd + ' Kg</span><span class="tl-meta-item" style="color:var(--vermelho)">Perda: ' + n2(r.perda) + ' Kg</span></div>' +
                    '<div class="tl-badges"><span class="badge ' + (pend ? 'badge-amarelo' : 'badge-verde') + '">' + (pend ? 'Pendente' : '✓ Confirmado') + '</span>' +
                    '<span class="badge badge-verde">' + n1(aprov) + '% aproveitamento</span><span class="badge badge-cinza">' + r.motivo + '</span></div></div>' +
                    '<div class="tl-right"><span class="tl-hora">' + r.hora + '</span><div class="tl-acoes-row">' +
                    (pend ? '<button class="btn-confirmar-mini" data-gc-click="vitConfirmar(' + r.id + ')">✓ Confirmar</button>' : '') +
                    '<button class="btn-lixo" title="Excluir" data-gc-click="vitExcluir(' + r.id + ')"><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg></button>' +
                    '</div></div></div>';
            });
            html += '</div>';
        });
        wrap.innerHTML = html;
    }

    function tudo(replay) {
        metricas();
        if (replay !== false) { barras(); rosca(); }
        timeline();
    }

    window.vitReplay = function () { barras(); rosca(); };
    window.vitFiltrar = function () { timeline(); };
    window.vitMotivo = function (m) {
        motivoAtivo = motivoAtivo === m ? '' : m;
        var chip = document.getElementById('vitChipMotivo');
        chip.style.display = motivoAtivo ? 'inline-flex' : 'none';
        document.getElementById('vitChipTxt').textContent = 'Motivo: ' + motivoAtivo;
        rosca();
        timeline();
    };
    window.vitLimparMotivo = function () { motivoAtivo = ''; document.getElementById('vitChipMotivo').style.display = 'none'; rosca(); timeline(); };
    window.vitExportar = function (fmt) {
        document.getElementById('vitMenuExp').classList.remove('show');
        vitToast('Exportação ' + fmt + ' gerada (só nesta demonstração).', 'aviso');
    };

    window.vitAbrirModal = function () {
        document.getElementById('vitFProduto').value = '';
        document.getElementById('vitFResp').value = '';
        document.getElementById('vitFQtd').value = '';
        document.getElementById('vitFPerda').value = '';
        document.getElementById('vitErro').textContent = '';
        document.getElementById('vitAprovPrev').textContent = '—';
        document.getElementById('vitModalNovo').classList.add('show');
    };
    window.vitFecharModal = function () { document.getElementById('vitModalNovo').classList.remove('show'); };
    window.vitCalc = function () {
        var q = parseFloat(document.getElementById('vitFQtd').value) || 0;
        var p = parseFloat(document.getElementById('vitFPerda').value) || 0;
        document.getElementById('vitAprovPrev').textContent = q > 0 ? n1(Math.max(0, (q - p) / q * 100)) + '%' : '—';
    };
    window.vitSalvar = function () {
        var produto = document.getElementById('vitFProduto').value.trim();
        var resp = document.getElementById('vitFResp').value.trim();
        var qtd = parseFloat(document.getElementById('vitFQtd').value) || 0;
        var perda = parseFloat(document.getElementById('vitFPerda').value) || 0;
        if (!produto || !resp || qtd <= 0) { document.getElementById('vitErro').textContent = 'Preencha produto, responsável e quantidade produzida.'; return; }
        if (perda > qtd) { document.getElementById('vitErro').textContent = 'A perda não pode ser maior que a quantidade produzida.'; return; }
        var agora = new Date();
        function p2(n) { return String(n).padStart(2, '0'); }
        REGS.push({id: proximoId++, dia: '19/09', produto: produto, resp: resp, qtd: qtd, perda: perda, motivo: document.getElementById('vitFMotivo').value, status: 'pendente', hora: p2(agora.getHours()) + ':' + p2(agora.getMinutes())});
        vitFecharModal();
        tudo(true);
        vitToast('Registro de "' + produto + '" criado. Confirme a produção pra lançar no estoque.', 'sucesso');
    };
    window.vitConfirmar = function (id) {
        REGS.forEach(function (r) { if (r.id === id) r.status = 'confirmado'; });
        tudo(false);
        vitToast('Produção confirmada — o produto entra no estoque.', 'sucesso');
    };
    window.vitExcluir = function (id) {
        var el = document.getElementById('vitTl' + id);
        if (el) { el.style.transition = 'opacity .25s'; el.style.opacity = '0'; }
        setTimeout(function () {
            REGS = REGS.filter(function (r) { return r.id !== id; });
            tudo(true);
            vitToast('Registro excluído (só nesta demonstração).', 'aviso');
        }, 250);
    };

    setTimeout(function () { tudo(true); }, 250);
    tudo(false);
})();
  }
});

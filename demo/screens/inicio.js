/* GERADO por tools/build-demo.js a partir de vitrine_inicio.html - não editar à mão. */
GCDemo.define("inicio", function (ctx) {
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

    var DET = {
        contagens: {t: '20 contagens realizadas hoje', linhas: [['Cozinha', 9], ['Bar', 6], ['Salão', 3], ['Almoxarifado', 2]], max: 9, un: ''},
        ocorrencias: {t: '1 ocorrência aberta', texto: 'Checklist "Abertura da Cozinha": tomates vencidos encontrados (2 caixas). Setor Cozinha, aberta às 19:04. Aguardando ação do gerente.'},
        avarias: {t: 'Nenhum item com avaria hoje', texto: 'Sem prejuízo pendente. Quando uma avaria é registrada, o valor perdido aparece aqui na hora.'},
        estoque: {t: 'R$ 7.694,00 em estoque', linhas: [['Carnes', 1700], ['Peixes', 660], ['Bebidas', 1180], ['Mercearia', 443]], max: 1700, un: 'R$ '},
        reclamacoes: {t: 'Nenhuma reclamação aberta', texto: 'Reclamações de clientes registradas como ocorrência aparecem aqui até serem resolvidas.'},
        retornos: {t: 'Nenhum retorno de prato aberto', texto: 'Quando um prato volta pra cozinha, o registro fica aqui com a mesa e o motivo.'}
    };
    var ativo = null;

    window.vitMetrica = function (chave) {
        var painel = document.getElementById('vitDetalhe');
        document.querySelectorAll('.metric-card').forEach(function (c) { c.classList.remove('vit-ativo'); });
        if (ativo === chave) { painel.style.display = 'none'; ativo = null; return; }
        ativo = chave;
        document.getElementById('vitM_' + chave).classList.add('vit-ativo');
        var d = DET[chave];
        document.getElementById('vitDetTitulo').textContent = d.t;
        var corpo = document.getElementById('vitDetCorpo');
        if (d.linhas) {
            corpo.innerHTML = d.linhas.map(function (l) {
                var pct = Math.round(l[1] / d.max * 100);
                return '<div class="vit-linha"><span class="vit-l-nome">' + l[0] + '</span><span class="vit-l-bar"><i style="width:' + pct + '%"></i></span><span class="vit-l-val">' + d.un + l[1].toLocaleString('pt-BR') + '</span></div>';
            }).join('');
        } else {
            corpo.innerHTML = '<p style="font-size:13px;color:var(--texto-muted);margin:0;line-height:1.6">' + d.texto + '</p>';
        }
        painel.style.display = 'block';
    };
    window.vitFecharDetalhe = function () {
        document.getElementById('vitDetalhe').style.display = 'none';
        document.querySelectorAll('.metric-card').forEach(function (c) { c.classList.remove('vit-ativo'); });
        ativo = null;
    };

    var ATALHOS = {
        cmv: ['CMV do mês', [['Faturamento', 'R$ 120.176,59'], ['CMV atual', '34,9%'], ['Meta', '30%']]],
        contagem: ['Contagem de itens', [['Itens contados hoje', '20'], ['Divergências', '2'], ['Última contagem', '19:04']]],
        cmo: ['Custo de Mão de Obra', [['CMO do período', 'R$ 78.538,35'], ['% do faturamento', '11,7%'], ['Colaboradores', '5']]],
        caixa: ['Fechamento de caixa', [['Esperado hoje', 'R$ 780,00'], ['Último fechamento', 'R$ 15,50 de diferença'], ['Setores fechados', '1 de 3']]],
        avarias: ['Avarias', [['Registradas no período', '4'], ['Valor perdido', 'R$ 424,00'], ['Pendentes', '0']]],
        cmc: ['Custo Médio de Compra', [['Total de compras', 'R$ 35.579,31'], ['Fornecedores', '4'], ['Ticket médio', 'R$ 1.617,24']]],
        relatorios: ['Relatórios', [['Prime Cost', '46,6%'], ['Resultado operacional', '39,7%'], ['Insights novos', '5']]]
    };
    window.vitAtalho = function (k) {
        var a = ATALHOS[k];
        document.getElementById('vitAtTitulo').textContent = a[0];
        document.getElementById('vitAtCorpo').innerHTML = a[1].map(function (s) {
            return '<div class="vit-stat"><span>' + s[0] + '</span><strong>' + s[1] + '</strong></div>';
        }).join('');
        document.getElementById('vitModalAtalho').classList.add('show');
    };
    window.vitAbrirMov = function () { document.getElementById('vitModalMov').classList.add('show'); };
    window.vitNotif = function () { document.getElementById('vitModalNotif').classList.add('show'); };
    window.vitFecharModal = function () {
        document.querySelectorAll('.modal-overlay').forEach(function (m) { m.classList.remove('show'); });
    };
    window.vitLimparNotif = function () {
        document.getElementById('vitNotifCorpo').innerHTML = '<p style="font-size:13px;color:var(--texto-muted);padding:10px 0">Nenhuma notificação.</p>';
        var dot = document.querySelector('.notif-dot');
        if (dot) dot.classList.remove('show');
    };

    var CATS = [["Bebidas", 2], ["Carnes", 1], ["Descartáveis", 2], ["Frutos do Mar", 1], ["Grãos", 2], ["Outros", 12]];
    var catAtiva = null;
    window.vitCategoria = function (i) {
        document.querySelectorAll('.donut-svg .seg').forEach(function (s) { s.classList.remove('vit-sel'); });
        var total = document.getElementById('vitDonutTotal');
        var lab = document.getElementById('vitDonutLabel');
        if (catAtiva === i) {
            catAtiva = null; total.textContent = '20'; lab.textContent = 'itens'; return;
        }
        catAtiva = i;
        document.getElementById('vitSeg' + i).classList.add('vit-sel');
        total.textContent = CATS[i][1];
        lab.textContent = CATS[i][0];
    };

    var slideAtual = 0;
    window.vitSlide = function (n) {
        slideAtual = n;
        document.getElementById('vitSlide0').classList.toggle('show', n === 0);
        document.getElementById('vitSlide1').classList.toggle('show', n === 1);
        document.getElementById('vitDot0').classList.toggle('active', n === 0);
        document.getElementById('vitDot1').classList.toggle('active', n === 1);
    };
    var CLIMAS = [['🌤️', '24°C', 'Parcialmente nublado — dia bom pra movimento no salão.'], ['☀️', '29°C', 'Ensolarado — a área externa deve encher no almoço.'], ['🌧️', '19°C', 'Chuva a caminho — bom momento pra reforçar o delivery.']];
    var climaIdx = 0;
    window.vitClimaRefresh = function () {
        climaIdx = (climaIdx + 1) % CLIMAS.length;
        document.getElementById('vitClimaIcone').textContent = CLIMAS[climaIdx][0];
        document.getElementById('vitClimaTemp').textContent = CLIMAS[climaIdx][1];
        document.getElementById('vitClimaDesc').textContent = CLIMAS[climaIdx][2];
    };
    // limpo pelo site ao sair da tela
    setInterval(function () { vitSlide(slideAtual === 0 ? 1 : 0); }, 7000);
})();
  }
});

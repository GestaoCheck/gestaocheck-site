<div class="vitrine-aviso">Demonstração interativa — lance um pagamento novo (botão "+ Novo Lançamento") e veja o CMO do período recalcular.</div>

<div class="hero-cmo">
    <div class="hero-main">
        <span class="hero-label">CMO do período</span>
        <span class="hero-valor">R$ <span id="vitHeroCMOValor">78.538,35</span></span>
        <span class="hero-meta">Faturamento: <strong>R$ 670.778,60</strong> | CMO/Fat.: <strong id="vitHeroPct">11.7%</strong></span>
        <span class="hero-badge dourado" id="vitHeroStatus">Dentro da meta (18%)</span>
    </div>
    <div class="hero-divider"></div>
    <div class="hero-stat"><span class="hero-stat-val" id="vitHeroColabs">5</span><span class="hero-stat-lbl">Colaboradores</span></div>
    <div class="hero-divider"></div>
    <div class="hero-stat"><span class="hero-stat-val" id="vitHeroMedio">R$ 15.707,67</span><span class="hero-stat-lbl">Custo médio / pessoa</span></div>
    <div class="hero-divider"></div>
    <div class="hero-stat"><span class="hero-stat-val" id="vitHeroPctHero">11.7%</span><span class="hero-stat-lbl">% sobre faturamento</span></div>
</div>

<div class="kgrid">
    <div class="kcard"><div class="kcard-icon kcard-green"><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" stroke-width="1.8" stroke-linecap="round"></line><path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke-width="1.8" stroke-linecap="round"></path></svg></div><span class="kcard-val" id="vitMSalarios">R$ 78.538,35</span><span class="kcard-lbl">Salários brutos</span></div>
    <div class="kcard"><div class="kcard-icon kcard-purple"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="1.8" stroke-linecap="round"></path><circle cx="9" cy="7" r="4" stroke-width="1.8"></circle></svg></div><span class="kcard-val" id="vitMColabs">5</span><span class="kcard-lbl">Colaboradores</span></div>
    <div class="kcard"><div class="kcard-icon kcard-teal"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="1.8"></circle><polyline points="12,6 12,12 16,14" stroke-width="1.8" stroke-linecap="round"></polyline></svg></div><span class="kcard-val" id="vitMCustoMedio">R$ 15.707,67</span><span class="kcard-lbl">Custo médio / pessoa</span></div>
    <div class="kcard"><div class="kcard-icon kcard-red"><svg viewBox="0 0 24 24"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline><polyline points="16,7 22,7 22,13" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline></svg></div><span class="kcard-val" id="vitMPctFat">11.7%</span><span class="kcard-lbl">% sobre faturamento</span></div>
</div>

<div class="painel" style="margin-top:14px">
    <div class="painel-titulo">Últimos lançamentos</div>
    <div id="vitUltimosLancamentos"><div class="cmo-linha-item"><div><div class="cmo-linha-nome">Rodrigo Alves</div><div class="cmo-linha-sub">Salário</div></div><div class="cmo-linha-valor">R$ 2.452,17</div></div><div class="cmo-linha-item"><div><div class="cmo-linha-nome">Camila Souza</div><div class="cmo-linha-sub">Salário</div></div><div class="cmo-linha-valor">R$ 2.699,27</div></div><div class="cmo-linha-item"><div><div class="cmo-linha-nome">Bruno Carvalho</div><div class="cmo-linha-sub">Salário</div></div><div class="cmo-linha-valor">R$ 2.535,97</div></div><div class="cmo-linha-item"><div><div class="cmo-linha-nome">Diego Ferreira</div><div class="cmo-linha-sub">Salário</div></div><div class="cmo-linha-valor">R$ 1.975,46</div></div><div class="cmo-linha-item"><div><div class="cmo-linha-nome">Larissa Mendes</div><div class="cmo-linha-sub">Salário</div></div><div class="cmo-linha-valor">R$ 2.952,68</div></div></div>
</div>

<div class="modal-overlay" id="vitModalOverlay" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-header"><span class="modal-title">Novo Lançamento</span>
            <button class="modal-close" data-gc-click="vitFecharModal()">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group full"><label>Colaborador *</label><input type="text" id="vitColab" list="vitListaColab" placeholder="Ex: João Silva">
                <datalist id="vitListaColab"><option>Rodrigo Alves</option><option>Camila Souza</option><option>Bruno Carvalho</option><option>Diego Ferreira</option><option>Larissa Mendes</option></datalist>
            </div>
            <div class="form-group full"><label>Tipo</label><select id="vitTipo"><option>Salário</option><option>Vale</option><option>Bônus</option><option>Hora extra</option></select></div>
            <div class="form-group full"><label>Valor (R$) *</label><input type="text" inputmode="numeric" id="vitValor" placeholder="0,00" data-gc-input="vitMascararMoeda(this)"></div>
        </div>
        <div class="modal-footer">
            <button class="btn-outline" data-gc-click="vitFecharModal()">Cancelar</button>
            <button class="btn btn-primary" data-gc-click="vitSalvarLancamento()">Salvar</button>
        </div>
    </div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

<div class="vitrine-aviso">Demonstração interativa — digite o valor contado na gaveta e registre o fechamento; a diferença é calculada de verdade.</div>
<div class="painel">
    <p class="painel-nota">Registre aqui direto, ou pelo turno de Fechamento de um checklist. "Diferença não-explicada" diferente de R$ 0,00 merece uma conversa com quem fechou.</p>
    <div class="painel-filtros">
        <select class="select-filtro"><option>Todos os setores</option></select>
        <button class="btn-primary" data-gc-click="vitAbrirModal()">+ Novo fechamento</button>
    </div>
    <div class="tabela-scroll">
        <table class="tabela">
            <thead><tr><th>Data</th><th>Setor</th><th>Esperado</th><th>Contado</th><th>Retiradas</th><th>Diferença não-explicada</th><th>Quem fechou</th></tr></thead>
            <tbody id="vitCaixaBody"><tr><td>11/09/2026</td><td>Cozinha</td><td>R$ 917,50</td><td>R$ 842,00</td><td>R$ 60,00</td><td style="color:var(--vermelho);font-weight:700">R$ 15,50</td><td>Marina Torres</td></tr></tbody>
        </table>
    </div>
</div>

<div class="modal-overlay" id="vitModalOverlay" data-gc-click="if(event.target===this) vitFecharModal()">
    <div class="modal">
        <div class="modal-header"><span class="modal-title">Fechar caixa — Cozinha</span>
            <button class="modal-close" data-gc-click="vitFecharModal()">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
            </button>
        </div>
        <div class="vit-caixa-esperado"><span>Valor esperado na gaveta (vendas em dinheiro hoje)</span><strong id="vitEsperadoTxt">R$ 780.00</strong></div>
        <div class="form-group full" style="margin-bottom:12px">
            <label>Valor contado na gaveta *</label>
            <input type="text" inputmode="numeric" id="vitContado" placeholder="0,00" data-gc-input="vitMascararMoeda(this)">
        </div>
        <div class="form-group full" style="margin-bottom:12px">
            <label>Retiradas (opcional)</label>
            <input type="text" inputmode="numeric" id="vitRetiradas" placeholder="0,00" data-gc-input="vitMascararMoeda(this)">
        </div>
        <p class="form-erro" id="vitErro"></p>
        <div id="vitResultado" style="display:none;margin-top:8px;padding:12px;border-radius:8px;background:var(--page-bg);font-size:13px;line-height:1.6"></div>
        <div class="modal-footer">
            <button class="btn-outline" data-gc-click="vitFecharModal()">Cancelar</button>
            <button class="btn-primary" data-gc-click="vitRegistrarFechamento()">Registrar fechamento</button>
        </div>
    </div>
</div>

<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

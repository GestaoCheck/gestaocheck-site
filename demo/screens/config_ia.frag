<div class="vitrine-aviso">Demonstração interativa — clique em "Gerar insights" e veja a análise real acontecer.</div>
<div class="config-secoes">
    <div class="config-bloco">
        <div class="config-bloco-header"><h2>Autorização de uso</h2></div>
        <p class="config-bloco-sub">O Dono desta instalação já autorizou — vale pra todo mundo que usa o sistema (gerente e acima).</p>
        <p style="font-size:13px;margin:10px 0;color:var(--verde)">Autorizado por contato@saborurbano.app em 11/09/2026.</p>
    </div>

    <div class="config-bloco">
        <div class="config-bloco-header"><h2>Inteligência Artificial</h2></div>
        <p class="config-bloco-sub">Gera insights automáticos a partir dos dados do seu negócio (faturamento, ocorrências, avarias, estoque...) — o sistema tenta os provedores abaixo, na ordem, até um responder. Recurso do plano Premium.</p>
        <div class="config-lista" style="margin-top:10px">
            <div class="config-item" style="align-items:flex-start;flex-direction:column;gap:6px;padding:14px 16px">
                <div style="display:flex;align-items:center;gap:10px;width:100%"><span class="config-item-nome">Groq</span><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:var(--radius-pill);color:var(--verde);background:color-mix(in srgb, var(--verde) 16%, transparent)">Disponível agora</span></div>
                <p style="font-size:12.5px;color:var(--verde);margin:0">✓ Rápida</p>
                <p style="font-size:12.5px;color:var(--verde);margin:0">✓ Nunca usa os dados da empresa para treinar nada, em nenhum plano</p>
            </div>
            <div class="config-item" style="align-items:flex-start;flex-direction:column;gap:6px;padding:14px 16px">
                <div style="display:flex;align-items:center;gap:10px;width:100%"><span class="config-item-nome">Cloudflare</span><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:var(--radius-pill);color:var(--verde);background:color-mix(in srgb, var(--verde) 16%, transparent)">Disponível agora</span></div>
                <p style="font-size:12.5px;color:var(--verde);margin:0">✓ Rápida</p>
                <p style="font-size:12.5px;color:var(--verde);margin:0">✓ Não guarda a requisição por padrão</p>
            </div>
            <div class="config-item" style="align-items:flex-start;flex-direction:column;gap:6px;padding:14px 16px">
                <div style="display:flex;align-items:center;gap:10px;width:100%"><span class="config-item-nome">Gemini</span><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:var(--radius-pill);color:var(--verde);background:color-mix(in srgb, var(--verde) 16%, transparent)">Disponível agora</span></div>
                <p style="font-size:12.5px;color:var(--verde);margin:0">✓ Do Google — pode trazer respostas um pouco diferentes</p>
                <p style="font-size:12.5px;color:var(--laranja);margin:0">⚠ No plano gratuito que usamos, o Google pode usar o conteúdo enviado para melhorar os produtos dele</p>
            </div>
        </div>
    </div>

    <div class="config-bloco">
        <div class="config-bloco-header"><h2>Insights automáticos</h2></div>
        <p class="config-bloco-sub" id="vitInsightsStatus">Gera um resumo em texto do período — o que está indo bem, o que merece atenção.</p>
        <div style="display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap">
            <div class="period-tabs">
                <button class="period-tab active" data-gc-click="vitSetPeriodo(this)">Mês</button>
                <button class="period-tab" data-gc-click="vitSetPeriodo(this)">Ano</button>
            </div>
            <button class="btn-novo-item" id="vitBtnGerar" data-gc-click="vitGerarInsights()">Gerar insights</button>
        </div>
        <p id="vitGeradoEm" style="font-size:11px;color:var(--texto-muted);margin-top:8px"></p>
        <div id="vitInsightsLista" style="margin-top:14px"></div>
    </div>
</div>

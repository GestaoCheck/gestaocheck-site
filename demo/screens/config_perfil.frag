<div class="vitrine-aviso">Demonstração interativa — troque a foto, edite o nome e ative a verificação em 2 etapas (dados fictícios, nada é salvo).</div>

<section class="cfg-painel active" id="cfg-perfil">
    <div class="config-bloco">
        <div class="config-bloco-header"><h2>Perfil</h2></div>
        <div class="cfg-perfil-foto-linha">
            <div class="cfg-perfil-avatar-wrap">
                <div class="cfg-perfil-avatar" id="vitAvatar">MT</div>
                <button class="cfg-perfil-lapis" title="Trocar foto" data-gc-click="vitAbrirFoto()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
            </div>
            <p class="config-bloco-sub" style="margin:0">Sua foto aparece pro seu gerente e pra quem você gerencia.</p>
        </div>
        <div class="form-group">
            <label>Nome completo</label>
            <input type="text" id="vitNome" value="Marina Torres" placeholder="Seu nome completo" data-gc-input="vitLimparErro()">
        </div>
        <p class="msg-erro" id="vitNomeErro"></p>
        <button class="btn-salvar" style="width:auto;padding:0 20px" data-gc-click="vitSalvarNome()">Salvar nome</button>

        <div class="form-group" style="margin-top:18px">
            <label>E-mail</label>
            <div class="cfg-perfil-email-linha">
                <span>contato@saborurbano.app</span>
                <button class="btn-config-acao" title="Copiar e-mail" data-gc-click="vitCopiar()">
                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8"/></svg>
                </button>
            </div>
            <p class="config-bloco-sub" style="margin:4px 0 0">Cadastrado no sistema, não pode ser alterado por aqui.</p>
        </div>
    </div>

    <div class="config-bloco">
        <div class="config-bloco-header"><h2>Segurança</h2><span class="vit-status-2fa off" id="vitBadge2fa">Desativada</span></div>
        <p class="config-bloco-sub" id="vitStatusTxt">A verificação em 2 etapas está desativada. Ative pra pedir também um código do app autenticador ao entrar.</p>
        <button type="button" class="sup-btn-acao" id="vitBtnAtivar" data-gc-click="vitAbrir2fa()">Ativar verificação em 2 etapas</button>
        <button type="button" class="sup-btn-acao perigo" id="vitBtnDesativar" style="display:none" data-gc-click="vitAbrirDesativar()">Desativar 2FA</button>
    </div>
</section>

<div class="modal-overlay" id="vitModalFoto" data-gc-click="if(event.target===this) vitFecharModais()">
    <div class="modal">
        <div class="modal-head"><h2>Foto de perfil</h2>
            <button class="modal-close" data-gc-click="vitFecharModais()"><svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg></button></div>
        <div class="modal-body">
            <p>Escolha uma cor pro seu avatar (na versão real você envia uma foto do seu aparelho).</p>
            <div class="vit-preview-wrap"><div class="cfg-perfil-avatar vit-preview" id="vitPreview">MT</div></div>
            <div class="vit-swatches"><button class="vit-swatch sel" id="vitSw0" style="background:var(--avatar)" title="Padrão" data-gc-click="vitEscolherCor(0)"></button><button class="vit-swatch" id="vitSw1" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)" title="Azul" data-gc-click="vitEscolherCor(1)"></button><button class="vit-swatch" id="vitSw2" style="background:linear-gradient(135deg,#22c55e,#15803d)" title="Verde" data-gc-click="vitEscolherCor(2)"></button><button class="vit-swatch" id="vitSw3" style="background:linear-gradient(135deg,#f59e0b,#c2410c)" title="Laranja" data-gc-click="vitEscolherCor(3)"></button><button class="vit-swatch" id="vitSw4" style="background:linear-gradient(135deg,#ec4899,#9d174d)" title="Rosa" data-gc-click="vitEscolherCor(4)"></button><button class="vit-swatch" id="vitSw5" style="background:linear-gradient(135deg,#a855f7,#6d28d9)" title="Roxo" data-gc-click="vitEscolherCor(5)"></button></div>
            <button class="btn-salvar" data-gc-click="vitSalvarFoto()">Salvar foto</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="vitModal2fa" data-gc-click="if(event.target===this) vitFecharModais()">
    <div class="modal">
        <div class="modal-head"><h2>Verificação em 2 etapas</h2>
            <button class="modal-close" data-gc-click="vitFecharModais()"><svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg></button></div>
        <div class="modal-body" id="vitPasso1">
            <p>1. Abra seu app autenticador e escaneie o QR Code abaixo (exemplo fictício).</p>
            <div class="vit-qr-wrap"><div id="vitQr" class="vit-qr"></div></div>
            <p class="vit-chave">Chave manual: <strong>JBSW Y3DP EHPK 3PXP</strong></p>
            <p>2. Digite o código de 6 dígitos que o app mostrar. <span class="vit-dica">Nesta demonstração, qualquer código de 6 números serve.</span></p>
            <div class="form-group"><input type="text" id="vitCodigo" inputmode="numeric" maxlength="6" placeholder="000000" class="vit-codigo" data-gc-input="vitLimparErro()"></div>
            <p class="msg-erro" id="vitCodigoErro"></p>
            <button class="btn-salvar" data-gc-click="vitConfirmar2fa()">Confirmar e ativar</button>
        </div>
        <div class="modal-body" id="vitPasso2" style="display:none">
            <p><strong>2FA ativada!</strong> Guarde estes códigos de backup num lugar seguro. Cada um funciona uma vez, caso você perca o celular — e só aparecem agora.</p>
            <div class="vit-backup" id="vitBackup"></div>
            <button class="btn-salvar" data-gc-click="vitFecharModais()">Guardei os códigos</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="vitModalDesativar" data-gc-click="if(event.target===this) vitFecharModais()">
    <div class="modal">
        <div class="modal-head"><h2>Desativar 2FA</h2>
            <button class="modal-close" data-gc-click="vitFecharModais()"><svg viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg></button></div>
        <div class="modal-body">
            <p>Sua conta voltará a exigir só a senha pra entrar. Tem certeza?</p>
            <button class="btn-salvar perigo" data-gc-click="vitDesativar2fa()">Desativar 2FA</button>
        </div>
    </div>
</div>
<div class="toast" id="vitToast"><span id="vitToastMsg"></span><button class="toast-fechar" data-gc-click="document.getElementById('vitToast').classList.remove('show')">&times;</button></div>

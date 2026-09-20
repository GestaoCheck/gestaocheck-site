## Início, Multi-IA e Segurança trocados (`files7.zip`); limpeza de
arquivos sem uso pendente de comando manual (20/09/2026)

- **Trocados** (Downloads `files7.zip`): `09_inicial_dashboard` (vira
  `09_inicio`, mapa `RENAME`), `multi_ia_zoom`, `seguranca_2fa_fluxo`,
  escuro + `-branco` (6 arquivos). O zip também trouxe
  `multi_ia_chat_fullpage(-branco).svg`: NÃO usado no site (o Multi-IA é o
  `multi_ia_zoom`), não importado. Importador ganhou `--partial` (zip com só
  algumas telas): `node tools/import-svgs.js --partial <pasta>`; ele
  remove `<metadata>` e achata `<svg>` aninhado (ver seção do Live Server).
  O Início novo NÃO tem mais o erro "Localização bloqueada" (clima
  carregado, "24°C") - o pedido de recaptura acima está resolvido. Menu
  lateral do Início/Estoque/CMO: posições idênticas, então `CURSOR_TARGET`
  continua certo (medido com `getBBox`). Testado no nginx real: 34 SVGs
  ok, Multi-IA e Segurança (destrancando com a chave) carregam, popup do
  CMO com o Início novo por baixo, zero erro/CSP.
- **Cache**: `.svg` tem cache imutável de 30d no nginx e a URL não muda.
  Ainda não foi a produção, então sem problema hoje; pra trocar um SVG
  DEPOIS de publicado, renomear o arquivo (ou visitantes antigos ficam com
  a imagem velha por até 30 dias).
- **Limpeza feita por MOVER (o ambiente bloqueia apagar - "Irreversible
  Local Destruction"; mover é permitido)**: tudo que não é mais usado foi
  pra `C:\Users\USER\Downloads\GestaoCheck_para_apagar\` e o Carlos apaga
  de lá. Conferido por busca que não tinha NENHUMA referência: 28
  `.mp4/.webm/.jpg/.webp` de `assets/sistema/` (vídeos/pôsteres antigos),
  a pasta `assets/sistema-html/` inteira (iframes antigos + `vitrine/`) e 4
  `_*_temp.html` da raiz (subpasta `site-de-vendas\`). Em
  `Chestaocheck-operacional\Imagens do Sistema` (não é git do sistema: 0
  arquivos rastreados) ficaram SÓ os 23 `vitrine_<tela>.html` escuros
  (fonte do `tools/demo-src`, idênticos byte a byte); os outros 95 (claros,
  `01_..23_*.html` antigos, PNG/GIF/MP4, capturas) foram pra subpasta
  `Imagens-do-Sistema\`. `assets/sistema/` agora só tem os 34 SVGs em uso.
  `assets/logo/` NÃO foi mexida de propósito (kit de marca: variantes
  `favicon-quadrado-*` reservadas pra app e `icone-splash.svg` pra
  reativar o splash). `.dockerignore` ficou só com o básico. Teste final no
  nginx real: 6 páginas + 12 popups, zero 404, zero erro/CSP.

## Segurança: cadeado 3D em palco próprio + chave arrastável que
destranca e revela a imagem (20/09/2026)

Carlos: o cadeado 3D ficava atrás de texto/cards e "não dá pra ver a
animação". Ideia dele (interpretada assim, confirmar se quiser outro
fluxo): chave animada; arrastar até o cadeado abre e mostra a imagem
(2FA); clicar na imagem tranca de novo e volta aos textos/cards; repete.

- **Layout** (`index.html`, `#seguranca`): novo `.sec-stage#secStage`
  (480px, 400px no celular) com o `<canvas id="security-3d">` DENTRO dele
  (antes era fundo da seção inteira), cadeado SVG de reserva
  (`.sec-lock-svg`), anel-alvo `.sec-drop`, botão `.sec-key#secKey` e
  `.sec-hint`. `.security-visual` perdeu o `reveal` (ficava escondido/
  reposicionado pelo ScrollTrigger) e ganhou `.sec-back-hint`.
- **Estados** (classes na `<section>`, `css/style.css`): sem JS = layout
  de sempre (imagem + cards, palco `display:none`). JS liga
  `.sec-interactive` = palco + cards (imagem escondida). `.sec-open` =
  só a imagem (palco e cards escondidos). Palco ganha `.is-open` (cadeado
  aberto), `.has-3d` (3D de pé; senão aparece o SVG 2D - celular ≤768px,
  `prefers-reduced-motion` ou sem WebGL).
- **Interação** (`initSecurityLock`, fim de `js/script.js`, Pointer
  Events + Web Animations, sem GSAP): arrastar a chave (segura = balança,
  brilha e solta faíscas; anel-alvo acende via `--near`); soltar perto do
  cadeado (raio 37,5% do alvo) destranca, soltar longe volta pra casa.
  Toque simples ou Enter/Espaço na chave = ela voa sozinha (celular e
  teclado). Destrancar: chave "entra", argola abre (~1,3s), imagem
  aparece com blur→nítido e o SVG animado (`data-anim`) recomeça do
  início pelo IntersectionObserver de sempre. Clicar (ou Enter) na imagem
  tranca e volta a chave/cards. `ScrollTrigger.refresh()` a cada troca
  (altura da seção muda). Testado 3x seguidas.
- **3D** (`js/three-hero.js`, `initSecurityShield`): argola num pivô no pé
  esquerdo; ao abrir sobe 0,42 e gira ~112° em torno dele; o cadeado
  para de girar e vira de frente; pico de brilho (`boost`) + anel mais
  rápido. Lê `stage.classList.contains('is-open')` a cada frame (não
  depende de qual script carregou antes). Câmera z 13 → 8,4 (cadeado
  maior). `resize()` agora ignora 0x0 e há `ResizeObserver` no palco
  (ele fica `display:none` enquanto a imagem está aberta - antes daria
  aspect NaN).
- **Versões**: `css/style.css?v=20`, `js/script.js?v=23`,
  `js/three-hero.js?v=11` (index e quem-somos-nos).
- **Testado** (nginx real com CSP, Playwright com mouse de verdade):
  arrastar até o cadeado abre, imagem carrega e toca, clique volta aos
  cards; soltar longe volta; toque e teclado; 2ª rodada; celular 375px
  (toque, SVG 2D, sem overflow) e `reducedMotion`; zero erro no console.

## CAUSA RAIZ dos "bugs" de Início/Multi-IA/Segurança/vitrine: o Live
Server (VS Code, porta 5500) injeta script em todo `.html` e `.svg`
(19/09/2026, rodada seguinte)

Carlos reportou várias rodadas seguidas: tela "Início" quebrada/ausente
antes do cursor, Multi-IA e Segurança sumidos, CMV/Estoque demorando ou
escondidos, e a vitrine presa em "Carregando a demonstração...". Nada
disso reproduzia no `npx serve`, no nginx real (Docker) nem no Playwright.
Achado olhando as portas abertas dele (`Get-NetTCPConnection`): a 5500 é o
**Live Server**, e reproduzi apontando o Chrome pra `127.0.0.1:5500`.

- **O que o Live Server faz**: injeta seu bloco de live-reload
  (`<!-- Code injected by live-server --><script>...`) em TODA resposta
  `.html` e `.svg`, antes do PRIMEIRO `</svg>`/`</body>`. Consequências:
  (1) os SVGs com `<svg>` ANINHADO (ícones de clima) - `09_inicio`,
  `multi_ia_zoom`, `seguranca_2fa_fluxo` - recebiam o script DENTRO do
  ícone e viravam imagem quebrada (`<img>` `onerror`); os de um único
  `</svg>` (Estoque, CMV, CMO...) sobreviviam. (2) os fragmentos
  `demo/shell.html` e `demo/screens/*.html` (não são páginas) também
  eram corrompidos (`[data-gc-tail]` sumia, `TypeError ... innerHTML` em
  `demo.js`, vitrine presa em "Carregando"). Em produção (nginx) nada
  disso acontece - é só do ambiente de dev dele.
- **Corrigido no código, pra funcionar nos dois servidores**:
  1. Fragmentos da vitrine agora são `demo/shell.frag` e
     `demo/screens/<tela>.frag` (`tools/build-demo.js`, `js/demo.js`).
     `nginx.conf` ganhou `location ~* \.frag$` (`text/plain`, entra no
     gzip, cache 30d imutável - o runtime já pede com `?v=<hash>`).
  2. `tools/import-svgs.js` (`flattenNestedSvg`) troca `<svg x y width
     height viewBox="0 0 36 36">` aninhado por `<g transform="translate
     scale">` - equivalente (medido: 7 pixels de 1,9 milhão diferem no
     Início; Multi-IA é animado) e deixa UM só `</svg>` por arquivo, então
     a injeção cai no fim, sem quebrar. Aplicado nos 6 arquivos afetados
     (escuro + `-branco`). **Se importar SVGs novos, rodar o importador**
     (já faz isso); SVG novo com `<svg>` aninhado continua a regra.
  3. Bug REAL de código achado no caminho: no portão `.demo-loading` do
     cursor (`whenDecoded` em `script.js`), se a imagem "antes" já tinha
     FALHADO antes de alguém escutar (`complete` true, `naturalWidth` 0),
     o portão esperava um evento que já passou e o frame ficava
     `visibility:hidden` até o timeout de 8s (CMV/Estoque "sumidos").
     Agora imagem falha resolve na hora (testado bloqueando `09_inicio`
     via `route.abort`: frame aparece sem esperar).
- **Versões**: `js/script.js?v=22` (4 páginas), `js/demo.js?v=5`.
- **Testado**: Live Server (5500) e `serve` (4173) e nginx real com CSP
  (Docker): 34 SVGs carregam (0 quebrados), Estoque/CMV com tela + "antes",
  Multi-IA/Segurança tocam, vitrine com 15 itens e troca de tela, popup
  CMO mostra o Início ~2,6s e dissolve na tela, zero erro/CSP.
- **Recomendação dada ao Carlos**: pra conferir o site como vai pro ar,
  usar `npx serve` ou o Docker (o Live Server não aplica CSP/gzip/cache
  do nginx e injeta script em tudo).

## Funcionalidades do site agora usam SVG vetorial (não mais iframe nem
vídeo); HTML ficou só na vitrine "sistema simplificado" (19/09/2026,
rodada seguinte)

Carlos pediu: as imagens SVG que o outro chat gerou (zips `files*.zip`
em Downloads) entram no lugar das imagens/animações das funcionalidades
pra ter qualidade melhor, e o HTML fica SÓ no sistema simplificado.

- **O que são os SVGs (conferido abrindo os arquivos)**: vetor de
  verdade - `<text>` real com Manrope/Fraunces embutidas em data-URI,
  sem `<image>`/`<foreignObject>`/script/link externo. As 5 animadas
  (Multi-IA x3, Beneficiamento, Segurança) usam SMIL (`<animate>`), que
  roda dentro de `<img>`. Sem pixel: nítido em qualquer zoom (testado com
  `deviceScaleFactor:3`), resolve o "borra ao dar zoom" na raiz. Os SVGs
  vêm com ~7,7KB de `<metadata>` c2pa em base64 (proveniência) - o
  `tools/import-svgs.js` remove.
- **Como importar/atualizar**: extrair os zips e rodar
  `node tools/import-svgs.js <pasta1> <pasta2> ...` -> copia só os 17
  usados (14 telas + `multi_ia_zoom`, `beneficiamento_entrada`,
  `seguranca_2fa_fluxo`, cada um escuro + `-branco`) pra
  `assets/sistema/` e FALHA se algum tiver `<image>`/`<foreignObject>`/
  `<script>`/link externo (não rodaria via `<img>` com o CSP). Os
  `vitrine_*.svg` dos zips NÃO são usados (a vitrine é o HTML de
  `demo/`). `multi_ia_cmv`/`multi_ia_chat_fullpage` e as telas 07/08/14/
  16/18/20-23 dos zips também não entraram (sem uso no index).
- **`index.html`**: 13 `<iframe class="sys-embed">` viraram `<img
  class="sys-theme-img" src|data-src="assets/sistema/NN_tela.svg">`
  (mesma numeração; popups mantêm `data-src` = só carregam na 1a
  abertura); os 3 `<video>` (Multi-IA, Segurança, Beneficiamento)
  viraram `<img>` do SVG animado. Zero `<iframe>`/`<video>`/`.sys-embed`
  no site. SVG animado em popup só começa quando o `src` é apontado
  (abertura), então a animação começa quando a pessoa vê.
- **`js/script.js`**: saíram `mountSysEmbeds`, o ramo de iframe/vídeo do
  `applySysTheme`/`abrirModal`, `BEFORE_FILE`, `getEmbedNavPoint` e o
  `attachSecurityCursor` (cursor sincronizado com `video.currentTime`; o
  SVG da Segurança já traz o cursor DENTRO da animação - o fluxo
  Início -> Configurações -> QR com crossfade e cursor - e SMIL em
  `<img>` não expõe relógio pra sincronizar nada). Tema: `X.svg` <->
  `X-branco.svg` (`sysThemeSrc`), testado abrindo popup pela 1a vez já
  em tema claro (tela "antes" do cursor também vem `-branco`).
- **Cursor de demonstração sem DOM**: antes lia `.nav-item.active` de
  dentro do iframe; agora `CURSOR_TARGET` (em `script.js`) é uma tabela
  por arquivo com o alvo em px do espaço 1680x1050 do SVG, MEDIDA com
  `getBBox()` dos `<text>` dos próprios SVGs (Playwright, `setContent`
  do SVG inline): itens da sidebar em y = 126 (Estoque) + 42/item, x =
  100; abas: Caixa (729,6; 459,9) na tela-mãe CMC, DRE (1432,1; 130) e
  Curva ABC (1515; 130) na tela-mãe Relatórios. **Como remedir** se o
  menu do sistema mudar: abrir o SVG no navegador, pegar
  `getBBox()` do `<text>` do item (centro), converter em % = x/1680,
  y/1050. A "tela antes" (Início, ou a tela-mãe nas abas) agora é um
  `<img>` de SVG dissolvendo por cima (`.demo-cursor-before`).
- **Bug do cursor achado e corrigido logo depois ("animação bugada da
  tela inicial até a outra")**: (1) a timeline do cursor começava antes
  de os 2 SVGs (tela + "antes", ~100KB cada, com fontes em data-URI)
  terminarem de carregar/decodificar - a tela de destino aparecia em
  branco ou "pipocava" por cima do Início. Agora `attachDemoCursor`
  segura o `play()` até `img.decode()` das duas imagens (`whenReady`,
  timeout de 8s) e o frame fica com `.demo-loading` (imagens
  `visibility:hidden`) até lá; `pause()` durante a espera cancela o
  play (popup fechado rápido). (2) o crossfade de 0,7s entre duas telas
  totalmente diferentes mostrava as duas sobrepostas ("duplo"
  embolado): virou 0,3s (medido ~220ms) com hold de 2,4s na tela de
  destino e `will-change:opacity` no overlay. Testado com throttling
  de rede (`loading=true` enquanto pendente, animação só depois),
  abre/fecha de popup x4 e cursor nas seções inline. `css/style.css?v=17`,
  `js/script.js?v=17`.
- **SVGs animados só rodam quando visíveis (19/09/2026, "Multi-IA e
  Segurança bugadas")**: SMIL dentro de `<img>` roda PRA SEMPRE enquanto a
  imagem existe, mesmo fora da tela, competindo com as 5 cenas 3D e o
  scroll (engasgo em máquina real; o headless não mostra porque a CPU dele
  já vive saturada). Agora Multi-IA, Segurança e Beneficiamento têm
  `data-anim data-src="X.svg"` e o `src` só aponta pro SVG enquanto está
  visível (`IntersectionObserver` threshold 0.15; popup: `abrirModal`/
  `fecharModal`); saindo volta pra um GIF transparente 1x1
  (`BLANK_IMG`, `parkAnim`/`playAnim` em `script.js`). Bônus: a animação
  SEMPRE recomeça do início ao entrar (antes a pessoa pegava o loop no
  meio). Mesmo URL = volta do cache do navegador. O loop de `img[data-src]`
  do `abrirModal` ignora `[data-anim]`; `attachDemoCursor` lê o nome do
  SVG de `data-src` primeiro (o `src` pode estar estacionado). Testado:
  parado na carga, toca ao entrar, para ao sair, tema claro com um parado
  e outro tocando, popup Beneficiamento abre/fecha/reabre x3 com cursor.
  `css/style.css?v=18`, `js/script.js?v=18`.
- **Tela "antes" do cursor quebrada no Chrome do Carlos (print do
  popup do Beneficiamento: ícone de imagem quebrada numa faixa no topo
  da moldura)**: o `<img>` do Início (overlay) falhava ao carregar no
  navegador DELE (o arquivo existe e responde 200; testado no Chrome real
  via extensão, nos 12 popups, sem nenhuma quebrada) - hipótese mais
  provável: extensão de bloqueio (ele tem várias na barra) barrando URL
  com "dashboard". Corrigido em duas frentes: (1) `09_inicial_dashboard`
  virou **`09_inicio.svg`** (+ `-branco`; `tools/import-svgs.js` tem o
  mapa `RENAME`, `CURSOR_HOME` em `script.js`); (2) o overlay ganhou
  `error` -> `display:none` (sem ícone quebrado; o cursor segue só sobre
  a tela de verdade) - testado simulando bloqueio da URL (Playwright
  `route.abort`).
- **Beneficiamento sem tela "antes"/cursor**: o SVG animado dele tem
  loop de 6,6s (em branco até 0,7s, cresce até 2,0s, SEGURA cheio de
  2,0s a 5,9s, some) e o cursor um ciclo de ~7,6s - dois relógios
  independentes desalinham a cada volta e a dissolução caía numa fase
  em branco. O relógio SMIL de um `<img>` NÃO dá pra controlar nem ler
  (`drawImage` desenha o quadro inicial; sem `setCurrentTime`), então
  sincronizar é frágil. Removido de `CURSOR_TARGET`: agora toca sozinho
  ao abrir o popup (a animação já é a "entrada do gráfico").
  **CUIDADO ao testar animação pela extensão do Chrome**: a aba do MCP
  fica OCULTA (`document.visibilityState === 'hidden'`, `rAF` parado) e
  NADA anima nela (SMIL/GSAP congelam no 1o quadro) - parece bug e não é.
  Use Playwright (headless renderiza) ou peça print ao Carlos.
- **Deploy**: `git status` mostra `assets/`, `css/`, `js/`, `demo/`,
  `tools/` e as páginas novas como NÃO rastreados (nunca foram
  commitados; só `index.html` etc. antigos estão no git). Um `git pull` na
  VPS não traz nada disso - imagens/telas apareceriam quebradas em
  produção. Precisa `git add` antes de subir.
- **Achados sobre o conteúdo do `multi_ia_zoom.svg` (não é bug do site)**:
  o loop de 15,8s tem uma fase "afastada" (~3s no começo e ~2s no fim)
  em que a viewBox recortada (`920 0 760 1008`) mostra só a metade direita
  do dashboard (cards cortados na borda, card de clima azul vazio) antes
  do balão de chat dar zoom - pode parecer quebrado. Verificado quadro a
  quadro com `svg.setCurrentTime()` (SVG inline, `pauseAnimations()`) -
  técnica boa pra inspecionar animação SMIL deterministicamente. No
  WebKit (Playwright) o texto negrito das fontes embutidas sai fino (peso
  variável em SVG-como-imagem). O painel embutido do app não renderiza o
  `index.html` (5 WebGL) - não serve pra julgar animação.
- **CSS**: `.screenshot-frame img` ganhou `object-position: top` (os SVGs
  são a página inteira, de 1050 até 1683px de altura; a moldura 1680x1050
  mostra o topo, igual as capturas antigas mostravam); `.sys-embed*`
  removido; Multi-IA usa `img` (retrato 760x1008, `contain`).
  `css/style.css?v=16`, `js/script.js?v=16`.
- **Peso**: os SVGs são servidos com gzip (`image/svg+xml` já estava em
  `gzip_types`) e cache imutável (`location ~* \.svg`). Carga inicial do
  `index.html` ~590KB na rede (só 5 SVGs entram: Estoque, CMV, Início
  como "antes", Multi-IA, Segurança), ~730KB depois de rolar a página
  toda; popups carregam sob demanda. Sem overflow em 375px.
- **Fora da imagem Docker, sem apagar nada**: `.dockerignore` agora
  exclui `assets/sistema-html/` (13MB, o antigo iframe), `assets/sistema/
  *.mp4|*.webm|*_poster*` (vídeos/posters antigos) - nada mais referencia
  (conferido por busca). Os arquivos continuam no disco; imagem de
  produção com 4,2MB de `assets/`. **Apagar de vez** (incl. a pasta
  `assets/sistema-html/vitrine/` de antes) segue pendente de decisão do
  Carlos - o ambiente bloqueou o `rm -rf` por ser irreversível.
- **Achado no conteúdo dos SVGs (pro outro chat)**: o `09_inicial_
  dashboard.svg` (usado como tela "antes" do cursor em quase todo popup)
  foi capturado com o card de clima em estado de ERRO ("Localização
  bloqueada pro navegador. Pra ver o clima, ative o acesso à
  localização...", temperatura "—"). Aparece por ~2s em cada popup.
  Pedir recaptura do Início com o clima carregado (ou com a mesma
  saudação/clima da vitrine `demo/`).
- **Testado** (nginx real com CSP, Playwright): 12 popups abrem com
  imagem `ok` (`naturalWidth>0`) e cursor; seções inline ok; zero
  console error/CSP; animações SMIL avançam (hash de quadro muda ao
  longo do tempo: Segurança 8 quadros distintos, Multi-IA digitando,
  Beneficiamento com o gráfico crescendo); tema claro/escuro nas
  seções e popups; regressão nas outras páginas (computed style de 810
  elementos igual) e vitrine `demo/` (23 telas, 0 problemas; 45 fluxos
  OK).

## Mini sistema fechado com 23 telas (lote 2 integrado): Início e
Beneficiamento não têm mais cadeado (19/09/2026, mesmo dia - rodada
final)

O outro chat entregou o lote 2 (`vitrine_inicio`, `_beneficiamento`,
`_cmv_vendas`, `_config_perfil`, `_config_notificacoes`, escuro + claro)
e regenerou o lote 1 com correções. Tudo copiado (só os escuros) pra
`tools/demo-src/` (agora 23 arquivos) e o build rodado.

- **O que o lote 1 corrigiu (5 arquivos mudaram)**: `estoque`
  (`vitAjustarQtd(6,-1)` virou `vitQtdMenos/vitQtdMais(id)`, literal
  negativo saía da gramática), `config_setores` (Enter+blur disparava
  `confirmar()` 2x - o bug 1 da lista anterior está resolvido),
  `checklists` (`block:'center'` -> `'start'`), `requisicao` (tirou o
  `stopPropagation` misturado no `onchange`), `patrimonio` (Limpar virou
  `vitLimparBusca()`). Ou seja, os bugs 1 e 3 dos "originais" acima
  deixaram de existir nos arquivos novos.
- **Catálogo do build** (`tools/build-demo.js`, `SCREENS`/`GROUPS`/`NAV`):
  Início e Beneficiamento viraram telas normais (sem `locked`; o código
  de cadeado no shell/runtime continua lá, sem nenhum uso hoje, caso
  algum dia volte uma tela bloqueada). **CMV** virou grupo de abas
  (Visão geral / **Vendas**). **Configurações** ganhou **Perfil** e
  **Notificações** (menu lateral com 5 itens: Perfil, Notificações,
  Setores e categorias, Usuários, Inteligência Artificial; padrão do
  grupo = Perfil). Tela padrão da vitrine voltou a ser o **Início**.
- **Shell generalizado**: o Início tem topbar diferente (saudação "Olá,
  Marina!" no lugar de título+subtítulo, sino e avatar com handlers
  próprios). Cada tela agora pode trazer `head` (cabeçalho) e `tail`
  (sino+avatar); o `tail` só entra no manifest quando difere do padrão
  (o do Estoque). `demo/shell.html` tem `[data-gc-head]`/`[data-gc-tail]`.
- **Perfil mexe no shell**: trocar o nome atualiza iniciais/nome na
  sidebar e o avatar da topbar (a tela usa `document.querySelector` no
  shell inteiro - funciona porque o `document` fake consulta o shadow
  root inteiro). Como o shell é compartilhado, o runtime **restaura o
  bloco `.sidebar-user` ao padrão a cada troca de tela** (`defaultUser`,
  `js/demo.js`), senão o nome editado vazava pras outras telas e
  voltava "Marina" ao reabrir o Perfil (testado: sair do Perfil volta a
  MT).
- **Falsos positivos do validador**: 28 handlers montados por script
  com argumento dinâmico (`vitExcluir(5)`) - o build já pula os que têm
  concatenação (`skipConcat`); o resto é conferido em runtime pelos
  testes. `setInterval` do carrossel do Início já é coberto pelo
  `ctx.setInterval` (limpo ao sair da tela; testado: 8,5s depois de
  sair, zero erro). Os `<link>` de Google Fonts das telas são ignorados
  (as fontes já vêm da página). Sidebar: 14 itens + Configurações.
- **Bug do ORIGINAL achado (não consertado)**: no Início, os pontinhos
  do carrossel de clima (`vitDot0/1`, 7x7px) ficam cobertos pelo próprio
  slide (`elementFromPoint` devolve `vitSlide0`, igual no arquivo cru) -
  não dá pra clicar neles, só o auto-rotate (7s) troca de slide.
- **Testado de novo no nginx real com CSP** (Docker): 23 telas, todos os
  handlers clicados = 0 problemas; 45 fluxos do lote 1 + 34 fluxos das 5
  telas novas (registrar produção/venda, CMV calculado na hora, valor
  unitário acompanhando o item, cards recalculando ao registrar/excluir/
  filtrar, editar nome -> iniciais no shell, 2FA com QR SVG + 8 códigos
  de backup + desativar, ligar/desligar todos + contador "N de 6", menu
  Exportar, overlays) = todos OK, zero console error/warn. Comparação
  pixel a pixel original x demo das novas: Início 1,1%, Beneficiamento
  1,5%, Perfil 2,3%, Notificações 2,4% (escuro; claro parecido);
  CMV/CMV Vendas ~3-7% só pela barra de abas nova. `js/demo.js?v=4`.
- **Pendente (permissão negada, decisão do Carlos)**: apagar
  `assets/sistema-html/vitrine/` (38 arquivos, 4,8MB, zero referências).
  O ambiente bloqueou o `rm -rf` por ser irreversível (`assets/` não
  está no git) - não foi contornado. Os originais seguem em
  `Imagens do Sistema/` e as capturas antigas em
  `assets/sistema-html/09_*.html`/`14_*.html`. Se o Carlos quiser, apaga
  pelo Explorer ou libera a permissão.
- **Fora do escopo desta rodada**: os GIFs antigos do Multi-IA
  (`multi_ia_cmv.gif`, `multi_ia_chat_fullpage.gif`, `multi_ia_zoom.gif`)
  em `Imagens do Sistema/` - nada apagado; fase 2 (SVGs em alta
  qualidade dos zips de Downloads) segue aguardando decisão.

## Vitrine "Veja por dentro" virou um mini sistema de verdade: Shadow
DOM, sem iframe, 18 telas com JS próprio, CSP intacto (19/09/2026; hoje são 23, ver a seção acima)

Carlos pediu o sistema simplificado "sem iframe", com as 18 telas
interativas do lote novo (`vitrine_<tela>.html`) e tudo isolado do site.
Regras dele: nada é salvo (dados fictícios, só na memória de quem
testa), Termos de Uso fora, e pode deixar telas "de gostinho" bloqueadas.

- **Onde estão as telas de origem (achado)**: NÃO estavam em Downloads
  (lá só há zips de `.svg`, que são as imagens da fase 2, ver abaixo).
  Os HTMLs são os de `Chestaocheck-operacional/Imagens do Sistema/`
  (17/09); as cópias antigas de `assets/sistema-html/vitrine/` são
  idênticas a eles + o `VITRINE-NAV-GUARD`. Copiadas as 18 ESCURAS pra
  `tools/demo-src/` (o claro é idêntico, confirmado por diff nos 18
  pares: só o `data-tema="escuro"` no `<html>` muda).
- **Arquitetura (e por que assim)**:
  - **Shadow DOM em vez de prefixar tudo com `.gc-demo`**: o
    `css/style.css` do site tem `.btn`, `.modal`, `.container`... que
    colidiriam com o CSS do sistema (mesmos nomes). Shadow DOM isola nos
    dois sentidos (testado: CSS agressivo injetado no site - `*`,
    `.btn`, `.content` - não atinge o demo; nenhuma regra do sistema
    aparece em `document.styleSheets`). Só `:root`/`body`/`html`/
    `[data-tema]` foram reescritos pro wrapper `.gc-demo`. **Herança
    atravessa o shadow boundary**: `color`/`text-align`/`line-height` do
    host vazam pra dentro (bug real achado: um `text-align:center` que
    eu tinha posto no host centralizou todas as tabelas) - por isso
    `:host{all:initial}` em `demo/base.css` e o estilo de "Carregando"
    só no `::before`, nunca no host.
  - **Um shell só** (sidebar+topbar idênticas nas 18 telas, só muda o
    `.active`) e a tela ativa montada/desmontada sob demanda
    (`js/demo.js`): fetch de `screens/<tela>.html` + `<style>` + JS da
    tela (`<script src>` same-origin, uma vez). Ao sair: remove DOM e
    estilo, limpa os timers da tela e descarta o `window` fake dela.
  - **CSP**: nada de inline/eval. Os HTMLs de origem usam
    `onclick="..."` e 1 `<script>` inline - o build troca `onclick/
    oninput/onchange` por `data-gc-click/input/change` (também no HTML
    montado dentro dos scripts) e o runtime executa por delegação com
    uma **gramática fechada** (`fn(literais, this, this.value, event)`,
    `return false`, `event.stopPropagation()`, `if(event.target===this)
    ...`, `getElementById(..).classList.toggle/remove/add`,
    `.scrollIntoView`, `.value=`) - 97 handlers estáticos únicos hoje. O
    build FALHA se aparecer sintaxe fora dela (assim já pegou
    `this.value` no 1º run). O `nginx.conf` NÃO mudou (zero
    afrouxamento de CSP).
  - **Cada tela = factory** (`GCDemo.define(key, function(ctx){ var
    window=ctx.window, document=ctx.document, setTimeout=...;
    with(window){ <original> } })`): as `window.vit*` (vitAbrirModal,
    vitFiltrar, vitMascararMoeda... com implementações diferentes por
    tela) vivem num objeto por tela. **Pegadinha**: as telas chamam
    `vitRenomear()` SEM `window.` (no original vira global implícito) -
    por isso o `with(window)` (achado testando config_setores).
  - **Escala**: layout de 1680px (largura dinâmica se o host passar
    disso) + `transform:scale` via ResizeObserver; o transform também
    faz do wrapper o containing block dos `position:fixed` (modais/
    toast). `vh`->`%`, `vw`->px de 1680, `@media (max-width/min-width)`
    removidas (o "viewport" do demo é o wrapper). Altura se adapta à
    janela (640-1200 lógicos). Celular: escala mínima 55% + rolagem
    horizontal controlada ("Arraste para o lado") e sidebar começa
    recolhida. `overflow:clip` (não `hidden`) no wrapper: `hidden` deixa
    `scrollIntoView`/`focus` rolarem o wrapper e deslocar sidebar+topbar.
- **Navegação**: as telas de origem NÃO têm menu interno, então o shell
  gera: **CMC <-> Caixa** (abas), **Relatórios: DRE completa <-> Curva
  ABC <-> Insights** (abas), **Configurações: Setores e categorias /
  Usuários / Inteligência Artificial** (menu lateral interno). Deep
  link por hash (`#estoque`, `#config_ia`) e voltar/avançar funcionam
  (`hashchange`). **[SUPERADO: hoje têm tela própria] Início e Beneficiamento ficavam bloqueados** (cadeado
  + "Disponível no sistema completo", aviso ao clicar): não existem no
  lote interativo. A tela de IA não tem bloco de Termos de Uso
  (confirmado no arquivo) - a aba se chama só "Inteligência Artificial".
- **Como regenerar** (quando o outro chat mandar telas novas): trocar os
  arquivos em `tools/demo-src/` e `cd tools && npm install && npm run
  build` -> reescreve `demo/` inteiro (manifest, shell, base.css, css/
  por hash, screens/). `demo/` é COMMITADO pronto (legível); `tools/`
  fica fora da imagem Docker (`.dockerignore`). O cache imutável de 30d
  do nginx vale pra `.css/.js` de `demo/` também: o runtime pede tudo
  com `?v=<hash do manifest>` (sobe sozinho a cada build) e o
  `manifest.json` é buscado com `cache:'no-cache'`. `js/demo.js` passa
  pelo terser no Dockerfile; `demo/` NÃO (gerado, o gzip já tira ~80%).
  Se aparecer sintaxe nova de handler, estender a gramática em
  `js/demo.js` (o build usa o mesmo `parseHandler`, fonte única).
- **Removido**: o iframe/`.sys-embed-crop` da vitrine, o troca-de-pane
  de `script.js` e ~160 regras de CSS mortas (`.sys-*` da vitrine antiga
  e componentes só dela) - conferido comparando o computed style de
  1.690 elementos nas 5 páginas (CSS antigo x novo): 0 diferenças. O
  `prevent` do Lenis agora reconhece o host `#gcDemo` (o alvo do evento
  vem de dentro do shadow root, `closest` sozinho não acha) - a página
  da vitrine não carrega Lenis, mas fica pronto. Versões:
  `css/style.css?v=15`, `js/script.js?v=15`, `js/demo.js?v=3`.
- **Pendente de decisão do Carlos**: apagar `assets/sistema-html/
  vitrine/` (38 arquivos, 4,8MB, agora sem NENHUMA referência;
  `assets/` não está no git, então apagar é irreversível - os originais
  continuam em `Imagens do Sistema/` e as capturas de Início/
  Beneficiamento também em `assets/sistema-html/09_*.html`/`14_*.html`).
  Não apagado ainda.
- **Testado** (Playwright em pasta de scratch fora do repo, contra o
  nginx REAL em Docker com o CSP de produção): 18 telas abertas, TODOS
  os handlers clicados (zero console error/warn, zero violação de CSP,
  zero HTTP >= 400); 45 fluxos com clique real (estoque +/-, DRE Mês/
  Ano, Curva ABC filtro, gerar insights, criar/renomear/excluir setor,
  modal abrir/fechar por overlay, máscara de moeda, criar/excluir
  despesa, select de status, filtros, painel de detalhe, tema claro/
  escuro, recolher sidebar, Enter na sidebar); 3 rodadas de navegação +
  rajada de cliques sem ids duplicados, sem `window.vit*` no global,
  <= 3 `<style>` no shadow, 1 `<script>` por tela; timer pendente
  (excluir e sair na hora) sem erro; sem overflow de página em 375/414/
  768/1280/1440/1920/2560. Comparação pixel a pixel original x demo
  (mesmo tamanho): telas sem abas 0,4-1,5% de diferença (escuro e
  claro); CMC/Caixa/DRE/Curva ABC/Insights/Config diferem 2-11% só
  porque o shell acrescenta a barra de abas/menu (empurra o conteúdo
  ~45px).
- **Bugs achados nos HTMLs ORIGINAIS (não consertados de propósito)**:
  1. `config_setores`: renomear com Enter dispara `confirmar()` 2x
     (Enter + `blur` do input removido) -> `replaceWith` lança "node ...
     no longer a child" no console. Inofensivo (o nome fica certo).
     Confirmado abrindo o arquivo cru no navegador.
  2. Nenhum modal/painel fecha com Esc (só clique no overlay/X).
  3. `config_setores`: excluir um item enquanto o input de renomear
     está aberto sem passar pelo blur (ex: acionado por teclado) dá
     TypeError (`.config-item-nome` já foi trocado pelo input).
  4. Despesas: "excluir" só faz `display:none` na linha (não remove do
     DOM) - por design da demo, mas conta em seletores.
- **Fase 2 (não feita, separada)**: Downloads tem 6 zips (`files*.zip`)
  com SVGs em alta qualidade (Multi-IA, Segurança, Beneficiamento,
  relatórios, `vitrine_*.svg`) pro resto do site - aguardando o Carlos
  dizer onde entram (sem mexer no hero).

## Vídeo da Segurança bem maior, qualidade mais alta, layout
reorganizado (18/09/2026, mesmo dia - rodada seguinte)

Carlos pediu "full HD" e maior pra conseguir ler, dando liberdade pra
mudar os cards de lugar se precisasse.

- **Achado real**: a gravação já era nativa em 3360x2100 (bem acima de
  Full HD, herdado desde a correção de legibilidade de uma rodada bem
  anterior) - o problema não era a resolução da gravação, era o espaço
  de EXIBIÇÃO: `.security-split` era um grid `1fr 1.3fr` com os 8 cards
  ao lado, o que limitava o vídeo a `max-width:640px` (só ~19% do
  tamanho nativo, texto pequeno de verdade tipo a chave manual do QR
  ficava ilegível). Reestruturado pra pilha vertical
  (`display:flex;flex-direction:column`) - vídeo primeiro, sozinho,
  bem maior (`max-width:640px → 1000px`, mais que o dobro), cards
  numa fileira normal por baixo (não precisam de leitura fina, cabem
  bem numa grade). Testado: frame saiu de 640px pra 1000px de largura
  no desktop (1280px de viewport), sem overflow em mobile (375px,
  frame cai pra 343px sozinho, dentro do grid responsivo que já
  existia).
- **Qualidade do encode também subida**: `crf` do H.264 foi de 20 pra
  16, do VP9 de 30 pra 26 (menos compressão, mais fidelidade) - com o
  vídeo aparecendo bem maior na tela agora, qualquer artefato de
  compressão ficaria mais visível também, não só o tamanho de exibição
  importava. Arquivos regenerados nos 2 temas (claro/escuro) +
  posters. Tamanho subiu de ~1,4-1,6MB pra ~1,6-2MB por arquivo -
  aceitável pra um vídeo que carrega direto na seção (não é lazy,
  sempre visível na página).
- Cursor sintético da rodada anterior (`attachSecurityCursor`) não
  precisou de nenhuma mudança - as posições são em % relativas à
  moldura, então acompanham o novo tamanho sozinhas.
- `css/style.css?v=13` (bump nas 6 páginas).

## Vídeo da Segurança reconstruído com crossfade de verdade (fim do
"seco"), cursor sintético sincronizado com o próprio relógio do vídeo
(18/09/2026, mesmo dia - rodada seguinte)

Carlos pediu 2 coisas: a animação do vídeo de Segurança "muito seca",
mais fluida, e tentar um cursor seguindo o caminho do vídeo.

- **Causa raiz do "seco" achada por inspeção direta do arquivo**: o GIF
  original (`seguranca_2fa_fluxo.gif`) só tem **3 frames reais**
  (`pts_time` 0/1.5/3.2, medido com `ffprobe -vf showinfo`) - o resto
  da duração de 6.8s é só o último frame "segurando". O `playbackRate:
  0.55` que já existia (`js/script.js`) desacelerava a REPRODUÇÃO, mas
  entre um frame real e o próximo continua sendo um corte seco - só
  ficava mais tempo esperando pra ver o mesmo salto brusco acontecer,
  não mais fluido, só mais devagar (exatamente o oposto do pedido).
- **Corrigido na raiz**: reconstruído o vídeo do zero com **crossfade
  de verdade** entre os 3 estados (`ffmpeg xfade=transition=fade`,
  técnica diferente do `minterpolate` usado no Beneficiamento numa
  rodada anterior - `minterpolate` estima MOVIMENTO entre frames
  parecidos, bom pra uma barra crescendo; aqui os 3 frames são telas
  INTEIRAS diferentes uma da outra, `minterpolate` tentaria "morphing"
  entre interfaces diferentes e ficaria pior, não melhor - crossfade
  dissolve as duas imagens uma na outra, técnica certa pra corte de
  cena). Timeline nova (dura 7.33s, medido): Início (parado 2.1s) →
  dissolve 0.7s → Configurações/Perfil (parado 1.4s) → dissolve 0.7s →
  QR code revelado (parado 2.4s) → loop. `playbackRate` removido de
  vez (`js/script.js`) - a pausa de leitura agora é tempo de verdade no
  vídeo, não velocidade de reprodução artificial.
- **Cursor sintético seguindo o caminho, sincronizado com o vídeo de
  verdade**: diferente do cursor genérico do site
  (`attachDemoCursor`/`getEmbedNavPoint`, que lê a posição real de um
  `.nav-item.active` dentro de um iframe vivo - não existe pra vídeo
  puro), esse é uma função nova (`attachSecurityCursor`,
  `js/script.js`) que calcula a posição do cursor a cada instante como
  **função direta de `video.currentTime / video.duration`** - nunca
  desincroniza do vídeo de verdade, mesmo depois de várias repetições
  do loop, porque não roda num timer paralelo (GSAP `repeat:-1` teria
  esse risco) - lê o relógio real do próprio `<video>` a cada frame.
  Pontos (x%, y%) medidos inspecionando os 3 frames reais extraídos do
  vídeo: Início → sidebar "Configurações" (6%, 89%) → botão "Ativar
  verificação em 2 etapas" (37%, 69%) → botão "Confirmar e ativar" no
  modal do QR (50%, 71%) - as frações de tempo de cada trecho batem
  exatamente com o hold/crossfade construído no vídeo (ex: cursor
  "clica" em Configurações bem no instante em que o crossfade 1
  começa). Reaproveita o mesmo componente visual (`.demo-cursor`/
  `.demo-cursor-ring`, CSS) e o mesmo SVG (`demoCursorSvg`) que o
  cursor genérico já usa - zero CSS novo. Só roda com a seção realmente
  visível (`IntersectionObserver`, mesma filosofia de custo zero fora
  de tela que as cenas 3D do site já seguem).
- **Nota de metodologia de teste** (mesma pegadinha já documentada
  várias vezes nesta sessão, reencontrada aqui): como o cursor é
  100% dirigido por `requestAnimationFrame` (sem GSAP timeline), e esse
  ambiente de automação só tickeia `rAF` quando força um repaint de
  verdade (screenshot), setar `video.currentTime` via JS entre 2
  screenshots não atualiza a posição do cursor imediatamente - fica
  "atrasado" até o próximo repaint de verdade. Verificado de duas
  formas independentes que a lógica está correta mesmo assim: (1)
  forçando um repaint real (screenshot depois de esperar), o cursor
  saiu da posição inicial (6%, 8%) pra perto de "Configurações" com
  opacidade 1 - prova que o mecanismo dispara; (2) testada a função de
  cálculo de posição isolada (Node, sem DOM/rAF nenhum) varrendo 100
  pontos de 0 a 1 - zero erro, todo valor no intervalo 0-100%, e os 6
  pontos-chave batem exatamente com os valores desenhados. Não é uma
  limitação do site - `requestAnimationFrame` roda a ~60fps sozinho em
  qualquer aba de navegador real e visível, só esse ambiente de teste
  específico que não simula isso sem pedir repaint explícito - Carlos
  precisa confirmar visualmente no navegador dele.
- Vídeo reconstruído nos 2 temas (escuro/claro, mesmos pontos de
  cursor - o layout da tela é idêntico entre os dois, só cor muda,
  conferido comparando os frames extraídos lado a lado) -
  `assets/sistema/seguranca_2fa_fluxo(.mp4/.webm/(-branco))` e os 2
  posters regenerados. `js/script.js?v=14` (bump nas 4 páginas que
  carregam o arquivo inteiro).

## Bug real corrigido - Beneficiamento carregava o vídeo escuro mesmo no
modo claro; ponto de entrada da vitrine devolvido ao site (18/09/2026,
mesmo dia - rodada seguinte)

Carlos reportou 2 coisas reais: o vídeo de Beneficiamento continuava
escuro mesmo com o modo claro ativado, e não tinha mais nenhum botão no
site pra testar o "sistema simplificado" (vitrine).

- **Bug real achado e corrigido - Beneficiamento "preso" no vídeo
  escuro em modo claro**: causa raiz em `applySysTheme()` (`js/
  script.js`) - a função já trocava corretamente `src` de `<source>`
  quando o vídeo JÁ tinha sido aberto uma vez (`hasAttribute('src')`),
  mas o vídeo do Beneficiamento é lazy (`<source data-src="...">`, só
  vira `src` de verdade na primeira abertura do popup, mesmo padrão de
  toda imagem/iframe lazy do site) - `applySysTheme` nunca atualizava
  esse `data-src`, só o `src`. Resultado: se a pessoa trocava pro tema
  claro ANTES de abrir o popup de Beneficiamento pela primeira vez, o
  `data-src` continuava apontando pro arquivo escuro original - quando
  o popup enfim abria, carregava o vídeo errado, mesmo com o resto do
  site já em modo claro. Corrigido somando a mesma atualização de
  `data-src` que iframe/img já tinham (linha a mais em
  `applySysTheme`). Testado reproduzindo o cenário exato do bug: tema
  trocado pra claro SEM nunca ter aberto Beneficiamento antes, depois
  abrindo o popup pela primeira vez - `video.currentSrc` confirmado
  como `beneficiamento_entrada-branco.webm` (antes do fix seria o
  arquivo escuro).
- **Ponto de entrada da vitrine devolvido ao site** - Carlos pediu de
  volta um jeito de testar o sistema simplificado direto pelo site
  (fazia sentido, já que a rodada anterior deixou a vitrine bem mais
  sólida - 18 telas interativas + bug do 404 na tela de Início
  corrigido). Devolvidos os 3 pontos de entrada que tinham sido
  removidos numa rodada anterior (17/09/2026): a seção
  `#veja-por-dentro-teaser` em `index.html` (entre Multi-IA e
  Segurança, mesmo padrão visual `.plans-teaser` já usado pro convite
  de Planos - CSS já existia, só reaproveitado), o botão "Conhecer o
  sistema" no CTA final (`#contato`, ao lado de "Solicitar
  demonstração"), e o link "Conhecer o sistema" no rodapé (coluna
  Empresa, entre "Como funciona" e "Contato") nas 5 páginas que têm
  rodapé completo (`index.html`, `planos.html`, `privacidade.html`,
  `termos.html`, `quem-somos-nos.html` - `conheca-o-sistema.html` em si
  não tem rodapé, continua "modo app" de propósito). Testado clicando
  de verdade no botão "Testar o sistema" - abre a vitrine normal, zero
  erro no console.
- `js/script.js?v=13` (bump nas 4 páginas que carregam o arquivo
  inteiro - `css/style.css` não mudou nesta rodada).

## Multi-IA com a captura de zoom de verdade (não a antiga), bug real
achado e corrigido - clicar em quase qualquer coisa na tela de Início
da vitrine quebrava tudo com 404 (18/09/2026, mesmo dia - rodada
seguinte)

Carlos apontou 2 coisas reais: eu tinha pedido uma captura nova do
Multi-IA com zoom no chat (rodada anterior, mesmo dia) mas nunca
integrei ela quando chegou, e "o sistema simplificado" continuava sem
funcionar de verdade.

- **Captura de zoom do Multi-IA integrada** - achei
  `multi_ia_zoom.gif`/`-branco.gif` já esperando em `Imagens do
  Sistema/` (criados às 17:06 do dia anterior, nunca usados). Convertido
  pro mesmo padrão de vídeo de sempre (`ffmpeg`, `fps=15` pra forçar CFR
  e segurar o frame final até a duração real - mesma técnica/mesmo bug
  de sempre, durações batendo: 13.33s/11.13s). Trocou
  `multi_ia_cmv.mp4/webm` por `multi_ia_zoom.mp4/webm` no `<video
  id="multiIaVideo">` de `index.html`.
  - **Achado real ao integrar**: essa captura é um zoom VERTICAL
    dedicado só no balão de chat (760x1008, retrato) - bem diferente da
    proporção 1680x1050 (paisagem) de toda outra screenshot/vídeo do
    site. A regra genérica de `.screenshot-frame` (`aspect-ratio:
    1680/1050` + `object-fit:cover`) cortaria um vídeo desse formato
    quase pela metade pra caber numa moldura larga - com as contas
    reais (moldura 675x423 vs vídeo 760x1008), só ~47% da altura do
    vídeo ficaria visível, provavelmente cortando texto - o oposto do
    que o zoom existe pra resolver. Corrigido com moldura própria só
    pro Multi-IA (`#multi-ia .screenshot-frame { max-width:460px }` +
    `video { aspect-ratio:760/1008; object-fit:contain }`, `style.css`)
    - vídeo aparece inteiro, sem cortar nada, confirmado por screenshot
    real (texto da pergunta/"Pensando.../resposta todos legíveis).
- **Bug real crítico achado e corrigido - vitrine "sistema simplificado"
  quebrava ao clicar em quase qualquer coisa na tela de Início**: a
  rodada anterior (lote de 18 telas) tinha testado e confirmado
  interatividade real (Estoque +/-), mas **não testou a tela de Início**
  (o pane padrão/primeiro que abre) - ela não fazia parte do lote de 18
  arquivos novos, continua sendo a captura antiga (DOM congelado real do
  sistema, com sidebar e "Acesso rápido" de verdade). Reproduzido o bug:
  clicar em qualquer atalho de "Acesso rápido" (ex: card "CMV") navegava
  o iframe pra `cmv.html` - arquivo que não existe na pasta da vitrine
  (só os arquivos numerados/`vitrine_*.html` existem) - resultado: página
  de erro 404 dentro do frame, vitrine "quebrada" pro visitante, sem
  jeito de voltar sem recarregar a página inteira. Como Início é o
  PRIMEIRO pane que qualquer um vê, isso sozinho já dava a impressão de
  "nada funciona" mesmo com as outras 18 telas funcionando por trás.
  Mesma causa também presente (não testada, mas mesma estrutura) na tela
  de Beneficiamento - também uma captura antiga com sidebar/links reais.
  **Corrigido em todos os 20 arquivos da vitrine** (não só os 2
  afetados, por precaução - as 18 telas novas usam só `href="#"`
  internamente, então o guard não muda nada nelas, mas protege qualquer
  link real que apareça no futuro): script injetado antes de `</body>`
  em cada arquivo (`VITRINE-NAV-GUARD`) que intercepta clique em fase de
  captura - cancela `<a href>` que não seja `#`/`javascript:`/`mailto:`
  ANTES de navegar, e cancela clique em qualquer elemento com
  `onclick="...location.href..."` (ex: o botão "Ver todas" de
  Movimentações recentes) ANTES do handler inline rodar - sem afetar
  nenhuma interação real que já funciona (nenhuma delas mexe em
  `location`). Testado sistematicamente: clique automatizado em todo
  `<a href>` navegável das 20 telas (não só Início) - zero navegação
  disparada em nenhuma; Estoque testado de novo depois do fix pra
  confirmar que o +/- de quantidade continua funcionando normal (25→24).
  Confirmado por screenshot real também (clique na tela, sem quebrar).
- **Pontos de entrada da vitrine continuam removidos** - não mexido
  nesta rodada, o pedido do Carlos foi especificamente sobre
  funcionalidade técnica ("não colocou funcionando"), não sobre
  republicar no site - mesmo entendimento confirmado 2 rodadas atrás.
- `css/style.css?v=12` (bump nas 6 páginas, `js/script.js` não mudou
  nesta rodada).

## Vitrine "Veja por dentro" com as 18 telas interativas de verdade (36
arquivos, escuro+claro) - todo mundo clicável agora, não só as 7 de
antes (18/09/2026)

Carlos mandou uma leva grande nova em `Imagens do Sistema/`
(`vitrine_<tela>.html`/`-branco.html` × 18 telas) e pediu confirmação
de que TODAS as telas da vitrine funcionam de verdade (clicável, JS
rodando, criar/apagar local) igual funcionam no `localhost` dele -
"se não deixar [funcionais], leva o tempo que precisar pra testar".
Ele também colou um prompt técnico (escrito pelo outro chat) explicando
como embutir - `<iframe>` apontando pro `.html`, nunca gerar imagem -
que já é exatamente a técnica que o site usa (`.sys-embed-crop`),
confirma que a abordagem está certa.

- **14 panes existentes trocaram de arquivo estático pra interativo**:
  Estoque, CMV, CMO, CMC, Despesas, Avarias, Ocorrências, Checklists,
  Manutenção, Requisição, Patrimônio, Relatórios (agora "Insights"),
  Configurações (agora especificamente "Setores e categorias") e Caixa
  (atualizado de novo, mesmo arquivo da rodada anterior). Mesmo esquema
  de sempre - sobrescrever o arquivo numerado em `assets/sistema-html/
  vitrine/` (a vitrine referencia por número, então zero mudança de
  HTML pra essas 14) - `19_requisicao.html` também sincronizado de
  volta pra `assets/sistema-html/` (raiz), usado no popup do
  `index.html`. **Bug da rodada anterior (menu lateral incompleto em
  Requisição/Caixa) já veio corrigido no arquivo novo** - conferido de
  novo, os 15 itens batem certinho, não precisou repetir o patch manual
  desta vez.
- **4 panes novas** (não existiam antes): **DRE completa** e **Curva
  ABC** (ganharam item próprio na sidebar da vitrine, entre "Relatórios"
  e "Configurações" - no site principal essas duas são só aba dentro de
  Relatórios, mas aqui, como são telas com interação de verdade,
  mereceram espaço próprio, mesmo raciocínio já usado pro Caixa) +
  **Usuários** e **IA e Termos** (as outras 2 sub-telas de
  Configurações que faltavam - antes só "Setores e categorias" existia
  na vitrine). Sidebar foi de 15 pra 20 itens.
- **Beneficiamento continua sem interação** - não fazia parte deste
  lote (Carlos não mandou `vitrine_beneficiamento.html`), continua com
  o arquivo real-DOM-mas-estático de uma rodada bem anterior. Registrado
  aqui pra não esquecer - se ele quiser essa também interativa, é pedido
  novo pro outro chat, não fabricado aqui.
- **Testado de verdade, não só "carregou"**: os 18 panes confirmados
  com `<script>` de verdade dentro do iframe (via `contentDocument`,
  não só checando que o arquivo abriu) - e mais que isso, **clique real
  testado**: no pane Estoque, cliquei o botão "+" de quantidade de
  verdade (`vitAjustarQtd(6,1)`) e confirmei o número mudando na tela
  (25kg → 26kg) - prova que não é só o script estar presente, a
  interação genuína funciona igual funcionaria pro visitante do site.
  Sidebar com 20 itens ainda rola direito (`scrollHeight` 826 vs
  `clientHeight` 520, testado arrastando). Zero overflow horizontal,
  zero erro no console, popup de Requisição em `index.html` também
  conferido com o arquivo atualizado.
- **Pontos de entrada da vitrine continuam removidos de propósito** -
  Carlos confirmou que tirar os links (rodada anterior) foi a decisão
  certa ("como eu tirei tá bem"); o pedido desta rodada era só sobre a
  QUALIDADE/funcionamento técnico da vitrine em si, não sobre republicar
  ela no site ainda. Quando ele decidir reativar, é só devolver os
  pontos de entrada removidos (ver seção "Veja por dentro tirado do ar"
  mais abaixo) - o conteúdo em si já está pronto/testado.

## Fluxo de setas da Requisição virou vertical, novo prompt pro outro
chat pedir uma captura de Multi-IA com zoom no chat (17/09/2026, mesmo
dia - rodada seguinte)

- **Fluxo de setas da Requisição virou vertical** (Carlos: "de cima pra
  baixo... fica mais cheio a tela, mais organizado") - `.flow-row-
  compact` (`style.css`) virou `flex-direction:column`, a seta
  (`.flow-arrow`) gira 90° via `transform:rotate(90deg)` pra apontar pra
  baixo em vez de pra direita, sem precisar trocar o ícone do Font
  Awesome. Testado via `getComputedStyle` (não deu pra confirmar por
  screenshot nesta rodada - pane não estava compositando frame, sintoma
  já documentado antes nesta sessão) - `flexDirection:"column"` e
  `transform` da seta confirmados aplicados de verdade. `css/
  style.css?v=11`.
- **Multi-IA ainda ilegível mesmo em resolução nativa** - Carlos
  confirmou que o vídeo continua difícil de ler mesmo depois do fix de
  resolução da rodada anterior (o texto do chat é só pequeno demais na
  tela toda, resolução maior sozinha não resolve isso). Pedido dele:
  mandar prompt pro outro chat pedindo uma REGRAVAÇÃO com um zoom de
  verdade dando destaque só na área do chat (cursor sai do Início,
  navega, abre o chat, e a CENA em si dá zoom pra dentro do balão em vez
  de mostrar a tela inteira o tempo todo) - texto ocupa mais pixels de
  verdade na gravação, não só um crop/scale feito depois por CSS. Prompt
  mandado ao Carlos (ver conversa) - aguardando ele repassar pro outro
  chat e mandar de volta.

## Bug real achado - 2 telas novas vieram com o menu lateral incompleto
("parece plano diferente"), Multi-IA em resolução nativa (texto do chat
ilegível antes), Requisições com as setas de volta, "Veja por dentro"
tirado do ar por enquanto (17/09/2026, mesmo dia - rodada seguinte)

Carlos reportou 3 pontos reais:

- **Bug real achado e corrigido - Requisição/Caixa com o menu lateral
  incompleto, "parecia planos diferentes"**: Carlos comparou o cursor
  saindo do Início (overlay) e chegando na Requisição/Caixa e notou o
  menu lateral "perdendo" itens no meio da animação - like a diferença
  entre planos de assinatura. Comparei os `title=` de cada item de menu
  entre arquivos - achado real: **19_requisicao.html e vitrine_caixa.html
  vieram só com 13 itens no menu (faltando "Despesas" e "Patrimônio"),
  enquanto todo o resto do lote (Início e os outros 5 arquivos
  interativos: Estoque, Avarias, Ocorrências, Checklists, Manutenção)
  tem os 15 itens certos** - inconsistência real de captura do outro
  chat, não confusão do Carlos. Corrigido sem precisar de nova captura:
  reconstruí os 2 itens de menu faltando (mesmo ícone/texto/posição,
  copiados de um arquivo que já tinha o menu completo) direto no HTML
  dos 4 arquivos afetados (`19_requisicao.html`/`-branco` na raiz E na
  pasta `vitrine/`, `vitrine_caixa.html`/`-branco`) - confirmado que os
  15 itens batem exatamente com o Início nos 4 arquivos agora, testado
  no popup do site e na pane da vitrine.
- **Multi-IA: texto do chat estava ilegível** (Carlos: "não dá pra ler
  direito, tá muito mal nítido"). Causa real: a conversão anterior
  reduzia a resolução de 3360x2100 (2x, o tamanho real da gravação) pra
  1680x1050 (1x, o padrão do resto do site) - texto de chat já é pequeno
  por natureza, perder metade da resolução antes mesmo de qualquer
  encolhimento de exibição deixava ilegível. Corrigido gerando o vídeo
  na resolução NATIVA (3360x2100, sem `scale` nenhum no ffmpeg) + CRF
  mais baixo (16 no H.264, 20 no VP9 - menos compressão, mais qualidade)
  - arquivo ficou maior (~145KB → ~500-700KB), aceitável pra um vídeo
  decorativo que só carrega quando a seção entra em vista. Testado:
  `video.videoWidth`/`videoHeight` confirmam 3360x2100 de verdade
  carregado no navegador (não é só o arquivo grande, é a resolução real
  em tela), decodificação limpa nos 4 arquivos (`.mp4`/`.webm` × claro/
  escuro).
- **"Veja por dentro" (sistema simplificado) tirado do ar por pedido do
  Carlos** ("deixa de fora dessa versão, vamos ajeitar ela depois, por
  agora deixa sem") - a vitrine ainda não convenceu (telas pequenas/
  bug do menu incompleto acima, mesmo depois de 2 rodadas de ajuste).
  Removidos todos os pontos de entrada: a seção `#veja-por-dentro-
  teaser` inteira (`index.html`, ficava entre Multi-IA e Segurança), o
  botão "Conhecer o sistema" do CTA final, e o link "Conhecer o
  sistema" do rodapé nas 6 páginas. **`conheca-o-sistema.html` e todo o
  código (CSS/JS) continuam intactos no repo** - só ficou inacessível
  pela navegação normal do site, igual o padrão já usado pro splash
  cinematográfico (`## Splash desativado`) - reativar é só devolver os
  pontos de entrada removidos (comentário deixado em `index.html`
  indicando onde). A própria página ainda funciona se alguém acessar a
  URL direto, só não tem mais link levando lá.
- **Requisições ganhou de volta o fluxo de setas** (Carlos: "no texto
  da requisição tu podia manter aquelas informações só setas") - a
  troca pra tela real da rodada anterior tinha derrubado o diagrama
  "Setor solicita → Estoque recebe → Atendimento → Histórico" de vez.
  Devolvido como um resumo compacto (`.flow-row-compact`, `style.css`)
  dentro da coluna de TEXTO do popup, abaixo do parágrafo - a tela real
  continua sendo o visual principal, o fluxo de setas virou um
  complemento menor ao lado, não mais o visual sozinho.
- Testado com servidor local: os 4 arquivos com menu corrigido
  conferidos (15 itens, ordem certa) no popup e na vitrine, vídeo do
  Multi-IA confirmado em 3360x2100 real no navegador, seções do
  `index.html` sem `#veja-por-dentro-teaser` (Multi-IA emenda direto
  com Segurança), fluxo de setas de Requisição visível junto com a tela
  real, zero erro no console. `css/style.css?v=10` (bump nas 6
  páginas) - `script.js` não mudou nesta rodada.

## Beneficiamento ganhou de volta o cursor "vem do Início" (funcionava
com GIF só decorativo), cursor tirado da Segurança (perdido/sem função),
Multi-IA não desacelera mais (ficava "robótico"), GIF do Beneficiamento
sem pulo, vitrine sem zoom e bem maior (menos borrada), Requisições
ganhou tela real (17/09/2026, mesmo dia - rodada seguinte)

Carlos testou de novo e trouxe 5 pontos reais:

- **Bug real corrigido - cursor do Beneficiamento "não ia e tava
  travado"**: a rodada anterior trocou o `.sys-embed` do Beneficiamento
  por um `<img>`/GIF puro - `attachDemoCursor()` exigia `.sys-embed` pra
  montar QUALQUER coisa além do clique decorativo simples, então o
  cursor ficava parado num ponto fixo sem eira nem beira (sem crossfade,
  sem ir a lugar nenhum) - exatamente "travado". Carlos esclareceu o que
  queria: a MESMA narrativa "vem do Início, clica, revela" que toda
  outra tela do site tem, mesmo essa sendo GIF/vídeo. Implementado via
  `data-cursor-target-title="Beneficiamento"` no `.screenshot-frame`
  (`index.html`) - `attachDemoCursor` agora aceita esse atributo como
  alternativa ao `BEFORE_FILE` (que só existe pra telas com `.sys-embed`
  próprio): sempre usa o Início como overlay e `getEmbedNavPoint` busca
  o alvo por `.nav-item[title="Beneficiamento"]` em vez de `.active` (o
  Início nunca marca outra tela como ativa, só ele mesmo - por isso
  precisa ser por `title=`, não por `.active`). Funciona em claro e
  escuro de graça, sem lógica extra - o overlay é um `.sys-embed` normal,
  então `applySysTheme()` já cobre ele igual cobre qualquer outro.
- **Cursor tirado da Segurança** (Carlos: "o cursor tá perdido, tá
  fazendo nada") - o vídeo real da Segurança já mostra a navegação de
  verdade (Início→Configurações→Ativar→QR) dentro da própria gravação;
  um cursor sintético por cima, sem sincronia nenhuma com o que o vídeo
  está mostrando, só confundia. Removido da lista de frames que ganham
  cursor (`#seguranca` entrou na mesma exceção que `#multi-ia` já
  tinha - grava real com navegação própria não precisa de cursor
  decorativo por cima).
- **Multi-IA não desacelera mais** - Carlos: "alguns gifs como o do
  Multi-IA tá muito travado". Causa real: a gravação já tem o PRÓPRIO
  ritmo (digitação char-a-char a cada ~0.05-0.09s + pausa real de
  "pensando") - aplicar o mesmo `playbackRate:0.55` que ajudou a
  Segurança (que é só 3 fotos/slides, sem nada rápido dentro de cada
  uma) piorou o Multi-IA: esticar um incremento que já é rápido/discreto
  só torna cada letra mais perceptível/robótica, o oposto de "fluido".
  Removido - roda no 1x nativo da gravação agora, só a Segurança
  continua desacelerada.
- **GIF do Beneficiamento também ficou de vídeo, com o pulo suavizado**:
  a gravação original só tinha 6 frames espalhados em menos de 1s
  (limitação real da ferramenta de captura em 2x, não do sistema - o
  outro chat já tinha avisado disso) - dava um "pulo" visível entre os
  frames. Suavizado com interpolação de movimento (`ffmpeg
  minterpolate`, calcula frames de verdade EM CIMA dos 6 originais, não
  só duplica) - funciona bem aqui porque o conteúdo é uma barra/rosca
  crescendo (mudança geométrica simples, ótimo caso pra interpolação -
  diferente de texto, que borraria feio). Convertido pra `.mp4`/`.webm`
  igual os outros - **achado repetido nesta rodada**: minterpolate por
  si só não segura o frame final até o fim da duração real do GIF (2ª
  vez que esse bug aparece, depois da Segurança) - corrigido com
  `tpad=stop_mode=clone` (segura o último frame pronto por mais tempo
  em vez de cortar cedo). `abrirModal()` ganhou suporte a `<video>`
  lazy (`source[data-src]`, mesmo princípio do `img`/`iframe` de
  sempre) - a Beneficiamento agora carrega/toca o vídeo só na primeira
  abertura do popup.
- **Vitrine "Veja por dentro" sem zoom, bem maior** (Carlos: "tudo tá
  tão distante que borra, mal nítido... faz ele ficar maior") - achado
  real fazendo as contas: o `zoom:.55` embutido nos arquivos (fix de uma
  rodada anterior) + o encolhimento residual pra caber no `.container`
  de 1200px do site deixava o resultado final PEQUENO DEMAIS pra ler
  confortavelmente - reduzir demais sempre lê como "borrado" pro olho
  humano, zoom ou não (zoom resolve NITIDEZ na escala que renderiza, não
  resolve TAMANHO pequeno). Removido o zoom dos 22 arquivos de
  `assets/sistema-html/vitrine/` (voltam a rodar no tamanho nativo real,
  1680px) e dado um `.container` bem mais largo só nessa página
  (`.app-mode .container { max-width:1800px }`, `width:auto` já limita
  sozinho ao que a tela permitir, sem risco de overflow em tela menor) -
  o `transform:scale` residual que `mountSysEmbeds` calcula (que é o que
  realmente controla nitidez, escala~1 = nítido) ficou bem mais perto de
  1:1: **0.99 numa tela de 1920px** (praticamente nativo), **0.78 num
  laptop de 1440px** (contra ~0.64 de antes, considerando o zoom
  embutido) - testado sem overflow em 375px (mobile) também.
- **Requisições ganhou tela real + cursor** (Carlos: "já que todos têm
  uma imagem, pode fazer assim em Requisição também, com a animação do
  cursor") - o `.module-modal-visual-flow` (texto/setas) virou
  `.screenshot-frame`/`.sys-embed` igual todas as outras, usando o
  arquivo `19_requisicao.html` (a versão interativa nova, mesma família
  de arquivo que já tinha `.nav-item.active[title="Requisição"]` marcado
  de verdade) - ganhou `BEFORE_FILE` (`19_requisicao.html →
  09_inicial_dashboard.html`, mesmo padrão "vem do Início" de todo
  mundo) e cursor de graça, sem precisar de código novo (esse caso já é
  o caminho normal - `.sys-embed` com `.nav-item.active` de verdade).
  `.module-modal-visual-flow`/`.flow-row` (CSS) ficaram sem nenhum uso
  em `index.html` depois disso - não removidas nesta rodada (não pedido,
  risco baixo deixar).
- **Sobre "algo funcionando, tipo criar item no estoque"**: as 7 telas
  interativas da vitrine (rodada anterior) já têm interação de verdade
  reaproveitando componentes reais - conferido que Estoque especificamente
  tem um `+`/`-` de quantidade que atualiza status "OK"/"Ausente" na
  hora (não é literalmente "criar item novo", mas é a mesma categoria de
  "algo funcionando por tela" que o Carlos pediu como alternativa
  ("ou algo em cada tela")) - registrado aqui pra não fingir que existe
  algo que não existe: se ele quiser especificamente um fluxo de
  "criar item novo", é pedido novo pro outro chat, não fabricado aqui.
- Testado com servidor local: cursor do Beneficiamento mostrando Início
  como overlay e mirando "Beneficiamento" por `title=` de verdade
  (conferido via `contentDocument`), Segurança sem `.demo-cursor`,
  Multi-IA com `playbackRate` 1, Requisições com tela real + overlay do
  Início + cursor, toggle de tema trocando os dois corretamente, vitrine
  sem overflow em 1920/1440/375px, zero erro no console. `js/
  script.js?v=12`, `css/style.css?v=9` (bump nas 6 páginas).

## Segurança e Multi-IA viraram vídeo de verdade (não mais HTML congelado
nem GIF), cursor de volta na Segurança, Beneficiamento com a animação
certa (gráfico crescendo, não tutorial), 7 telas interativas de verdade
na vitrine "Veja por dentro" (17/09/2026, mesmo dia - rodada seguinte)

Carlos testou a rodada anterior e trouxe feedback + o outro chat mandou
mais uma leva de ativos:

- **Bug real corrigido - Segurança tinha perdido o cursor de
  demonstração**: a rodada anterior trocou o `.sys-embed`/iframe da
  Segurança por um `<img>` (GIF) - `attachDemoCursor()`
  (`js/script.js`) sempre exigia `frame.querySelector('.sys-embed')`
  logo no início (`if (!mainEmbed) return null`), então qualquer frame
  sem iframe simplesmente não ganhava cursor nenhum. Corrigido:
  `mainEmbed` agora é opcional - se não existir, a função pula a parte
  de achar tela "antes"/overlay (não tem tela pra trocar mesmo, é uma
  gravação real) mas continua construindo o cursor decorativo (clique +
  ripple) normalmente, com fallback pro ponto fixo de sempre já que não
  tem `.nav-item.active` pra ler de um iframe que não existe.
- **Segurança e Multi-IA viraram vídeo de verdade, não mais imagem/HTML
  estático** - dois problemas puxaram essa mudança:
  1. Segurança: Carlos pediu "deixa mais lento" no GIF novo. GIF não
     tem `playbackRate` (só vídeo tem) - convertido pra `.mp4`/`.webm`
     com `ffmpeg` (instalado via npm numa pasta de scratch isolada,
     mesmo padrão de sempre - nada entrou no repo). **Achado real
     convertendo**: o GIF só tem 3 frames de verdade (0s/1.5s/3.2s,
     mas dura 6.8s no total - o último frame fica "segurando" até o
     fim) - convertido direto, o vídeo saía cortado em ~4.6s (perdia o
     "segurar" do frame final, que não existe como conceito em vídeo
     comum). Corrigido forçando `fps=10` no filtro de vídeo do ffmpeg -
     isso duplica o último frame decodificado até completar a duração
     real do GIF, resultado bateu exato (6.80s nos dois). Arquivo
     também ficou ~70% menor que o GIF (600KB → ~180KB).
  2. Multi-IA: a versão anterior (`08_multi_ia_chat.html`, DOM
     congelado) saía **sem nenhuma animação** - Carlos reportou "não
     tem mais a animação". Causa óbvia em retrospecto: é uma captura
     zero-JS (a técnica inteira do site depende disso), então a
     digitação/"pensando"/resposta do chat (que É JS) nunca rodava -
     virava só uma foto do estado final. O outro chat mandou uma
     GRAVAÇÃO real (`multi_ia_cmv.gif`, pergunta digitada + "pensando"
     + resposta, com o gráfico de Evolução do CMV real ao fundo) -
     convertido pro mesmo padrão vídeo (`ffmpeg`, `fps=15`, já que essa
     tinha frames bem mais regulares que a da Segurança, sem o mesmo
     bug de duração) - 785KB → ~145KB.
  - `playbackRate = 0.55` (mesmo valor de sempre) aplicado nos dois
    vídeos novos - reaplicado também no evento `loadedmetadata` porque
    `applySysTheme()` chama `video.load()` ao trocar de tema, que reseta
    a taxa pro padrão (1x) - sem isso, o vídeo voltava a ficar rápido
    depois de qualquer troca claro/escuro.
  - `applySysTheme()` (`js/script.js`) ganhou suporte a `video.sys-theme-
    video` - troca `poster` + cada `<source>` filho e chama `.load()` pra
    o navegador reavaliar os formatos com as URLs novas. `sysThemeSrc()`
    também passou a reconhecer `.mp4`/`.webm`/`.jpg` (antes só `.html`/
    `.gif`). **Nomenclatura dos posters ajustada**: o `-branco` precisa
    ficar bem antes da extensão (`nome_poster-branco.jpg`), não no meio
    (`nome-branco_poster.jpg`, como o ffmpeg gerou por padrão) - a regex
    de troca de tema procura `-branco` colado na extensão, renomeado os
    2 arquivos gerados errado antes de usar.
- **Beneficiamento: a "animaçãozinha natural do sistema" era outra
  coisa** - Carlos esclareceu depois de ver o resultado: não era o
  tutorial/destaque de onboarding (que eu tinha usado na rodada
  anterior), era a **entrada do gráfico** (barras + rosca crescendo de
  verdade via Chart.js, ~1s) que toca quando a tela carrega. O outro
  chat gravou essa animação certa (`beneficiamento_entrada.gif`,
  ~200KB, pequeno o bastante pra não precisar converter pra vídeo) -
  substituiu o DOM congelado com tutorial no popup do `index.html`.
- **Vitrine "Veja por dentro" ganhou 7 telas com interação genuína de
  verdade** (pedido do Carlos numa rodada anterior: "sistema
  simplificado melhor... nada funcional de verdade mas algo pro cliente
  clicar, testar botões" - prompt mandado pro outro chat). Entregou:
  Requisição (troca de status reordena/recalcula, clique abre painel
  lateral real), Manutenção (troca de status + excluir com fade),
  Avarias (abre painel, marca resolvida, comenta na hora), Caixa
  (calcula diferença de caixa de verdade a partir do valor contado) +
  Checklists/Ocorrências/Estoque (já pedidos antes). Todos HTML/CSS/JS
  puro, zero backend, reaproveitando os componentes REAIS do sistema
  (não inventados). Integração:
  - **6 telas substituem o pane existente** (Checklists=17, Ocorrências=
    16, Estoque=10, Requisição=19, Manutenção=18, Avarias=15) - como o
    HTML da vitrine já referencia esses arquivos por número
    (`assets/sistema-html/vitrine/{N}_{nome}.html`), bastou SOBRESCREVER
    o conteúdo desses arquivos (com o zoom `html{zoom:.55}` reinjetado,
    mesma técnica de sempre pra manter nítido) - **zero mudança de HTML/
    JS** pra essas 6, a vitrine já carrega a versão interativa nova sem
    saber que mudou.
  - **Caixa é pane NOVA** (não existia na vitrine - no sistema real é
    aba dentro de CMC, mas aqui ganhou espaço próprio já que é uma das
    telas com interação de verdade) - novo `data-pane="caixa"` somado
    ao `<nav>` da sidebar (`conheca-o-sistema.html`, ícone de gaveta de
    caixa) e a `.sys-pane` correspondente, arquivo salvo como
    `vitrine_caixa.html` (não tinha número - não é uma das 21 telas
    numeradas do lote original). JS de troca de pane já era 100%
    genérico (`document.querySelectorAll('.nav-item')`/`.sys-pane`
    casando por `data-pane`) - não precisou de nenhuma mudança em
    `script.js` pra essa pane nova funcionar.
- **Testado com servidor local real**: cursor confirmado de volta na
  Segurança, `playbackRate` 0.55 nos 2 vídeos, popup de Beneficiamento
  mostrando o GIF novo (e trocando pra `-branco` certo no toggle de
  tema), pane Caixa nova carregando com `<script>` de verdade
  (confirmado via `iframe.contentDocument`), pane Checklists carregando
  a versão interativa nova (título "(demonstração)", presença de
  `<script>` - a antiga não tinha), zero erro no console em `index.html`
  e `conheca-o-sistema.html`. `js/script.js?v=11`, `css/style.css?v=8`
  (bump nas 6 páginas). GIFs antigos da Segurança/Multi-IA em
  `assets/sistema/` apagados (substituídos pelos vídeos, zero referência
  sobrando) - os `.gif` do Beneficiamento e os vídeos velhos do Multi-IA
  (`multi_ia_chat_fullpage.*`, órfãos desde a rodada anterior) não foram
  tocados.

## Cursor sempre parte do Início, novos ativos do outro chat integrados
(GIF real da Segurança, Multi-IA virou HTML ao vivo, Beneficiamento/
Avarias com gráfico corrigido, tutorial do Beneficiamento), alternância
claro/escuro nas telas do sistema (17/09/2026, mesmo dia - rodada
seguinte)

- **Lógica do cursor de demonstração mudou de "tela anterior na
  sidebar" pra "sempre parte do Início"** (Carlos: "todas as imagens
  começam na tela de início, e dela vai pra tela [...] agora tem
  algumas que não tem como, exemplo DRE ou curva ABC, tela de relatório
  e daí sim pras telas já que é uma aba da tela"). `BEFORE_FILE`
  (`js/script.js`) reescrito: toda tela agora mostra Início
  (`09_inicial_dashboard.html`) como "antes", cursor clica no item da
  sidebar, crossfade revela a tela de verdade - **exceto** as 4 telas
  que são ABA de outra tela, não item de sidebar próprio (Caixa mora
  dentro de CMC, DRE e Curva ABC moram dentro de Relatórios, 2FA mora
  dentro de Configurações) - essas continuam mostrando a tela MÃE como
  "antes" (não dá pra chegar nelas com 1 clique direto do Início).
  Nenhum arquivo novo precisou ser pedido - os arquivos já existiam
  todos localmente.
- **Ativos novos do outro chat (relatados pelo Carlos) integrados**:
  1. **Segurança ganhou o GIF real de navegação** (`seguranca_2fa_fluxo
     .gif`/`-branco.gif`, ~600KB) mostrando Início → clica em
     Configurações → chega no Perfil/Segurança → clica Ativar → QR
     abre - substituiu o `.sys-embed` estático que só mostrava a tela
     final parada. Trocado por `<img class="sys-theme-img">` dentro do
     mesmo `.screenshot-frame` de sempre (a proporção do GIF, 3360×2100,
     bate exato com 1680/1050 - sem corte de `object-fit:cover`).
  2. **Multi-IA virou tela real em HTML** (`08_multi_ia_chat.html`, fundo
     CMV com o gráfico de Evolução visível) no lugar do vídeo
     (`multi_ia_chat_fullpage.mp4/webm`) - virou `.sys-embed` igual as
     outras telas, nítido em qualquer zoom, sem precisar de gravação.
     Removido o código morto que ajustava `playbackRate` do vídeo
     antigo (`#multiIaVideo` não existe mais). **Os arquivos antigos do
     vídeo (`multi_ia_chat_fullpage.mp4/.webm/_poster.jpg`) não foram
     apagados** (mesma regra de sempre - não remover asset sem pedido
     explícito), ficaram só sem uso.
  3. **Beneficiamento e Avarias tinham gráfico em branco** - bug real
     achado pelo outro chat: as duas telas desenham o gráfico com
     Chart.js num `<canvas>`, e canvas é só pixel puro (nunca aparece
     no `outerHTML`) - toda captura congelada dessas duas telas (escuro/
     claro) saía com o gráfico vazio. Corrigido convertendo o canvas
     pra imagem antes de congelar. Arquivos trocados no repo
     (`assets/sistema-html/14_beneficiamento.html`/`15_avarias.html` +
     os `-branco`).
  4. **Beneficiamento ganhou a animação de tutorial de verdade**
     (pedido do Carlos: "o beneficiamento tem uma animaçãozinha [...]
     é natural do sistema") - usada a variante SEM blur no fundo (o
     outro chat mandou as duas, com/sem `backdrop-filter:blur(2px)` no
     `.tutorial-overlay` - o produto real usa COM blur de propósito,
     mas a versão sem fica melhor pra imagem de marketing/demonstração,
     decisão tomada aqui sem precisar perguntar de novo - se o Carlos
     preferir a versão com blur, é só trocar o arquivo).
- **Alternância claro/escuro nas telas do sistema, pedida pelo Carlos**
  ("todas as telas tem um modo claro e escuro então faz algo bacana") -
  as 23 telas de origem sempre tiveram par claro/escuro, só nunca
  tinham sido copiadas/usadas (pendência registrada desde 11/09/2026).
  Botão novo (`#sysThemeToggle`, ao lado do texto "Mais funcionalidades
  / E ainda tem mais" em `#modulos`, exatamente onde o Carlos sugeriu)
  alterna TODAS as telas do sistema embutidas no site (não só
  `#modulos` - o site inteiro: Estoque/CMV/Segurança/Multi-IA inline +
  os popups de módulo) entre claro e escuro de uma vez. **Implementação
  sem precisar editar atributo nenhum em cada `<iframe>`/`<img>` do
  HTML**: a convenção de nome (`X.html`↔`X-branco.html`,
  `X.gif`↔`X-branco.gif`) já garante a contraparte - `applySysTheme()`
  (`js/script.js`) só troca `src`/`data-src` de todo `.sys-embed`/
  `.sys-embed-crop iframe` e `img.sys-theme-img` do documento pelo nome
  com/sem `-branco`. **Sem persistência entre visitas de propósito**
  (volta pro escuro a cada carregamento de página) - o site não usa
  nenhum tipo de armazenamento local hoje (ver `privacidade.html`), e
  adicionar `localStorage` só pra lembrar esse toggle exigiria mexer
  nesse texto legal de novo por um ganho pequeno.
  - **Ajuste de theme-safety em `attachDemoCursor`**: a tela "antes"
    (crossfade) é escolhida a partir do `BEFORE_FILE`, que só tem
    entrada pelo nome ESCURO - se um popup for aberto pela PRIMEIRA vez
    já com o tema claro ativo (usuário clicou no toggle antes de nunca
    ter aberto aquele card), a busca precisa normalizar o nome (tirar
    `-branco`) antes de consultar o mapa, e recolocar o sufixo claro no
    resultado - sem isso, a tela "antes" simplesmente não aparecia
    nesse cenário específico (achado e corrigido nesta mesma rodada,
    testado abrindo popup direto em tema claro).
  - **Escopo, por decisão de tempo/risco**: só o site principal
    (`index.html`) - a vitrine "Veja por dentro"
    (`conheca-o-sistema.html`) usa arquivos com `zoom` já embutido
    (`assets/sistema-html/vitrine/`, técnica própria pra ficar nítida,
    ver seção mais abaixo) e teria que ganhar uma segunda leva de
    cópias com zoom+claro pra funcionar - fica de fora por ora, não
    pedido explicitamente.
- Testado com servidor local real (`npx serve`, `.claude/launch.json`) -
  toggle trocando `src`/`data-src` de telas inline, telas em popup (lazy)
  e a tela "antes" do crossfade corretamente nos três casos; conferido
  via JS dentro do iframe que a animação de tutorial do Beneficiamento
  está de verdade ativa (`.tutorial-alvo-destaque` presente,
  `.tutorial-overlay.show`) e que o gráfico saiu como imagem (não
  canvas vazio); os 3 casos de aba (Caixa/DRE/Curva ABC) conferidos
  mostrando a tela MÃE certa (CMC/Relatórios) como "antes", não mais
  Início; zero 404 nos assets novos, zero erro real no console. `js/
  script.js?v=10`, `css/style.css?v=7` (bump nas 6 páginas).

## Ideia futura registrada - site vira "hub" de múltiplos sistemas, cada
um com o próprio site/aba própria (17/09/2026, nada implementado)

Carlos deixou claro que isso é **futuro**, só pra guardar - não mexer
em nada disso sem pedido explícito. Visão: a empresa vai vender mais de
um sistema no futuro (hoje só o GestãoCheck). Quando isso acontecer, o
site ATUAL (gestaocheck.tech) deixaria de ser "o site do produto" e
viraria uma TELA/aba dentro de um site maior, tipo hub - um site novo,
mais institucional, mostrando "quem somos" + quais sistemas a empresa
oferece (ex: 3 sistemas) - e cada sistema teria a própria "aba"/site
dedicado (o gestaocheck.tech de hoje seria uma dessas abas), com tudo
que esse site já tem hoje (planos, telas reais, etc.) mais informação
tipo "versão" do sistema. Nenhum desenho técnico ainda (não decidido:
domínio do hub vs subdomínio por sistema, se é multi-site ou multi-
seção, como o hub referencia cada site de produto) - só registrado pra
não perder a ideia quando a empresa realmente tiver mais de 1 sistema
pra vender. Não começar a implementar isso sem alinhar com o Carlos
primeiro quando chegar a hora.

## Vídeo do Multi-IA mais devagar, scroll animado de volta em saltos
grandes, crossfade de tela-pra-tela restaurado, cursor de Caixa/DRE/
Curva ABC clica na aba certa, vitrine nítida de novo, Beneficiamento
ganhou tela real (17/09/2026)

Carlos testou a rodada anterior e trouxe 6 pontos reais:

- **Vídeo do Multi-IA mais devagar**: "muito rápido e travado, tem que
  ser bem mais devagar". `<video id="multiIaVideo">` ganhou
  `playbackRate = 0.55` via JS (`script.js`) - não precisa re-exportar
  o arquivo, é só velocidade de reprodução nativa do `<video>`.
- **Bug real corrigido - scroll sem animação em saltos grandes** (ex:
  clicar na logo vindo do fim da página): o `isBigJump`/
  `immediate:true` (pulo seco pra saltos >3 telas) - fix de uma rodada
  bem anterior pra um travamento real que foi reproduzido várias vezes
  - foi **removido**. Motivo: as duas otimizações feitas DEPOIS daquele
  travamento original (cenas 3D só renderizam quando visíveis via
  `IntersectionObserver`, e a maioria do conteúdo pesado - popups,
  telas da vitrine - só carrega sob demanda) parecem ter resolvido a
  causa raiz de verdade. Testado de forma confiável (não via contagem
  de frames de rAF, que esta sessão já documentou ser furada no
  ambiente de teste - via `PerformanceObserver({entryTypes:
  ['longtask']})`, que mede trava de main thread de verdade,
  independente de renderização visual): forcei um scroll animado
  completo do fim ao início da página (mesmo cenário do bug original) e
  **zero tarefa longa** apareceu. Se o travamento voltar a acontecer de
  verdade num navegador real (não só no ambiente de teste), a
  resincronização Lenis/scroll nativo (`force:true`, um bug DIFERENTE)
  continua intacta - não tem relação com essa mudança.
- **Cursor de demonstração ganhou de volta a troca de tela** (Carlos:
  "não tem a animação de antes, que de uma tela ia pra tela
  apresentada") - novo `BEFORE_FILE` (`script.js`) mapeia cada tela pra
  a tela "anterior" na ordem real da sidebar (ex: Estoque vem de
  Início, CMV vem de Estoque...) - mas agora com uma SEGUNDA TELA VIVA
  (`.sys-embed` clonado, não mais uma screenshot raster) cobrindo a
  tela de verdade e sumindo (crossfade) no momento do clique, revelando
  a tela real por baixo - mesма sensação de "navegou de uma tela pra
  outra" de antes, só que com DOM congelado nítido dos dois lados.
  Reaproveita os arquivos que já tinham sido copiados pra vitrine (não
  precisou pedir nada novo).
- **Bug real corrigido - cursor de Caixa/DRE/Curva ABC clicava na tela
  mãe (CMC/Relatórios), não na aba de verdade**: achado real inspecionando
  os arquivos congelados - `04_caixa_fechamento.html` já vem com
  `<button class="secao-tab active" id="tabBtnCaixa">Caixa</button>`
  marcado, e `02_dre_completa.html`/`03_curva_abc.html` com
  `<button class="tab active" id="tabBtnDre">`/`id="tabBtnCurvaAbc"` -
  ou seja, o próprio arquivo congelado já sabia qual aba estava aberta,
  só ninguém tinha usado essa informação. `getEmbedNavPoint()` agora
  aceita um `data-cursor-tab="true"` no `.screenshot-frame` (somado nos
  3 popups certos, `index.html`) que troca a busca de `.nav-item.active`
  (sidebar) pra `.tab.active, .secao-tab.active` (a aba de verdade) -
  **cuidado**: quase toda tela tem uma dessas classes marcando a PRÓPRIA
  aba padrão (ex: Estoque marca "Verificação", CMC marca "Visão Geral")
  - por isso isso não virou o comportamento padrão geral, só os 3 casos
  que realmente precisam (`data-cursor-tab`).
- **Vitrine "sistema simplificado" ficou nítida de novo** (Carlos:
  "parece que só colocou a imagem, fica feio... quero algo mais real").
  Achado real: o `<iframe>` sempre rodava no tamanho NATIVO (1680px) e
  só a APARÊNCIA era encolhida via `transform:scale()` (~0.5-0.6 aqui,
  a vitrine é bem menor que a moldura de screenshot normal) -
  `transform:scale` encolhe um raster JÁ desenhado, deixando o texto
  com uma leve borradura visível (mesmo efeito de encolher um print
  grande) - bem diferente do HTML/CSS que a vitrine tinha antes
  (escrito à mão já no tamanho final, sempre nítido). **Corrigido sem
  reescrever a vitrine inteira à mão de novo**: criadas cópias dos 15
  arquivos com `html{zoom:.55}` injetado (`assets/sistema-html/vitrine/`,
  script Node ad-hoc, não faz parte do repo/build) - `zoom` (diferente
  de `transform`) faz o navegador RENDERIZAR de novo no tamanho final
  (como um zoom de página de verdade), não esticar um bitmap pronto -
  fica nítido, e o CSS responsivo por dentro da página congelada
  continua "enxergando" 1680px (zoom não muda a largura que o layout
  interno percebe, só o tamanho físico renderizado). Com o zoom já
  embutido no arquivo, o `<iframe>` roda direto perto do tamanho final
  (`VITRINE_NATIVE_W = 1680*.55 = 924px`) - o `transform:scale` que
  sobra em `mountSysEmbeds` é só um ajuste fino pra bater com a largura
  exata da moldura (testado: `scale≈0.86` numa tela comum, contra
  `~0.5-0.6` de antes - bem mais perto de 1:1, bem menos perceptível).
  Testado clicando em várias telas (Início, Estoque) - nítido, sem
  sidebar duplicada, zero erro no console, sem overflow em mobile.
- **Análise real: o que falta pra completar as animações de cursor**
  (Carlos pediu pra listar exatamente o que precisa pedir pro outro
  chat) - só sobrou 1 pendência de verdade: uma tela própria pra
  "Segurança" (a seção inline de `index.html` mostra 2FA, que fica
  dentro de Configurações no sistema real - `07_2fa_qrcode.html` não
  tem nenhum indicador de aba/seção "Segurança" ativa que dê pra usar
  pra posicionar o cursor com precisão, diferente de Caixa/DRE/Curva
  ABC que já tinham `.tab.active` pronta) - prompt exato mandado pro
  Carlos pedir pro outro chat, esperando ele mandar de volta.
  **Beneficiamento resolvido na rodada seguinte** (ver abaixo) - não
  precisou de tela nova, o arquivo já tinha sido copiado pra vitrine.
- **Pendente, não implementado ainda - alternância claro/escuro**:
  Carlos perguntou se eu queria "por outras animações" - sugeriu um
  botão de alternar claro/escuro perto do texto "Mais funcionalidades /
  E ainda tem mais." (`#modulos`), do lado ou dentro de cada card. As
  versões `-branco` (tema claro) das 23 telas EXISTEM na pasta de
  origem (geradas junto com as escuras, nunca copiadas pro repo por
  falta de uso - ver "GIF claro do Multi-IA... não foi integrado" numa
  seção anterior) - dá pra fazer sem pedir nada novo. Não implementado
  nesta rodada (o resto do pedido já era grande o bastante) - fica
  como próximo passo se o Carlos confirmar que quer.
- Testado de ponta a ponta com Docker real: `?v=8` (JS)/`?v=6` (CSS) -
  versão bumpada de novo (3 rodadas de mudança em sequência nesta
  mesma conversa), zero erro nas 6 páginas, crossfade conferido via
  DOM (`overlay opacity 1→0` ao avançar a timeline), cursor de
  Caixa/DRE/Curva ABC conferido clicando na aba certa de verdade.
- **Beneficiamento ganhou tela real** (Carlos: "eu queria que a tela de
  beneficiamento existisse") - não precisou pedir nada novo: o arquivo
  `14_beneficiamento.html` já tinha sido copiado numa rodada anterior
  (usado só na vitrine até então). Popup de `index.html` trocou
  `.module-modal-visual-flow`/`.flow-row` (texto puro) por
  `.screenshot-frame`/`.sys-embed` igual as outras telas - ganhou
  cursor de demonstração e crossfade também (`BEFORE_FILE` ganhou
  `14_beneficiamento.html: 06_despesas.html`, seguindo a ordem real da
  sidebar). Requisições continua com `.module-modal-visual-flow` (não
  foi pedido, e não tem tela própria copiada ainda) - CSS do flow não
  foi removido, ainda em uso ali. `?v=9` (JS, bumpado de novo). Testado:
  popup abre com a tela real, crossfade correto (mostra Despesas antes,
  troca pra Beneficiamento), zero erro no console nas 6 páginas.

## Auditoria geral pós-DOM-congelado: cursor conferido em todos os 13
lugares, 2 textos legais desatualizados corrigidos, mobile ajustado
pras telas reais, comparação com concorrente (16/09/2026, mesmo dia -
rodada seguinte)

Carlos pediu uma auditoria completa em cima de tudo que mudou: cursor
apontando certo, textos batendo com a realidade, algo pra cortar (site
não ficar grande demais), animação pra melhorar, mobile ajustado (a
tela é menor, "algumas coisas tem que ficar diferente"), e comparação
final com os concorrentes.

- **Cursor conferido nos 13 lugares de verdade** (não só Estoque, que já
  tinha sido testado na rodada anterior) - script abriu cada um dos 10
  popups de módulo + os 3 inline (Estoque/CMV/Segurança) e leu
  `.nav-item.active` de dentro do iframe de cada um. Resultado: **os 13
  encontram o item certo**, inclusive nos casos "indiretos" que o
  sistema antigo (`TAB_DEMOS`) tratava como caso especial - Caixa aponta
  pra "CMC" (Caixa é aba dentro de CMC, então o item ativo de verdade na
  sidebar É "CMC" - correto!), DRE e Curva ABC apontam pra "Relatórios"
  (mesma lógica), Segurança (2FA) aponta pra "Configurações" (2FA vive
  dentro de Configurações no sistema real). Isso é mais preciso que o
  sistema antigo, que precisava de tabela `TAB_DEMOS` hard-coded pra
  cobrir esses 3 casos - agora sai de graça, é só o que o DOM real diz.
- **2 textos legais desatualizados corrigidos** (achados nesta
  auditoria, não reportados pelo Carlos - inconsistência real entre o
  texto e o site de verdade):
  1. `privacidade.html`/`termos.html` ainda falavam em "screenshots"/
     "capturas de tela" e "GIFs" pra descrever as telas do sistema -
     desatualizado em dois sentidos (o GIF do Multi-IA virou vídeo
     14/09, e agora metade das telas são DOM congelado incorporado, não
     mais imagem estática). Reescrito pra "capturas do próprio sistema
     real, em imagem ou incorporadas diretamente" + "vídeo de
     demonstração", sem mentir sobre o mecanismo.
  2. `privacidade.html` tinha um parágrafo inteiro ("Dados no seu
     navegador") dizendo que o site "pode usar `localStorage` pra
     lembrar qual tema você escolheu ver" - **isso não existe mais**
     (o comparador claro/escuro foi removido faz dias, ver "Card 'Tema
     claro/escuro' removido"), e conferido por busca no código: o site
     não usa `localStorage` em lugar NENHUM hoje. Reescrito pra afirmar
     a realidade atual (não usa nenhum tipo de armazenamento local
     hoje), sem inventar uma funcionalidade que não existe - mesma regra
     de sempre ("nunca anunciar o que não existe de verdade"), só que
     aplicada ao contrário (não deixar afirmar o que JÁ deixou de
     existir).
- **Mobile: achado real, não um bug de layout, mas de legibilidade** -
  medido de verdade: um popup de módulo em 375px de largura reduzia a
  tela real (nativa 1680px) pra escala ~0.155 - um texto de 13px na tela
  real vira ~2px na tela, ilegível de cara. Isso **não é regressão desta
  rodada** (a screenshot raster antiga tinha exatamente o mesmo problema
  de escala, só que pior - além de pequena, ficava borrada) - mas o
  Carlos pediu atenção específica a mobile, e vale corrigir o que dá.
  Duas mudanças, sem reescrever a arquitetura:
  1. **Ganho real de espaço**: `.contact-modal`/`.module-modal-card`
     ganharam padding bem mais enxuto só no mobile (`@media
     max-width:768px`) - de 112px de padding combinado pra 64px, a tela
     real ganha ~18% de largura a mais (261px → 309px numa tela de
     375px). Modesto, mas real e sem risco.
  2. **Aviso que orienta em vez de esconder o problema**: como agora é
     HTML/texto de verdade (não mais print), dar zoom mantém tudo
     nítido - vantagem real sobre o sistema antigo, que só borraria mais
     ao ampliar uma imagem raster. Adicionado um aviso só no mobile
     (`.screenshot-frame + .mockup-caption::after`, `style.css`) - a
     legenda "Sistema real, dados fictícios" ganha " — dê zoom pra ver
     os detalhes" só em telas ≤768px. Conferido que `<meta
     name="viewport">` não tem `user-scalable=no`/`maximum-scale` em
     nenhuma página (não teria como avisar pra dar zoom se o zoom
     estivesse desabilitado) - pinch-zoom funciona normal, `pointer-
     events:none` no iframe só bloqueia CLIQUE dentro dele, não afeta o
     gesto de zoom do navegador (é outro mecanismo).
  3. Testado com container real: `wrapWidth` do popup foi de 261px pra
     309px, aviso aparecendo certo no `::after`, zero erro no console,
     visual conferido por screenshot (tela real legível o bastante pra
     convincer que é de verdade, com convite claro pra ampliar se quiser
     ler número exato).
- **"Algo pra cortar" - achado, mas não cortado sem confirmar**: medido
  `document.body.scrollHeight` do `index.html` = **25524px** - comparado
  ao vivo com a Saipos (`saipos.com`, concorrente direto do setor de
  food service, pesquisado antes nesta sessão) = 13708px, quase metade.
  Ponto real de possível redundância identificado: `#indicadores`
  ("Três indicadores", CMV/CMO/CMC em miniatura) fica **imediatamente
  antes** das seções cheias de CMV e CMO (que já têm tratamento
  completo logo em seguida) - dá pra ler como repetição do mesmo
  conteúdo 2 vezes seguidas. **Não removido nesta rodada** - é uma
  decisão de conteúdo/narrativa (a cena 3D de `#indicadores` foi
  bastante trabalhada numa rodada anterior), fica como recomendação pro
  Carlos decidir, não uma remoção unilateral.
- **Ideia de animação, não implementada** - registrada aqui como
  sugestão, não um pedido/decisão do Carlos ainda: um indicador visual
  sutil (ex: ícone de lupa pulsando de leve) sobre `.sys-embed`/`.sys-
  embed-crop` no mobile, reforçando o aviso de texto com algo visual -
  mais chamativo que só a legenda, sem exigir nenhuma lib nova (CSS
  puro, mesmo padrão dos outros `@keyframes` do site).
- **Comparação final com concorrente** - Saipos (visitada ao vivo nesta
  auditoria, não só memória de rodada anterior): abre com um FORMULÁRIO
  de captura de lead na dobra inicial (nome/e-mail/WhatsApp/faturamento),
  não com screenshot nenhum do produto - estratégia de "captura primeiro,
  mostra depois" bem diferente da nossa ("mostra tudo, WhatsApp só
  quando o visitante decidir"). Confirma o motivo real do site ser mais
  longo que a concorrência: GestãoCheck opta por profundidade de conteúdo
  e prova visual em vez de um funil de geração de lead curto - trade-off
  consciente, não um descuido, mas o `#indicadores` acima é o ponto onde
  essa profundidade pode estar duplicando em vez de somando.

## Cursor recalibrado com o DOM vivo, ordem do "Conhecer o sistema"
corrigida, "Voltar ao site" preserva posição de scroll, vitrine
"Veja por dentro" reconstruída com telas reais, PNGs antigos apagados
(16/09/2026, mesmo dia - rodada seguinte)

Carlos testou a integração acima e apontou 4 coisas reais:

- **Bug real corrigido - cursor de demonstração "não tava pegando"**:
  a rodada anterior tinha deixado as 13 telas convertidas pra
  `.sys-embed` com só o clique decorativo genérico (sem apontar pra
  lugar nenhum de verdade) - funcional, mas sem graça, lia como
  "quebrado" comparado ao sistema antigo (que clicava exatamente no
  item certo do menu lateral). **Corrigido de verdade, e melhor que
  antes**: nova função `getEmbedNavPoint()` (`js/script.js`) lê o DOM
  **de verdade** dentro do iframe (same-origin, sem CORS) procurando
  `.nav-item.active` - a classe que o próprio sistema usa pra marcar a
  página atual no menu lateral - em vez de depender da tabela
  `NAV_ITEMS` (posição em % medida à mão, por captura, do sistema
  antigo). Isso é estritamente melhor: nunca fica desatualizado, não
  precisa recalibrar se o menu real mudar de ordem/tamanho no futuro.
  Usa **valor calculado por função** no tween do GSAP (não um valor
  fixo) - o GSAP reavalia a função a cada início/repetição da timeline,
  então mesmo que o iframe ainda não tenha carregado na primeira vez
  que a timeline dispara, ela tenta de novo sozinha no ciclo seguinte
  (`repeat:-1, repeatDelay:1.6`), sempre lendo o estado real e atual do
  DOM. **Sistema antigo removido de vez** (`NAV_ITEMS`/`TAB_DEMOS`, o
  overlay crossfade pra "tela anterior", `.demo-cursor-overlay*` no
  CSS) - não fazia mais sentido mantê-lo como "documentação"/rede de
  segurança depois que os PNGs que ele referenciava foram apagados de
  vez (ver abaixo) - teria ficado apontando pra arquivo inexistente.
- **Ordem real corrigida - banner "Conhecer o sistema" estava depois de
  tudo, quase no rodapé**: Carlos esperava ele logo ANTES da Segurança
  (fazia sentido pro fluxo - "quer ver com os próprios olhos" antes do
  bloco de confiança/proteção de dados), mas a seção
  `#veja-por-dentro-teaser` tinha ficado presa lá embaixo, entre
  Segurança e "Para quem é", desde a rodada que criou a página própria
  pra ela. Movida pra logo depois do Multi-IA, antes de `#seguranca` -
  confirmado com `document.querySelectorAll('section')` que a ordem
  bate agora: Multi-IA → banner → Segurança → Para quem é...
- **"Voltar ao site" agora volta pro ponto exato de onde a pessoa
  estava, não pro topo do zero**: o link de `conheca-o-sistema.html`
  (`.app-topbar-back`) usava `href="index.html"` puro - sempre pousava
  na posição 0. Corrigido em `js/script.js`: o clique agora chama
  `window.history.back()` em vez de deixar o link normal acontecer -
  SE existe histórico de navegação vindo do próprio site
  (`document.referrer` bate com a própria origem) - efetivamente o
  mesmo que apertar o botão Voltar do navegador. Testado clicando de
  verdade em "Conhecer o sistema" a partir de uma posição de scroll
  específica e depois em "Voltar ao site": confirmado que volta pra
  `index.html` com a URL/query original preservada (prova de que é
  `history.back()` de verdade, não um link recarregando do zero) e
  landando numa posição de scroll não-zero, coerente com onde estava -
  **atenção**: como o site usa Lenis (scroll virtual suave) + conteúdo
  que muda de altura depois do carregamento (iframes/imagens
  assíncronas), a posição não é sempre pixel-perfeita (o Lenis
  reconcilia o próprio estado interno com o scroll nativo depois da
  restauração do navegador, o que pode deslocar um pouco) - mas nunca
  mais reseta pra zero, que era o bug real reportado.
- **Vitrine "Veja por dentro" (`conheca-o-sistema.html`) reconstruída
  com as 15 telas em DOM congelado real** (Carlos: "agora que tem telas
  em código, melhora as telas do sistema simplificado") - as ~500
  linhas de HTML/CSS reaproveitado à mão (que já tinham ficado
  desatualizadas/simplificadas demais em várias rodadas anteriores)
  foram substituídas por `.sys-embed-crop`, uma variante nova do
  `.sys-embed` pensada especificamente pra esse contexto: a vitrine já
  desenha sua PRÓPRIA sidebar real e clicável ao lado do frame
  (`.sys-sidebar`, sempre existiu) - mostrar a página congelada
  INTEIRA duplicaria a sidebar (ela também tem uma embutida, sempre
  216px de largura - conferido em 4 arquivos diferentes, valor
  consistente). `.sys-embed-crop` corta esse pedaço via
  `transform: scale(s) translateX(-216px)` (calculado em JS,
  `mountSysEmbeds` em `script.js`) e mostra só a área de conteúdo. Sem
  altura fixa (diferente do `.sys-embed` normal, que é 1680x1050 fixo
  tipo screenshot) - aqui o objetivo é mostrar a TELA INTEIRA (a altura
  real de conteúdo é medida depois que o iframe carrega e aplicada via
  JS), rolando dentro do `.sys-pane-wrap` que já tinha overflow-y:auto
  de antes. Cada tela carrega só na primeira vez que a pessoa clica
  nela (`data-src`→`src`, igual os popups de módulo) - só "Início" (a
  aba padrão ao abrir a página) carrega de cara. Mapeamento pane→arquivo:
  inicio→09, estoque→10, cmv→11, cmo→12, cmc→13, despesas→06,
  beneficiamento→14, avarias→15, ocorrencias→16, checklists→17,
  manutencao→18, requisicao→19, patrimonio→05, relatorios→20,
  configuracoes→21 (só uma das 3 sub-telas de Configurações do sistema
  real - a de "Setores e categorias", já que a vitrine tem só 1 pane
  pra essa área, não 3). Testado clicando em várias telas (Estoque,
  Configurações) - conteúdo real renderizando nítido, sem sidebar
  duplicada, sem overflow, zero erro no console; testado em 375px
  (mobile) também, sem overflow horizontal.
- **PNGs/WebPs antigos apagados de vez** (Carlos: "os prints pode
  apagar") - as 23 screenshots numeradas + as 2 imagens "antes" do
  cursor antigo (`caixa_cmc_antes`/`relatorios_tabs_antes`) + o
  `11b_cmv_vendas` órfão (nunca foi referenciado em lugar nenhum,
  achado no mesmo pente) saíram de `assets/sistema/` - confirmado por
  busca em todo HTML/JS/nginx.conf antes de apagar que não sobrava
  nenhuma referência. Só ficou o vídeo/poster do Multi-IA (não é
  screenshot, continua em uso). Copiados 7 arquivos HTML novos pra
  `assets/sistema-html/` só pra viabilizar a vitrine (09, 14, 16, 18,
  19, 20, 21 - os 13 do lote anterior + esses 7 somam as 20 telas que
  o site usa hoje no total, dos 23 que existem na origem - as 3 que
  faltam, 22/23/07-duplicado-de-config, não têm uso em lugar nenhum
  ainda).
- Testado de ponta a ponta com Docker real de novo: `?v=6` (JS) e
  `?v=3` (CSS) - versão bumpada de novo nesta rodada (mudou os dois
  arquivos depois do último bump), zero erro nas 6 páginas, ordem de
  seções conferida via JS, cursor calculando posição real via
  `getEmbedNavPoint`, vitrine testada clicando em várias telas.

## Screenshots viraram DOM congelado ao vivo (`.sys-embed`) - resolve
de vez o "borra ao dar zoom" (16/09/2026)

Depois da investigação de 14/09 (raster 1x, sem solução real sem o
Carlos mandar captura nova), ele preferiu resolver diferente: pediu
pro Claude de outro chat (que tem acesso ao sistema rodando de
verdade) gerar, pra cada uma das 23 telas do lote original, o **DOM
real congelado** (HTML+CSS finais, pós-JS/pós-fetch, zero `<script>`)
em vez de mandar uma screenshot nova. Entregou 46 arquivos (23 telas ×
2 temas, claro/escuro) em `Chestaocheck-operacional/Imagens do
Sistema/`, avisando que precisavam ser embutidos como página (iframe/
inclusão), não como `<img>` (HTML não renderiza dentro de `<img
src>`).

- **Por que isso resolve o problema de verdade, ao contrário de só
  gerar um PNG 2x**: PNG é pixel fixo - por mais alta que seja a
  resolução da captura, dar zoom além dela sempre borra (física de
  imagem raster, já investigado e documentado na seção acima). HTML/
  CSS real não tem esse teto - renderiza nítido em QUALQUER zoom,
  porque o navegador desenha o texto/vetor de novo a cada vez, não
  amplia um bitmap. Por isso a escolha do Carlos (via o outro Claude)
  de gerar DOM congelado em vez de screenshot nova é estrategicamente
  melhor que o que eu tinha originalmente pedido.
- **Copiados só os 13 arquivos tema ESCURO realmente usados hoje**
  (`assets/sistema-html/`) - o site é 100% escuro (o comparador claro/
  escuro foi removido faz tempo, ver "Card 'Tema claro/escuro'
  removido"), então as 23 versões `-branco` e as 10 telas escuras que
  não têm `<img>` correspondente hoje (Beneficiamento/Requisições usam
  `.flow-row` sem imagem; 09/11b/14/16/18/19/20/21/22/23 não são usadas
  em nenhum `<img>` do site atual) **ficaram só na pasta de origem**,
  não foram copiadas pro repo - evita peso morto. Se algum dia uma
  dessas seções ganhar imagem/popup, o material já existe, é só copiar.
- **Novo componente `.sys-embed`** (`style.css`) - substitui `<img>`
  dentro de `.screenshot-frame`: um `<iframe>` carrega a página
  congelada, mas SEMPRE no tamanho nativo (1680x1050, a mesma largura
  que as capturas antigas usavam) - a página congelada tem CSS
  responsivo de verdade (mobile-first), então se renderizasse já na
  largura estreita da moldura ela cairia no layout mobile dela,
  errado. Em vez disso, o iframe roda no tamanho nativo e só a
  APARÊNCIA é escalada visualmente via `transform:scale()`, calculado
  em JS (não dá pra fazer só com CSS - escalar um tamanho fixo pra
  caber num container variável precisa saber a largura real do
  container em pixels). `pointer-events:none` de propósito - a página
  congelada tem `onclick="..."` de funções que não existem mais (zero
  JS por trás), não é feita pra ser clicável. `scrolling="no"` no
  `<iframe>` some com a barra de rolagem nativa em telas cujo conteúdo
  passa de 1050px de altura (mostra só o topo, igual a screenshot
  antiga mostrava).
- **`mountSysEmbeds()` nova em `script.js`** - roda fora do bloco
  condicionado ao GSAP de propósito (só usa `ResizeObserver`, funciona
  mesmo sem GSAP) - calcula a escala de cada `.sys-embed` no
  carregamento e reage a qualquer mudança de largura depois (resize de
  janela, media query) sem precisar recalcular na mão em lugar nenhum.
  Popups de módulo (`abrirModal`) ganharam o mesmo tratamento `data-src`
  que as imagens já tinham (`iframe[data-src]` só vira `src` real na
  primeira abertura) - o iframe do popup só carrega quando alguém
  realmente abre aquele card, mesmo princípio de lazy-load de sempre.
- **Cursor de demonstração (`attachDemoCursor`) ajustado, não
  removido**: como essas telas não têm mais `<img>` (não tem arquivo
  pra procurar em `NAV_ITEMS`/`TAB_DEMOS`, que é um sistema só do
  raster antigo), a função agora aceita frame com `.sys-embed` no lugar
  de `img` e cai direto no clique decorativo simples (sem troca de
  tela) - mesmo comportamento que o 2FA já usava antes de ganhar
  mapeamento. **Efeito colateral esperado, não bug**: como TODAS as 13
  telas que tinham `<img>` viraram `.sys-embed` nesta rodada, o ramo
  "com troca de tela" (overlay crossfade pra tela anterior) do sistema
  antigo fica sem nenhum chamador possível agora - `NAV_ITEMS`/
  `TAB_DEMOS` continuam no arquivo (documentação + caso algum dia volte
  a ter `<img>` raster), mas na prática não são mais alcançados. Não
  removidos nesta rodada pra não inflar ainda mais um changeset já
  grande - candidato a limpeza futura se quiser.
- **Dois bugs reais de CACHE achados testando** (não do recurso em si -
  achados tentando confirmar que funcionava): (1) `js/script.js?v=4`
  continuou sendo servido da versão ANTIGA pelo navegador mesmo depois
  do container novo no ar - o Cache-Control é `immutable, 30 dias`, e
  o `?v=4` não tinha mudado desde a rodada anterior desta mesma sessão,
  que já tinha usado esse endereço; corrigido bumpando pra `?v=5` nas 4
  páginas que carregam `script.js` inteiro. (2) **Achado novo, mais
  sério**: `css/style.css` NUNCA teve query de versão (só os `.js`
  tinham essa convenção) - mesmo problema de cache preso, só que sem
  nenhum jeito de forçar antes. Corrigido somando `?v=2` no `<link>`
  das 6 páginas. **Atenção pra quem mexer em CSS daqui pra frente**:
  como o `Cache-Control` do `.css`/`.js` é `immutable` (30 dias), toda
  vez que o CONTEÚDO de `css/style.css` ou `js/script.js`/
  `three-hero.js` mudar, a query de versão (`?v=N`) precisa subir
  também, nas 6 páginas - sem isso, quem já visitou o site (ou testou
  localmente antes) fica preso na versão antiga por até 30 dias, sem
  erro nenhum aparecendo, só o comportamento antigo persistindo
  silenciosamente. Vale também pro ambiente de teste desta sessão -
  reaproveitar uma porta Docker já usada antes nesta conversa não é
  suficiente pra forçar reload, é preciso bumpar a versão mesmo.
- **PNGs antigos das 13 telas não apagados** (`assets/sistema/01...`,
  `02...` etc. + seus `.webp`) - ficaram sem nenhuma referência em
  HTML/JS (só sobrevivem como string morta dentro de `NAV_ITEMS`/
  `TAB_DEMOS`), mas não foram removidos do repo por precaução (mesmo
  padrão de sempre - não apagar asset sem pedido explícito). Podem ser
  removidos numa limpeza futura se quiser.
- **GIF claro do Multi-IA (`multi_ia_chat_fullpage-branco.gif`), gerado
  junto pelo outro Claude, não foi integrado** - não tem lugar de uso
  hoje (o comparador claro/escuro que justificaria uma versão clara foi
  removido do site faz tempo, ver seção "Card 'Tema claro/escuro'
  removido"). Fica registrado, sem ação, caso o Carlos queira reativar
  alternância de tema em algum lugar no futuro.
- Testado com container Docker real (metodologia de sempre): `nginx -t`
  limpo, `.sys-embed` renderizando no tamanho nativo (1680x1050)
  confirmado via `getComputedStyle`, escala recalculada certa em
  desktop (811px→0.48) e mobile (341px→0.20, sem overflow horizontal),
  popup de módulo abrindo e trocando `data-src`→`src` do iframe
  corretamente, zero erro real no console nas 6 páginas (só o aviso
  antigo/inofensivo do THREE.Clock).

## Nota sobre "sem build step" (14/09/2026)

O resto deste arquivo descreve o site como "sem build step" repetidas
vezes - isso era uma filosofia que **surgiu naturalmente** (mesma
abordagem do sistema principal, foi só o jeito que começamos), **não
uma decisão deliberada do Carlos**. Ele esclareceu isso explicitamente:
"essa parada de sem build step não foi algo que eu quis, só fomos
fazendo e não usando, mas se der pra usar build step pra melhorar algo
pode usar, não ligo se vamos usar ou não, quero o melhor pro site".
**Ou seja: build step deixou de ser uma restrição.** Se uma ferramenta
que precisa de instalação/compilação/build genuinely melhorar o site
(performance, qualidade, o que for), pode usar - não precisa mais
achar um jeito "sem build step" de resolver as coisas por padrão. As
seções abaixo que mencionam "sem build step" como decisão de projeto
ficam como registro histórico do que motivou a escolha original, não
como regra a seguir daqui pra frente.

# CLAUDE.md — Site de Vendas GestãoCheck (gestaocheck-site)

> Repo renomeado de `gestao-pro` pra `gestaocheck-site` (11/09/2026) —
> remote local já atualizado (`git remote set-url`). **A VPS ainda não**
> — quem for atualizar lá precisa rodar `git remote set-url origin
> git@github.com:GestaoCheck/gestaocheck-site.git` dentro de
> `/opt/site-vendas/gestao-pro` antes do próximo `git pull`, senão o
> pull vai falhar (a menos que o GitHub ainda esteja redirecionando do
> nome antigo).

Contexto pra quem (ou qual sessão) mexer nesse projeto depois. Este é o
**site de vendas/institucional** do GestãoCheck — não é o sistema em si (o
sistema fica em outro repositório). Objetivo: vitrine pra apresentar o
produto e gerar contato via WhatsApp, hoje sem preço público no site
(decisão: fechar por demonstração/WhatsApp, não com preço exposto).

## Stack

HTML + CSS + JS puro, sem build step (`index.html` / `style.css` /
`script.js`), mesma filosofia do sistema principal. Ícones via Font
Awesome (CDN), fonte Inter (Google Fonts, CDN). Logo/ícones reais em
`scr/assets/logo/*.svg` (várias variantes: horizontal, vertical, ícone
sozinho, favicons circulares/quadrados em navy/branco/colorido — usar a
variante certa pro contexto, não reaproveitar a mesma pra tudo). Desde
11/09/2026 também usa GSAP (animação) e Three.js (cena 3D) via CDN — ver
seção própria abaixo.

## Animações: GSAP + Three.js (decisão 11/09/2026)

Carlos pediu upgrade visual "tipo site da GTA 5". Alinhamos antes de
implementar (ele pediu consenso explicitamente): GSAP, Anime.js e
Motion resolvem o mesmo problema (animação de propriedade/timeline) —
escolhido **GSAP + ScrollTrigger** como motor único (padrão de mercado,
de graça desde a aquisição pela Webflow em 2024, funciona via CDN sem
build step). Anime.js/Motion **não** entram — seria redundância.
Three.js entra à parte, só pro Hero (categoria diferente: WebGL/3D).

- **`script.js`**: o sistema antigo de reveal (listener de `scroll` +
  classe `.reveal.active`) foi substituído por `ScrollTrigger.batch()`
  com stagger real por seção. Também tem: contadores animados nos
  números do mockup do Hero (`[data-count]`/`data-prefix`/`data-suffix`/
  `data-decimals` no HTML), e as barras de gráfico/barra de progresso
  (`--bar-h`/`--bar-w` no `style=` inline de cada elemento) agora são
  animadas via GSAP em vez de transição CSS.
- **Fallback de segurança**: `.reveal` é `opacity: 1` (visível) por
  padrão no CSS — só fica `opacity: 0` (esperando a animação) se o body
  ganhar a classe `js-anim-ready`, que o `script.js` só adiciona depois
  de confirmar que `gsap`/`ScrollTrigger` carregaram. Se o CDN cair ou
  um bloqueador travar o script, o conteúdo nunca fica escondido pra
  sempre — regra pra nunca quebrar isso de novo.
- **`three-hero.js`** (novo arquivo, `type="module"` — Three.js a
  partir da r150+ só distribui build ES module, não tem mais o
  `three.min.js` clássico com variável `THREE` global): cena de rede de
  nós conectados (`THREE.Points` + `THREE.LineSegments`) no `<canvas
  id="hero-3d">` dentro do `.hero`, cor da marca (ciano `--primary` +
  coral `--secondary` como destaque). Rotação lenta + parallax leve com
  o mouse. **Desligado** (a própria função retorna sem inicializar nada)
  em telas `≤768px` e quando `prefers-reduced-motion: reduce` está
  ativo — decisão de performance/bateria em mobile e acessibilidade, não
  é só CSS escondendo, o JS nem roda.
- **Versões pinadas via cdnjs** (conferir se existe versão mais nova
  antes de trocar, mas sempre pinar exato, nunca "latest"): GSAP/
  ScrollTrigger `3.15.0`, Three.js `0.186.0`.
- **Testado em 11/09/2026**: alturas de barra/largura de progresso
  batendo exato com o valor alvo, WebGL do Three.js criando contexto
  normalmente, canvas 3D realmente ausente em mobile, zero erro real no
  console (os avisos "GSAP target not found" que apareceram numa rodada
  de teste eram efeito colateral de forçar `gsap.globalTimeline` manual
  durante o teste, não do código real — confirmado reproduzindo em aba
  limpa sem esse forcing, zero warning).

**Fora de escopo dessa entrega, de propósito** (não misturar): migração
pra Astro/Vite, analytics, captura de lead, monitoramento de uptime,
SEO técnico (sitemap/robots.txt/schema.org), troca dos mockups CSS por
screenshots reais — vieram na mesma conversa (análise grande que o
Carlos colou), registrados aqui pra não esquecer, mas são trabalho
separado.

## Paleta: modo escuro (decisão 11/08/2026)

O site foi convertido de tema claro pra **escuro** nessa data (pedido
explícito, depois de 3 rodadas de "escurece mais"). Detalhes que quem for
mexer na paleta depois precisa saber:

- `--primary` deixou de ser o petróleo escuro e virou um **ciano claro**
  (`#7DD3DC`) — é a cor usada como texto/ícone/acento sobre o fundo
  escuro (títulos, `.tag`, links, chips). `--primary-dark` continua sendo
  o petróleo escuro original (`#0a3540`) e agora serve de **âncora
  escura** pros poucos elementos que têm texto branco em cima (CTA final,
  faixa de destaque/`.solution-banner`, sidebar do mockup,
  `.step-number`, `.flow-step-final`, hover do `.founder-linkedin` e do
  `.btn-secondary`).
- **Regra pra não quebrar de novo**: nunca usar `var(--primary)` (o ciano
  claro) num lugar que tenha `color: white` junto — vira texto branco
  invisível em fundo claro. Sempre que precisar de um fundo sólido com
  texto branco, usar `var(--primary-dark)`.
- `--bg-white`/`--bg-gray` viraram dois tons escuros (`#142B33`/
  `#0C1E24`) — os nomes das variáveis ficaram desatualizados (ainda
  dizem "white"/"gray") mas não foram renomeados pra não precisar
  reescrever ~50 usos no CSS; são "card" (mais claro, elementos
  elevados) e "página" (mais escuro, fundo das seções), nessa ordem.
- Testado com auditoria de contraste (script JS ad-hoc, não faz parte do
  repo) percorrendo todo texto visível da página — achou e corrigiu 2
  problemas reais: `.step-number` (números "01-04") com contraste 1.62:1
  (coral em cima do novo ciano claro, quase ilegível) e um bug **que já
  existia antes do modo escuro** (`.nav-links a` sobrescrevia a cor
  branca do botão "Solicitar demonstração" do menu por especificidade de
  CSS - corrigido com `.nav-links a.btn-primary`).

## Estado atual (11/08/2026)

Ajustado nessa data: paths de logo/favicon/og:image que apontavam pra
arquivos inexistentes (`scr/logo.png`, `assets/logo.png`,
`scr/icone-colorido.svg` na raiz) foram corrigidos pros arquivos reais em
`scr/assets/logo/`. WhatsApp corrigido: **não é mais um número único** —
o site tem 3 contatos reais (Carlos `5585991799221`, Tonhão
`5585999817221`, Jarbas `5585992029592`), cada um no próprio card em
"Fundadores" (botão de WhatsApp ao lado do LinkedIn) e também no modal
"Com quem você quer falar?" que abre ao clicar em qualquer botão
"Solicitar demonstração" (Hero e CTA final) — ver `script.js`
(`data-modal-open`/`data-modal-close`) e o bloco `#contactModal` no fim
do `index.html`. LinkedIn do Antonio Neto adicionado
(`linkedin.com/in/antonio-neto-39bb72268`) — os 3 fundadores têm foto
(`scr/assets/equipe/`) e LinkedIn completos agora.

### Convenção de logo/favicon (decidida 11/08/2026)

- **Favicon (aba do navegador) = `favicon-circulo-contorno.svg`** — isso
  agora é o **padrão fixo pra site de vendas** (deste e de qualquer site
  de vendas parecido que a empresa criar no futuro pra outro produto).
  Não trocar por outra variante sem decisão nova.
- **Se um dia existir um app baixável de verdade** (mobile/desktop, ver
  ideia de longo prazo em `docs/VISAO.md` do repo principal), esse app
  usa o **padrão de ícone de app** — os arquivos `favicon-quadrado-*.svg`
  (formato de ícone de app iOS/Android, cantos arredondados) são
  reservados pra isso, não pra site.
- **Regra pra decidir qual dos dois padrões usar num site novo**: se o
  site novo for parecido com este (institucional/vendas), reusa
  `favicon-circulo-contorno.svg`; se for algo "tipo app" (ex: um painel
  do próprio app embutido em algo), usa o padrão de ícone de app acima.
- **Logo do header/footer/rodapé** (`logo-horizontal.svg` hoje) é
  flexível — decisão de "qual arquivo fica melhor visualmente em cada
  lugar" pode mudar por contexto/sessão, contanto que seja sempre a
  mesma marca (nunca inventar variante nova sem pedir). O que é fixo é
  só o favicon, pelo motivo acima (vira a "assinatura" reconhecível da
  aba do navegador).

**Pendências conhecidas, não bloqueantes pra subir**:

- `og:image` aponta pra um SVG (`logo-vertical-completo.svg`) — funciona,
  mas o ideal pra preview de link em WhatsApp/redes é um PNG/JPG
  ~1200×630px (SVG não renderiza em todo lugar). Gerar um quando tiver
  como exportar.
- Nenhum vídeo/gravação real do sistema embutido ainda — os "mockups" do
  site (`.dashboard-mockup`, `.mini-mockup`) são interfaces desenhadas em
  CSS com dados fictícios, não capturas reais. Se um dia gravar uma
  demonstração real (ex: tela entrando no sistema, cadastrando um item),
  dá pra embutir como `<video autoplay muted loop>` na Hero ou numa seção
  própria — procurar o arquivo de vídeo antes de tentar isso.

## Conteúdo atualizado com screenshots reais do sistema (feito 11/09/2026)

**Resolvido** — a pendência abaixo foi concluída. O sistema principal
tinha crescido muito desde a revisão de conteúdo de 11/08/2026 (2FA,
DRE completa, Curva ABC, Patrimônio, Multi-IA, Caixa, Despesas); Carlos
mandou 24 screenshots reais do sistema (dados fictícios,
`Imagens do Sistema/` fora do repo) + o par completo claro/escuro de
cada uma, e o site foi atualizado com prova visual de verdade em vez de
mockup CSS genérico:

- **Screenshots reais substituindo os mini-mockups CSS** nas seções que
  já existiam (Estoque, CMV, CMO, CMC, Avarias, Checklists, Relatórios)
  — componente novo `.screenshot-frame` (`style.css`), imagens em
  `scr/assets/sistema/`. **Hero continua com o mockup CSS animado** (só
  ele tem número contando/gráfico crescendo de verdade — não virou
  screenshot estático).
- **6 seções novas**: Multi-IA (`#multi-ia`), Caixa (`#caixa`),
  Despesas (`#despesas`), Patrimônio (`#patrimonio`), DRE completa
  (`#dre`), Curva ABC (`#curva-abc`). Segurança ganhou o 2FA
  (`.security-split`, 2 colunas) em vez de virar seção própria.
- **"Veja por dentro"** (`#veja-por-dentro`) — carrossel com crossfade
  (`.screens-showcase`, CSS puro + JS, **não depende do GSAP** de
  propósito, pra não travar numa imagem só se alguma lib externa
  falhar) mostrando as 10 telas que não ganharam seção própria
  (dashboard inicial, CMV-vendas, Beneficiamento, Manutenção,
  Requisição, Insights, as 3 de Configurações). Decisão consciente:
  Carlos sugeriu GIF, optei por carrossel (mais leve, dá pra clicar/
  pausar, não pesa igual `.gif` exportado) — ele topou.
- **Comparador claro/escuro de verdade** (`.theme-compare`, seção
  Experiência) — slider arrastável (`<input type="range">` +
  `clip-path`, também sem depender do GSAP) comparando a tela Início
  nos dois temas. Só essa seção usa a versão clara; o resto do site
  usa só a versão escura pra não misturar tema na mesma página.
- **Animação em todo o site, não só Hero**: Lenis (scroll suave, via
  jsdelivr — não está no cdnjs) integrado ao ScrollTrigger; barra de
  progresso de scroll no topo (`#scroll-progress`); título do Hero
  revelando palavra por palavra (`.split-word`/`.split-word-inner`);
  screenshots entrando com leve zoom (1.08→1); botão `.btn-primary`
  magnético (segue o cursor); seção Multi-IA com **pin** — fica presa
  na tela enquanto imagem, lista de recursos e cards de insight entram
  em sequência (`ScrollTrigger` com `pin:true`+`scrub`, timeline
  própria em `script.js`). **Atenção**: os elementos dentro de
  `#multi-ia` usam a classe `.ia-pinned` justamente pra ficar fora do
  loop genérico de reveal — se adicionar elemento novo lá dentro que
  deveria usar o reveal padrão, não esquecer de tirar essa classe.
- **CSP do `nginx.conf` atualizada**: `script-src` precisou ganhar
  `https://cdn.jsdelivr.net` (Lenis) além do `cdnjs.cloudflare.com` já
  liberado — **achado real**: o CSP nunca tinha sido testado contra as
  libs do GSAP/Three.js em produção de verdade (só local via `npx
  serve`, que não aplica os headers do `nginx.conf`), então rodei um
  servidor de teste replicando os headers reais pra confirmar as duas
  vezes (antes e depois do Lenis) — sem isso o site funcionaria local e
  quebraria silenciosamente em produção.
- Peso: pasta `scr/assets/sistema/` ficou com ~3,9MB (25 imagens, todas
  com `loading="lazy"` exceto o Hero). Aceitável por ora — compressão/
  WebP é item já registrado como fora de escopo (ver análise de
  performance mais abaixo).

## Ajustes finos de acabamento (11/09/2026, mesmo dia — feedback do Carlos depois de ver o site no ar)

- **Nitidez das screenshots**: as imagens (nativas em 1680×1050, bem
  acima de qualquer largura que renderizam no site) pareciam
  "amolecidas" mesmo em telas grandes. Causa real: o `gsap.to(...,
  {scale: 1})` da entrada com zoom deixava um `transform` residual
  aplicado no `<img>` mesmo depois da animação terminar (scale
  exatamente 1), o que mantém o Chrome renderizando o elemento numa
  camada composta em vez do raster normal — efeito colateral conhecido
  do GSAP/CSS transforms, não é compressão nem resolução da imagem
  (confirmado: os PNGs de origem são nítidos). Corrigido com
  `clearProps: 'transform,willChange'` no final de cada tween de
  entrada (aplica pra todo `.screenshot-frame img`, inclusive o da
  Multi-IA na variante sem pin).
- **Multi-IA cortando em tela pequena**: o `pin` (`ScrollTrigger` com
  `pin:true`) prendia a seção na tela por `+=1400px` de scroll, mas o
  conteúdo total (cabeçalho + grid + tira de insights) passava da
  altura de monitores/notebooks menores — como é `pin`, o que ficasse
  abaixo da dobra durante o pin não tinha como ser visto (não é scroll
  normal). Primeira correção (`ScrollTrigger.matchMedia()` com pin só em
  telas grandes) ainda deixava "só funciona em monitor grande" — o
  Carlos apontou de novo. **Correção definitiva**: em vez de prender a
  seção inteira, só o par imagem+texto fica dentro do pin agora
  (`.ia-pin-stage`, novo `<div>` em volta só do `.deepdive-grid` em
  `index.html`) — a tira de insights ficou fora do pin, como conteúdo
  normal que revela sozinho quando o scroll chega nela. Como o pin
  passou a prender só uma fatia bem menor da seção (imagem+texto, não
  cabeçalho+imagem+texto+insights), os limites do `matchMedia` puderam
  cair pra `(min-width: 769px) and (min-height: 480px)` — ou seja,
  praticamente qualquer tela que não seja mobile (768px já é o
  breakpoint mobile usado no resto do site) cabe sem cortar nada.
  Testado e conferido cabendo até em 900×550 e no limite exato de
  769×480. Além disso a imagem ficou maior (`.deepdive-grid` virou
  `1.15fr 0.85fr` só nessa seção, `max-width: 640px` no frame) e o
  padding vertical da seção foi reduzido (100px→64px).
- **Comparador claro/escuro trocado por botão de alternar**: o slider de
  arrastar (`<input type="range">` + `clip-path`) tinha ficado frágil —
  substituído por um botão de alternância (`.theme-toggle-btn`) que
  troca a imagem ativa com crossfade (`opacity` + `transition`, sem
  `clip-path`/drag nenhum). Mostra sempre o frame inteiro, em qualquer
  tamanho de tela, sem depender de precisão de mouse/toque numa área
  pequena.
- **Cursor de demonstração em todas as screenshots**: cada
  `.screenshot-frame` (menos o da Multi-IA, que já tem a sequência com
  pin) ganhou um cursor animado (SVG, injetado via `script.js`) que
  percorre a imagem uma vez ao entrar na tela — 2 pontos de "clique"
  com efeito de ripple (`.demo-cursor-ring`), pontos variados por seção
  (pequeno jitter determinístico por índice, pra não repetir o mesmo
  gesto em cascata). Resolve o pedido de ter alguma animação em toda
  tela do site, não só no Hero, sem precisar de vídeo/gravação real nem
  de coordenadas exatas de cada tela (o Carlos ofereceu mandar o HTML
  real das telas pra animação mais precisa — não usado ainda, fica
  registrado como possível refinamento futuro se quiser ainda mais
  precisão).
- CSP do `nginx.conf` foi reconferida nessa rodada — já estava correta
  desde a entrega anterior (`cdnjs.cloudflare.com` + `cdn.jsdelivr.net`
  em `script-src`), nenhuma mudança necessária.

## Animação em todo o site, parte 2 (11/09/2026, mesmo dia — Carlos pediu
mais depois de ver o resultado da rodada anterior)

Depois dos ajustes finos acima, Carlos pediu mais três coisas: imagens
das screenshots maiores (achou que "não nítidas" = pequenas demais pra
ler o texto de dentro), cursor de demonstração repetindo em vez de
tocar só uma vez, e animação/3D em **todas** as partes do site, não só
Hero/Multi-IA. O que foi feito:

- **Bug real achado no `.deepdive-grid`**: a proporção assimétrica
  (`1.15fr 0.85fr`) da rodada anterior tinha sido pensada pra imagem
  ficar maior, mas só funcionava nas seções `.reverse` (onde o `order`
  do CSS já colocava a imagem na coluna 1) — nas seções normais (texto
  primeiro no HTML, sem `.reverse`), o TEXTO é que ficava com a coluna
  maior, porque `grid-template-columns` define largura por **posição
  de coluna**, não por tipo de conteúdo, e só a posição visual mudava
  com `order`, não a coluna física. Corrigido: `.deepdive-grid` base
  usa `0.85fr 1.15fr` (texto menor na coluna 1, imagem maior na coluna
  2 — bate com a ordem padrão do HTML) e `.deepdive-grid.reverse` usa
  `1.15fr 0.85fr` (imagem maior na coluna 1, pois o `order` bota a
  imagem lá) — ou seja, a imagem SEMPRE fica na coluna maior, não
  importa de que lado ela aparece visualmente.
- **Cursor de demonstração agora repete em loop** em vez de tocar uma
  vez só: virou uma timeline com `repeat:-1, repeatDelay:1.2` que só
  toca (`.play()`) enquanto a screenshot está na tela e pausa
  (`.pause()`) quando sai (`ScrollTrigger` com `onEnter`/`onEnterBack`/
  `onLeave`/`onLeaveBack`), pra não gastar processamento com 13 timelines
  rodando escondidas fora de vista.
- **Tilt 3D no hover** em praticamente todo cartão do site
  (`.feature-card`, `.step-card`, `.segment-card`, `.indicator-card`,
  `.founder-card`, `.purpose-card` — 21 elementos) - o cartão inclina
  seguindo o mouse (`rotationX`/`rotationY` + leve `scale`), efeito 3D
  barato (só roda no hover, sem loop/RAF constante). **Bug real achado
  e corrigido durante o teste**: a propriedade do GSAP pra rotação 3D é
  `rotationX`/`rotationY`, **não** `rotateX`/`rotateY` (esse é o nome
  da propriedade CSS nativa `rotate`) — usar o nome errado faz o GSAP
  tentar mexer na propriedade CSS individual em vez da rotação de
  verdade e solta o aviso "not eligible for reset" no console sem
  girar nada. Segundo bug achado no mesmo teste: `gsap.quickTo`
  separado por sub-propriedade (`rotateX`/`rotateY`/`scale` cada um
  com seu próprio `quickTo`) não funciona quando são 3 sub-propriedades
  do mesmo `transform` - trocado por um único `gsap.to()` combinado
  com `overwrite:'auto'` por chamada de `mousemove`.
- **Segunda cena 3D**, no CTA final (`#contato`) - `three-hero.js`
  virou uma função reaproveitável (`initNodeNetwork(canvasId, opts)`),
  chamada duas vezes: `#hero-3d` (70 nós, como antes) e `#cta-3d` (36
  nós, mais discreta, opacidade 0.4) — mesma técnica (rede de nós
  conectados), efeito "abre com 3D, fecha com 3D". Desliga em mobile e
  `prefers-reduced-motion` igual o Hero.
- **Fundo animado em toda seção** (exceto Hero e CTA final, que já têm
  cena 3D própria - bolha ali seria poluição) - camada decorativa
  injetada via JS (`.section-bg-fx`, um `<div>` com 2 `<span class="bg-blob">`
  por seção) com blur pesado e drift lento via `@keyframes` CSS puro
  (não depende do GSAP, sempre funciona). Resolve o "quero coisa
  rolando no fundo em toda parte" sem precisar de WebGL em toda seção
  (o que exigiria fundo transparente nas seções, quebrando o design
  atual de blocos de cor sólida) - `.container` ganhou
  `position:relative;z-index:1` pra ficar sempre acima da camada de
  fundo.
- **Reveal individual em vez de bloco único**: `.steps-grid` (Como
  funciona), `.founders-grid` (fundadores) e `.flow-row`
  (Beneficiamento) tinham `.reveal` só no `<div>` pai - os 4 cards/3
  fundadores/7 passos do fluxo entravam todos juntos de uma vez.
  Movido `.reveal` pra cada item individual, aproveitando o sistema de
  `ScrollTrigger.batch` genérico que já existe (sem JS novo) - agora
  cada um entra em sequência (stagger), inclusive o fluxo de produção
  (`.flow-row`) que entra passo a passo da esquerda pra direita, o que
  faz sentido pro conteúdo (é um processo). Mesma coisa nos 17
  `.diff-chip` (Diferenciais), que agora cascateiam em vez de aparecer
  tudo de uma vez.
- **Nota de metodologia de teste** (fica registrado pra não perder
  tempo reinvestigando): nesta sessão, chamadas de `gsap.getProperty()`
  feitas via automação de teste voltavam `0` mesmo depois de tweens
  completarem, porque a aba não estava genuinely visível
  (`document.hidden`) e o ticker do GSAP (baseado em
  `requestAnimationFrame`) simplesmente não progride enquanto a aba
  está oculta - não é bug do site, é só um efeito colateral do ambiente
  de teste (confirmado: os mesmos tweens funcionam normal assim que a
  aba fica visível de verdade). **Atualização**: descobri depois que
  isso acontece às vezes mesmo com `document.hidden === false` nesse
  ambiente de automação (parece que o navegador só renderiza frame
  quando pede um screenshot, não continuamente) - o jeito confiável de
  testar um tween/timeline sem depender de tempo real é chamar
  `.progress(1)` direto nele (ou na tween específica), nunca esperar
  com `setTimeout` e torcer.

## Ajustes finos de acabamento, parte 3 (11/09/2026, mesmo dia — Carlos
mandou print mostrando a seção Multi-IA quebrada)

- **Bug real achado e corrigido - Multi-IA sobrepondo conteúdo**: a
  causa era o `pin` do `ScrollTrigger` (mesmo já limitado só à área
  imagem+texto na rodada anterior) - o pin reserva espaço na página
  igual à distância de scroll da animação (`end: '+=1000'`, ou seja,
  1000px extras), criando um vão enorme entre o par imagem+texto e a
  tira de insights logo abaixo (seção chegou a medir quase 1900px de
  altura). Dependendo de onde a pessoa parava o scroll dentro desse
  vão, a tira de insights (que já estava com opacidade 1 de propósito)
  podia aparecer visualmente por cima do conteúdo pinado. Essa seção já
  tinha dado problema 2 vezes antes (corte de conteúdo em tela pequena,
  depois esse vão) - decisão: **removido o `pin` de vez**. Multi-IA
  agora é uma seção normal, com o mesmo reveal em batch + zoom de
  screenshot + cursor de demonstração que todas as outras já usam (que
  nunca deram problema). Perde o efeito de "ficar presa na tela", ganha
  robustez - trade-off que valeu a pena depois de 3 rodadas de bug na
  mesma seção.
- **Imagens ainda maiores**: `.deepdive-grid` foi de `0.85fr 1.15fr`
  pra `0.72fr 1.28fr` (a coluna da imagem virou ~64% da largura, era
  ~57%) - a screenshot passou de ~635px pra ~712px de largura em
  desktop. Não há mais o que ganhar em nitidez além disso: as imagens
  de origem já são 1680×1050 (conferido arquivo por arquivo), a essa
  largura ainda estão sendo **reduzidas** (nunca ampliadas), que é
  justamente o cenário mais nítido possível num navegador.
- **Por que não virou "código" (HTML/CSS recriado)**: o Carlos pediu
  pra transformar as screenshots em código achando que ficaria mais
  nítido que "print". Não é bem assim - o problema de nitidez era o
  tamanho de exibição (resolvido acima), não o formato do arquivo (PNG
  na resolução que está já é mais nítido que qualquer downscale
  consegue perder). Recriar ~20 telas do sistema em HTML/CSS seria um
  trabalho de semanas, arriscaria ficar sutilmente diferente do sistema
  real (indo contra o "não quero nada de mentira ou genérico" que foi
  pedido explicitamente quando decidimos usar screenshot real em vez de
  mockup CSS) e não resolveria o problema de verdade. Não implementado
  por esse motivo - registrado aqui pra não reconsiderar sem lembrar do
  porquê.
- **Cursor de demonstração virou "navegação entre telas reais"**: em
  vez de só passear na mesma imagem, agora o cursor vai até um item
  do menu lateral (mesma posição em toda screenshot, porque é o mesmo
  app/sidebar em todas as 23 imagens - tabela `NAV_ITEMS` em
  `script.js`), "clica" (efeito de ripple), e a própria `<img>` troca
  pra uma tela real diferente (crossfade rápido, tipo "flash" de
  transição), fica um instante, e volta pra imagem original da seção -
  como se fosse navegação de verdade dentro do sistema, mas sempre com
  screenshots 100% reais (nenhuma capturada ou recriada especificamente
  pra essa animação). Cada seção mapeia pra um item de menu diferente
  (por índice, rotacionando pela lista de 14 itens de menu mapeados),
  então a página toda mostra uma boa variedade de telas ao longo do
  scroll. Posições do menu lateral são aproximadas (baseadas em
  inspeção visual de uma screenshot, não em coordenadas exatas do
  sistema) - se um dia o menu lateral do sistema mudar de ordem/adicionar
  item, essa tabela pode ficar desatualizada (não é crítico, o efeito
  ainda funciona visualmente mesmo se o cursor não parar exatamente em
  cima do texto certo).

## Ajustes finos de acabamento, parte 4 (11/09/2026, mesmo dia)

- **Cursor de demonstração corrigido de verdade**: o Carlos reportou que
  "algumas animações de cursor não funcionam" e que a troca de tela
  ficava "seca". Achei os dois problemas: (1) a troca de imagem
  (`swapTo`) rodava numa tween **separada**, fora da timeline principal
  do cursor - se o `ScrollTrigger` pausasse a timeline bem no meio da
  troca (usuário rolando rápido), a imagem podia ficar travada apagada
  pela metade, porque pausar a timeline não pausava essa tween solta;
  (2) a transição em si era um "flash" (escurece tudo, troca o `src`,
  clareia de novo), sem nenhuma imagem visível durante a troca - por
  isso parecia seco. **Corrigido**: agora cada `.screenshot-frame` tem
  uma segunda `<img class="demo-cursor-overlay">` por cima da original,
  e o crossfade (opacidade 0→1→0 dela) é feito com `.to()` **dentro**
  da própria timeline do cursor - logo pausar/retomar em qualquer ponto
  sempre mostra um estado visual válido (nunca trava pela metade), e a
  transição agora é um blend de verdade entre as duas imagens, não um
  corte. Testado forçando `timeline.progress()` em vários pontos
  (inclusive pausado no meio) - sempre um resultado visual coerente.
- **4 estilos de fundo animado** aplicados nas seções que o Carlos
  pediu pra ficarem diferentes: **Segurança** → rede de pontos (`.bg-fx-dots`,
  remete a "rede protegida"), **Experiência** → aurora/gradiente mesh
  (`.bg-fx-aurora`, ganhou `id="experiencia"` que não tinha antes),
  **Diferenciais** → grade técnica (`.bg-fx-grid`), **Requisições** →
  partículas flutuantes (`.bg-fx-particles`). Implementado em
  `script.js` (função `BG_FX_VARIANTS`, mapeando `section.id` → estilo)
  + `style.css`. O resto das seções continua com o brilho suave padrão
  (não trocado - só as 4 pedidas).
- **Pendências aguardando decisão do Carlos** (mandei um Artifact com
  exemplos, ele pediu mais opções e mandei mais 5 - aguardando ele
  escolher/confirmar antes de trocar algo):
  - Carlos gostou de mais 3 (ondas suaves, constelação+estrela
    cadente, ícones flutuantes) além dos 4 já aplicados no site (rede
    de pontos/aurora/grade técnica/partículas) - ainda não decidiu
    quais seções usam essas 3 novas (nenhuma aplicada ainda). Também
    pediu algo mais "de marca" (ligado ao nome GestãoCheck) - mandei
    2 variantes usando o próprio ✓ da marca (checks flutuantes / rede
    de pontos com check nos nós) no mesmo Artifact - aguardando decisão
    final de tudo antes de aplicar mais nada.
  - **Ideia grande, ainda não implementada**: abertura do site com a
    logo gigante num fundo animado (rede de pontos ou outro estilo),
    que "fecha" conforme o usuário rola pra baixo revelando o Hero/site
    normal, e fecha de volta pra logo no final da página (loop natural
    de scroll bidirecional - sem precisar de lógica de loop de verdade,
    é só scrub nos dois sentidos). Mandei um **rascunho isolado**
    (Artifact, não está na produção) pra ele sentir o conceito antes de
    eu investir tempo integrando na página real - precisa da aprovação
    dele antes de virar código de verdade.
  - **Vitrine clicável do sistema** - o Carlos mandou o código real
    (HTML+CSS) da tela Início: `dashboard.css` + `inicial.html`. Achado
    importante: **o sistema principal também é multi-página estático
    sem framework/build step** (mesma filosofia deste site, confirmado
    no próprio comentário do CSS dele sobre `@view-transition`) - dá
    pra reaproveitar a marcação da sidebar quase 1:1, sem precisar
    converter de React/Vue. Fontes reais: Manrope (corpo) + Fraunces
    (títulos/logo), via Google Fonts. Cor da sidebar (`--sidebar-bg:
    #1E3540`) é fixa entre tema claro/escuro (só a área de conteúdo
    muda), por isso bate com o navy das nossas screenshots (que são
    todas tema escuro) mesmo a página `dashboard.css` mandada sendo a
    variante clara. **Decisão do Carlos (2ª rodada)**: nada de print
    dentro da vitrine, nem na tela Início - quer HTML/CSS renderizado
    de verdade em toda tela (mais nítido que imagem, e ele topou mandar
    o código de cada uma, sem JS). Atualizei o protótipo: a tela
    **Início já é 100% HTML/CSS ao vivo** (números fictícios digitados
    à mão, já que sem o `inicial.js` os campos nasceriam zerados) -
    Estoque/CMV/CMO/Caixa ainda são screenshot, aguardando ele mandar
    o código de cada uma pra completar a conversão. Ainda é protótipo
    solto (Artifact), não é a implementação final - falta ele aprovar
    antes de integrar no `index.html` de verdade.
  - **Abertura "estilo GTA V"**: o rascunho v1 (cortina fechando ao
    scroll) não agradou - Carlos queria mais dramático, tipo GTA V (zoom
    pra dentro da logo, escurece, revela) - reescrevi com essa técnica.
    v2 ainda estava scroll-scrubbed (precisava rolar pra disparar); ele
    esclareceu que quer **automático** (toca sozinho ao carregar a
    página, tipo tela de loading de jogo - "GTA V" não tinha nada a ver
    com scroll). v3 (atual, mesmo link): sequência com `setTimeout` em
    estágios (logo aparece → zoom dramático com blur → escurece no auge
    → clareia → libera o site), ~3.7s, sem depender de scroll -
    `document.body.style.overflow` fica travado até o fim da sequência.
    Ainda falta decidir o fundo animado de trás da logo e ele aprovar o
    timing.
  - **Fundos animados, 2ª rodada**: Carlos não curtiu nenhuma das
    variantes de checkmark que propus, e voltou atrás nas outras
    escolhidas antes (aurora/grade técnica/partículas/ondas/
    constelação/ícones) - quer manter **só rede de pontos** confirmada
    e ver opções novas, "de site atual", nada repetido. Limpei o
    Artifact (só rede de pontos + 5 conceitos novos: flow field/linhas
    fluidas, contorno topográfico, ruído/grain animado, células
    orgânicas tipo voronoi, palavras-fantasma do produto flutuando).
    **Atenção**: as 3 seções que já usam aurora/grade-técnica/partículas
    no `index.html`/`style.css`/`script.js` (Experiência/Diferenciais/
    Requisições, ver "Ajustes finos de acabamento, parte 4" acima)
    continuam assim por ora - ele não pediu pra reverter o que já está
    no site, só pediu novas opções pra decidir depois. Não trocar nada
    no código de produção até ele escolher os novos estilos.
  - Ele também ofereceu mandar prompts pra eu rodar em outras
    ferramentas de IA (tipo Gamma, "Dora") se eu achar que ajuda a ter
    mais ideias de visual - não usado ainda, só registrado como opção
    disponível se algum dia fizer sentido pedir.

## Ajustes finos de acabamento, parte 5 (11/09/2026, mesmo dia)

- **10 fundos animados aplicados de verdade no site** (produção, não é
  mais rascunho) - Carlos fechou a decisão depois de 3 rodadas: rede de
  pontos, aurora, grade técnica, partículas (rodada 1) + ondas,
  constelação+estrela cadente, ícones flutuantes (rodada 2) + flow
  field, contorno topográfico, palavras-fantasma (rodada 3). Implementado
  em `style.css` (`.bg-fx-waves`/`.bg-fx-shoot`/`.bg-fx-icons`/
  `.bg-fx-flow`/`.bg-fx-topo`/`.bg-fx-ghost`, além dos 4 já existentes) +
  `script.js` (`BG_FX_VARIANTS` agora cobre as 27 seções do site, exceto
  Hero/CTA final que já têm cena 3D própria - antes só 4 seções tinham
  estilo próprio, resto usava o brilho genérico de 2 bolhas). Ganharam
  `id` novo pra poder ser alvo do mapeamento: `#indicadores` (CMV+CMO+CMC),
  `#proposito` (Missão/Visão), `#fundadores`. Palavras-fantasma usa
  palavra própria por seção (ex: CMO mostra "CMO"/"Mão de obra", Multi-IA
  mostra "IA"/"Insights") via `buildGhostFx(words)` - reaproveitável pra
  seção nova, só passar a lista de palavras.
- **Abertura "GTA V" corrigida (de novo)**: Carlos confirmou que quer
  scroll/toque mesmo (não automático - a sugestão anterior dele de
  "automático" foi mal entendida, ele só estava descrevendo o efeito
  visual, não o gatilho). v4 do rascunho (mesmo Artifact/link): duas
  zonas de scroll-scrub simétricas, mesma curva de zoom+blur+escurece
  nas duas - a do topo revela o Hero, a do fim (depois de rolar o site
  inteiro) fecha de volta na logo ("se afastando"). Tem um `<div>` preto
  de amortecimento depois da zona de fechamento pra não ficar num estado
  "meio clareando" bem no fim exato da página.
- **Acesso à pasta inteira do sistema principal liberado pelo Carlos**:
  `C:\Users\USER\OneDrive\Área de Trabalho\Projetos\GestãoCheck\Apps\
  Chestaocheck-operacional` (`pages/*.html` + `styles/*.css`) - só
  LEITURA, nunca escrever nada lá (a regra de "não mexer no repo do
  sistema" continua valendo pra escrita, essa liberação foi só pra
  copiar conteúdo de referência pro site de vendas). Achado valioso:
  `styles/tema-escuro.css` tem as cores reais do tema escuro (diferente
  do que eu tinha assumido por aproximação) - `--sidebar-bg:#14232B`,
  `--page-bg:#0A1216`, `--card-bg:#1D303A`, `--texto:#EAF1F3`, etc. Já
  usei esses valores exatos no protótipo da vitrine interativa.
  **Vitrine interativa agora com 3 telas 100% em HTML/CSS ao vivo**
  (Início, CMV, CMO - sem JS, números fictícios à mão) - Estoque e Caixa
  ficam como screenshot por enquanto porque o conteúdo delas é uma
  lista/tabela populada via JS (`id="lista-checklist"` etc.) sem exemplo
  de item pra copiar o formato exato - preciso ver a lista renderizada
  de verdade (ou o Carlos passar 4-5 linhas de exemplo) antes de
  inventar o formato. **Pendente**: ainda tem ~13 telas do sistema não
  convertidas (Despesas, Beneficiamento, Avarias, Checklists, Patrimônio,
  Manutenção, Requisição, Relatório, Configurações, etc.) - trabalho
  grande o bastante pra continuar aos poucos, não é algo pra tentar
  terminar tudo de uma vez.

## Auditoria de responsividade (12/09/2026 — Carlos pediu pra melhorar
todas as telas e conferir mobile "por completo")

Passei o site inteiro por várias larguras (320/375/414/667×375 paisagem/
768/900/1050/1200px) medindo `getBoundingClientRect()` de verdade em vez
de só olhar print (o ambiente de teste ficou instável pra screenshot
várias vezes essa sessão) - achei e corrigi 4 bugs reais:

- **Logo maior no mobile que no desktop** (bug real, `style.css`): a
  regra `@media (max-width:768px) .logo-img` tinha `height:72px`
  (contra 64px no desktop) - provavelmente sobrou de alguma rodada
  antiga de "aumenta a logo" sem reparar que era dentro do bloco mobile.
  Corrigido pra `height:42px; max-width:170px` (proporcional ao header
  bem mais compacto do celular).
- **Hambúrguer colado na logo em vez de ir pro canto direito**: faltava
  `justify-content: space-between` no `.nav-content` mobile (só tinha
  `position:relative`, pro dropdown) - com só 2 itens visíveis
  (logo + hambúrguer) e sem isso, eles ficavam grudados à esquerda por
  padrão do flexbox, sobrando um vão vazio enorme à direita.
- **Botão "Solicitar demonstração" do menu cortado entre 769-1049px**
  (bug real, sitewide): o menu desktop (5 links + botão) só cabia sem
  cortar a partir de ~1050px, mas virava hambúrguer só abaixo de 768px -
  nessa faixa de ~280px de largura o botão ficava parcialmente fora da
  tela (não gerava scroll horizontal porque o header é `position:fixed`,
  então não dava pra perceber olhando só o scroll da página). Criado um
  `@media (max-width:1100px)` **só pras regras do menu** (novo bloco,
  separado do `@media (max-width:768px)` que já existia e cuida de
  todo o resto do layout mobile) - agora o hambúrguer entra bem antes
  de faltar espaço, sem afetar nenhuma outra regra que já funcionava
  bem nessa faixa (ex: `.deepdive-grid` continua 2 colunas até 768px,
  não precisa virar 1 coluna só porque o menu precisou).
- **Screenshots colapsando pra ~0px de altura antes de carregar** (bug
  real, sitewide, achado auditando `#multi-ia` mas afeta toda
  `.screenshot-frame img`): como são todas `loading="lazy"` e o CSS não
  reservava proporção nenhuma, o navegador não sabia a altura até a
  imagem carregar de verdade - resultado: um "pulo" de layout (CLS) ao
  rolar, pior ainda em conexão lenta/mobile. Corrigido com
  `aspect-ratio: 1680/1050` (a proporção real de toda screenshot,
  conferida arquivo por arquivo numa rodada anterior) + `object-fit:
  cover` em `.screenshot-frame img` - agora o espaço certo já fica
  reservado antes mesmo da imagem carregar.

**Conferido e já estava OK** (sem mudança): menu mobile (abre/fecha,
todos os itens com alvo de toque ≥39px), modal "Com quem você quer
falar" (3 fundadores, bem espaçado, WhatsApp funcionando), hero-3d/
cta-3d corretamente ausentes em mobile/paisagem curta, fundo animado
das 27 seções (legível, não atrapalha o texto, `pointer-events:none`
não bloqueia clique em nada), carrossel "Veja por dentro", cursor de
demonstração (visível e animando normal em tela de celular), nenhum
`overflow-x` real da página em nenhuma largura testada (320px até
1440px).

## Vitrine interativa integrada de verdade + fundo da Segurança
corrigido (12/09/2026, mesmo dia)

- **Bug real achado e corrigido - fundo animado da Segurança**: Carlos
  reportou "estranho, não tá os pontos, as linhas estão grossas". Duas
  causas reais: (1) `.security::after` (um padrão de grade antigo, de
  antes de toda essa rodada de fundos animados, decorando a seção desde
  a conversão pro tema escuro) competia visualmente com a rede de
  pontos nova por cima - **removido** (superado pela rede de pontos,
  que já cobre o mesmo papel de "textura de fundo"); (2) as linhas SVG
  (`.bg-dot-lines line`, também usadas em `.bg-flow-line`/`.bg-topo-line`)
  usam `viewBox="0 0 100 100"` com `preserveAspectRatio="none"`
  esticado pra caber em cada seção - numa seção bem mais larga que alta
  (como a Segurança), esse esticamento não-uniforme distorcia a
  espessura do traço (ficava "grossa"). Corrigido com
  `vector-effect: non-scaling-stroke` (propriedade SVG feita
  exatamente pra isso - mantém a espessura declarada não importa o
  quanto o SVG seja esticado) nas 3 classes de linha - resolve o mesmo
  problema em qualquer seção que algum dia fique bem larga/baixa, não
  só a Segurança.
- **Vitrine interativa "Veja por dentro" — substituiu o carrossel de
  verdade, com TODAS as 14 telas reais funcionando** (Carlos: "tu tem o
  código então usa, faz com que todas as telas funcione e já pode
  colocar no site"). O `#veja-por-dentro` (antes um carrossel de
  screenshot) virou a vitrine: sidebar real (mesmos ícones/ordem do
  `inicial.html` que o Carlos mandou) + 14 telas em HTML/CSS ao vivo
  (Início, Estoque, CMV, CMO, CMC, Despesas, Beneficiamento, Avarias,
  Ocorrências, Checklists, Manutenção, Requisição, Patrimônio,
  Relatórios) - clique na sidebar troca a tela, sem JS por trás (só
  troca de classe `.active`, `script.js`), números fictícios digitados
  à mão. **Caixa não é item de menu** (achado ao ler o código: no
  sistema real, Caixa é uma ABA dentro de CMC, não item de sidebar
  próprio - corrigido a suposição errada do protótipo anterior).
  Componentes CSS novos, todos escopados em `.sys-vitrine` (variáveis
  `--sys-*` com as cores reais de `tema-escuro.css`, prefixo pra nunca
  colidir com o resto do site) - **reaproveitados entre várias telas**
  em vez de um componente bespoke por tela (dado o volume): `.hero-cmo`
  + `.kgrid`/`.kcard` (CMO/CMC/Manutenção/Requisição, que usam essa
  marcação de verdade no sistema), `.metrics`/`.metric-card` (Início/
  Checklists, também marcação real), `.resumo-cards`/`.resumo-card`
  (Estoque/Despesas/Beneficiamento/Avarias/Relatórios - real também,
  mas usado em mais telas do que no sistema original pra não precisar
  de componente novo por tela), `.tabela`/`.tabela-wrap` (toda tela com
  lista), `.cmv-status-row` (anel de progresso do CMV, único). Simplificação
  consciente: Despesas/Patrimônio no sistema real têm um layout próprio
  com gráfico de categorias (`.desp-resumo`/`.patr-resumo`, barras) -
  aqui usei uma versão mais simples (`.sys-total-card` + tabela) pra não
  precisar construir mais 2 sistemas de componente bespoke; Relatórios
  no sistema real é multi-aba com DRE/Curva ABC/Insights - aqui virou
  uma "visão geral" simples (3 cards + tabela de composição). Se o
  Carlos quiser mais fidelidade nessas telas específicas depois, dá pra
  detalhar - ficou registrado aqui o porquê da simplificação.
  Removido o CSS/JS do carrossel antigo (`.screens-showcase*`,
  `showcaseGoTo` etc.) - código morto depois da troca.

## Cursor de demonstração corrigido, screenshots maiores e demo de chat
no Multi-IA (12/09/2026, mesmo dia — feedback do Carlos depois de ver a
vitrine no ar)

- **Bug real achado e corrigido - cursor de demonstração clicava no
  item errado da sidebar**: Carlos reportou "no estoque a animação
  clica em início" (mostrava o nome/posição errada e trocava pra tela
  errada). Causa real: o item de menu "clicado" em cada
  `.screenshot-frame` vinha de `NAV_ITEMS[i % NAV_ITEMS.length]`, onde
  `i` era a ORDEM da seção na página (`.forEach((frame, i) => ...)`) -
  isso funcionava só enquanto a ordem das seções batesse com a ordem da
  tabela `NAV_ITEMS`. Depois que Multi-IA/Caixa/DRE/Curva ABC entraram
  no meio das seções (rodadas anteriores), a ordem descolou e cada
  seção passou a apontar pro item de menu errado. **Corrigido pra
  sempre buscar pelo nome do arquivo, nunca pela posição**: cada frame
  acha seu próprio índice em `NAV_ITEMS` procurando o arquivo da
  própria screenshot (`NAV_ITEMS.findIndex(item => item.file ===
  ownFile)`) - imune a reordenação futura de seções. Aproveitei pra
  inverter a lógica pra fazer mais sentido também (pedido do Carlos:
  "ela tem que começar em uma tela anterior e o cursor clicar na tela
  que é pra estar"): agora a imagem BASE (`<img>`, por baixo) já é
  sempre a tela certa da seção (como sempre foi - vem fixa no HTML), e
  o OVERLAY (por cima) mostra a tela ANTERIOR da sidebar (item de menu
  logo acima, ex: Estoque mostra Início por cima, CMV mostra Estoque
  por cima) - o cursor clica na posição real do item que é ESTA seção,
  o overlay se desfaz revelando a tela certa por baixo. Telas que não
  são item direto da sidebar (Multi-IA, Caixa - aba dentro de CMC,
  DRE/Curva ABC - abas dentro de Relatórios, 2FA - dentro de
  Configurações) não têm mais demo de navegação por menu (fingir que dá
  pra chegar nelas com 1 clique na sidebar seria incorreto) - ficam só
  com um clique decorativo do cursor, sem trocar de tela.
- **Demo de "abrir o chat" no Multi-IA**: Carlos pediu algo diferente
  pra essa seção especificamente ("a animação abrindo o chat e
  escrevendo algo") - em vez do cursor genérico de navegação (que nem
  fazia sentido ali, já que o Multi-IA abre por um botão flutuante, não
  por item de sidebar), a seção ganhou sua própria demo
  (`initIaChatDemo` em `script.js`, CSS em `.ia-chat-*`): um botão
  flutuante (`.ia-chat-fab`) pulsa, abre um balão de chat com bounce
  (`.ia-chat-bubble`), "digita" uma pergunta real letra por letra
  ("Qual foi meu Prime Cost esse mês?", via tween de `onUpdate` sobre
  um contador de caracteres - sem plugin de texto, só JS simples) com
  cursor piscando, segura um instante e fecha de novo, em loop - a
  própria screenshot por baixo já mostra a resposta pronta do
  assistente, então dá a sensação de "pergunta feita, resposta ali".
- **Screenshots maiores no desktop**: Carlos achou as imagens pequenas
  demais pra ler o conteúdo. Duas mudanças em `.deepdive-grid`
  (`style.css`): (1) proporção texto/imagem foi de `0.72fr 1.28fr` pra
  `0.65fr 1.35fr` (ganho em toda tela ≥769px, sem risco de overflow -
  ainda dentro do `.container` de 1200px de sempre); (2) telas de
  monitor grande (`@media (min-width: 1400px)`) ganham um "breakout" -
  o `.deepdive-grid` quebra pra fora do `.container` até 1360px,
  centralizado simetricamente (`margin-left/right: calc((100% -
  1360px) / 2)`). Testado: 1152px de imagem em laptop comum (1366px,
  abaixo do breakout) e ~894px em monitor grande (1600px, com
  breakout), nenhum overflow horizontal em nenhum dos dois. Carlos deu
  liberdade explícita pra, se eu achar melhor, converter mais telas de
  screenshot pra HTML/CSS ao vivo (ele topa mandar o código de cada
  uma, igual já fiz pra Início/CMV/CMO na vitrine "Veja por dentro") -
  não feito nessa rodada (é o mesmo trabalho grande e incremental já
  registrado antes), fica registrado como opção em aberto.

## Vitrine com Configurações, sidebar corrigida, imagens maiores de
novo e nova cena 3D na Segurança (12/09/2026, mesmo dia — mais uma
rodada de feedback)

- **Bug real achado e corrigido - sidebar da vitrine não rolava**: com
  15 itens de menu (depois de somar Configurações, ver abaixo), a lista
  passou a ser mais alta que os 620px do `.sys-frame`, mas o excesso
  simplesmente sumia (cortado pelo `overflow:hidden` do frame) em vez
  de rolar. Causa clássica de flexbox: `.sys-nav` é `flex:1` dentro de
  uma coluna flex (`.sys-sidebar`) com `overflow-y:auto`, mas sem
  `min-height:0` um filho flex nunca encolhe abaixo do tamanho do seu
  próprio conteúdo (`min-height:auto` é o padrão) - então ele nunca
  chegava a ficar "pequeno o bastante" pra precisar rolar de verdade.
  Corrigido com `min-height: 0` em `.sys-nav` (`style.css`). Testado via
  `scrollHeight` vs `clientHeight` (621 vs 562, agora rola de verdade) e
  arrastando a rolagem manualmente - todos os 15 itens acessíveis.
- **Tela de Configurações adicionada na vitrine** (16ª... na verdade
  15ª tela, contando com as 14 de antes): nova pane `configuracoes`,
  usando a linguagem visual real da tela de Configurações do sistema
  (`configuracoes.html`/`.css`, lido no repo principal) - fileira de
  abas (Perfil/Notificações/Setores e categorias/Usuários/Pagamentos/
  Suporte/IA e Termos de Uso, só a primeira "ativa" visualmente, sem
  troca real - mesmo padrão que outras panes já usam pra mostrar abas
  do sistema real sem precisar implementar a troca de verdade) + card
  de Perfil (avatar/nome/e-mail) + card de Segurança (status do 2FA
  ativado, complementa a seção "Segurança" do site que já mostra o QR
  code de ativação) + card de Setores reaproveitando os mesmos nomes já
  usados no restante da vitrine (Cozinha/Bar/Estoque Central/Salão) pra
  manter consistência de dados fictícios entre telas.
- **Texto da seção reescrito pra não soar como "isso é o sistema
  inteiro"**: Carlos apontou que o texto dava a entender que a vitrine
  ERA o sistema completo, quando na verdade é uma versão simplificada
  (menos telas, componentes reaproveitados entre seções diferentes,
  sem lógica de verdade por trás). Título/descrição/legenda trocados
  pra deixar isso explícito: "Apresentação simplificada do sistema, com
  o código de verdade (não é print) e dados fictícios — o sistema
  completo tem muito mais tela e detalhe do que dá pra caber aqui" (era
  "Essa é a interface real... clique nos itens do menu, dados
  fictícios").
- **Screenshots maiores de novo**: mais uma rodada de "aumenta mais um
  pouco" - proporção do `.deepdive-grid` foi de `0.65fr 1.35fr` pra
  `0.6fr 1.4fr`, e o breakout de monitor grande (ver rodada anterior)
  foi de `1360px`/`≥1400px` pra `1440px`/`≥1500px` (ainda com folga
  segura antes do limite da media query, sem risco de overflow).
- **Ícones flutuantes corrigidos pra cobrir a seção inteira** (bug real
  achado ao investigar "a parte de cima do Nosso Propósito tá sem
  nada"): `buildIconsFx()` (`script.js`) fazia todo ícone nascer de
  `bottom: -30px` e subir só 320px (`style.css`) - numa seção normal
  isso cobre a altura toda, mas "Nosso Propósito" tem 2 grids
  empilhados (Missão/Visão + 6 valores) e fica bem mais alta que 320px,
  então os ícones nunca chegavam nem perto do topo (só a parte de baixo,
  perto do grid de valores, sempre teve ícone visível - exatamente o
  "só o fim tem animação" que o Carlos relatou). Corrigido dando a cada
  ícone um `top` aleatório (0-100%) espalhado pela seção inteira, e
  trocando a animação de "subir 320px numa direção só" por um balanço
  local (`translateY(-36px)`, vai e volta) - resolve em qualquer seção
  que use `bg-fx-icons`, não só essa (usado também em "Como funciona",
  Beneficiamento e Relatórios).
- **Segurança ganhou cena 3D própria** (pedido: "algo mais tecnológico,
  diferente, chamativo, grandioso" - trocar a rede de pontos simples por
  algo mais forte). Nova função `initSecurityShield()` em
  `three-hero.js` (reaproveita o mesmo import do Three.js já usado por
  Hero/CTA, sem CDN novo): um icosaedro de wireframe ciano (o "núcleo
  seguro", com um miolo sólido bem translúcido por dentro simulando
  glow sem custo de post-processing/bloom), um anel coral inclinado
  girando num eixo diferente (efeito de halo/escaneamento orbitando o
  núcleo) e uma nuvem de ~46 pontos orbitando ao redor (dados
  protegidos) - tudo pulsando devagar (respiração, via seno do tempo
  decorrido) pra não ficar estático. Visualmente bem diferente da rede
  de nós do Hero/CTA (que é pontos+linhas difusos) - aqui é um objeto
  sólido central com camadas girando em velocidades distintas. Canvas
  novo `#security-3d`, mesma regra de desligar em `≤768px` e
  `prefers-reduced-motion` que Hero/CTA já seguem. Ganhou também uma
  linha de "escaneamento" (`.sec-scan`, CSS puro/keyframe, não depende
  do GSAP nem do WebGL) varrendo a seção de cima a baixo em loop, por
  cima da cena 3D - reforça o tema "scanner de segurança" por
  praticamente zero custo. A seção `seguranca` saiu do mapeamento
  genérico `BG_FX_VARIANTS` (`script.js`) e entrou na lista de exceção
  junto com Hero/CTA final (seção que já tem cena 3D própria não ganha
  fundo genérico por cima - seria poluição visual).
- **Bug real achado e corrigido nas outras seções "constelação + estrela
  cadente"** (achado ao mexer no CSS acima, não pedido pelo Carlos, mas
  direto no meio do código que eu já estava tocando): os seletores de
  estilo dos pontos/linhas da constelação (`.bg-dot`/`.bg-dot-lines`)
  só existiam escopados como `.bg-fx-dots .bg-dot` etc., mas
  `buildShootFx()` (usado por Problemas/Indicadores/Patrimônio/Sobre,
  classe `.bg-fx-shoot`) reaproveita a mesma função `buildDotsFx()` pra
  gerar os pontos - como o container ali é `.bg-fx-shoot`, não
  `.bg-fx-dots`, os pontos/linhas da constelação nunca tinham estilo
  nenhum nessas 4 seções (só a estrela cadente aparecia, os pontos
  ficavam invisíveis). Ia virar um bug ainda mais visível agora que
  `.bg-fx-dots` não é usada em lugar nenhum sozinha (Segurança migrou
  pra cena 3D) - corrigido escopando os seletores pras duas classes-pai
  (`.bg-fx-dots .bg-dot, .bg-fx-shoot .bg-dot`, etc.).

## Cadeado no lugar do icosaedro, camadas da Segurança corrigidas,
cursor certo em Caixa/DRE/Curva ABC, Início bem mais completo e
rolagem do sidebar de verdade (12/09/2026, mesmo dia — mais uma rodada)

- **Bug real achado e corrigido - conteúdo da Segurança "misturado" com
  a cena 3D**: Carlos reportou que o título/texto da seção parecia por
  baixo da animação. Causa: `.section-header` (o `<h2>`/`<p>` da seção)
  é `position: static` por padrão - na ordem de pintura do CSS,
  elemento static entra ANTES de qualquer elemento posicionado (mesmo
  com `z-index:0`, caso do canvas/scan-line), então o header pintava
  por baixo da cena 3D mesmo sem nenhum z-index "errado" à vista.
  `.security-split` (os cards) já tinha `z-index:1` explícito e por
  isso nunca teve esse problema - só faltava no header. Corrigido com
  `.security .section-header { position:relative; z-index:1 }`. Também
  aumentei a opacidade de fundo dos `.security-card` (era quase
  transparente, 0.05) pra um fundo sólido com `backdrop-filter: blur`
  (efeito vidro fosco) - com a cena bem mais cheia que a rede de pontos
  antiga, ficava tudo cruzando o texto por trás.
- **Ícones "quadrados" viraram cadeado de verdade**: trocado o
  icosaedro genérico por um cadeado remontado com primitivas do
  Three.js (`initSecurityShield` em `three-hero.js`) - corpo (Box com
  segmentos extras pro wireframe parecer mais "circuito" que uma caixa
  lisa) + argola (metade de um Torus, a geometria já nasce em formato
  de arco - só encostar no topo do corpo) + uma marquinha de fechadura
  (torus fininho coral). Mesma técnica de "wireframe + miolo
  translúcido" de antes pro efeito de glow, mesmo anel orbitando
  inclinado e nuvem de partículas ao redor - só o núcleo central mudou
  de forma. Opacidade do canvas reduzida de 0.75 pra 0.6 (some espaço
  pra a leitura do texto, complementando o fix de z-index acima).
- **Imagem da Segurança maior**: `.security-visual .screenshot-frame`
  de `420px` pra `520px`, e a proporção do `.security-split` ajustada
  (`1.3fr 1fr` → `1fr 1.15fr`) pra a coluna da imagem realmente ter
  espaço de usar esse tamanho (antes o max-width não tinha efeito
  nenhum porque a coluna do grid já era menor que 420px).
- **Cursor de Caixa/DRE/Curva ABC finalmente aponta pra algo real**:
  essas 3 seções não são item de sidebar (Caixa é aba dentro de CMC,
  DRE/Curva ABC são abas dentro de Relatórios), então ficavam com um
  clique decorativo num ponto fixo (50%,55%) sem nenhuma relação com a
  imagem - "cursor apontando pra nada", como o Carlos descreveu. Carlos
  mandou 4 screenshots novas reais especificamente pra isso
  (`caixa.png`/`caixa-2.png`/`para_dre.png`/`para_dre_darck.png`, em
  `Chestaocheck-operacional/Imagens do Sistema/`) - usei `caixa.png`
  (CMC com a aba "Caixa" ainda não clicada) e `para_dre_darck.png`
  (Relatório Geral com a aba de tabs visível, cobre DRE E Curva ABC) só
  como as telas "antes", copiadas pra `scr/assets/sistema/` como
  `caixa_cmc_antes.png`/`relatorios_tabs_antes.png`. Novo mapa
  `TAB_DEMOS` em `script.js` (por nome de arquivo, mesmo princípio anti-
  bug do mapa `NAV_ITEMS`) diz pra essas 3 telas onde a aba de verdade
  fica (x/y aproximados, achados por inspeção visual) - o cursor clica
  lá, revela a screenshot escura já existente (`04_caixa_fechamento
  .png`/`02_dre_completa.png`/`03_curva_abc.png`, sem mudança nelas).
  **Atenção**: `caixa.png` é tema CLARO (Carlos não tinha a versão
  escura na hora) - único lugar do site que mistura tema por um
  instante durante a animação (a tela final revelada continua escura,
  normal). Se ele mandar a versão escura depois, é só trocar o arquivo
  em `caixa_cmc_antes.png`. `caixa-2.png` (aba Caixa já clicada, também
  clara) não foi usada - ficaria redundante com a screenshot escura que
  já existe pra essa seção.
- **Bug real achado e corrigido - sidebar da vitrine não respondia ao
  scroll do mouse** (a correção da rodada anterior, `min-height:0`, só
  tinha corrigido a CAPACIDADE de rolar - dava pra arrastar a barra de
  rolagem manualmente, mas girar a rodinha do mouse por cima não
  fazia nada, tinha que clicar/arrastar). Causa real: o Lenis (smooth-
  scroll da página inteira) intercepta TODO evento de wheel por padrão
  pra suavizar o scroll da página, inclusive quando o mouse está em
  cima de uma área com rolagem própria (`overflow-y:auto`) - sem
  configurar, ele nunca soube que devia deixar essas áreas rolarem
  sozinhas. Corrigido com a opção `prevent` do Lenis
  (`prevent: (node) => !!node.closest('.sys-nav, .sys-pane-wrap')`) -
  testado disparando um evento `wheel` de verdade em cima do menu e
  conferindo que `defaultPrevented` fica `false` (ou seja, o Lenis
  realmente deixou passar). `.sys-frame` também ficou mais alto (620px
  → 700px), menos scroll necessário no dia a dia.
- **Início bem mais completo** ("bota tudo que o sistema tem" - Início
  era a tela mais simplificada da vitrine, só 3 métricas + 4 atalhos,
  enquanto o dashboard real tem 6 métricas, 7 atalhos E uma fileira de
  baixo inteira que não existia aqui): métricas foram de 3 pra 6
  (Contagens/Ocorrências/Avarias/Valor em estoque/Reclamações/Retornos
  de prato, as mesmas 6 que existem em `inicial.html` de verdade,
  ganhando as cores laranja/roxo/teal que faltavam em `.metric-icon`);
  atalhos foram de 4 pra 7 (+ CMC, Avarias, Relatórios); nova fileira
  de baixo com "Movimentações recentes" (reaproveita `.sys-occ-item`,
  já existente pra Ocorrências) e "Estoque por categoria" (donut SVG
  novo, 4 categorias/cores, `312` itens batendo com o total já usado na
  tela de Estoque da mesma vitrine). Componentes novos:
  `.sys-bottom-row`/`.sys-section-card`/`.sys-donut-*` (`style.css`).
- **Demo do Multi-IA menos "estranha"**: Carlos achou a animação de
  abrir/fechar o chat estranha (perguntou até se devia gravar um vídeo
  perguntando de verdade pro sistema, ou se eu conseguia rodar a
  screenshot real em localhost - não tenho acesso ao backend/banco do
  sistema principal, só ao código estático das páginas, então não dá
  pra rodar o Multi-IA de verdade nem gerar essa gravação). Em vez
  disso, melhorei a demo que já existe: agora tem a pergunta digitada
  E uma resposta de verdade aparecendo dentro do balão (com "digitando…"
  no meio, 3 pontinhos saltitando, antes da resposta) - "Prime Cost em
  54,2% — dentro da meta 🎯" - antes só mostrava a pergunta sendo
  digitada e fechava, sem nunca "responder" nada dentro do balão (a
  resposta só existia na screenshot estática por baixo, o que ficava
  deslocado do gesto de "perguntar"). Registrado aqui pro caso do
  Carlos querer de fato uma gravação real depois: precisaria ser feita
  fora dessa sessão (rodando o sistema de verdade com login/backend).
- **Texto da vitrine simplificado**: tirado o trecho "com o código de
  verdade (não é print) e dados fictícios" do parágrafo (Carlos achou
  redundante - a legenda logo abaixo do frame já deixa claro que são
  dados fictícios). Ficou só: "Apresentação simplificada do sistema, o
  sistema completo tem muito mais tela e detalhe do que dá pra caber
  aqui."
- **Imagens dos outros `.deepdive-grid` maiores de novo** (3ª rodada
  de "aumenta mais um pouco"): proporção `0.6fr 1.4fr` → `0.55fr
  1.45fr`, breakout de monitor grande `1440px`/`≥1500px` →
  `1500px`/`≥1600px`.

## Bug real de especificidade CSS, cursor recalibrado com medição de
pixel, abertura v4 integrada de vez, e CMV/CMO/CMC mais completos
(12/09/2026, mesmo dia — mais uma rodada)

- **Bug real achado e corrigido - cursor "errando" a partir de CMC**:
  Carlos reportou que até CMO o cursor acertava, mas piorava depois.
  Causa: a tabela `NAV_ITEMS` (posição de cada item do menu, em % da
  altura da screenshot) tinha o PASSO errado entre item e item (3.3%,
  estimado de olho numa rodada bem anterior) - o valor real, medido
  agora de verdade, é ~3.85%. Erro pequeno no início da lista
  (Estoque/CMV/CMO ainda ficavam dentro da margem de erro visual), mas
  ia acumulando item a item - por Relatórios (o último da lista) já
  tinha quase 75px de desvio. **Corrigido com medição de pixel de
  verdade**: abri `13_cmc_visaogeral.png` (screenshot real com a
  sidebar inteira) num `<canvas>`, escaneei o brilho de cada linha na
  coluna do texto do menu pra achar o centro exato de cada item, e
  refiz a tabela inteira com esses valores medidos (não mais
  estimados). Conferido também os x/y de `TAB_DEMOS` (Caixa/DRE/Curva
  ABC) do mesmo jeito - já estavam certos, só ajustei a casa decimal.
- **Bug real de especificidade CSS achado e corrigido - overlay "antes"
  de Caixa/DRE/Curva ABC parecia com zoom/descentralizado**: Carlos
  relatou que essas 3 imagens (as novas, mandadas à parte, com
  proporção diferente do padrão 1680x1050) apareciam "tortas"/com zoom.
  Causa real: essas imagens são mais largas que o padrão do site, e
  `object-fit:cover` cortava as bordas pra preencher a moldura - dava
  uma sensação de zoom indesejado. Tentei resolver com uma classe nova
  `.demo-cursor-overlay-contain { object-fit: contain }` (mostra a
  imagem inteira, sem cortar), mas na primeira tentativa **não
  funcionou mesmo com a classe aplicada certinho no elemento** - o
  motivo (achado testando `getComputedStyle` direto no navegador) é
  que `.screenshot-frame img` (a regra que define `object-fit:cover`
  por padrão) tem especificidade MAIOR (1 classe + 1 tag) que uma
  classe sozinha (`.demo-cursor-overlay-contain`), então vencia mesmo
  vindo depois no arquivo CSS. Corrigido repetindo `.screenshot-frame`
  no seletor (`.screenshot-frame .demo-cursor-overlay-contain`, 2
  classes) pra empatar/vencer em especificidade. Lição registrada aqui
  porque é fácil cair de novo: "veio depois no arquivo" só resolve
  empate de especificidade - `.screenshot-frame img` sempre vai ganhar
  de qualquer seletor de 1 classe só, não importa a ordem.
- **Abertura (splash) v4 "Zoom no Scroll" integrada na produção de
  verdade** (antes só existia como rascunho isolado, num Artifact) -
  Carlos confirmou reaproveitar a v4 já aprovada antes nesta mesma
  conversa (ele mencionou "v3" nesta rodada, mas a v4 já tinha sido
  confirmada explicitamente por nome pouco antes - assumi que foi só
  troca de número, sinalizei isso na resposta). HTML novo: uma
  `.splash-zone` de 350vh como primeiro elemento do `<body>` (revela o
  Hero) e outra de 280vh (`.splash-zone-bottom`) + um amortecedor preto
  de 60vh como últimos elementos antes dos `<script>` (fecha "se
  afastando" no fim da página, evita ficar "meio aberto" bem no fim
  exato do scroll). CSS/JS novo (`.splash-*` em `style.css`,
  `initSplash()` no topo de `script.js`) - **de propósito FORA do
  bloco condicionado ao GSAP** (não depende de GSAP/ScrollTrigger/Lenis
  nenhum, só `getBoundingClientRect` + scroll nativo), pra funcionar
  mesmo se essas libs externas falharem em carregar. Logo usado:
  `icone-branco.svg` (branco puro) - **achado importante**: o logo
  "oficial" pra esse tipo de peça (`logo-vertical-completo.svg`) tem
  uma parte em navy escuro (`#09394F`) que ficaria quase invisível no
  fundo escuro do splash (`--bg-gray`, também escuro) - branco puro é a
  escolha certa pra qualquer peça em fundo escuro tipo essa. O header
  fixo (`header`) some enquanto o zoom de qualquer uma das duas zonas
  está em curso (classes `.intro-active`/`.outro-active` no `<html>`,
  alternadas a cada scroll) - fica estranho um menu de navegação por
  cima da tela cheia do logo. Testado rolando programaticamente (o
  ambiente de teste não simula scroll de mouse de verdade) até o meio
  da zona (logo já preenchendo a tela, borrado) e até o fim (Hero
  revelado, header de volta) - funcionou exatamente como no rascunho
  aprovado. Testado em mobile também (sem overflow horizontal).
- **CMV, CMO e CMC mais completos** (Carlos gostou do Início "bota
  tudo" e pediu o mesmo tratamento nas outras telas) - as 3 ganharam
  uma seção "Evolução (últimos meses)" com barra horizontal por mês,
  igual à tela real (`.sys-evo-list`/`.sys-evo-row`, novo componente
  reutilizável em `style.css`). CMC usa os números REAIS da própria
  screenshot do sistema já salva no repo (`13_cmc_visaogeral.png`: Abr
  R$6.803,79 → Set R$2.571,38); CMV e CMO usam valores fictícios
  plausíveis (não há screenshot real com o histórico mensal delas
  ainda). **Pendente, registrado aqui pra não esquecer**: o mesmo
  tratamento ainda falta nas outras ~10 telas da vitrine (Despesas,
  Beneficiamento, Avarias, Ocorrências, Checklists, Manutenção,
  Requisição, Patrimônio, Relatórios, DRE, Curva ABC, 2FA) - Carlos
  pediu "todas", isso aqui foi o começo (as 3 mais visitadas/citadas
  por ele), não a entrega completa.

## Abertura: revelação "mágica" de verdade, logo colorido, rede 3D
(12/09/2026, mesmo dia — mais uma rodada, feedback sobre a integração
que acabou de entrar em produção)

- **Bug real de mecânica achado e corrigido - Hero "deslizava" pra
  dentro em vez de aparecer do escuro**: Carlos notou que o conteúdo
  aparecia "rolando pra cima" durante a revelação, não "surgindo do
  nada" depois de escurecer. Causa: o `.splash-blackout` (a camada
  preta) era filho do `.splash-sticky`, que solta de ser sticky
  exatamente quando a `.splash-zone` termina (progresso p=1) - E a
  curva de opacidade antiga já começava a clarear em p=0.75, antes
  mesmo de ficar 100% preta (o pico real de opacidade era ~0.9, nunca
  opaco de verdade). Resultado: no exato momento em que o Hero começa a
  aparecer por trás (scroll normal, sticky já soltou), a cortina preta
  ainda estava só parcialmente escura E ainda grudada ali - dava pra
  perceber o conteúdo deslizando por trás da transparência parcial.
  **Corrigido em duas frentes**: (1) `.splash-blackout` virou
  `position:fixed` (não mais preso ao sticky que solta) - cobre a tela
  inteira até a curva mandar clarear, não importa se o sticky já
  liberou ou não; (2) curva reescrita pra escurecer 100% rápido
  (completa por p=0.55, junto com o zoom) e **segurar preto sólido por
  mais de 30% do scroll da zona** (até p=0.9) antes de clarear rápido
  no fim (p=0.9→0.98) - agora o usuário passa um bom trecho de scroll
  vendo só preto (o conteúdo "desliza" por trás, mas ninguém vê) e o
  Hero só aparece quando já clareou de verdade, lendo como
  "aparecimento" em vez de "scroll revelando aos poucos". Mesma lógica
  vale pro fechamento (`outro-active`), agora só escondendo o header
  quando o escurecimento realmente começa (p>0.4), não assim que entra
  na zona.
- **Logo do splash melhorado**: Carlos achou o logo branco liso "não
  ficou top". Trocado por uma variante nova, `icone-splash.svg`
  (cópia de `icone-colorido.svg` com o preenchimento navy `#09394F`
  trocado pra ciano `#7DD3DC` - o navy original é escuro demais e
  quase sumia no fundo escuro do splash, só o coral `#FD694A`
  aparecia). Resultado: check ciano + seta coral, cores da marca de
  verdade, bem mais vivo que branco liso. Também ganhou um glow
  radial pulsante atrás (`::before` com `radial-gradient` ciano/coral
  + blur, `@keyframes splashGlowPulse`) pra não ficar "parado e chapado"
  enquanto o usuário ainda não começou a rolar.
- **Rede de pontos 2D virou rede de nós 3D** (pedido: "melhora, tipo a
  de Segurança, mas algo que remeta a gestão"): reaproveitada a MESMA
  função `initNodeNetwork()` já usada no Hero/CTA (rede de nós
  conectados, a metáfora "dados conectados/organizados" já remete a
  gestão sem precisar inventar uma cena nova do zero) - dois canvases
  novos (`#splash-3d-top`/`#splash-3d-bottom`, `parallax:false` porque
  o logo já é o centro das atenções, orbitar sozinha fica mais elegante
  que seguir o cursor) por cima dos pontos 2D antigos, que continuam
  existindo como base (nunca fica vazio se o Three.js falhar - mesma
  filosofia de sempre). **Bug real achado e corrigido no mesmo pente**:
  esqueci o `display:none` em mobile/`prefers-reduced-motion` pros
  canvases novos (`initNodeNetwork` já pula o WebGL nessas condições,
  mas o `<canvas>` vazio continuava ocupando/aparecendo) - mesmo padrão
  que `#hero-3d`/`#cta-3d`/`#security-3d` já tinham, só faltou copiar
  pros novos. Site agora sobe pra 5 contextos WebGL simultâneos (Hero,
  CTA, Segurança, splash topo, splash rodapé) - todos rendendo sem
  parar o tempo todo (nenhum pausa quando sai da tela, incluindo os 3
  que já existiam antes desta rodada). Não é um bug novo desta rodada
  especificamente, mas registrado aqui como possível otimização futura
  (pausar via IntersectionObserver quando o canvas não está visível) se
  algum dia performance virar reclamação de verdade.

## Abertura: linhas finas de vez, cena 3D bem mais rica, anéis de pulso
por cima (12/09/2026, mesmo dia — Carlos pediu pra "chamar mais
atenção" já que é a primeira coisa que a pessoa vê)

- **Bug real achado e corrigido - linhas da rede 2D ainda grossas**:
  mesmo bug de sempre (já resolvido em Segurança/CMV/CMO antes) -
  `.splash-lines line` usa `viewBox="0 0 100 100"` esticado sem manter
  proporção pra caber numa área bem mais alta que larga (100vh) e isso
  engrossa o traço. Só que **esqueci de copiar o `vector-effect:
  non-scaling-stroke` pra essa classe nova** quando criei a abertura -
  as outras (`.bg-dot-lines`, `.bg-flow-line`, `.bg-topo-line`) já
  tinham, essa não. Corrigido.
- **Cena 3D da abertura ficou bem mais rica** (pedido: "já que é a
  primeira, chama mais atenção, bota coisas foda"): trocado
  `initNodeNetwork()` genérico (o mesmo do Hero/CTA) por uma função
  própria, `initSplashScene()` - rede de nós quase 40% mais densa (95
  nós vs 70 do Hero, dá pra ir mais pesado aqui porque é o único
  elemento 3D da tela, não compete com texto/cards por cima) **+ dois
  anéis cruzados**
  girando em eixos e velocidades diferentes (mistura da técnica "halo
  orbitando" que já existia na Segurança com a rede de nós do Hero -
  combinação que nenhuma cena do site tinha ainda, "coisa diferente"
  como pedido).
- **Camada extra por cima, tipo a mesclagem da Segurança mas com efeito
  novo**: 3 anéis de "pulso" (tipo sonar/radar, `.splash-pulse` + 2
  variantes com delay/cor diferente) irradiando do logo, crescendo e
  sumindo em loop, defasados pra nunca sumir todos juntos - CSS puro
  (`@keyframes splashPulse`), sempre funciona mesmo se o Three.js
  falhar (mesma filosofia "nunca fica vazio" do resto da abertura).
  Resultado final: pontos 2D (base) + rede 3D densa com halo duplo
  (WebGL) + anéis de pulso (CSS) - 3 camadas se misturando, bem mais
  chamativo que a versão de antes.
- **Cantos/bordas vazios preenchidos** (Carlos: "ainda ficou partes sem
  nada"): a rede de nós/anéis fica concentrada perto do centro (onde o
  logo está), deixando os cantos da tela vazios - principalmente
  visível em monitor largo e, mais ainda, no mobile (onde o canvas 3D
  nem roda, sobrando só os poucos pontos 2D concentrados no meio de uma
  tela alta). Duas camadas novas, as duas 100% CSS/JS puro (sem
  WebGL, então preenchem mesmo em mobile/se o Three.js falhar):
  **glow de canto** (`.splash-corners`, 4 `radial-gradient` bem sutis
  nos 4 cantos, cor de marca) e **starfield** (`.splash-star`,
  `buildStarfield()` em `script.js` - 45 pontinhos espalhados por TODA
  a tela, 0-100% em x e y, ao contrário dos pontos/rede que ficam perto
  do meio, com leve piscar). Testado em mobile - antes ficava um vazio
  enorme em cima/embaixo do aglomerado central, agora a tela inteira
  tem vida.

## Bug real crítico corrigido - site travava ao clicar em link de
âncora (logo/menu); revelação e fechamento da abertura reescritos pra
combinar com a intenção real (12/09/2026, mesmo dia)

- **Bug real achado e corrigido - "o site trava quando clica na logo
  pra voltar ao topo"**: Carlos mandou print mostrando a página presa
  numa mistura de cor (nem a abertura nem o site direito). Causa real:
  `html { scroll-behavior: smooth }` (CSS nativo, já existia antes da
  abertura) e o Lenis (scroll suave via JS) **brigavam pelo controle da
  posição de scroll** ao clicar num link de âncora - o navegador anima
  `scrollTop` direto por conta própria, e o Lenis (que acha que É ele
  quem controla o scroll) não fica sabendo disso, então os dois ficavam
  se corrigindo um contra o outro. Antes da abertura existir isso já
  era um bug latente (só gerava um tranco leve); com a abertura, virou
  visualmente grave porque a animação depende de matemática precisa de
  scroll - qualquer desincronia mostra uma mistura travada de cores
  (a logo gigante borrada, ainda sem encolher, com o fundo de alguma
  seção aparecendo por trás). **Corrigido em duas frentes**: removido
  `scroll-behavior:smooth` (o Lenis já suaviza sozinho, não precisa dos
  dois) e todo clique em link de âncora (`a[href^="#"]`, inclusive a
  logo) agora chama `lenis.scrollTo()` em vez de deixar o navegador
  fazer o salto nativo - o Lenis passa a ser a ÚNICA fonte de verdade
  do scroll, nunca mais desincroniza. Testado clicando na logo (voltou
  ao topo, sem travar) e num link de menu (`#sobre`, aterrissou exato,
  0.3px de diferença) - **nota de metodologia**: nesse ambiente de
  teste, `lenis.scrollTo()` parece não "andar" enquanto eu só espero
  com `setTimeout` (mesma pegadinha do GSAP já documentada antes aqui -
  o `requestAnimationFrame` não progride sem uma renderização de
  verdade acontecendo) - só confirmei o scroll de fato depois de forçar
  uma screenshot no meio do caminho.
- **Bug real achado e corrigido - logo ficava "borrão" gigante colorido
  por cima do Hero**: intimamente ligado ao bug acima (o Carlos
  screenshotou os dois juntos) - mesmo quando o scroll não travava, a
  escala/blur da logo (`scale(50x)`, `blur(14px)` no auge do zoom)
  **nunca voltava pro normal** depois que o preto clareava - só o preto
  sumia, a logo continuava lá, gigante e borrada, por cima/misturada
  com o Hero. Corrigido: a logo inteira agora também some (`opacity`)
  junto com o clareamento do preto - quando dá pra ver o Hero, não
  sobra nada da logo por cima dele.
- **Fechamento (fim da página) reescrito pra "voltar ao início", não
  ficar preso no preto**: Carlos esclareceu a intenção certa - a
  abertura é "zoom pra dentro, vai pro site"; o fechamento deveria ser
  o espelho ("se afastando, voltando pra tela [calma, tipo o início]"),
  **não** terminar preso em preto sólido (o que a `.splash-damper`
  antiga forçava de propósito, mas contra a intenção real). Trocada a
  curva do fechamento: em vez da mesma curva "só ida" da abertura, agora
  usa uma curva "ida E volta" (onda triangular no progresso) - a
  primeira metade da zona zoom+escurece igual a abertura, a segunda
  metade DESFAZ o zoom e clareia de novo, terminando de volta na cena
  calma (logo tamanho normal, pontos/rede visíveis) - a MESMA cena do
  início da página, sem precisar rolar pra cima de novo pra ver. Testado
  chegando ao fim exato da página: `blackout opacity:0`,
  `logo scale(1) blur(0px) opacity:1` - cena calma confirmada, não
  preto. `.splash-damper` (a barra preta de 60vh no fim) foi removida -
  não faz mais sentido com o final agora terminando limpo por conta
  própria. O header também passou a ficar escondido a zona de
  fechamento INTEIRA (uma vez que começa a escurecer) em vez de voltar
  no meio do caminho - a cena final é "tela de fechado", sem menu, que
  nem a abertura.

## Bug real corrigido - logo voltava pro topo ERRADO (dentro da
abertura) e não pra "onde sempre voltou"; zonas da abertura encurtadas
pra não parecer seção (12/09/2026, mesmo dia)

- **Bug real achado e corrigido - clicar na logo levava pra DENTRO da
  abertura, não pro topo de sempre**: Carlos relatou de novo "o site
  trava" e "quando clicamos é pra ele voltar pra onde sempre voltou,
  não pra essa nova parte". Causa real: o clique na logo (`href="#"`)
  chamava `lenis.scrollTo(0)` - `scrollY 0` é literalmente o topo da
  `.splash-zone` (a abertura), que virou o primeiro elemento do `body`
  desde que a abertura entrou em produção. Ou seja, clicar na logo
  jogava o usuário de volta pro COMEÇO da animação de abertura (não
  pro Hero, que é onde a "home" do site sempre foi) - descendo de
  qualquer parte funda da página, isso significava uma rolagem enorme
  atravessando a zona de fechamento inteira de novo, em reverso, o que
  lia como travamento/instabilidade mesmo sem ser um bug de scroll em
  si. Corrigido: o alvo do clique em `href="#"` agora é `.hero`
  (`document.querySelector('.hero')`), não `0` - a logo volta direto
  pro topo "de sempre" (Hero, logo abaixo do header fixo), nunca mais
  pra dentro da abertura. **Detalhe técnico**: não dava pra usar
  `#header` como alvo porque `header` é `position:fixed` - o
  `getBoundingClientRect()` dele não reflete posição real no
  documento (fica sempre perto de `top:0`); `.hero` é flow normal
  logo depois da `.splash-zone`, então serve como alvo direto e
  correto pro `lenis.scrollTo()`.
- **Bug real achado e corrigido - abertura "parecia uma seção", não um
  efeito que aparece e some**: Carlos mandou 2 screenshots novas
  mostrando a rede de nós/pulsos visível JUNTO com o texto do Hero (em
  vez de sumir antes dele aparecer) e a mesma cena visível logo depois
  do rodapé, como se fosse "uma seção grudada ali" em vez de uma
  transição rápida. Causa real: só a LOGO e o preto (`.splash-blackout`)
  tinham a opacidade animada até 0 no fim da curva - a rede de pontos
  2D, o canvas 3D, os anéis de pulso e o glow de canto
  (`.splash-corners`/`.splash-star`) nunca eram escondidos (eram CSS
  puro ou só parcialmente ligados ao scroll), então continuavam
  visíveis por cima do Hero mesmo depois do preto já ter clareado de
  vez. Corrigido: `applyOpenCurve()` agora também anima a opacidade do
  `.splash-sticky` inteiro (o pai de tudo: pontos, canvas 3D, pulsos,
  cantos, starfield, logo, preto) até 0 no fim da zona - garante que
  literalmente nada sobra visível quando o Hero é revelado. O canvas 3D
  (`.splash-3d`, antes com opacidade fixa 0.8 via CSS, nunca mudava com
  o scroll) também passou a ser controlado via JS, acompanhando o mesmo
  `zoomP` que já anima os pontos 2D, em ambas as curvas (abertura e
  fechamento). Testado: rolando até o Hero, screenshot confirma tela
  limpa (nada da abertura sobra visível); no fim da página, a cena calma
  de descanso continua aparecendo normalmente (fechamento não foi
  afetado por esse fix, só a abertura tem o fade total do container).
- **Zonas de scroll da abertura/fechamento encurtadas** (contribuía
  pro mesmo "parece seção"): `.splash-zone` (topo) era `350vh` -
  descontado 1 viewport da `.splash-sticky`, isso é 250vh de scroll
  REAL "dentro" da transição antes do Hero aparecer, mais de 2 telas
  inteiras - tempo suficiente pra parecer conteúdo navegável de
  verdade, não um flash. Reduzido pra `200vh` (100vh de scroll real,
  cerca de 1 tela) - mesmo arco de zoom+escurece+clareia, só que bem
  mais rápido de atravessar. `.splash-zone-bottom` (fechamento) foi de
  `280vh` pra `200vh`, mesmo raciocínio, agora simétrica com o topo.
  As curvas em `script.js` são expressas em fração do progresso (0-1)
  da zona, então continuam funcionando sem mudança nenhuma na lógica -
  só a distância física de scroll pra completá-las ficou menor.

## Overlay "antes" de DRE/Curva ABC com letterbox não descontado no
cursor; vitrine com 9 telas enriquecidas usando o código real do
sistema principal (13/09/2026)

- **Bug real achado e corrigido - cursor de Curva ABC (e DRE) "bugado"
  de verdade**: Carlos reportou o cursor de Curva ABC errando (DRE
  tinha o mesmo problema, só não foi citado por nome). Causa real:
  `caixa_cmc_antes.png`/`relatorios_tabs_antes.png` têm proporção
  ~1.78:1, mais larga que o padrão do site (1.6:1) - com `object-fit:
  contain`, a imagem preenche 100% da LARGURA da moldura mas só ~90%
  da ALTURA (o resto vira barra vazia, ~5% em cima e ~5% embaixo,
  preenchida com a cor de fundo desde o fix da rodada anterior). O
  `x/y` de cada aba em `TAB_DEMOS` (`script.js`) foi medido em % da
  imagem ORIGINAL (correto), mas o cursor é posicionado em % da
  MOLDURA inteira (`left/top` do `.screenshot-frame`) - sem descontar
  essa barra vazia, o `y` calculado ficava sistematicamente ~3-4
  pontos percentuais ACIMA de onde a aba realmente aparece renderizada
  (o `x` não precisa de ajuste, a largura preenche 100% igual nos dois
  casos). **Corrigido com uma fórmula de conversão** (documentada
  inline em `TAB_DEMOS`): `y_moldura = barra + y_imagem_original *
  escala`, onde `escala = 1.6 / proporção_da_imagem` e `barra = (1 -
  escala) / 2`. Valores corrigidos: Caixa `y: 40.6 → 41.6`, DRE/Curva
  ABC `y: 16.9 → 20.3` (x sem mudança nos 3). **Metodologia de
  verificação usada** (o pane do navegador ficou instável pra
  screenshot boa parte desta rodada, mesmo depois de recarregar -
  provavelmente porque a janela ficou fora de foco em algum momento):
  em vez de insistir em capturar print, desenhei a imagem "antes" num
  `<canvas>` replicando exatamente o `object-fit:contain` (mesmas
  contas de largura/altura/offset que o CSS faz), e usei
  `getImageData` pra medir o brilho médio dos pixels exatamente no
  ponto do cursor corrigido - confirmei numericamente que os 3 pontos
  (Caixa/DRE/Curva ABC) caem em cima de texto claro de verdade (valores
  bem acima do fundo escuro ~17), não mais num vão vazio. O ghosting
  ("duas imagens uma em cima da outra") que o Carlos reportou nessa
  mesma leva de screenshots já tinha sido corrigido na rodada anterior
  (fundo sólido no overlay) - confirmado ainda corrigido ao reabrir
  DRE/Curva ABC no navegador, o print que ele mandou era de antes desse
  fix chegar no arquivo.
- **Vitrine "Veja por dentro" bem mais completa em 9 das ~14 telas**
  (pedido: "a inicial tá boa mas o resto tá básico ainda, pega do
  código pai que já tem o código completo das telas, faz elas melhores"
  - acesso de leitura à pasta `Chestaocheck-operacional/pages/*.html` +
  `styles/*.css` já liberado em rodada anterior). Fui tela por tela no
  código real pra achar o que faltava, em vez de simplificar de novo:
  - **Estoque**: ganhou o card "Itens faltando" (existe na tela real,
    `#faltantes-lista` - lista de item com quantidade esperada zerada,
    agrupado por setor).
  - **Despesas**: virou o layout real de 3 colunas (`.desp-resumo` no
    sistema) - total do período + composição por categoria em barra +
    evolução dos últimos meses, lado a lado - antes só tinha o total +
    2 cards genéricos soltos.
  - **Beneficiamento**: ganhou o donut "Perdas por motivo" (existe como
    gráfico de rosca de verdade na tela real, `#graficoRosca`) -
    reaproveita a mesma técnica de círculos SVG com `stroke-dasharray`
    já usada no donut "Estoque por categoria" da Início.
  - **Avarias**: tabela ganhou as colunas Motivo e Responsável (a tela
    real tem 11 colunas ao todo, incluindo essas - a vitrine tinha só
    5) + nova seção "Avarias por setor" (breakdown em barra, mesmo
    componente `.sys-evo-list` já usado em CMV/CMO/CMC, reaproveitado
    aqui pra categoria em vez de mês).
  - **Ocorrências**: ganhou a fileira de chips de filtro por status
    (Todas/Abertas/Em andamento/Aguardando origem/Resolvidas - existe
    de verdade na tela real) e mais 2 itens na lista, com tipos mais
    variados (a tela real tem bem mais que "reclamação" - retorno de
    prato/drink/vinho, falta de pessoal, etc., usados como referência
    pros novos itens fictícios).
  - **Checklists**: a tabela genérica virou os cards de verdade (a tela
    real usa `.checklists-grid`/`.checklist-card`, não tabela) - cada
    checklist com badge de turno + barra de progresso (X/Y itens
    concluídos), 3 exemplos com progresso variado (100%/57%/100%).
  - **Manutenção**: tabela ganhou a coluna Prioridade (existe na tela
    real, tinha ficado de fora).
  - **Requisição**: tabela ganhou a coluna Urgência (existe na tela
    real) e reordenada pra bater com a ordem real das colunas.
  - **Patrimônio**: ganhou o card "Por categoria" ao lado do total
    (`.patr-resumo` real é 2 colunas, a vitrine só tinha 1) - mesmo
    componente de barra do Despesas.
  - **Relatórios**: a maior mudança - os 3 `resumo-cards` genéricos
    viraram a barra de composição real "Pra onde foi cada R$ 1,00
    faturado" (`.rel-composicao-bar`, 3 segmentos empilhados
    CMV/CMO/margem, com o % de Prime Cost ao lado) + 3 kcards
    linkáveis na tela real (Faturamento/CMO/CMC) - essa é literalmente
    a mesma barra que aparece nas screenshots reais de DRE/Curva ABC
    usadas noutras seções do site, então a vitrine passou a bater
    visualmente com o resto do site nesse ponto.
  Componentes CSS novos, reaproveitáveis (`style.css`): `.sys-evo-list.
  categorias` (mesma barra de "Evolução", só com rótulo mais largo pra
  nome de categoria em vez de mês), `.sys-composicao-*` (barra
  empilhada de 3 segmentos), `.sys-checklist-grid`/`.sys-checklist-card`
  (card com barra de progresso). Não fiz Manutenção/Requisição/
  Configurações virarem cards ou ganharem gráfico novo - já batiam
  razoavelmente com a tela real, só faltavam colunas de tabela; não
  simplifiquei de propósito nenhuma tela que já estava correta.
  **Pendente**: 2FA (dentro de Configurações) continua com o clique
  decorativo simples - não tem imagem "antes" nem tela mãe navegável
  fora de Configurações, então não recebeu o mesmo tratamento; e as
  ~5 telas restantes da vitrine que não foram tocadas nessa rodada
  (Início/CMV/CMO/CMC/Configurações) já tinham recebido o "bota tudo"
  em rodadas anteriores, não precisavam de trabalho novo.

## Bug real crítico corrigido - abertura "bugava" (tela vazia/lavada)
ao rolar de volta pro topo; clareamento estreitado pra ficar simultâneo
com a revelação do Hero (13/09/2026, mesmo dia)

- **Bug real achado e corrigido - "buga" ao rolar de volta pro início,
  passando pela animação principal**: Carlos mandou 2 screenshots - uma
  mostrando o header visível mas a área de baixo completamente vazia
  (cor lisa, sem logo, sem rede, sem preto), outra mostrando o Hero
  normal (o que ele queria ver "logo", sem passar por esse vazio).
  Achei DUAS causas reais, uma em cima da outra:
  1. **Opacity em cascata**: o fix da rodada anterior ("esconder tudo
     no fim, não só logo/preto") aplicava `opacity` direto no
     `.splash-sticky` - só que `.splash-blackout` (o preto) é FILHO
     dele. Opacity de pai multiplica com a do filho - o preto (que já
     calculava a própria opacidade sozinho) ficava com o valor final
     MULTIPLICADO pela opacidade decrescente do pai, esvaziando o
     "segura preto sólido" bem antes da hora (uma lavagem fraca da cor
     de fundo em vez de preto de verdade). **Corrigido**: criado um
     wrapper novo, `.splash-decor` (`index.html`/`style.css`), em volta
     de TUDO que não é o preto (pontos, canvas 3D, pulsos, cantos,
     starfield, logo) - `.splash-blackout` ficou de fora dele, irmã
     direta dentro de `.splash-sticky`, então a opacidade dele nunca
     mais é multiplicada por nada.
  2. **Vão morto antes do Hero existir de verdade**: mesmo com o preto
     certo, ainda sobrava um problema estrutural - a janela de
     clareamento (`clearP`) começava em 85% da zona, mas o
     `.splash-sticky` só solta de ser sticky (revelando o Hero de
     verdade por trás) em 100% - ou seja, os últimos 15% da zona
     mostravam a cena já clareando/sumindo, mas ainda presa num box
     sticky que cobre a tela inteira, sem nada atrás pra ver ainda (o
     Hero só existe visualmente no exato instante em que o scroll passa
     de 100%). Esse vão de "nem preto nem Hero" é o que aparecia como
     tela vazia. **Corrigido**: janela de clareamento estreitada de 15%
     pra 3% da zona (`0.97→1.0` em vez de `0.85→1.0`) - o clareamento
     agora é rápido o bastante pra terminar praticamente junto do
     instante em que o sticky solta, sem vão perceptível no meio -
     bate com o pedido do Carlos ("assim que sair do preto já quero
     estar no começo do site", não num limbo no meio do caminho).
  Testado rolando pra baixo (abertura) e de volta pra cima (fechamento
  reverso) várias vezes: preto sólido de verdade durante o "hold" (sem
  lavagem), sem nenhum frame vazio no meio, pousando limpo na cena
  calma da logo no topo ou direto no Hero, sem estado intermediário
  quebrado em nenhum dos dois sentidos.

## Screenshot nova de Relatórios (tamanho padrão, sem gambiarra) + GIF
real no Multi-IA, substituindo a demo falsa (13/09/2026, mesmo dia)

- **`relatorios_tabs_antes.png` trocada por uma captura no tamanho
  padrão do site**: Carlos entendeu que o problema de fato era a
  imagem estar fora do padrão (1680x1050, igual as outras 24) e mandou
  uma nova (`nova-imagem-relatorio.png`, copiada por cima do arquivo
  existente em `scr/assets/sistema/`, mesmo nome de sempre). Como a
  imagem nova já bate exatamente com a proporção da moldura, o
  `object-fit: contain` (e a barra vazia que ele causava) deixou de
  ser necessário pra essa imagem - `TAB_DEMOS` em `script.js` ganhou
  uma flag `contain: true` só pra quem ainda precisa dela
  (`caixa_cmc_antes.png`, que continua fora do padrão) - DRE e Curva
  ABC agora usam `cover` liso, que nem todo o resto do site. **x/y do
  cursor remedidos do zero** na captura nova (mesma técnica de sempre,
  escaneando pixel por canvas) - DRE `{x:85.1, y:12.5}`, Curva ABC
  `{x:90.0, y:12.5}` (não são mais os mesmos valores de antes - é uma
  captura diferente, com a tela em outro estado/zoom). Aproveitei que
  essa captura nova tem os números reais da barra "Pra onde foi cada
  R$1,00 faturado" pra também atualizar a mesma barra na vitrine
  "Veja por dentro" (seção Relatórios) com os valores reais: CMV
  34,9%, CMO 11,7%, margem 53,4%, Prime Cost 46,6% (antes eram valores
  fictícios aproximados, 46,6/15,7/37,7).
- **Multi-IA: demo falsa de chat trocada pela gravação real**
  (`multi_ia_chat_fullpage.gif`, mandada pelo Carlos via prompt que
  passei pra ele rodar noutro chat com acesso ao sistema de verdade,
  rodando/logado) - Carlos achou estranho ter uma animação fingindo
  "digitando..." em cima de uma screenshot estática, quando o resto do
  site já é tudo captura real; um GIF da interação de verdade
  (pergunta digitada + resposta aparecendo, gravado do sistema rodando
  com dados fictícios) resolve isso sem precisar de encenação nenhuma.
  Removida a timeline GSAP inteira que criava o balão de chat falso
  (`initIaChatDemo`, `.ia-chat-*`/`.ia-msg-*` em `style.css`) - o
  `<img>` do GIF sozinho já basta (GIF é nativamente autoplay+loop no
  navegador, sem JS nenhum). `08_multi_ia_chat.png` (a screenshot
  estática antiga) apagada de `scr/assets/sistema/` - não sobrou
  nenhuma referência a ela no código, então não fazia sentido deixar o
  arquivo like órfão no repo. GIF confirmado 1680x1050 (mesmo padrão
  do site, cabe liso na moldura) e ~2,2MB (razoável pra um GIF de ~6-10s
  com bastante texto/UI, não precisou de compressão adicional).

## Bug real crítico corrigido - as 5 cenas 3D nunca pausavam fora de
tela, rodando pra sempre desde o carregamento (13/09/2026, mesmo dia)

- **Bug real achado e corrigido - "trava por completo" ao voltar pra
  animação 3D inicial**: já estava registrado como possível otimização
  futura desde a rodada que somou a 5ª cena 3D (splash), nunca
  implementada - virou travamento de verdade agora, bem provavelmente
  puxado pelo peso somado do GIF novo (~2,2MB, decodificando sem parar)
  em cima da carga que já existia. Causa real: `three-hero.js` tem 5
  cenas Three.js (Hero, CTA, Segurança, splash topo, splash rodapé) e
  NENHUMA delas nunca pausava - cada uma chama a própria `animate()`
  que se re-agenda via `requestAnimationFrame` pra sempre, desde o
  carregamento da página, **mesmo com o canvas fora da tela** (nada
  verificava visibilidade). Ou seja, o site sempre rodou os 5
  `renderer.render()` simultâneos o tempo inteiro, em paralelo,
  independente de onde a pessoa estivesse rolando - isso já era pesado
  antes, mas ficou pesado a ponto de travar depois do GIF novo somar
  mais carga de decodificação em cima. A cena do splash é a mais
  pesada das 5 (95 nós + 2 anéis, contra 70 do Hero e 36 do CTA), e a
  seção do splash é justamente onde a opacidade de `.splash-decor`
  também é recalculada a cada frame de scroll - a combinação das duas
  coisas ali é o pior caso do site inteiro, batendo com o relato
  exato do Carlos ("toda vez que voltamos pra animação 3D inicial").
  **Corrigido com `IntersectionObserver`**: nova função
  `observeVisibility()` (topo de `three-hero.js`, reaproveitada pelas
  3 funções que criam cena - `initNodeNetwork`, `initSplashScene`,
  `initSecurityShield`) - cada canvas só tem seu loop de animação
  rodando enquanto está realmente visível (ou perto de ficar,
  `rootMargin: 200px` de folga); fora disso, `cancelAnimationFrame` só
  o loop inteiro (não só pula o render de um frame) até voltar a
  aparecer. Na prática, a qualquer momento do scroll, só 1-2 das 5
  cenas estão de fato renderizando, não as 5 o tempo todo. Testado:
  zero erro no console rolando pra cima/baixo repetidamente (inclusive
  rápido, em sequência), site permaneceu responsivo o tempo todo nos
  testes automatizados feitos aqui - **atenção**: o ambiente de teste
  automatizado tem uma taxa de quadros própria mais baixa que um Chrome
  real (não é um sinal confiável pra medir o ganho de performance de
  verdade) - o Carlos precisa confirmar no navegador dele se o
  travamento sumiu de vez.

## Travessão (—) removido de todo o texto visível do site (13/09/2026,
mesmo dia)

Carlos pediu pra revisar todos os textos do site deixando "mais
profissional e confiável, sem traços de IA" - apontou especificamente
o travessão (—) como o "traço" que ele queria fora, um tique clássico
de texto gerado por IA. Passei o `index.html` inteiro (única fonte de
copy visível do site) atrás de toda ocorrência de `—` em texto que o
visitante realmente lê, e reescrevi cada frase sem o travessão -
trocando por ponto final (quando eram duas ideias completas), vírgula
(continuação natural da mesma frase) ou dois-pontos (quando introduzia
uma explicação/lista), conforme o que ficava mais natural em cada
caso, nunca só apagando o caractere. Cobriu: `<title>`/`og:title`,
todos os parágrafos de feature (Estoque, CMV, Multi-IA, Avarias,
Checklists, Caixa, Despesas, Patrimônio, Relatórios), itens de
`feature-list`, as 13 ocorrências repetidas da legenda
"Sistema real — dados fictícios" (virou "Sistema real, dados
fictícios", numa edição só via `replace_all`), a legenda da Segurança,
o texto da vitrine "Veja por dentro" (incluindo os dados simulados
dela - "Entrada — Produto" virou "Entrada de Produto", "Setor —
detalhe" virou "Setor, detalhe"), a seção Ocorrências da vitrine, a
legenda do comparador de tema, os 2 parágrafos de "Nossa história", e
o cargo dos 3 fundadores no modal de contato ("Fundador — Vendas" virou
"Fundador, Vendas"). **Não mexi** em comentários de código (`<!-- -->`)
- não são texto que o visitante vê, ficam de fora do pedido. Conferido
com `grep` no fim que não sobrou nenhum `—` fora de comentário no
arquivo inteiro. Testado lendo o texto renderizado da página inteira
(via extração de texto do DOM) depois da rodada de edições - nenhuma
frase ficou truncada/quebrada, tudo lendo natural.

## Bug real corrigido - faixa "travada" na cena 3D do splash depois de
rolar a página inteira e voltar (regressão da rodada anterior,
13/09/2026, mesmo dia)

- **Bug real achado e corrigido**: Carlos reportou que, depois de rolar
  o site inteiro até o fim e voltar pra animação inicial, ela "bugava"
  de novo. Reproduzido aqui: depois de descer a página inteira (~28000px
  de scroll) e subir todo o caminho de volta, a cena 3D do splash
  ficava com uma faixa horizontal "travada" no meio da tela (conteúdo
  antigo, sem atualizar) enquanto o resto da rede de nós continuava
  girando normalmente ao redor - confirmado comparando 2 screenshots
  com alguns segundos de diferença: os nós ao redor mudavam de posição
  (prova que a cena tava renderizando), só a faixa ficava sempre igual.
  Causa real: **regressão da correção anterior desta mesma sessão** (a
  do "trava por completo", ver seção acima) - aquela versão usava
  `cancelAnimationFrame`/`requestAnimationFrame` pra parar e reiniciar
  o loop de animação de verdade quando o canvas saía/voltava a ficar
  visível (`IntersectionObserver`). Isso economizava GPU de verdade,
  mas expôs um bug real de composição do navegador: parar e reiniciar
  `requestAnimationFrame` de um canvas WebGL várias vezes seguidas (o
  scroll de ida e volta pela página inteira passa pelo canvas do splash
  repetidas vezes) deixa parte da textura composta na tela desatualizada
  depois de retomar - o navegador não repinta aquele pedaço direito.
  **Corrigido sem abrir mão da economia de GPU**: `observeVisibility()`
  não chama mais `cancelAnimationFrame` - o loop de animação roda pra
  sempre (nunca para de verdade), só que agora pula a parte cara
  (atualizar rotação/posição + `renderer.render()`) via uma flag
  booleana (`isVisible`) quando o canvas está fora da tela. Continua
  cortando quase todo o custo de GPU de um canvas fora de tela (o
  `render()` é o gasto real, não o loop em si), só que sem nunca
  desligar/religar o pipeline de composição do canvas - o que
  provavelmente é a causa raiz do bug da faixa travada. Testado
  reproduzindo o cenário exato (rolar a página inteira até o fim,
  voltar até o topo, mais um pequeno nudge de scroll que antes piorava
  o bug) - tela limpa, sem faixa, sem caixa atrás da logo, em várias
  repetições do teste.

## `three-hero.js` ganhou query de versão no `<script>` - suspeita de
cache de módulo ES no navegador (13/09/2026, mesmo dia)

- Carlos reportou que o bug da faixa travada (ver seção acima)
  "continua igual" mesmo depois do fix. Testei de novo aqui o cenário
  exato que ele descreveu (rolar a animação final várias vezes pra
  frente e pra trás, depois voltar pro topo) e **não consegui
  reproduzir** - tela limpa em todas as repetições, sem faixa, sem
  caixa atrás da logo. **Achado forte nesta mesma sessão**: eu mesmo
  esbarrei nesse exato problema testando o fix anterior - um
  `location.reload(true)` normal NÃO pegou a versão nova de
  `three-hero.js` (só funcionou abrindo uma aba nova do zero). Isso é
  um comportamento conhecido de `<script type="module">` - o
  navegador cacheia o módulo já compilado por URL de um jeito mais
  agressivo que um `<script>` comum, e nem sempre um refresh normal
  (às vezes nem um hard-refresh) busca a versão nova. **Suspeita
  principal**: o Carlos pode estar testando com a versão ANTIGA de
  `three-hero.js` ainda em cache no navegador dele, sem saber -
  precisa fechar a aba de vez (ou usar aba anônima) pra garantir que
  tá vendo o código novo. Corrigido preventivamente pra não depender
  de lembrar disso de novo: `<script type="module" src="three-hero.js">`
  virou `src="three-hero.js?v=3"` (`index.html`) - a query string muda
  a URL aos olhos do cache do navegador, forçando buscar de novo.
  **Se o bug realmente persistir depois de confirmar que carregou a
  versão nova** (conferir isso é o próximo passo, não presumir que
  já era o problema todo), precisa de mais detalhe de repro (vídeo/print
  de como fica exatamente "bugado" - as duas fotos da rodada anterior
  mostravam uma faixa/caixa escura específica, útil comparar se é a
  mesma coisa de novo ou algo diferente).

## Cena 3D de verdade na seção "O Problema" (13/09/2026, mesmo dia -
rodada seguinte)

Carlos voltou a pedir melhoria especificamente em "O Problema" mesmo
depois da rodada anterior já ter melhorado o efeito 2D de constelação
(mais pontos/brilho/estrelas) que essa seção usava - o pedido real era
uma cena 3D de verdade (WebGL), não só o CSS/SVG mais bonito.

- **`initFragmentsScene()` nova em `three-hero.js`** - conceito pensado
  de propósito pra CONTRASTAR com o check do Hero (organizado, peça
  única, cores da marca): aqui são 9 fragmentos soltos (cada um seu
  próprio `Mesh`, gira sozinho no seu eixo/velocidade - não um grupo
  girando junto), maioria coral (cor de alerta do site) com alguns
  ciano, boiando espalhados (não num padrão/grade). Linhas finas
  "tentando conectar" os pares mais próximos piscam fraco e fora de
  sincronia (nunca ficam sólidas) - a ideia visual é literalmente o que
  a seção descreve (informação espalhada, conexão que não existe de
  verdade), o oposto da rede conectada e estável do Hero. Nuvem de
  partículas espalhada complementa. Mesma técnica de sempre (wireframe
  + `isVisible`/`IntersectionObserver`, desliga em mobile/
  `prefers-reduced-motion`).
- **`#problemas` saiu do `BG_FX_VARIANTS` genérico** (`script.js`) e
  entrou na lista de exceção junto com Hero/CTA/Segurança (seção com
  cena 3D própria não ganha fundo 2D genérico em cima, seria poluição)
  - `<canvas id="problemas-3d">` adicionado como primeiro filho da
  seção no `index.html`, mesma posição que `#security-3d` ocupa em
  Segurança. `.problems` ganhou `position:relative;overflow:hidden`
  pra conter o canvas - o texto/grid de cards por cima já fica correto
  por cima da cena sem precisar de fix de z-index extra, porque
  `.container` já tem `position:relative;z-index:1` globalmente (regra
  antiga, de quando o sistema de fundo animado genérico foi criado).
- **Site sobe pra 5 cenas WebGL possíveis de novo** (Hero, CTA,
  Segurança, splash topo, Problemas) - mesmo patamar de antes de tirar
  a `splash-zone-bottom`, mas com a garantia de que só 1-2 renderizam
  de verdade a qualquer momento (`isVisible`+`IntersectionObserver` já
  em todas).
- **Nota de metodologia de teste** (aconteceu de novo nesta rodada,
  vale registrar): `initFragmentsScene`/`initShowcaseScene`/etc.
  conferem `window.matchMedia("(max-width:768px)")` **uma única vez**,
  no carregamento do script (por decisão de performance/acessibilidade
  antiga - "o JS nem roda" em mobile) - **não são responsivas a
  redimensionar a janela depois**. Testei carregando a página numa
  aba já estreita (~629px, tamanho que esse ambiente de automação usa
  por padrão) e DEPOIS mudando pra 1400px - a cena nunca inicializava
  (`skip` já tinha sido `true` no carregamento), canvas ficava do
  tamanho padrão do HTML (300×150) esticado por CSS, parecendo um bug
  de resolução. Recarregando a página DIRETO em 1400px (não
  redimensionando depois), tudo funcionou normal. Se for testar cena
  3D aqui de novo, sempre recarregar a página no tamanho de tela final
  antes de checar, nunca só redimensionar o viewport de um tab já
  carregado.

## Build step de verdade (gzip + minificação), bug real crítico do CSP
achado e corrigido, fontes/preconnect otimizados (14/09/2026, mesmo dia
- rodada seguinte à instalação do compilador C++)

Depois de esclarecer a questão do WebP/vídeo (não é "qualidade melhor",
é arquivo menor - ver seção abaixo) e do build step (liberado, ver nota
lá em cima), Carlos pediu pra melhorar o site geral e fazer outra
auditoria "agora que tá liberado usar builds e tudo mais". Antes de
tentar de novo o upscaling por IA, decidiu mandar telas novas em maior
resolução por conta própria (mais garantido, sem risco de artefato de
IA) - fica pendente até ele mandar.

- **Compressão gzip - maior achado desta rodada** (nunca tinha sido
  ligada): `nginx.conf` não tinha `gzip` NENHUM configurado. Medido nos
  arquivos reais do site: CSS -79%, JS -67% a -76%, HTML -82%. Ligado
  pra `text/plain`/`text/css`/`javascript`/`json`/`svg+xml`/`ld+json`
  (nunca pra png/jpg/webp/mp4/webm/gif - já vêm comprimidos, gzip de
  novo só gasta CPU à toa). Zero risco (suporte universal, já vem no
  nginx padrão) - o maior ganho de peso de toda a auditoria, e o mais
  simples de implementar.
- **Build step de verdade: minificação de CSS/JS** - `Dockerfile` virou
  multi-stage: um estágio `node:20-alpine` roda `terser` (JS) e
  `clean-css-cli` (CSS) ANTES do nginx final. O código-fonte no repo
  continua 100% comentado/legível (ninguém edita arquivo minificado à
  mão) - só o que vai pro container de produção sai processado.
  **Achado real testando**: minificar ANTES do gzip reduz mais uns
  50-64% ALÉM do que o gzip sozinho já tira (`script.js`: gzip sozinho
  15,5KB → minificado+gzip 5,5KB) - o código tem bastante comentário/
  documentação em português, que não comprime tão bem quanto código
  repetitivo. Resultado final real (medido com container Docker
  rodando): `style.css` 98KB → ~10KB na rede (-90%), `script.js` 46KB →
  ~5,5KB (-88%). **HTML não entra na minificação de propósito** -
  `index.html` tem o JSON-LD liberado no CSP por hash exato; minificar
  mudaria o hash e quebraria ele silenciosamente - gzip sozinho já
  reduz HTML uns 82%, não vale o risco.
- **Bug real crítico achado testando com CSP de verdade em TODAS as 6
  páginas** (não só `index.html`, que já tinha sido testada antes) -
  `privacidade.html`/`termos.html` tinham um `<script>` INLINE (menu
  mobile + dropdown "Funcionalidades" + ano do rodapé) que o CSP estava
  **bloqueando silenciosamente** (`script-src` só libera o ÚNICO hash
  do JSON-LD de `index.html` - qualquer outro script inline, mesmo que
  pareça inofensivo, é bloqueado por design). **Isso significa que o
  menu mobile e o dropdown nunca funcionaram nessas 2 páginas em
  produção real**, desde que existem (13/09/2026) - só não foi
  percebido antes porque os testes de CSP anteriores focaram no
  `index.html`. Corrigido extraindo o bloco (idêntico nas duas
  páginas, confirmado por comparação de string) pra um arquivo externo
  novo, `js/legal-page.js` - script same-origin já é coberto por
  `script-src 'self'` sem precisar de hash nenhum, resolve o bug E
  evita a fragilidade de mais um hash pra manter sincronizado.
  Confirmado com container real: dropdown abre, ano aparece, zero erro
  no console nas duas páginas.
- **Fonte Inter trimada pros pesos realmente usados** - a URL do Google
  Fonts carregava 7 pesos (`300;400;500;600;700;800;900`), mas o CSS só
  usa `500/600/700/800` (+ `400` implícito, peso padrão de texto sem
  `font-weight` declarado) - `300` e `900` nunca são usados em lugar
  nenhum (conferido por busca no CSS inteiro + estilos inline).
  Removidos da URL nas 6 páginas - menos 2 arquivos de fonte pra
  baixar, sem mudar nada visual (nenhum elemento usava esses pesos).
- **`preconnect` pros CDNs que faltavam** - só `fonts.googleapis.com`/
  `fonts.gstatic.com` tinham preconnect; `cdnjs.cloudflare.com`
  (Font Awesome, GSAP/ScrollTrigger - usado nas 6 páginas) e
  `cdn.jsdelivr.net` (Lenis - só nas 3 páginas que carregam GSAP
  completo) não tinham - adicionado nos lugares certos, deixa o
  navegador abrir a conexão (DNS+TLS) mais cedo, em paralelo com o
  resto do carregamento, antes mesmo de precisar buscar o arquivo.
- **Testado de ponta a ponta com Docker real** (build multi-stage +
  container rodando, não só arquivo local) depois de CADA mudança
  desta rodada - `nginx -t` limpo, tamanhos finais confirmados com
  `curl`, e as 6 páginas varridas no navegador de verdade (console
  limpo, dropdown/popup/vídeo/cena 3D funcionando) no final, depois de
  tudo junto.

## Investigação real - por que as screenshots ficam "ruins" ao dar zoom
(14/09/2026, mesmo dia)

Carlos achou que WebP/vídeo (rodada anterior) deixariam as imagens "com
qualidade melhor" - **não é bem assim**, esclarecido pra ele: WebP/MP4
só deixam o ARQUIVO menor (carrega mais rápido), a qualidade visual
continua a mesma de antes (conferido lado a lado na hora, sem perda
perceptível) - não pioram nem melhoram o que já tinha. Ele também
reportou "as imagens são de baixa qualidade, dá zoom e ficam horríveis"
e pediu pra "ajeitar todas as imagens igual fizemos com a logo".

**Causa raiz real, investigada com `sharp`**: as 25 screenshots do
sistema (`assets/sistema/`) são todas **1680×1050 a 72 DPI** - ou seja,
capturadas em resolução "1x" (padrão), não "2x"/Retina/HiDPI. Isso é
diferente do problema do SVG do logo (aquele era sobra de precisão
numérica desnecessária, sem perda nenhuma ao cortar - resolvido de
verdade com `svgo --precision=1`). Aqui não tem "gordura" pra cortar: a
imagem já usa exatamente os pixels que tem. Zoom (ou exibir a imagem
maior que o tamanho que ela realmente tem) sempre vai mostrar
pixelização/borrão em QUALQUER imagem raster nessa situação - isso é
física de imagem raster, não um defeito de compressão ou coisa que dê
pra "consertar" reprocessando o arquivo que já existe.

**Tentei resolver mesmo assim com upscaling por IA** (super-resolution,
tipo Real-ESRGAN) - já que o Carlos deu liberdade pra usar build
step/ferramentas novas se ajudasse de verdade. Instalei `upscaler`
(UpscalerJS) + modelo `@upscalerjs/esrgan-slim` via npm (mesma pasta
isolada de scratch das ferramentas anteriores). **Bloqueado por
limitação real do ambiente, não por falta de tentativa**: o pacote
precisa de `@tensorflow/tfjs-node` (binding nativo, compila C++ via
node-gyp) pra rodar no Node - a instalação falhou porque não tem
toolchain de compilação C++ instalado (Visual Studio Build Tools) e o
binário pré-compilado não baixou. Tentei contornar usando o build
"browser" (`@tensorflow/tfjs` puro, sem binding nativo) direto no Node -
esse build usa import de diretório (`import 'upscaler/dist/browser/
esm/...'`), que o resolvedor ESM do Node rejeita por padrão fora de um
bundler (webpack/vite) - sem bundler no projeto (que seria, ironicamente,
o build step que precisaria existir só pra isso funcionar), não tem
como rodar. **Não tentei instalar o Visual Studio Build Tools** pra não
fazer uma mudança grande/invasiva no sistema sem autorização explícita
pra isso especificamente.

**O que resolveria de verdade**: só existe 1 jeito real de melhorar a
nitidez percebida - o Carlos mandar capturas NOVAS em resolução mais
alta (2x/Retina - ex: usando um monitor HiDPI, ou uma ferramenta de
captura que tire print em escala 2x/3x mesmo em monitor comum). Quando
ele mandar, a mesma pipeline já pronta (webp + colocar em `assets/
sistema/` + `<img>` já aponta pro nome certo) trata isso sem trabalho
extra. Registrado aqui pra não reinvestigar do zero (nem tentar
resolver via reprocessamento do arquivo atual) se o assunto voltar -
o problema é resolução de origem, não compressão/formato.

## Planos com nome de verdade, "Funcionalidades" virou dropdown no
menu, projeto reorganizado em pastas (14/09/2026, mesmo dia - rodada
seguinte)

- **Convite `#planos-teaser` removido do `index.html`** - Carlos: "agora
  que solicitar demonstração já tem os planos, o planos pode sair
  daquela parte com o botão" - como "Solicitar demonstração" já leva
  direto pra `planos.html` (rodada anterior) e "Planos" continua no menu
  do topo + rodapé, o banner extra no meio da página virou redundante.
  Removida a seção + a entrada `planos-teaser` do `BG_FX_VARIANTS`
  (`script.js`) - `.plans-teaser`/`.plans-teaser-inner` (CSS) continuam,
  ainda usadas por `#veja-por-dentro-teaser`.
- **Planos ganharam nome de verdade**: Básico/Médio/Máximo (nomes que só
  existiam nesse site, inventados numa rodada anterior) viraram
  Essencial/Profissional/Premium - os nomes reais que o sistema usa (já
  documentados aqui em "## Funcionalidades já cobertas..." desde
  11/09/2026: "Sistema de Planos de verdade (Essencial/Profissional/
  Premium)"). Trocado em `planos.html` (títulos dos 3 cards, "Tudo do
  [X], mais:", texto dos botões "Quero o [X]", a mensagem de WhatsApp
  pré-preenchida de cada botão, meta tags/OG/Twitter) - preço e módulos
  de cada plano não mudaram, só o nome. Nenhum outro arquivo referenciava
  os nomes antigos (conferido por busca antes).
- **Faixa de 15 botões "Funcionalidades" (`#funcionalidades`) virou
  dropdown no menu** - Carlos: "em vez de ter esses botões e tal, bota
  tudo em funcionalidades com do menu, se liga fica melhor" (referência:
  o mega-menu do GestãoDS já usado de inspiração pro rodapé numa rodada
  anterior). A seção inteira saiu do meio da página; os mesmos 15 links
  (mesmos ícones, mesmos `href`) viraram o conteúdo de um dropdown que
  abre ao clicar em "Funcionalidades" no menu (`.nav-dropdown`/
  `.nav-dropdown-toggle`/`.nav-dropdown-menu`, novo em `style.css`+
  `script.js`) - grid de 3 colunas no desktop, vira acordeão de 1 coluna
  dentro do menu mobile (reaproveita o mesmo breakpoint de 1100px que já
  existia). Interação por **clique**, não hover (mais previsível em
  mega-menu, funciona igual em mouse/touch) - fecha ao clicar fora, ao
  clicar num link (que já navega/abre popup normalmente), ou junto com o
  menu mobile.
  - **Achado real ao remover a seção**: o botão secundário do Hero
    ("Conhecer o GestãoCheck") apontava pra `#funcionalidades` - como o
    `id` sumiu, o link ia quebrar (scroll pra lugar nenhum). Redirecionado
    pra `#como-funciona` (próxima seção informativa depois do Hero).
  - **Segundo achado real, mais sério**: as OUTRAS 4 páginas
    (`planos.html`/`quem-somos-nos.html`/`privacidade.html`/
    `termos.html`) ainda tinham o link antigo de item único
    `<a href="index.html#funcionalidades">Funcionalidades</a>` - com a
    seção removida do `index.html`, esse link ia carregar a página e não
    ir a lugar nenhum (hash morto). Substituído pelo MESMO dropdown nas
    5 páginas (hrefs com prefixo `index.html#...`, mesmo padrão já usado
    no rodapé) - `privacidade.html`/`termos.html` não carregam
    `script.js` inteiro (só um `<script>` inline pequeno), então a lógica
    de abrir/fechar o dropdown teve que ser copiada pro inline delas
    também, não só pro `script.js` principal.
  - `#funcionalidades` saiu do `BG_FX_VARIANTS` (`script.js`, entrada
    morta - a seção não existe mais) e o CSS morto (`.module-strip`,
    `.module-strip-inner`, `.module-chip` + a regra correspondente no
    `@media (max-width:768px)`) foi removido junto, confirmado sem
    nenhum outro uso no site antes de apagar.
  - Testado: dropdown abre (15 links, grid 3 colunas), clique num link
    fecha o dropdown E abre o popup certo (`#modulo-cmo` testado),
    clique fora fecha, versão mobile testada em 375px (acordeão limpo,
    zero overflow horizontal), zero erro no console nas 6 páginas.
- **Projeto reorganizado em pastas** - Carlos: "ajeita e organiza os
  arquivos no projeto de maneira lógica". Estrutura nova:
  ```
  css/style.css              (era style.css na raiz)
  js/script.js, js/three-hero.js   (era script.js/three-hero.js na raiz)
  assets/logo|equipe|sistema/      (era scr/assets/... - "scr" era typo
                                     de "src" carregado desde o início
                                     do projeto, corrigido de vez)
  ```
  HTML/CSS/JS de página (`index.html`, `planos.html` etc.), `robots.txt`/
  `sitemap.xml` (localização exigida por convenção de SEO) e os arquivos
  de config/deploy (`Dockerfile`/`docker-compose.yml`/`nginx.conf`/
  `.dockerignore`/`.gitignore`) continuam na raiz de propósito - mover
  esses últimos arriscaria quebrar o deploy na VPS sem necessidade
  (`Dockerfile` precisa estar na raiz do contexto de build).
  - **`nginx.conf` não precisou de nenhuma mudança de lógica** - as
    regras de cache/WebP são todas por EXTENSÃO (`location ~*
    \.(?:css|js)$` etc.), não por caminho, então continuam batendo
    certinho em `/css/style.css`, `/js/script.js`,
    `/assets/sistema/*.webp` sem editar nada além de 1 comentário que
    citava o caminho antigo.
  - **Achado real ao mover a pasta de assets**: `mv scr/assets assets`
    (e `git mv`) falhou com "Permissão negada" - o OneDrive (a pasta do
    projeto fica dentro de `OneDrive\...`) tava segurando lock na pasta
    inteira, provavelmente ainda sincronizando os ~30 arquivos novos
    (`.webp`/`.mp4`/`.webm`) criados poucos minutos antes na rodada da
    auditoria. Resolvido movendo as 3 subpastas (`logo/`, `equipe/`,
    `sistema/`) uma de cada vez em vez da pasta `scr/assets` inteira de
    uma vez - cada uma sozinha passou sem travar.
  - 51 referências a `scr/assets/` (nos 6 HTML - `script.js`/
    `three-hero.js`/`style.css` nunca tinham hardcoded esse caminho,
    só data/src de `<img>`/`<link>`) trocadas por `assets/` via
    find-replace, mais as 12 referências a `style.css`/`script.js`/
    `three-hero.js` trocadas pra `css/style.css`/`js/script.js`/
    `js/three-hero.js`.
  - `README.md` tinha um diagrama de estrutura desatualizado (ainda
    dizia "página única, todas as seções", de antes do site virar 6
    páginas) - reescrito pra refletir a estrutura real e nova (páginas
    na raiz, `css/`/`js/`/`assets/` agrupados, config/deploy na raiz).
  - **Testado com Docker de verdade** (não só o servidor local) -
    `docker build` + `docker run` com a estrutura nova: `nginx -t`
    passou limpo, `/css/style.css`/`/js/script.js`/`/js/three-hero.js`/
    `/assets/logo/...` todos `200`, negociação de WebP conferida de novo
    com o caminho novo (`/assets/sistema/12_cmo.png` com `Accept:
    image/webp` → `Content-Type: image/webp`) - a reorganização não
    quebrou nenhuma das correções da rodada anterior. Testado também no
    navegador nas 6 páginas (zero erro no console, imagem/vídeo de
    popup carregando do caminho novo, cena 3D do Hero renderizando -
    confirma que `assets/`/`css/`/`js/` resolvem certo).

## Pendências de mídia da auditoria resolvidas de verdade - WebP, vídeo
no lugar do GIF, SVG comprimido (14/09/2026, mesmo dia - rodada
seguinte)

A auditoria geral (ver seção abaixo) tinha 3 achados que ficaram sem
solução por falta de ferramenta no ambiente (sem `cwebp`/ImageMagick/
`ffmpeg`/`svgo` instalados). Carlos pediu pra instalar o que fosse
preciso e resolver mesmo. Instalado só em pasta isolada fora do repo
(`sharp`/`svgo`/`@ffmpeg-installer/ffmpeg` via npm, numa pasta de
scratch temporária) - **nenhuma ferramenta/`package.json`/`node_modules`
entrou no repo**, mantendo a filosofia "sem build step" - os scripts de
conversão rodaram apontando pra fora, escrevendo os arquivos finais
direto nas pastas reais do site.

- **Todo PNG/JPG de `scr/assets/sistema/` e `scr/assets/equipe/` ganhou
  um `.webp` irmão** (`sharp`, qualidade 82) - conferido lado a lado no
  navegador (zoom em texto pequeno de tela de dashboard) que não perdeu
  nitidez nenhuma. Em vez de reescrever toda `<img>`/`data-src` do site
  pra `<picture>` (são dezenas, várias com a lógica de troca de módulo
  em popup), a entrega é 100% no `nginx.conf` via negociação de
  conteúdo (`Accept: image/webp`) - **zero mudança de HTML/JS**, o
  `<img src="....png">` continua exatamente igual no código.
  - **Dois bugs reais achados testando com container Docker de
    verdade** (não só lendo o arquivo - `docker build`+`docker run`+
    `curl` com `Accept` variando, depois confirmado no navegador de
    verdade também): (1) primeira tentativa (`try_files
    $uri$webp_suffix $uri`) montava `"arquivo.png.webp"` em vez de
    `"arquivo.webp"` - `$uri` já inclui a extensão original, corrigido
    capturando o caminho SEM extensão via regex no `location`
    (`^/(.+)\.(?:png|jpe?g)$`); (2) mesmo com o grupo capturado, `$1`
    chegava **vazio** dentro do `try_files` - causa: `$webp_suffix` (a
    variável do `map`) é resolvida "lazy", só na primeira vez que é
    referenciada - resolver ela dispara o regex do `map`
    (`"~*image/webp"`), e QUALQUER regex avaliado depois do regex do
    `location` sobrescreve `$1` pra vazio, mesmo sem capturar nada.
    Corrigido com `set $img_base $1;` logo na entrada do bloco -
    "congela" o valor numa variável própria antes do `map` ter chance
    de rodar. Confirmado no fim com `<img>` real carregando no
    navegador (não só `curl`): `performance.getEntriesByType('resource')`
    mostrou `transferSize` batendo exato com o tamanho do `.webp` no
    disco, não do `.png` original.
  - Resultado: o que um navegador moderno de verdade baixa (WebP +
    vídeo + SVG comprimido, ver abaixo) caiu de ~6,3MB pra ~2,1MB
    (-66%) - navegador sem suporte a WebP (raro hoje) continua caindo
    pro PNG/JPG original automaticamente, sem quebrar nada.
- **GIF do Multi-IA virou vídeo** (`multi_ia_chat_fullpage.gif`, 2,2MB
  → `.mp4`+`.webm`, 172KB/125KB, ~92% menor) - convertido com `ffmpeg`
  (H.264/VP9, mesmo conteúdo exato). `<img>` virou `<video autoplay
  muted loop playsinline preload="metadata" poster="...">` com os dois
  formatos como `<source>` (webm primeiro, navegador escolhe o que
  suporta) + um `poster` (frame estático comprimido, JPG+WebP) pra não
  mostrar vazio antes de carregar. `muted` é obrigatório - autoplay sem
  som é a única forma que todo navegador moderno permite sem interação
  do usuário. GIF original apagado (não tinha mais referência em lugar
  nenhum). `.screenshot-frame img` virou `.screenshot-frame img,
  .screenshot-frame video` no CSS (mesma regra de aspect-ratio/object-
  fit/largura, só estendida). `nginx.conf` ganhou cache de 30d pra
  `.mp4`/`.webm` (mesma lógica do resto). **Testado sem depender de
  screenshot** (o ambiente de automação não estava compositando frame
  de verdade nesta rodada, sintoma já documentado antes nesta sessão
  pro GSAP/rAF - aparentemente vale pra vídeo também) - confirmado via
  `drawImage(video,...)` num canvas + `getImageData` que o vídeo tem
  frame de verdade decodificado (não veio preto/vazio), e via `ffmpeg
  -v error ... -f null -` que os dois arquivos decodificam sem erro
  nenhum.
- **SVGs de `scr/assets/logo/` comprimidos com `svgo`** - **achado
  real**: a config PADRÃO do `svgo` deixou os arquivos **maiores**, não
  menores (`logo-horizontal-claro.svg` foi de 50331 pra 62869 bytes,
  +24,9%) - o preset default reformata os números do `path` de um jeito
  mais verboso que o original nesse caso específico (paths bem grandes,
  exportados de outra ferramenta com pouca casa decimal já). Corrigido
  usando `--precision=1` (arredonda coordenada pra 1 casa decimal) -
  resultado real: todos os arquivos entre 30% e 72% menores
  (`logo-horizontal-claro.svg`: 50331 → 23154 bytes, -54%). Confirmado
  visualmente sem diferença nenhuma (renderizado lado a lado no
  navegador, pixel a pixel idêntico ao original) - faz sentido, a
  escala real desses paths (coordenadas na casa dos milhares, com
  transform de escala 0.1x aplicado) deixa a precisão de 1 casa decimal
  bem abaixo de qualquer coisa perceptível.

## Auditoria geral do site (14/09/2026) - segurança, performance,
responsividade, SEO e código morto

Carlos pediu auditoria geral com liberdade total pra mudar o que fosse
preciso: segurança, se o site "tá de acordo", responsividade, e se dava
pra usar alguma tecnologia nova. Passei pelo repo inteiro (não só
código - também `nginx.conf`/`docker-compose.yml`/`Dockerfile`) e testei
de verdade (CSP com headers reais, responsividade em 320-1440px nas 6
páginas, console limpo). O que mudou:

- **`nginx.conf` - 3 achados reais**:
  1. `.gif` nunca tinha cache-control nenhum (só svg/jpg/jpeg/png/ico) -
     o GIF do Multi-IA (~2,2MB) baixava de novo em toda visita sem
     header de cache nenhum guiando o navegador. Corrigido, entrou na
     mesma regra de 30 dias/immutable dos outros assets.
  2. CSS/JS não tinham cache-control nenhum, mesmo já usando query
     string de versão (`?v=N`) pra invalidar cache quando o conteúdo
     muda - toda visita revalidava via `304` em vez do navegador nem
     perguntar pro servidor. Adicionada regra de cache agressivo (30d,
     immutable) pra `.css`/`.js` - segura porque a própria URL muda
     quando o arquivo muda (mesmo mecanismo de cache-busting já usado
     há várias rodadas, só faltava o header aproveitar isso).
  3. Sem `Strict-Transport-Security` (HSTS) - o Traefik já termina TLS
     (Let's Encrypt, `docker-compose.yml`), mas HSTS é responsabilidade
     da origem, não do proxy. Adicionado `max-age=31536000;
     includeSubDomains` (sem `preload` de propósito - entrar na lista
     de preload do Chrome é praticamente irreversível por meses, não
     ativar sem decisão explícita do Carlos/Tonhão).
- **`robots.txt`/`sitemap.xml` criados** (raiz do repo) - pendência
  antiga, nunca implementada (technical SEO ficou fora de escopo em
  rodadas anteriores). `sitemap.xml` lista só as 4 páginas indexáveis
  (`/`, `/planos.html`, `/conheca-o-sistema.html`,
  `/quem-somos-nos.html`) - `privacidade.html`/`termos.html` ficam de
  fora de propósito, já têm `<meta name="robots" content="noindex">`,
  colocar no sitemap mandaria sinal contraditório pro Google.
- **Meta tags completas nas 6 páginas** - a maioria só tinha
  `og:title`/`og:description`/`og:type`, faltava em quase todas:
  `og:image`, `og:url`, `og:locale`, o conjunto `twitter:card` inteiro
  (nenhuma tinha), `<link rel="canonical">` e `<meta name="theme-color">`
  (`#0C1E24`, a cor de fundo do site - tinta a barra do navegador em
  mobile). `og:image` continua apontando pro SVG existente
  (`logo-vertical-completo.svg`) - **pendência que continua em aberto**:
  WhatsApp/Facebook/LinkedIn não renderizam OG image em SVG de verdade
  (precisa JPG/PNG ~1200×630) - não tenho ferramenta de conversão de
  imagem disponível neste ambiente (sem ImageMagick/cwebp/ffmpeg) pra
  gerar um PNG de verdade sem risco de sair borrado/mal recortado -
  registrado aqui de novo (já estava pendente desde 11/08/2026), Carlos
  precisa gerar um PNG real quando tiver como exportar.
- **Dados estruturados (JSON-LD) em `index.html`** - schema.org
  `SoftwareApplication`, ajuda o Google a mostrar rich results (preço,
  categoria). Único script inline do site - o CSP (`script-src`) não
  tinha `'unsafe-inline'` de propósito (decisão de segurança antiga),
  então em vez de enfraquecer o CSP pra liberar QUALQUER script inline,
  usei um `'sha256-...'` que libera só esse bloco exato pelo hash do
  conteúdo. **Atenção pra quem mexer nesse bloco depois**: editar o
  JSON-LD (mesmo só espaço/quebra de linha) muda o hash e o CSP passa a
  bloquear ele silenciosamente em produção (sem erro visível pro
  usuário, só um warning no console que ninguém vê) - o comando pra
  recalcular está comentado dentro do próprio `nginx.conf`, ao lado da
  diretiva. **Testado com headers de verdade** (não só `npx serve`, que
  não aplica CSP nenhum - replicado um servidor de teste local com os
  headers exatos do `nginx.conf`, mesma metodologia já usada antes
  nesta sessão pra validar CSP) - script JSON-LD carregou normal, zero
  violação de CSP no console, GSAP/ScrollTrigger/Lenis/Font Awesome
  continuam carregando normal (script-src pros CDNs não foi tocado).
- **Código morto removido** (`script.js`/`style.css`) - `buildDotsFx`/
  `buildParticlesFx`/`buildShootFx` (a constelação de pontos, as
  partículas flutuantes e a estrela cadente) não tinham mais NENHUM
  chamador desde que `#sobre` (a última seção que ainda usava
  `buildShootFx`) ganhou cena 3D própria nesta mesma sessão (ver seção
  acima) - confirmado por busca no arquivo inteiro antes de apagar.
  Removidas as 3 funções + as classes CSS que só elas usavam
  (`.bg-fx-dots`, `.bg-fx-particles`, `.bg-fx-shoot`, `.bg-dot`,
  `.bg-dot-lines`, `.bg-particle`, `.bg-shoot` e as `@keyframes`
  `bgDotTwinkle`/`bgDotDrift1-3`/`bgFloatUp`/`bgShootMove`) - as outras
  7 variantes de fundo (waves/icons/flow/topo/ghost/aurora/grid)
  continuam intactas e testadas funcionando (conferido via
  `section.querySelector('.section-bg-fx').className` em
  `#funcionalidades`/`#como-funciona`/`#diferenciais`/`#experiencia`/
  `#modulos`/`#paraquem`/`#planos-teaser` depois da limpeza).
- **`loading="lazy"` nas fotos dos 3 fundadores** em
  `quem-somos-nos.html` (`.founder-photo`, seção Fundadores, abaixo da
  dobra) - só essas, não nas versões pequenas dentro do modal de
  contato (já não carregam até o modal abrir de qualquer jeito, o
  `<img>` reaproveita o mesmo arquivo já cacheado pela versão grande).
- **Responsividade re-testada nas 6 páginas** em 320/375/768/900/1440px
  (medindo `scrollWidth - clientWidth` de verdade, não só olhando) -
  **zero overflow horizontal em qualquer largura, em qualquer página**.
  Também conferido que o menu ainda colapsa pro hambúrguer certinho na
  faixa 769-1100px (bug antigo já corrigido, sem regressão).
- **Bibliotecas de CDN conferidas contra a versão mais recente**: GSAP/
  ScrollTrigger `3.15.0`, Three.js `0.186.0` e Lenis `1.3.26` **já são
  as versões mais novas disponíveis** (nenhuma desatualizada). Font
  Awesome **está desatualizado** (`6.5.1`, a versão mais nova é `7.3.1`)
  - **decisão: não atualizado nesta rodada**. FA7 muda o jeito de
  referenciar ícone (família/estilo em classes separadas) e o
  comportamento de largura padrão de cada ícone (`fa-fw` foi removido) -
  são mudanças que quebram visualmente sem migração, e o site tem
  dezenas de ícones espalhados pelas 6 páginas sem um jeito fácil de
  conferir todos de uma vez depois de uma atualização às cegas. Fica
  registrado como recomendação, não como pendência - só vale a pena se
  o Carlos quiser esse trabalho especificamente algum dia.

**Itens investigados, resolvidos na rodada seguinte** (ver seção "Pendências
de mídia da auditoria resolvidas de verdade" logo abaixo/acima, mesma
data) - WebP nos PNGs/JPGs, GIF do Multi-IA virou vídeo, SVGs de logo
comprimidos. Só ficou mesmo sem solução:
- Não dá pra confirmar 100% se o Traefik compartilhado (mesma VPS dos
  clientes do sistema principal) já redireciona HTTP→HTTPS
  automaticamente pra esse domínio novo - isso vive na configuração
  global do Traefik, fora deste repo. HSTS (adicionado acima) ajuda
  independente disso, mas vale o Tonhão confirmar na hora do deploy que
  `http://gestaocheck.tech` redireciona certo pra `https://`.

Nada dessa rodada foi commitado - fica pro Carlos revisar e commitar
quando quiser.

## Convite "Quem somos nós" removido do meio do site (já tá no rodapé),
"Solicitar demonstração" agora leva direto pra Planos, cena 3D no
lugar da constelação feia de "Nossa história" (14/09/2026)

- **`#quem-somos-teaser` removido do `index.html`**: Carlos notou que
  desde a rodada anterior "Quem somos nós" já tem link no rodapé -
  repetir como banner inteiro no meio do site ("se já tá lá embaixo não
  precisa estar na tela também") era redundante. Removida a seção, sem
  mexer em mais nada da página (`quem-somos-nos.html` continua existindo
  normal, só perdeu esse ponto de entrada extra). `quem-somos-teaser`
  também saiu do `BG_FX_VARIANTS` de `script.js` (não existe mais em
  lugar nenhum).
- **"Solicitar demonstração" agora leva direto pra `planos.html`**, não
  mais pro modal "com quem você quer falar" - pedido do Carlos pra dar
  mais destaque aos planos ("colocar em um lugar melhor... solicitar
  demonstração já vai logo pra essa tela de planos"). Mudou nos 3 lugares
  que esse botão aparece: menu (`nav-links`, nas 5 páginas que têm menu
  completo), Hero e CTA final (`index.html`) - todos viraram
  `<a href="planos.html">` (eram `<button data-modal-open="contactModal">`
  no Hero/CTA final, `href="#contato"` no menu). O CTA final também
  trocou o ícone de `fa-whatsapp` pra `fa-arrow-right` (não abre mais
  WhatsApp direto, ícone antigo ficaria enganoso). **Efeito colateral
  limpo**: como nada em `index.html` abre mais o modal `#contactModal`
  (só as páginas de planos/fundadores usam esse mecanismo agora), o
  bloco HTML inteiro do modal genérico foi removido de `index.html` -
  confirmado antes que `script.js` não quebra com ele ausente
  (`abrirModal`/`CONTACT_OPTION_BASE_HREFS` já tratam ausência de
  elemento com `if (!modal) return`/`querySelectorAll` vazio). O botão
  "Quero o [Plano]" dentro de `planos.html` continua abrindo o modal de
  WhatsApp normalmente (não mexido) - só o "Solicitar demonstração"
  genérico mudou de destino.
- **Texto da Política de Privacidade corrigido** (`privacidade.html`) -
  o parágrafo "WhatsApp: a única forma de contato" ainda dizia que os
  botões "Solicitar demonstração" abrem o WhatsApp direto - não é mais
  verdade, então ficaria uma imprecisão num documento legal. Reescrito
  pra descrever o fluxo real: "Solicitar demonstração" leva pra Planos,
  e é lá (nos botões "Quero o [plano]") + nos links dos fundadores que o
  WhatsApp realmente abre.
- **Cena 3D "check da marca" na seção `#sobre` de `quem-somos-nos.html`**
  - Carlos: "a animação do fundo da tela de quem somos nós tá muito
  feia, melhora igual as outras telas". Essa seção (o título "De uma dor
  real...") usava a constelação 2D genérica (`buildShootFx`/
  `buildDotsFx`) - numa seção bem alta com título grande, as linhas
  retas/esparsas cruzavam direto por cima do texto, bem abaixo do nível
  das cenas 3D que o resto do site principal já tem (Hero/CTA/Segurança/
  Problema/Indicadores). **Corrigido reaproveitando a cena do Hero/CTA**
  (`initShowcaseScene`, o check ciano+coral com halo orbitando) em vez
  de escrever uma cena nova - `quem-somos-nos.html` não carregava
  `three-hero.js` até agora, passou a carregar (`<script type="module"
  src="three-hero.js?v=9">`), ganhou `<canvas id="sobre-3d">` como
  primeiro filho de `#sobre`, CSS no mesmo padrão de sempre
  (`position:absolute;inset:0`, desliga em mobile/
  `prefers-reduced-motion`, `#sobre` ganhou `overflow:hidden`) e uma
  chamada nova em `three-hero.js` (`initShowcaseScene("sobre-3d", {
  scale: 1.1, particleCount: 28, showBars: false })` - sem a barrinha de
  gráfico do Hero, que só faz sentido no contexto de "dados/gestão", não
  na história da empresa). `sobre` saiu do `BG_FX_VARIANTS` genérico e
  entrou na lista de exceção (mesma lógica de Hero/CTA/Segurança/
  Problemas/Indicadores - seção com cena 3D própria não ganha fundo 2D
  em cima). Site principal sobe pra 7 cenas WebGL possíveis no total
  entre as páginas (Hero, CTA, Segurança, splash topo, Problemas,
  Indicadores, Sobre) - continua só 1-2 renderizando de verdade a
  qualquer momento (`isVisible`+`IntersectionObserver` em todas).
  **Nota pra depois**: com `sobre` fora do mapeamento, `buildShootFx`/
  `buildDotsFx` (`script.js`) ficaram sem nenhum chamador - não
  apagadas nesta rodada (não é o foco do pedido, e são inofensivas
  paradas ali), mas se algum dia for fazer limpeza de código morto,
  esse par de funções + o CSS `.bg-fx-shoot`/`.bg-fx-dots`/`.bg-dot`/
  `.bg-shoot` (`style.css`) são candidatas certas.
  Testado: `node --check`/balanço de tags limpos nos 6 HTML +
  `three-hero.js`, contexto WebGL saudável (`getError()` 0,
  `isContextLost()` false) com o canvas no tamanho real da seção (não
  300×150 padrão), zero erro no console, os 3 CTAs "Solicitar
  demonstração" confirmados apontando pra `planos.html`, botão "Quero o
  Básico" em `planos.html` confirmado ainda abrindo o modal de WhatsApp
  com a mensagem certa (fluxo antigo intacto onde devia continuar).
  `script.js?v=4`/`three-hero.js?v=9` (cache-busting de sempre).

## "Planos" de volta ao rodapé, card "Tema claro/escuro" removido,
bug real de grid invertido nos popups de módulo corrigido - imagem
bem maior (13/09/2026, mesmo dia - rodada seguinte)

- **Planos de volta ao rodapé**: Carlos viu o resultado da rodada
  anterior (Planos só no menu do topo, fora do rodapé) e decidiu manter
  nos dois lugares - "vi que mudou e limpou bastante, então tá bom
  manter nos dois". Link `planos.html` voltou a ser o primeiro item da
  coluna "Funcionalidades" do rodapé (mesma posição que ocupa no rodapé
  do GestãoDS, referência usada pra essa coluna) nas 5 páginas, sem
  tirar do menu do topo.
- **Card "Tema claro/escuro" removido de vez** (`#modulos`, popup e
  link de rodapé) - Carlos: "isso não é uma funcionalidade pra se dizer
  'olha que ela se liga', é só uma função básica". Removido: o botão do
  grid `#modulos`, o popup inteiro (`#modulo-tema`, com o comparador
  claro/escuro interativo que só existia ali), a entrada `tema` do
  `MODULE_ANCHORS` (`script.js`), o link `#tema` do rodapé nas 5
  páginas, o listener JS do botão de alternância (`.theme-toggle-btn`,
  só existia pra esse popup) e o bloco CSS inteiro `.theme-compare*`/
  `.theme-toggle*` (`style.css`) - nada disso era reaproveitado em
  lugar nenhum do site, confirmado por busca antes de apagar. `#modulos`
  ficou com 12 cards (era 13). As duas screenshots usadas só ali
  (`09_inicial_dashboard.png`/`09_inicial_dashboard-branco.png`)
  continuam no repo (não apagadas, só ficaram sem referência no HTML -
  não é uma limpeza de asset que o Carlos pediu).
- **Bug real achado e corrigido - imagem dos popups de módulo renderizava
  pequena demais**: Carlos pediu pra aumentar as imagens dentro dos
  popups pra ficarem do tamanho das 4 seções que continuam inline
  (Estoque/CMV/Multi-IA/Segurança) - "quero igual de todas as partes".
  Investigando, achei que não era só o `max-width:1100px` do card sendo
  pequeno - o `.module-modal-grid` (`grid-template-columns: 0.55fr
  1.45fr`) estava dando a coluna GRANDE pro TEXTO e a coluna PEQUENA pra
  IMAGEM, o oposto do que o próprio comentário no CSS dizia que
  acontecia. Causa: essa proporção foi copiada do `.deepdive-grid` (que
  funciona certo porque lá o texto vem PRIMEIRO no HTML nas seções
  normais, `0.55fr` cai matematicamente em cima dele) - mas em TODO
  popup de módulo, sem exceção, `.module-modal-visual` (a imagem) é
  quem vem primeiro no HTML, não o texto. Sem uma variante tipo
  `.deepdive-grid.reverse` (que existe lá justamente pra esse caso),
  a imagem sempre caiu na coluna pequena - o popup nunca teve a imagem
  "em prioridade" que o comentário do código dizia ter, desde que os
  popups de módulo foram criados. **Corrigido** invertendo direto pra
  `1.45fr 0.55fr` (não precisou de variante `.reverse`, porque a ordem
  é sempre a mesma nos 12 popups, ao contrário do `.deepdive-grid` que
  alterna). Resultado medido: imagem foi de ~333px pra ~881px de
  largura numa janela de 1400px (mais larga até que a versão inline de
  Estoque, ~811px, nessa mesma tela). Junto, `.module-modal-card`
  `max-width` também subiu de 1100px pra 1500px (mesmo teto do
  breakout do `.deepdive-grid` em monitor grande) - com as duas
  correções juntas a imagem do popup fica pelo menos do mesmo tamanho
  (geralmente maior) que a versão inline equivalente. Testado: medido
  via `getBoundingClientRect()` num popup com screenshot normal (CMO) e
  um com `.module-modal-visual-flow` (Beneficiamento, sem imagem, só
  texto de fluxo) - os dois recebem a coluna grande corretamente agora;
  conferido também em mobile (grid vira 1 coluna via media query
  já existente, sem overflow horizontal, 375px). Zero erro novo no
  console.

## Rodapé redesenhado com coluna "Funcionalidades", "Nossa história" saiu
do menu do topo (13/09/2026, mesmo dia - rodada seguinte)

Carlos mandou 2 prints do GestãoDS (concorrente já pesquisado numa rodada
anterior, ver "Site condensado em blocos" abaixo): o mega-menu
"Funcionalidades" do topo (lista longa de links) e o rodapé, que tem
"Quem somos" só lá embaixo (não repete no menu do topo) e uma coluna
"Nosso Software" com um link por funcionalidade. Pediu pra usar de
inspiração (pode modificar), somar uma coluna assim de funcionalidades
no nosso rodapé, e mover "Nossa história"/"Sobre nós" pra só existir no
rodapé (tirar do menu do topo) - dá pra limpar bastante o menu.

- **"Nossa história" removida do menu do topo** (`<ul class="nav-links">`)
  nas 5 páginas que têm o menu completo (`index.html`, `planos.html`,
  `quem-somos-nos.html`, `privacidade.html`, `termos.html`) - o link
  continua existindo, só que agora só no rodapé (ver abaixo), igual o
  padrão do concorrente.
- **Rodapé perdeu a coluna genérica "Produto" e ganhou "Funcionalidades"**
  (`.footer-col-modules`, nova classe) com um link por funcionalidade -
  as 17 que o site tem hoje (Estoque/CMV/Multi-IA/Segurança, que são
  seção própria, + os 13 que viraram popup em `#modulos`: CMO, CMC,
  Beneficiamento, Avarias e Ocorrências, Checklists, Caixa, Despesas,
  Patrimônio, Requisições, Relatórios, DRE completa, Curva ABC, Tema
  claro/escuro). Reaproveita o mecanismo `MODULE_ANCHORS` que já existia
  em `script.js` (criado na condensação em blocos, pra links antigos tipo
  `href="#cmc"` continuarem funcionando) - só precisou somar 1 entrada
  nova (`tema: 'modulo-tema'`, não existia mapeamento pra essa ainda).
  Lista de 17 itens ficaria exageradamente alta numa coluna só -
  balanceada em 2 colunas internas via CSS multi-column
  (`column-count:2`, `style.css`), sem precisar dividir a lista em 2
  arrays manualmente; no mobile a coluna vira largura cheia
  (`grid-column:1/-1`) pra cada sub-coluna não ficar espremida - testado
  em 375px, 2 colunas internas de texto curto cabem bem, sem overflow
  horizontal.
- **Coluna "Empresa" reorganizada**: agora tem Quem somos nós, Para quem
  é, Como funciona, Conhecer o sistema, Contato - absorveu o que fazia
  sentido da antiga "Produto" (Como funciona, Contato) já que essa
  coluna deixou de existir como estava.
- **"Planos" removido do rodapé** (pedido explícito do Carlos: "tira
  planos, não precisa") - continua no menu do topo normalmente, só não
  repete mais como link no rodapé.
- **Bug real achado e corrigido enquanto mexia nesse bloco**: em
  `planos.html`/`privacidade.html`/`termos.html`, o link "Nossa
  história"/"Sobre nós" (menu e rodapé) apontava pra `index.html#sobre`
  - um id que não existe mais desde que `#sobre` saiu do `index.html` e
  virou `quem-somos-nos.html` (rodada "Splash desativado... Planos e
  Veja-por-dentro viraram páginas próprias" abaixo). Ninguém tinha
  atualizado esses 3 arquivos na hora - o link carregava o `index.html`
  e não ia a lugar nenhum. Corrigido nas 5 páginas pra apontar direto
  pra `quem-somos-nos.html`. Aproveitei e também corrigi
  `privacidade.html`/`termos.html`, que nem tinham o link "Planos" no
  menu do topo (as outras 3 páginas tinham, essas 2 não - inconsistência
  achada no mesmo pente, corrigida).
- **Novo: hash de módulo funciona vindo de OUTRA página** (`script.js`) -
  os links novos do rodapé de `planos.html`/`quem-somos-nos.html`/
  `privacidade.html`/`termos.html` apontam pra `index.html#cmc` etc.
  (não dá pra interceptar o clique, é troca de página de verdade) - sem
  tratamento, o navegador carregava o `index.html` e não fazia nada com
  o hash (não existe elemento com id pros 13 módulos que viraram popup).
  Somado um cheque de `location.hash` uma vez ao carregar a página
  (mesmo bloco de `script.js` que já cuida do clique em âncora, reusa
  `MODULE_ANCHORS`/`scrollToTarget`/`abrirModal`) - se o hash bate com
  um módulo, rola até `#modulos` e já abre o popup certo; se é uma
  âncora de verdade (`#estoque` etc.), rola até lá (ajuda a resincronizar
  o Lenis também, que não sabe que o navegador já pulou pro hash
  nativamente antes do JS carregar). Testado: carregando `index.html#cmc`
  direto (simulando clique vindo de outra página) o popup do CMC abre
  sozinho; carregando `index.html#estoque` a seção certa já aparece no
  topo da tela.
- Testado: balanço de tags conferido nas 5 páginas HTML + chaves do CSS,
  `node --check` limpo em `script.js`, os 17 links do rodapé lidos via
  inspeção da árvore de acessibilidade (todos com o `href` certo), clique
  real no link "CMO" do rodapé abrindo o popup certo, clique real em
  "Tema claro/escuro" (a entrada nova do `MODULE_ANCHORS`) também
  abrindo o popup certo, coluna de funcionalidades em 2 colunas full-
  width sem overflow em 375px.

## Cena 3D de verdade na seção "Visão completa" (13/09/2026, mesmo dia -
rodada seguinte)

Carlos pediu o mesmo tratamento de "O Problema" (cena 3D de verdade, ver
seção acima) pra `#indicadores` ("Visão completa"), mas avisou que essa
seção é pequena (só 3 cards - CMV/CMO/CMC), então a cena precisa fazer
sentido nesse tamanho, não ser grandiosa igual Hero/Segurança/Problema.

- **`initInsightScene()` nova em `three-hero.js`** - pensada de propósito
  como o OPOSTO visual de `initFragmentsScene` (Problema = fragmentos
  soltos, cada um girando sozinho, linhas piscando fora de sincronia,
  nunca ficam sólidas - tema "caos/desconexão"): aqui são só 3 núcleos
  pequenos (`OctahedronGeometry`, um por indicador), presos numa
  formação triangular estável (`nodeRadius: 2.3`, bem menor que os
  outros raios de cena do site), ligados por linhas SÓLIDAS que só
  pulsam suavemente (nunca piscam/somem) - mais um anel fino de
  "escaneamento" girando através deles (remete a "visão completa" -
  enxergar tudo de uma vez) e só 10 partículas de fundo (bem esparsa,
  seção pequena não precisa de nuvem densa). O grupo inteiro (não cada
  núcleo isolado) gira junto como uma peça só - tema "ordem/clareza",
  contraste direto com o "cada fragmento por si" de Problema. Mesma
  técnica de sempre (wireframe + miolo translúcido pra simular glow,
  `isVisible`/`IntersectionObserver`, desliga em mobile/
  `prefers-reduced-motion`).
- **`#indicadores` saiu do `BG_FX_VARIANTS` genérico** (`script.js`) e
  entrou na lista de exceção junto com Hero/CTA/Segurança/Problemas -
  `<canvas id="indicadores-3d">` adicionado como primeiro filho da
  seção no `index.html`. `#indicadores` ganhou `position:relative;
  overflow:hidden` (`style.css`) pra conter o canvas - texto/cards por
  cima já ficam corretos sem fix de z-index extra (mesma regra global
  de `.container{position:relative;z-index:1}` de sempre). Opacidade do
  canvas um pouco mais baixa que Problema (0.55 vs 0.6) - seção menor,
  cena mais discreta de propósito, não deve competir com os 3 cards.
- **Erro real cometido (2x na mesma sessão) e corrigido**: escrevi um
  comentário usando `#` solto em vez de `//` no início de
  `initInsightScene` (`# propósito - seção pequena...`) - JavaScript não
  tem comentário de linha com `#`, então `node --check`/o parser do
  navegador quebravam ali com `SyntaxError: Invalid or unexpected
  token`. Mesmo erro exato já tinha acontecido escrevendo
  `initFragmentsScene` (Problema) horas antes nesta mesma sessão -
  registrado aqui pra não repetir uma terceira vez: **nunca usar `#`
  como marcador de comentário em arquivo `.js`**, é sintaxe de shell/
  Python, não de JavaScript.
- **Site sobe pra 6 cenas WebGL possíveis** (Hero, CTA, Segurança,
  splash topo, Problemas, Indicadores) - mesmo padrão de sempre, só 1-2
  renderizando de verdade a qualquer momento graças ao
  `isVisible`+`IntersectionObserver` já presente em todas.
- Testado: `node --check` limpo em `script.js`/`three-hero.js`, balanço
  de chaves/tags conferido em `style.css`/`index.html`, canvas
  `#indicadores-3d` inicializando com dimensão real (não mais 300×150
  padrão do HTML) ao carregar a página FRESCA já no tamanho de tela
  final (1400×900 - mesma pegadinha de teste já documentada acima:
  redimensionar depois de carregar não reinicializa a cena), contexto
  WebGL saudável (`getError()` 0, `isContextLost()` false), zero erro
  no console, cena visível na tela (triângulo/linhas ciano perto do
  título "Três indicadores" confirmado por screenshot).

## "Quem somos nós" virou página própria, botão de demonstração
compactado, constelação de fundo melhorada, cena 3D do Hero mais
visível, análise pendente pra "Veja por dentro" (13/09/2026, mesmo dia
- rodada seguinte)

- **`quem-somos-nos.html` criada** - mesmo padrão de `planos.html`/
  `conheca-o-sistema.html`: Sobre/Nossa história + Nosso Propósito
  (Missão/Visão/8 valores) + Fundadores saíram do `index.html` e
  viraram 1 página só, ligada por um banner convite compacto
  (`#quem-somos-teaser`, reaproveitando `.plans-teaser`). Nav/rodapé
  ("Nossa história"/"Sobre nós") atualizados pra apontar pra lá. `sobre`/
  `proposito`/`fundadores` continuam como chave no `BG_FX_VARIANTS` de
  `script.js` (não removidas, só não usadas mais no `index.html`) -
  essas 3 seções existem agora só em `quem-somos-nos.html`, que carrega
  `script.js` inteiro também e precisa das mesmas entradas pro fundo
  animado de cada uma continuar com o estilo próprio (constelação/
  ícones/flow) em vez de cair no genérico.
- **Botão "Solicitar demonstração" compactado** (Carlos: "exagerado
  demais") - removido o efeito magnético (`.btn-primary` seguindo o
  cursor via `gsap.quickTo`, script.js) e reduzido o padding base de
  `.btn` (16px 32px → 13px 26px) + removidos os `style=` inline que
  deixavam a versão do Hero/CTA final ainda maiores (20px 40px,
  1.1rem) - todos os botões primários do site agora usam o mesmo
  tamanho compacto, sem exceção.
- **Constelação de fundo (`bg-fx-shoot`, usada em Problemas/Indicadores/
  Sobre) melhorada** (Carlos: "muito paia") - `buildDotsFx()` foi de 8
  pra 12 pontos com mais linhas conectando, pontos maiores com glow
  (`box-shadow`) e agora também piscam (`bgDotTwinkle`, novo keyframe),
  não só derivam devagar; `buildShootFx()` foi de 2 pra 4 estrelas
  cadentes, cada uma maior/mais brilhante com trilha bem mais longa
  (150px, era 90px). Reaproveitado automaticamente em toda seção que
  usa esse fundo, sem precisar tocar seção por seção.
- **Cena 3D do Hero mais visível** (Carlos: "adorei a animação do
  começo, só que não dá pra ver ela direito"): opacidade do canvas
  `#hero-3d` (`style.css`) de 0.55 pra 0.8, e o parâmetro `scale` da
  cena (`initShowcaseScene("hero-3d", ...)` em `three-hero.js`) de 1
  pra 1.35 - o check 3D fica maior e mais visível "vazando" nas
  bordas/entrelinhas do texto do Hero, sem precisar mexer no layout do
  texto em si.
- **"Conheça o sistema" virou "modo app"** - Carlos pediu análise antes
  de mexer ("primeiro analisa e me mostra"), apresentei 3 caminhos
  (página em modo app / janela flutuante por cima do site / deixar como
  estava) - ele escolheu o modo app. Implementado em
  `conheca-o-sistema.html`: o header normal (com o menu inteiro) virou
  `.app-topbar` - só logo pequena + link "← Voltar ao site", bem mais
  fino; o título/parágrafo grande antes da vitrine virou uma legenda
  fininha (`.app-mode-label`); `.sys-frame` (o "monitor" da vitrine)
  passou a ocupar quase a tela inteira (`height: calc(100vh - 190px)`,
  testado batendo exato em 1400×900 - 900-190=710px, conferido via
  `getBoundingClientRect()`); rodapé E modal de contato foram removidos
  dessa página de propósito (não tinha nenhum botão que abria o modal
  depois da mudança, e "modo app" não deveria ter CTA de venda dentro,
  só a saída pelo topo) - GSAP/ScrollTrigger/Lenis também deixaram de
  ser carregados aqui (nenhum código antes do bloco condicionado a eles
  em `script.js` usa `gsap`/`ScrollTrigger` sem guard, confirmado via
  busca no arquivo - então tirar os 3 `<script>` de CDN é seguro, só
  menos peso/mais rápido pra abrir).
- **Guardado pra próxima versão, junto com a reativação do splash**:
  a opção "janela flutuante" (abrir a vitrine num popup em tela cheia
  por cima do site atual, sem trocar de URL, fechando volta pro mesmo
  lugar) - Carlos gostou da ideia mas decidiu deixar pra quando for
  reativar a abertura cinematográfica também, não fazer agora. Exigiria
  devolver o código da vitrine pra dentro do `index.html` (ou carregar
  via fetch/iframe), o que vai contra o "site mais leve" que motivou
  tirar ela de lá - avaliar isso com calma quando chegar a hora.

## Splash desativado (guardado pra depois), Planos e Veja-por-dentro
viraram páginas próprias, mais uma rodada de compactação (13/09/2026,
mesmo dia)

Carlos pediu 3 coisas nessa rodada, no mesmo padrão do site de
referência que ele mandou (onde "Ver planos" abre OUTRA TELA, não uma
seção dentro da mesma página):

- **Abertura cinematográfica (splash) DESATIVADA, não apagada.**
  "Tira por enquanto, deixa como atualização futura" - removido só o
  bloco `<div class="splash-zone" id="splashZoneTop">...</div>` do
  `<body>` do `index.html` (era as linhas logo depois do `<body>`,
  antes do `<header>`). **Nada mais foi tocado de propósito**: o CSS
  inteiro (`.splash-*` em `style.css`) e a lógica JS inteira
  (`initSplash()`, topo de `script.js`, e `initSplashScene
  ("splash-3d-top")` em `three-hero.js`) continuam no repo, intactos -
  como a IIFE de `initSplash()` já tinha o guard `if (!zoneTop)
  return;` (pra nunca quebrar se o HTML faltasse) e `initSplashScene`
  já pula sozinha se o canvas não existir, remover só o HTML foi
  suficiente pra desligar o efeito inteiro sem precisar editar nenhum
  dos dois arquivos JS. **Pra reativar no futuro**: só devolver o
  bloco HTML removido (ver o commit desta rodada, ou a versão anterior
  do arquivo) de volta como primeiro filho do `<body>`, antes do
  `<header>` - tudo o resto já está pronto e funcionando, incluindo o
  refino de fluidez (smoothstep + sync com o Lenis) da rodada anterior.
- **`planos.html` criada** - a seção `#planos` (cards de preço + CTA
  WhatsApp) saiu do `index.html` e virou página própria, com o mesmo
  header/footer/modal de contato. `index.html` ficou só com um banner
  convite compacto (`#planos-teaser`, classe `.plans-teaser` nova em
  `style.css` - reaproveitável pra qualquer "convite pra outra página"
  futuro) linkando pra `planos.html`. A página nova carrega
  GSAP+ScrollTrigger+Lenis+`script.js` inteiro (não a versão mínima
  inline que `privacidade.html`/`termos.html` usam) porque precisa do
  sistema de modal de contato + `setContactModalMessage()` funcionando
  de verdade - testado que o botão "Quero o Máximo" (por exemplo) abre
  o modal com a mensagem certa do WhatsApp mesmo rodando nessa página
  separada.
- **`conheca-o-sistema.html` criada** - a vitrine interativa "Veja por
  dentro" (`#veja-por-dentro`, ~590 linhas de HTML com as 14 telas em
  HTML/CSS ao vivo) também saiu do `index.html` e virou página própria,
  mesmo padrão de header/footer. `index.html` ficou com um banner
  convite compacto (`#veja-por-dentro-teaser`, mesma classe
  `.plans-teaser`) linkando pra lá. O botão "Conhecer o sistema" do CTA
  final (`#contato`) - que antes ia pra `#funcionalidades`, sem muito
  sentido com o próprio texto do botão - agora aponta pra essa página
  nova, que é literalmente o que o botão promete. Testado que trocar de
  tela na sidebar (`data-pane`) continua funcionando igual, já que
  `script.js` inteiro roda aqui também.
- **Resultado direto**: `document.body.scrollHeight` do `index.html`
  caiu de ~18753px pra ~13717px só com essas 2 páginas saindo + o
  splash desligado - queda de ~27% na altura, sem apagar nenhum
  conteúdo (tudo continua existindo, só que numa página própria a 1
  clique de distância).
- **Mais uma rodada de compactação de caixa/texto** (Carlos: "deixa as
  letras, textos, caixas menores, as imagens mantém grande mesmo") -
  dessa vez focado no CHROME ao redor do conteúdo, não nas imagens
  (`.screenshot-frame`/`.deepdive-visual`/`.module-modal-visual`
  ficaram do tamanho que estavam, de propósito): `section` padding
  72px→56px; `.section-header h2` `clamp(1.7rem,3.2vw,2.4rem)` →
  `clamp(1.5rem,2.8vw,2.1rem)`; `.section-header p` 1rem→0.95rem;
  padding de `.feature-card` 32px→24px, `.plan-card` 32px→24px,
  `.value-card` 28px→20px, `.step-card` 28px/24px→20px/18px,
  `.module-card` 24px→18px, `.segment-card` 28px/16px→20px/14px;
  `.feature-card h3` 1.25rem→1.1rem, `.feature-card p` ganhou
  `font-size:0.92rem` (não tinha tamanho explícito antes, herdava o
  padrão do body).

## Cenas 3D do Hero/CTA refeitas, tamanho de letra auditado de novo,
re-teste do bug de scroll com interação real (13/09/2026, mesmo dia -
rodada seguinte)

Carlos achou as cenas 3D do Hero/CTA (`initNodeNetwork`, rede de pontos
genérica) "simples e feias" comparado com o cadeado da Segurança, e
achou que o site ainda podia estar travando.

- **`initNodeNetwork` (rede de pontos genérica) trocada por
  `initShowcaseScene`** - mesma técnica de construção do cadeado
  (`initSecurityShield`: malha wireframe + miolo translúcido pra
  simular glow, halo orbitando, nuvem de partículas), só que moldando
  o **check da própria marca** (o ícone do GestãoCheck é check+seta)
  em vez de reaproveitar formas genéricas - geometria calculada de
  verdade por vetor (2 "braços" ligando 3 pontos: vértice, ponta
  esquerda, ponta direita), não rotação chutada. Ganhou também halo
  duplo (2 anéis cruzados, mesma técnica do splash) e uma mini "barra
  de gráfico" flutuando com pulso de altura (só no Hero, reforça o
  tema "gestão/dados" - CTA fica sem, mantém mais discreto como
  sempre foi por design). **Mais leve que antes, não mais pesado**: a
  rede antiga calculava as conexões entre nó (loop O(n²), até 861
  comparações de distância pro Hero de 42 nós) - essa cena não tem
  esse cálculo, só malhas fixas + partículas soltas. Mesmo
  `isVisible`+`IntersectionObserver` de sempre (nunca renderiza fora
  de tela). Testado via inspeção de `WebGLRenderingContext` (contexto
  não perdido, `getError()` retornando 0, sem warning nenhum do
  Three.js no console) - **não consegui tirar screenshot real dessa
  rodada** (o painel de preview ficou fechado/oculto no ambiente de
  teste no meio da sessão, sem eu ter fechado - `screenshot` retornou
  erro explícito "Browser pane is not displayed, so the page is not
  compositing frames" em vez do de sempre "renderizou mas ficou
  parado"), validado só por estado/console - Carlos precisa confirmar
  visualmente no navegador dele.
- **Bug de travamento re-testado com interação de verdade** (Carlos
  disse achar que ainda tava acontecendo): rodada anterior tinha
  reproduzido o freeze usando `window.scrollTo()` direto via
  JavaScript (não é algo que um visitante real faz) - meio de
  confirmar o bug, não de simular uso real. Nesta rodada, testei com
  **scroll de rodinha de mouse de verdade** (via ação de scroll da
  ferramenta de automação, que dispara evento de wheel de verdade) até
  o fim da página inteira, e **clique de verdade** na logo - `lenis.
  scroll` e `window.scrollY` ficaram sincronizados o tempo todo, sem
  nenhum travamento, em várias repetições. Testei também scroll por
  teclado (`Home`/`End`) - não faz nada nessa página (o Lenis parece
  bloquear o scroll nativo por completo, só a rodinha/touch funciona),
  então nem é um caminho que desincroniza nada na prática. **Suspeita
  principal pro Carlos achar que ainda trava**: cache do navegador -
  `script.js` nunca tinha ganho query de versão (só `three-hero.js`
  tinha, por já ter esse histórico) - se ele testou sem fechar a aba
  de vez entre as correções, pode estar rodando uma versão VELHA do
  `script.js` (de antes do fix de verdade) sem saber. Corrigido
  preventivamente: `script.js` virou `script.js?v=3`,
  `three-hero.js?v=5` virou `?v=6`. Pedido pro Carlos: testar numa aba
  nova/anônima antes de reportar que ainda trava, pra garantir que não
  é isso.
- **Tamanho de letra auditado de novo, mais alguns cortes** (Carlos
  perguntou explicitamente se bateu com os concorrentes pesquisados
  antes) - achei 3 elementos que a rodada anterior (que já tinha
  cortado `section` padding/`.section-header h2`) tinha deixado passar,
  bem maiores que qualquer concorrente:
  - `.hero h1`: `clamp(2.5rem,5vw,4.5rem)` (até 72px) → `clamp(2.1rem,
    4vw,3.4rem)` (até ~54px) - nenhum concorrente pesquisado (Saipos,
    ControleNaMão, GestãoDS, etc.) chega perto de 72px no título do
    Hero.
  - `.hero p` (subtítulo): `1.25rem` → `1.1rem`.
  - `.final-cta h2`: `clamp(2rem,4vw,3.5rem)` → `clamp(1.8rem,3.5vw,
    2.6rem)`, mesmo raciocínio do Hero.

## Ajuste de rumo em cima da condensação: 4 funcionalidades voltam a
ser seção própria, imagem prioridade nos popups, cursor de demo de
volta, bug real de congelamento achado de verdade, site mais compacto,
seção de Planos (13/09/2026, mesmo dia - rodada seguinte à condensação
em blocos)

Carlos viu o resultado da condensação em blocos (rodada anterior, ver
seção abaixo) e pediu ajustes em cima:

- **Segurança volta a ser seção própria** ("como era antes, é
  importante"), e junto ela, **Estoque/CMV/Multi-IA também** (Carlos:
  "toda animação top fica, só que nos blocos" foi mal aplicado -
  reservar tratamento cheio só pras 4 que já tinham demo rica de
  verdade era o certo desde o início, só não ficou claro na rodada
  anterior). `#modulos` (grid + popup) ficou só com as outras 12
  funcionalidades + o comparador de tema (13 cards). Segurança voltou a
  rodar a cena 3D o tempo todo (não mais lazy-só-no-popup) porque tem
  seção própria de novo - `three-hero.js` voltou pro padrão de sempre
  (`isVisible` + `observeVisibility`, cena criada no carregamento da
  página).
- **Imagens dos popups aumentadas, prioridade sobre o texto** (Carlos:
  "é lá que o cliente vai ver e entender"): `.module-modal-grid` foi de
  `1fr 1.2fr` (texto maior que a imagem, ao contrário do que eu
  achava) pra `0.55fr 1.45fr` (mesma proporção do `.deepdive-grid`,
  imagem bem maior) - card do popup também ficou mais largo (900px →
  1100px).
- **Cursor de demonstração (NAV_ITEMS/TAB_DEMOS) voltou** - tinha sido
  removido na condensação por "não fazer sentido em popup estático",
  mas Carlos quer de volta. Reimplementado com uma função só
  (`attachDemoCursor()`) reaproveitada nos dois contextos que existem
  agora: nas 4 seções inline (Estoque/CMV/Segurança - Multi-IA fica de
  fora, o GIF já é a demo) toca/pausa com `ScrollTrigger` igual sempre
  foi; nos 12 módulos que ficaram em popup, toca quando o popup abre e
  pausa quando fecha (`MODULE_CURSOR_TIMELINES`, lido em `abrirModal`/
  `fecharModal`) - não tem "entrar na tela" rolando dentro de um popup,
  então ScrollTrigger não se aplica aí. Os valores de posição
  (`NAV_ITEMS`/`TAB_DEMOS`) são exatamente os mesmos de antes (medidos
  por pixel em rodadas anteriores) - só a forma de disparar mudou,
  não a calibração.
- **Bug real crítico achado de verdade - a causa NUNCA foi
  duração/velocidade da animação de scroll**: essa investigação passou
  por 2 tentativas erradas antes de achar a causa certa (documentadas
  no comentário de `scrollToTarget` em `script.js`, vale ler lá
  também). Reproduzi o "trava e não volta" que o Carlos descreveu
  (fim da página → clica na logo → não volta) de verdade, com
  `lenis.scroll` (estado interno do Lenis) e `window.scrollY` (posição
  real do navegador) - achei os dois **desincronizados**: depois de um
  scroll que o Lenis não controla diretamente (teclado Home/End/Page
  Down/barra de espaço não passa pelo listener de `wheel` que o Lenis
  usa pra rastrear scroll - só rodinha do mouse/touch passam por ele),
  o Lenis continua achando que a página está numa posição que já não é
  mais a real. Depois disso, **qualquer** `lenis.scrollTo()` (com ou
  sem `immediate`, com qualquer `duration`) fica preso pra sempre -
  ele anima a partir de onde ACHA que está, nunca da posição
  verdadeira, e nunca alcança o destino de verdade. Confirmado testando
  com `lenis.scroll`/`window.scrollY` direto (não só rAF, que se
  mostrou um sinal não-confiável neste ambiente de teste específico -
  ver nota de metodologia abaixo) - antes do fix, `lenis.scroll` ficava
  travado em `0` com a página de verdade em `17599px`, e nenhum clique
  de âncora movia mais nada. **Corrigido** ressincronizando o Lenis com
  a posição real antes de qualquer salto (`scrollToTarget`,
  `script.js`): se `lenis.scroll` e `window.scrollY` divergirem,
  primeiro `lenis.scrollTo(window.scrollY, {immediate:true,
  force:true})` (o `force` é necessário - por padrão o Lenis ignora um
  `scrollTo` pro valor que ele já acha que está), só depois disso
  anima/pula pro destino de verdade. Testado repetidas vezes depois do
  fix - scroll sempre chega no lugar certo, em sequência de vários
  cliques, sem travar mais.
  - **Nota de metodologia importante pra quem for investigar bug de
    scroll/travamento aqui de novo**: neste ambiente de teste
    especificamente, contar frames de `requestAnimationFrame` pra
    provar "travou" se mostrou **não confiável** - um teste que
    reproduziu o freeze de verdade (confirmado via `lenis.scroll`/
    `window.scrollY` nunca mudando) e outro onde o scroll funcionou
    perfeitamente (confirmado pelos MESMOS valores mudando corretamente)
    deram o mesmo resultado de "0 frames em 8-15s" na contagem de rAF -
    ou seja, a contagem de rAF por si só não distingue travamento real
    de execução normal neste harness. **Usar sempre um sinal de estado
    real da aplicação** (aqui, `window.scrollY` e `lenis.scroll`
    comparados antes/depois de uma ação) em vez de só contar frames.
  - `immediate:true` (não `duration` maior) continua sendo o certo pra
    saltos grandes - confirmado de novo que animar o caminho inteiro
    (não importa a velocidade) atravessando muitas seções com
    reveal/fundo animado/WebGL é pesado demais; só o pulo instantâneo
    evita isso de verdade. Ver histórico completo no comentário do
    código.
- **Site mais compacto de propósito** (Carlos comparou letra/espaço
  dos concorrentes com o nosso e achou os deles menores): `section`
  (regra global) foi de `padding:100px 0` pra `72px 0`; `.section-header
  h2` de `clamp(2rem,4vw,3rem)` pra `clamp(1.7rem,3.2vw,2.4rem)`, texto
  do header de `1.1rem` pra `1rem` - aplica em TODA seção do site, não
  precisou mexer seção por seção.
- **Seção de Planos criada, preço agora é público** - ver seção própria
  "## Preço" logo abaixo, documentado em detalhe lá (é uma reversão de
  decisão grande o bastante pra merecer seção própria, não só um item
  aqui).

## Site condensado em blocos (pesquisa de 6 concorrentes), bug de scroll
seco corrigido, splash de fechamento removido, páginas legais criadas
(13/09/2026, mesmo dia)

Carlos achou o site "grande demais" comparado à concorrência e pediu
análise completa antes de mexer (deu carta branca de tempo/recursos).
Nesta rodada:

- **Pesquisa de 6 concorrentes reais** (não só o site que ele mandou):
  GestãoDS (mandado por ele - navegado de verdade no browser, incluindo
  `/planos-e-precos/`), Saipos, Colibri, ControleNaMão, Sischef, VEX
  Menu (achados via busca por "sistema de gestão bares e restaurantes
  CMV estoque" - concorrentes reais do GestãoCheck, não do GestãoDS que
  é sistema médico). Padrão idêntico nos 6: hero curto sem intro
  cinematográfica, funcionalidades em grid compacto de card (ícone +
  nome + 1-2 linhas, nunca screenshot embutido), profundidade atrás de
  clique ("Saiba mais"/popup/página própria) em vez de seção de tela
  cheia por funcionalidade, preço nunca na home.
- **16 seções `.deepdive`/funcionalidade viraram 1 grid compacto**
  (`#modulos`, novo, ficou onde `#estoque` era) **+ 17 popups** (as 16
  + o comparador claro/escuro, que morava em `#experiencia`). Nada foi
  apagado - todo conteúdo (texto, screenshot, o GIF real do Multi-IA, a
  cena 3D da Segurança) continua existindo, só saiu do fluxo direto da
  página pra dentro de um popup que abre no clique. **Importante,
  ajuste sobre o próprio plano**: a ideia original era manter
  Estoque/CMV/Multi-IA/Segurança como "bandeira" (tratamento completo
  inline) - o Carlos corrigiu isso explicitamente ("toda animação top
  fica, só que nos blocos, não direito no site") - **nenhuma seção de
  funcionalidade ficou de fora do grid**, só Hero/splash/CTA final (que
  não são "funcionalidade", são esqueleto do site) continuam soltos.
  - Mecanismo do popup: reaproveita `.contact-modal`/`data-modal-open`/
    `data-modal-close`/`abrirModal()` que já existia pro modal de
    WhatsApp - `.module-modal-*` (`style.css`) só estiliza o conteúdo
    de dentro diferente (2 colunas visual+texto, ou o layout bespoke da
    Segurança).
  - Imagens dos popups usam `data-src` em vez de `src` - carregam só na
    primeira abertura (`abrirModal` em `script.js` faz a troca). Motivo:
    `.contact-modal` é `visibility:hidden` (não `display:none`, precisa
    pra transição), então tem geometria de tela cheia mesmo fechado -
    `loading="lazy"` nativo sozinho não bastava, o navegador achava as
    imagens "perto da tela" cedo demais.
  - **Cena 3D da Segurança agora é lazy de verdade**: antes rodava
    desde o carregamento da página (1 das 5 cenas WebGL sempre ativas,
    mesmo fora de vista - só pulava o `render()` custoso via
    `isVisible`, nunca desligava de vez). Agora só é criada na primeira
    vez que o popup abre (`window.initSecurityShieldLazy()` em
    `three-hero.js`, exposta em `window` porque é module e `script.js`
    não é) e liga/desliga via `setActive()` a cada abrir/fechar - não
    dava pra confiar no `IntersectionObserver`/`isVisible` de sempre
    porque o canvas, dentro de um modal `visibility:hidden` de tela
    cheia, sempre "intersecta" o viewport mesmo fechado.
  - `NAV_ITEMS`/`TAB_DEMOS`/demo-cursor (`script.js`) foram removidos
    de vez - todo esse sistema dependia de `ScrollTrigger` reagindo à
    seção entrando na tela durante scroll normal; como os screenshots
    agora moram dentro de popup (abre por clique, não por scroll), não
    fazia mais sentido. Mesma lógica pro zoom-ao-revelar das
    screenshots. `BG_FX_VARIANTS` podado das 16 entradas que
    correspondiam às seções removidas.
  - `#proposito` (Missão/Visão + 6 valores) tinha 2 grids empilhados -
    virou 1 grid só de 8 cards no mesmo estilo (`.value-card`),
    Carlos deu OK explícito pra compactar mais onde desse.
- **Bug real corrigido - scroll de âncora "seco" (sem animação)**:
  regressão direta da correção de travamento da rodada anterior
  (`{ immediate: true }` pra saltos > 3 telas) - num site de ~28000px,
  praticamente todo link do menu caía nesse caso, então virou pulo
  instantâneo sempre, não só nos saltos realmente grandes que
  motivaram o fix original. Corrigido trocando `immediate` por uma
  `duration` mais LONGA (2.2s) pra saltos grandes - espalha o mesmo
  tanto de trabalho de paint/reveal por mais tempo real em vez de
  cortar a animação de vez, o que ataca a causa raiz do travamento
  antigo (sobrecarga por segundo) sem sacrificar a animação visível.
  Combinado com a condensação do site (bem mais curto agora) e a
  Segurança não rodando mais WebGL escondida, o cenário que causava o
  travamento original ficou bem mais raro.
- **Splash de fechamento removido, abertura refinada** (pedido
  explícito do Carlos: "a introdução nossa fica, com a nossa logo... só
  deixa mais fluido" - a zona espelhada no FIM da página saiu de vez).
  `initSplash()` (topo do `script.js`) perdeu toda a zona/lógica de
  fechamento (`applyCloseCurve`, `outro-active`, elementos `*Bottom`);
  `#splashZoneBottom` removida do `index.html`; `initSplashScene
  ("splash-3d-bottom")` removida do `three-hero.js`. Tira ~200vh de
  altura e 1 contexto WebGL a menos. Abertura ganhou: (1) curva de zoom
  passou por `smoothstep()` antes de elevar ao quadrado (era aceleração
  quadrática pura desde o primeiro pixel de scroll - agora começa e
  termina mais devagar); (2) `update()` passou a se conectar no evento
  de scroll do PRÓPRIO Lenis (`lenis.on('scroll', ...)`, via
  `window.__splashUpdate` exposto pro bloco do Lenis pegar) além do
  listener nativo de sempre (mantido como fallback se Lenis não
  carregar) - o evento do Lenis é mais fino que só reagir ao evento
  nativo por cima do scroll virtual dele.
- **Política de Privacidade e Termos de Uso criados** (`privacidade.html`/
  `termos.html`, novos) - o rodapé já linkava os dois desde sempre, mas
  apontavam pra `href="#"` (nunca implementado). Páginas estáticas
  simples (mesmo header/footer, sem a abertura/GSAP/Lenis - não
  carregam `script.js` inteiro, só um `<script>` inline pequeno pro
  menu mobile + ano do rodapé), conteúdo reflete o que o site realmente
  é (100% estático, sem formulário/backend/analytics, único dado que
  sai é o que o visitante manda manualmente pelo WhatsApp).

## Funcionalidades já cobertas no site desde 11/09/2026 (histórico — o que ainda faltava antes da rodada acima)

Mantido como registro histórico; tudo listado abaixo **já está no
site** agora. Se o sistema ganhar funcionalidade nova de novo no
futuro, comparar contra o inventário real do repo principal antes de
presumir que já está coberto.

**Coisas que existem hoje e não têm menção nenhuma no site** (resumo,
não é lista fechada — conferir o documento completo/repo principal
antes de escrever a copy de verdade):
- **2FA completo** (TOTP + QR code + backup codes) — hoje o site só
  menciona bloqueio de login/hash de senha na seção Segurança.
- **DRE completa** (Receita → CMV → CMO → CMC → Despesas → Avarias →
  Resultado) — plano Premium. Diferente do "DRE" que já existia no CMV
  (mencionado no repo principal como básico); essa é a versão robusta.
- **Curva ABC** (classificação de produto por relevância de faturamento,
  Pareto) — plano Premium.
- **Patrimônio** (registro de investimento/equipamento, isolado de
  Estoque/CMV) + Manutenção agora vinculada a ele.
- **Multi-IA** — assistente conversacional (cascata gratuita entre
  provedores), responde sobre números do negócio e dúvida de uso,
  insights automáticos, autorizado pelo Dono do cliente.
- **Caixa** (fechamento diário com esperado calculado automático,
  retiradas com motivo) e **Despesas** (fixas/operacionais) — módulos
  novos, nenhum dos dois existe no site hoje.
- **Sistema de Planos de verdade** (Essencial/Profissional/Premium) com
  cobrança automática (juros por atraso, suspensão, cancelamento,
  reativação com multa) e feature flags por instalação — o site hoje
  não tem seção de planos (decisão deliberada de não mostrar preço, ver
  seção própria abaixo — mas os PLANOS em si, como estrutura de
  produto, nunca foram anunciados).
- **370 testes automatizados**, documentação de API automática
  (Swagger/OpenAPI), Sentry opcional — prova de maturidade técnica que
  o site não menciona (relevante pro ângulo "não é projeto de escola"
  já usado no README do repo principal).
- Promoções/combo no CMV, rascunho de venda quando falta estoque,
  relatório "Prime Cost" e gráfico de composição de faturamento — dentro
  de módulos que o site já cobre (CMV, Relatórios), mas a copy atual não
  menciona esses recursos específicos.

**Versão em produção quando isso foi registrado**: v1.3.3 fechada,
v1.3.4 pronta pra release (só falta o Carlos taguear), v1.4.0 em diante
planejadas (IA aprendendo o negócio do cliente, tutorial de IA,
reorganização de planos, conta visualizadora, PDV/tráfego pago/
instalável/licenciamento — essas ainda **não existem**, não anunciar no
site até serem lançadas de verdade).

## Funcionalidades futuras mencionadas pelo Carlos (registrado 11/08/2026, nada implementado)

Não anunciar essas duas no site ainda — são ideias pra versões futuras do
sistema, não existem hoje:

- **IA inteligente dentro do sistema** — **atualização 11/09/2026: isso
  já saiu do papel** — ver Multi-IA na seção acima. Esse bullet original
  falava de uma ideia sem escopo; hoje já é funcionalidade real.
- **DRE pra cálculo** — cuidado pra não confundir com o que já existe: o
  CMV do sistema principal **já tem DRE de verdade** hoje (categorias de
  venda, receita/custo/lucro), só a **exportação** do DRE que ainda é
  placeholder ("em breve"). O que o Carlos pediu pra registrar aqui
  parece ser uma versão mais robusta/nova do cálculo de DRE — perguntar
  a ele o escopo exato antes de prometer algo específico no site.

## Conteúdo do site — fonte de verdade

O texto/funcionalidades descritas no site (Estoque, CMV, CMO, CMC,
Beneficiamento, Avarias, Ocorrências, Checklists, Requisições, Relatórios,
segurança) devem bater com o que **realmente existe** no sistema — ver
`CLAUDE.md` e `docs/VISAO.md` do repositório principal do GestãoCheck (é
um repo separado deste). Revisão de 11/08/2026: conferido módulo por
módulo, está tudo consistente com o que existe de verdade (nenhuma
funcionalidade inventada). Se adicionar/mudar alguma claim de
funcionalidade aqui, checar antes no repo principal — não presumir.

## Preço — DECISÃO REVERTIDA, agora está público no site (13/09/2026)

**Histórico**: até 13/09/2026 preço ficava só em conversa (WhatsApp/
demonstração), decisão deliberada, documentada aqui há semanas. Carlos
reverteu essa decisão explicitamente nesta data - pediu seção de
Planos com preço visível de verdade + botão que já manda WhatsApp
mencionando o plano de interesse.

**Fonte de verdade dos preços/módulos por plano**: NÃO é mais
`plano_custos_gestaocheck.md` na pasta Downloads (caminho antigo, já
não existe mais lá) - o arquivo mudou de lugar, agora fica em
`C:\Users\USER\OneDrive\Área de Trabalho\Projetos\GestãoCheck\Plano de
Sistema Operacional\plano_custos_gestaocheck.md` (fora deste repo,
mesma pasta tem também `Funcionalidades.txt`). Seção usada: "Estrutura
final por plano, pra usar no site de vendas (13/09/2026)" - a versão
mais recente/confirmada dentro do documento (o arquivo tem várias
rodadas de revisão de preço registradas cronologicamente, sempre usar a
última seção, não a primeira que aparecer).

**Implementado no site** (`#planos`, `index.html`, entre Fundadores e o
CTA final): 3 planos com nome/preço/módulos exatamente como o documento
confirma - Básico R$650/mês (até 5 usuários: Estoque, CMV, CMO, CMC,
Beneficiamento, Caixa, Patrimônio), Médio R$850/mês (até 10, + Avarias/
Ocorrências/Checklists/Manutenção/Requisições/Relatórios), Máximo
R$1.100/mês (até 20, + Despesas/DRE completa/Curva ABC/Multi-IA). O
"Resumo financeiro simplificado" que o documento lista como parte do
Básico **não entrou no site** de propósito - o próprio documento marca
esse item como "ainda não construído" (⚠️), e a regra de conteúdo do
site é nunca anunciar funcionalidade que não existe de verdade (ver
"## Conteúdo do site — fonte de verdade" acima) - se um dia for
implementado, adicionar esse bullet no plano Básico.
- **Addons** também no site (`.plans-addons`, abaixo dos 3 cards): +1
  usuário R$50/mês, +5 usuários R$250/mês, +10 usuários R$400/mês,
  Suporte 24h +R$400/mês - valores da tabela revisada mais recente do
  documento (substituiu uma tabela antiga de +5/+10 que tinha valores
  diferentes).
- **Cada botão "Quero o [plano]" abre o MESMO `#contactModal` de
  sempre** (escolher qual fundador chamar no WhatsApp), só que com a
  mensagem pré-preenchida já mencionando o plano - implementado com
  `data-plan-message` no botão + `setContactModalMessage()` em
  `script.js`, que reescreve a URL dos 3 links de WhatsApp toda vez que
  o modal abre (mensagem custom vinda do botão que abriu, ou a
  mensagem padrão de sempre quando abre pelos botões genéricos de
  "Solicitar demonstração") - testado que o modal volta pra mensagem
  padrão certinho depois de ter sido aberto por um plano.
- **Nota de "tudo é combinável"** (pedido explícito do Carlos, texto no
  `section-header` de `#planos`): deixa claro que o cliente pode ficar
  no plano atual e negociar um módulo específico do plano de cima à
  parte (ex: Básico + Multi-IA avulso), em vez de forçar migração de
  plano inteiro pra ganhar 1 módulo só - reflete como o documento de
  custos já trata isso ("tudo é combinado").
- **Cobrança anual, multa de cancelamento e trial (2-3 semanas)** -
  registrados no documento de custos, mas **não colocados no site**
  nesta rodada (nem foi pedido, nem tem contrato formal redigido ainda
  pra sustentar a promessa de multa - o próprio documento avisa "tratar
  como intenção, não cobrar multa sem documento assinado"). Preço
  mostrado no site é só o mensal.

## Futuro — integração site ↔ sistema ↔ controle interno (ideia registrada 11/08/2026, nada implementado)

Direção de longo prazo que o Carlos levantou, **fora de escopo agora**
(prioridade hoje é só deixar o site pronto pra subir no domínio
principal). Registrando aqui pra não perder quando chegar a hora:

1. **Site → Sistema**: quando um cliente novo fechar (via WhatsApp por
   enquanto, futuramente talvez um formulário/checkout no próprio site),
   o site deveria conseguir informar o sistema principal: qual plano o
   cliente escolheu, quanto pagou, se foi mensal (com os 30 dias iniciais)
   ou anual (ex: pagou 2 meses de desconto), pra o sistema já nascer
   sabendo o plano/vencimento do cliente sem digitação manual.
2. **Site → Sistema de controle interno (novo, só do Carlos e do Tonhão)**:
   um sistema separado, só pra uso interno da dupla, pra acompanhar
   quantidade de clientes ativos, qual plano cada um tem, e ajudar a
   organizar a operação (ligado ao "teto de quantos clientes o time
   aguenta" discutido no documento de custos). Não é o mesmo sistema que o
   cliente usa.
3. Nenhum dos dois tem desenho técnico ainda (não decidido: webhook,
   API própria, formato dos dados, autenticação entre os dois sistemas).
   Não começar a implementar isso sem alinhar o desenho com o Carlos
   primeiro — é intencionalmente vago ainda.

## Segurança

Site 100% estático (sem formulário, sem backend, sem banco) — não existe
vetor de "bot enche de spam" no sentido clássico (não tem endpoint
nenhum pra atacar). Os links de WhatsApp (`wa.me/...`) só abrem o app
com mensagem pré-preenchida; quem visita ainda precisa clicar "Enviar"
manualmente — o site não consegue disparar mensagem sozinho. Mesmo assim,
`nginx.conf` (usado pelo `Dockerfile` em produção) aplica headers de
segurança: `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy` e um `Content-Security-Policy`
restritivo (`script-src 'self'` — só o `script.js` local roda, nenhum JS
de terceiro; `style-src`/`font-src` liberados só pra Google Fonts e
cdnjs, que são os únicos CDNs de verdade usados). **Testado em
11/08/2026** simulando os mesmos headers num servidor local: Font
Awesome e Google Fonts carregam normalmente, zero violação de CSP no
console.

## Deploy

`Dockerfile` + `docker-compose.yml` já prontos neste repo — sobe na
mesma VPS/Traefik que já hospeda os clientes do sistema principal
(mesmo padrão de labels do `docker-compose.prod.yml` de lá, só trocando
domínio/nome do router pra não colidir com nenhum cliente). Domínio:
`gestaocheck.tech` + `www.gestaocheck.tech` (registro DNS `A` na raiz e
em `www` — o coringa `*` que já existe cobre só subdomínio de cliente,
não a raiz). Passo a passo completo no `README.md`, seção "Deploy".
Responsável pela subida na VPS: Tonhão. Repo tem remote
`git@github.com:GestaoCheck/gestaocheck-site.git` (renomeado, ver aviso
no topo do arquivo).

para subir na vps
cd /opt/site-vendas/gestao-pro
git pull
docker compose up -d --build

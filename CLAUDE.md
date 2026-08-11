# CLAUDE.md — Site de Vendas GestãoCheck (gestao-pro)

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
variante certa pro contexto, não reaproveitar a mesma pra tudo).

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

## Conteúdo do site — fonte de verdade

O texto/funcionalidades descritas no site (Estoque, CMV, CMO, CMC,
Beneficiamento, Avarias, Ocorrências, Checklists, Requisições, Relatórios,
segurança) devem bater com o que **realmente existe** no sistema — ver
`CLAUDE.md` e `docs/VISAO.md` do repositório principal do GestãoCheck (é
um repo separado deste). Revisão de 11/08/2026: conferido módulo por
módulo, está tudo consistente com o que existe de verdade (nenhuma
funcionalidade inventada). Se adicionar/mudar alguma claim de
funcionalidade aqui, checar antes no repo principal — não presumir.

## Preço — não está no site (decisão deliberada)

Preço fica só em conversa (WhatsApp/demonstração), não public no site.
Se decidir mostrar preço no futuro, o valor de referência (plano
Essencial R$650/mês) e a estrutura completa de planos/addons de usuário
estão em `plano_custos_gestaocheck.md` (fora deste repo, na pasta
Downloads do Carlos — pedir pra ele se precisar consultar de novo).

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
`git@github.com:GestaoCheck/gestao-pro.git`.

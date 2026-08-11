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
`scr/assets/logo/`. WhatsApp unificado pro número correto (Tonhão,
`5585999817221`) em todos os CTAs — antes havia dois números diferentes e
nenhum dos dois estava certo. Link do LinkedIn do Antonio Neto ainda **não
tem URL real** (`founder-card` dele mostra "Em breve" no lugar do botão —
trocar por `<a href="...">Ver LinkedIn</a>` assim que tiver o link, mesmo
padrão dos outros dois fundadores).

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

## Deploy

Ainda não subiu no domínio principal — esse é o objetivo depois que o
site estiver "perfeito" (visual, conteúdo, sem link/imagem quebrada).
Repo tem remote `git@github.com:GestaoCheck/gestao-pro.git`.

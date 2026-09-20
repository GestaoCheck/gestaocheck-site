# GestãoCheck — Site de Vendas

**Site institucional/comercial do GestãoCheck** — a vitrine pública do
produto: o que ele resolve, quais módulos tem, quem está por trás, e como
falar com a gente pra conhecer de perto. Não é o sistema em si (esse é um
projeto à parte); este repositório existe só pra apresentar o produto e
gerar contato de venda.

![Status](https://img.shields.io/badge/status-pronto%20pra%20deploy-brightgreen)
![Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS%20puro-F7DF1E?logo=javascript&logoColor=black)
![Build](https://img.shields.io/badge/build%20step-nenhum-informational)

---

## Sobre

Página única (`index.html`), pensada pra ser a porta de entrada de quem
ouviu falar do GestãoCheck e quer entender rápido o que é, ver os módulos
principais (Estoque, CMV, CMO, CMC, Beneficiamento e os operacionais),
conferir a parte de segurança, entender a história por trás do produto e
falar com um dos fundadores.

Vai subir no domínio principal da empresa assim que a revisão final
estiver fechada.

---

## Time

O mesmo time por trás do sistema:

| Quem                      | Função                   |
| ------------------------- | ------------------------ |
| **Carlos Eduardo**        | Desenvolvedor & Fundador |
| **Antonio Neto (Tonhão)** | Desenvolvedor & Fundador |
| **Jarbas Jamysson**       | Fundador & Vendas        |

Este site foi construído por Carlos, com Claude Code como parceiro de
desenvolvimento — mesmo fluxo de trabalho documentado usado no sistema
principal, adaptado pra esse projeto menor (ver [`CLAUDE.md`](CLAUDE.md)
pra contexto técnico completo: decisões já tomadas, pendências, e a ideia
futura de o site conversar direto com o sistema).

---

## O que tem na página

- **Hero** com a proposta de valor e um mockup ilustrativo do dashboard.
- **Faixa de módulos** e **"Como funciona"** em 4 passos.
- **Seção dedicada por módulo** (Estoque, CMV, CMO, CMC, Beneficiamento),
  cada uma com mini-mockup ilustrativo dos dados que o sistema mostra.
- **Avarias/Ocorrências, Requisições e Relatórios**.
- **Segurança** — lista do que já existe de verdade no sistema (bloqueio
  de login, hash de senha, sessão revogável, banco isolado por cliente
  etc.), não promessa vaga.
- **Para quem é** — segmentos de negócio atendidos.
- **Diferenciais**, **compatibilidade multi-dispositivo** (tema claro/
  escuro incluso).
- **Nossa história** e **propósito** (missão/visão/valores).
- **Fundadores**, com foto, cargo e um jeito de falar com cada um.
- **Modal "Com quem você quer falar?"** — os botões de CTA ("Solicitar
  demonstração") abrem um modal deixando escolher entre os 3 fundadores,
  cada um com seu próprio WhatsApp — em vez de forçar todo mundo pro
  mesmo contato.

---

## Tecnologias

HTML5, CSS3 e JavaScript puro — **sem framework, sem build step**, mesma
filosofia de simplicidade do sistema principal. Ícones via Font Awesome
(CDN) e fonte Inter (Google Fonts, CDN).

---

## Estrutura

```
gestaocheck-site/
│
├── index.html                 (página inicial)
├── planos.html                (planos e preços)
├── quem-somos-nos.html        (história, missão/visão/valores, fundadores)
├── conheca-o-sistema.html     (vitrine interativa "modo app")
├── privacidade.html           (Política de Privacidade)
├── termos.html                (Termos de Uso)
│
├── css/
│   └── style.css              (todo o CSS do site)
├── js/
│   ├── script.js              (scroll reveal, menu, dropdown, modais, popups)
│   ├── three-hero.js          (cenas 3D via Three.js, ES module)
│   └── demo.js                (runtime do mini sistema da vitrine, Shadow DOM)
│
├── demo/                      (GERADO por tools/build-demo.js: shell, CSS e as
│                                23 telas do mini sistema - não editar à mão)
├── tools/                     (build do demo: postcss + telas de origem em
│                                demo-src/; fica fora da imagem Docker)
│
├── assets/
│   ├── logo/                  (logo/ícone em várias variantes — horizontal,
│   │                            vertical, favicon circular/quadrado, etc.)
│   ├── equipe/                (fotos dos fundadores)
│   └── sistema/                (telas do sistema em SVG vetorial - importadas
│                                 por tools/import-svgs.js - antigo: vídeo do
│                                 Multi-IA, cada PNG/JPG com um .webp irmão)
│
├── robots.txt / sitemap.xml   (SEO técnico)
├── Dockerfile / docker-compose.yml / nginx.conf   (deploy)
│
├── CLAUDE.md                  (contexto técnico completo pra quem
│                                for mexer no projeto)
└── README.md                  (este arquivo)
```

---

## Como rodar localmente

Não precisa de instalação nenhuma — é HTML/CSS/JS puro. Duas formas:

**Direto no navegador:**

Abrir `index.html` direto no navegador já funciona (alguns navegadores
restringem um pouco recursos ao abrir por `file://`, mas o site não
depende de nada assim).

**Com um servidor local** (recomendado, mais fiel ao ambiente real):

```bash
npx serve .
```

Abre em `http://localhost:3000` (ou a porta que o `serve` escolher).

---

## Deploy

Sobe na mesma VPS (Hostinger) e no mesmo Traefik que já hospeda os
clientes do sistema principal — `Dockerfile` + `docker-compose.yml` já
prontos neste repositório, usando o mesmo padrão de labels que já
funciona em produção (ver `docs/DEPLOY_VPS.md` do repositório principal
pro contexto completo do Traefik/VPS).

```bash
mkdir -p /opt/site-vendas && cd /opt/site-vendas
git clone https://github.com/GestaoCheck/gestaocheck-site.git .
docker compose up -d --build
```

Domínio configurado nas labels: `gestaocheck.tech` e `www.gestaocheck.tech`
(ajustar em `docker-compose.yml` se o domínio real for outro). Precisa de
um registro DNS `A` apontando pra VPS tanto na raiz (`@`) quanto em `www`
— o registro coringa (`*`) que já existe pros clientes **não cobre** o
domínio raiz.

---

## Documentação técnica

Contexto completo — o que já foi ajustado, pendências conhecidas, e a
ideia registrada (ainda não construída) de o site avisar automaticamente
o sistema e um painel interno quando um cliente novo fechar — está em
[`CLAUDE.md`](CLAUDE.md).

---

## Contato

Quer conhecer o GestãoCheck? Fale com qualquer um dos fundadores — os
links de WhatsApp de cada um estão na própria página, seção "Fundadores"
e no botão "Solicitar demonstração".

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
gestao-pro/
│
├── index.html              (página única, todas as seções)
├── style.css                 (todo o CSS do site)
├── script.js                   (scroll reveal, menu mobile, modal de contato)
│
├── scr/assets/logo/              (logo/ícone em várias variantes — horizontal,
│                                   vertical, favicon circular/quadrado, etc.)
├── scr/assets/equipe/              (fotos dos fundadores)
│
├── CLAUDE.md                         (contexto técnico completo pra quem
│                                       for mexer no projeto)
└── README.md                           (este arquivo)
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

Ainda não subiu no domínio principal — é o próximo passo depois da
revisão final. Sendo HTML/CSS/JS estático, qualquer hospedagem de site
estático serve (Hostinger, Vercel, Netlify, Nginx numa VPS própria etc.).

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

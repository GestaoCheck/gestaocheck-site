# GestãoCheck — Site de Vendas

**Site institucional/comercial do GestãoCheck** — a vitrine pública do
produto: o que ele resolve, quais módulos tem, quem está por trás, e como
falar com a gente pra conhecer de perto. Não é o sistema em si (esse é um
projeto à parte); este repositório existe só pra apresentar o produto e
gerar contato de venda.

> Conecta estoque, produção, compras, custos e operação em um só lugar —
> pra você entender exatamente o que está acontecendo na sua empresa.

![Status](https://img.shields.io/badge/status-no%20ar-brightgreen)
![Stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS%20puro-F7DF1E?logo=javascript&logoColor=black)
![Build](https://img.shields.io/badge/build%20step-nenhum-informational)

🔗 **No ar:** [gestaocheck.tech](https://gestaocheck.tech)

---

## Sobre

Página única (`index.html`), pensada pra ser a porta de entrada de quem
ouviu falar do GestãoCheck e quer entender rápido o que é, conferir a
parte de segurança, entender a história por trás do produto e falar com
um dos fundadores.

<!--
  TODO (Carlos, 2026-08-24): quando o próximo sistema sob a marca
  GestãoCheck for lançado publicamente (ex: um "Financeiro"), revisar
  esta seção — hoje ela descreve só o Operação, mas nesse ponto o
  GestãoCheck vira marca-mãe de vários produtos e o texto precisa deixar
  isso claro, não só apresentar 1 sistema como se fosse o único.
-->

### GestãoCheck Operação

O GestãoCheck não é um sistema de estoque — o **GestãoCheck Operação** é
uma plataforma de gestão empresarial completa, pensada pra rodar o dia a
dia real de um negócio, não só registrar dado:

- **Estoque** inteligente organizado por setor e categoria (configuráveis pelo
  usuário, não hardcoded), com conversão automática de unidade,
  importação de nota fiscal por PDF ou **foto via OCR**, fila de
  verificação de item novo e fluxo de aprovação de mudança de preço.
- **CMV, CMO e CMC** — custo real de mercadoria vendida, mão de obra e
  compra, com ficha técnica ligada aos itens de estoque de verdade (não
  cadastro solto), metas por período e evolução mês a mês.
- **Beneficiamento** — produção intermediária, de matéria-prima a
  produto final, com cálculo automático de rendimento e custo por
  porção, suportando múltiplos níveis de produção.
- **Rotina operacional completa** — Avarias, Ocorrências (central que
  recebe origem automática de Avarias e Checklist), Checklists,
  Manutenção, Requisição entre setores e Relatórios.
- **Segurança e controle de acesso de verdade**: permissões por papel e
  por setor, autenticação com 2FA, recuperação de senha, trilha de
  auditoria completa (quem fez o quê e quando), sessão revogável
  remotamente, notificações em tempo real.
- **Multiempresa isolado por design**: cada cliente tem seu próprio
  banco de dados — nunca dado misturado entre empresas diferentes.
- **Exportação de relatório em CSV/PDF**, dashboard gerencial e ciclo de
  cobrança/planos (Essencial, Profissional, Premium) já embutido.

Contexto técnico completo (decisões já tomadas, pendências conhecidas) em
[`CLAUDE.md`](CLAUDE.md) — quem for mexer no projeto começa por lá.

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

## Contato

Quer conhecer o GestãoCheck? Fale com qualquer um dos fundadores — os
links de LinkedIn e WhatsApp de cada um estão logo abaixo, na seção
"Time", ou direto na própria página, seção "Fundadores".

---

## Time

O GestãoCheck é construído por 3 fundadores:

<table>
<tr>
<td align="center" width="33%">
<img src="scr/assets/equipe/jarbas.jpg" width="140" alt="Jarbas Jamysson"><br><br>
<b>Jarbas Jamysson</b><br>
Fundador — Vendas<br><br>
<a href="https://www.linkedin.com/in/jarbas-jamysson-388a41264">LinkedIn</a> ·
<a href="https://wa.me/5585992029592?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20o%20GestãoCheck">WhatsApp</a>
</td>
<td align="center" width="33%">
<img src="scr/assets/equipe/antonio.jpg" width="140" alt="Antonio Neto"><br><br>
<b>Antonio Neto (Tonhão)</b><br>
Fundador — Desenvolvedor<br><br>
<a href="https://www.linkedin.com/in/antonio-neto-39bb72268/">LinkedIn</a> ·
<a href="https://wa.me/5585999817221?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20o%20GestãoCheck">WhatsApp</a> ·
<a href="https://github.com/oliveriraneto">GitHub</a>
</td>
<td align="center" width="33%">
<img src="scr/assets/equipe/carlos.jpg" width="140" alt="Carlos Eduardo"><br><br>
<b>Carlos Eduardo</b><br>
Fundador — Desenvolvedor<br><br>
<a href="https://www.linkedin.com/in/carlos-eduardo-408087230">LinkedIn</a> ·
<a href="https://wa.me/5585991799221?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20o%20GestãoCheck">WhatsApp</a> ·
<a href="https://github.com/carloseduardo-rocha">GitHub</a>
</td>
</tr>
</table>

Este site foi construído pela equipe de desenvolvimento GestãoCheck, com Claude Code como parceiro de
desenvolvimento — mesmo fluxo de trabalho documentado usado no sistema
principal, adaptado pra esse projeto menor.

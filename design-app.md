# TRIAD — Design System do App

App único de produtividade com **três módulos ativáveis**. Cada vértice do triângulo é um módulo.

| Módulo | Função | Forma | Wordmark |
|--------|--------|-------|----------|
| RADIAN | Timer / foco | Círculo + raio girando | `R A D I A N` |
| QUADRA | To-do em blocos | Quadrado + diagonal | `Q U A D R A` |
| PRISMA | Calendário + orçamento | Triângulo + feixe refratado | `P R I S M A` |

Nome do app: **T R I A D** — três vértices, um sistema.
Tagline: *"Três vértices. Um sistema."*

## Rotas

- `/` — landing page (vitrine, já existente, permanece intacta)
- `/app` — o app (login → onboarding → módulos)

## Cores (herdadas da landing, monocromático puro)

```
--t-ink:       #0A0A0A
--t-ink-soft:  #1A1A1A
--t-paper:     #FAFAF8
--t-paper-2:   #F2F1EC
--t-line:      rgba(10,10,10,0.10)
--t-muted:     #6B6B6B
```

Dark mode inverte via `[data-theme="dark"]`:
```
--t-ink:       #FAFAF8   (texto claro)
--t-paper:     #0A0A0A   (fundo escuro)
--t-paper-2:   #141414
--t-line:      rgba(255,255,255,0.14)
--t-muted:     #A0A0A0
```

**REGRA CRÍTICA:** toda cor de texto/fundo usa SEMPRE `var(--t-*)`, nunca hex fixo.
Foi exatamente esse o bug do app antigo (dark mode apagava textos preto fixo).

## Tipografia

- **Montserrat** 600–900 — display, números grandes, títulos. Tracking `-0.02em` em tamanho grande.
- **Inter** 300–500 — corpo, 16–17px.
- **JetBrains Mono** 500–700 — wordmarks, labels, tags, valores, datas. CAIXA ALTA, tracking `0.2em`–`0.4em`.

## Módulos ativáveis (o conceito central)

- No **onboarding** (após criar conta) o usuário escolhe quais módulos quer.
- Pode mudar depois em **Configurações → Módulos**.
- Desativar **NÃO apaga dados** — só remove da navegação. Reativar traz tudo de volta.
- Mínimo 1 módulo ativo (não deixa desativar todos — trava o último).
- A navegação inferior se adapta: mostra só os módulos ativos + Configurações.

## Persistência

Tudo em `localStorage`, namespaced:
```
triad:user      → { name, email, createdAt }
triad:modules   → { radian: bool, quadra: bool, prisma: bool }
triad:theme     → "light" | "dark"
triad:onboarded → bool
triad:radian    → { sessions[], settings }
triad:quadra    → { blocks[] }
triad:prisma    → { events[], entries[] }
```

## Componentes

- **Painel deslizante** (não modal full-screen) para criar/editar — vem da direita no desktop, de baixo no mobile.
- **Inputs underline** — só linha inferior, label mono em caixa alta pequena.
- **Botão primário** — retangular 6px, caixa alta com tracking, `scale(0.97)` no active.
- **Nav inferior** fixa, ícones + label mono, safe-area respeitada.
- **Card/bloco** — borda hairline, sem sombra. Hover só afina borda.

## Bugs do app antigo a evitar

1. Botão de adicionar NUNCA sobrepõe campo de input — painel tem footer próprio, fora do fluxo de scroll.
2. Dark mode: só variáveis CSS.
3. PWA mobile: `viewport-fit=cover`, safe-area-inset no nav inferior, testado em ≤390px.
4. Touch targets ≥ 44px.
5. Timer usa timestamp (não só setInterval) pra continuar correto se a aba perder foco.

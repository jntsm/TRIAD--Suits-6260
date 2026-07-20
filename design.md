# Prisma Suite — Design System

Vitrine para o ecossistema de apps de produtividade: **Radian** (timer/foco), **Quadra** (to-do), **Prisma** (calendário + orçamento).

Autoral, não plágio. Herda os *princípios estruturais* da Apple (tiles edge-to-edge alternando claro/escuro, tipografia com tracking negativo, chrome silencioso, uma única sombra reservada ao "produto") + a linguagem editorial monocromática já usada em Radian/Quadra (preto/branco, grid fino, wordmark monoespaçado). Twist autoral: **zero azul** — a cor de ação é o próprio preto/branco (monocromático puro), e o "produto" de cada tile é uma **forma geométrica** (círculo, quadrado, prisma), não uma foto.

## Marca

| App | Função | Forma | Wordmark |
|-----|--------|-------|----------|
| RADIAN | Timer / foco | Círculo + raio | `R A D I A N` |
| QUADRA | To-do list | Quadrado + diagonal | `Q U A D R A` |
| PRISMA | Calendário + orçamento | Triângulo/prisma + feixe refratado | `P R I S M A` |

Suite name: **PRISMA SUITE** (o site). Tagline: *"Três formas. Um sistema."*

## Cores (monocromático)

```
--ink:        #0A0A0A   /* preto quase puro — texto/ações em claro */
--ink-soft:   #1A1A1A   /* tiles escuros base */
--ink-2:      #141414   /* tile escuro variação */
--paper:      #FAFAF8   /* off-white quente (mesmo tom de Radian/Quadra) */
--paper-2:    #F2F1EC   /* parchment para quebrar dois tiles claros */
--white:      #FFFFFF
--line:       rgba(10,10,10,0.10)   /* hairline / grid em claro */
--line-dark:  rgba(255,255,255,0.14) /* hairline / grid em escuro */
--muted:      #6B6B6B   /* texto secundário em claro */
--muted-dark: #A0A0A0   /* texto secundário em escuro */
```

Sem gradientes decorativos. Profundidade vem de: (a) troca de superfície claro↔escuro (o próprio divisor de seção), (b) uma sombra suave única sob a forma geométrica: `0 20px 60px rgba(10,10,10,0.22)`.

## Tipografia

- **Display / títulos:** Montserrat (600–900). Tracking negativo em tamanhos grandes (`-0.02em`) para a cadência "tight".
- **Corpo:** Inter (300–500), 17px, line-height 1.5.
- **Labels / wordmark / stats / eyebrows:** JetBrains Mono (500–700), CAIXA ALTA, letter-spacing generoso (`0.2em` a `0.35em`).

Escala:
```
hero:      clamp(3rem, 8vw, 7rem)   Montserrat 800  tracking -0.03em
display:   clamp(2.25rem, 5vw, 4rem) Montserrat 700 tracking -0.02em
h2:        clamp(1.75rem, 3vw, 2.5rem) Montserrat 700
lead:      clamp(1.25rem, 2vw, 1.75rem) Inter 300
body:      1.0625rem Inter 400 (17px)
mono-label: 0.75rem JetBrains Mono 600 uppercase tracking 0.3em
```

## Layout

- Tiles full-bleed empilhados, gap 0. Cor da superfície = divisor.
- Container de conteúdo: max 1200px, centrado.
- Padding de seção: 120px vertical desktop → 72px mobile.
- Grid fino opcional de fundo (linhas 1px a cada 48px) como assinatura editorial, bem sutil.
- Whitespace generoso: a forma geométrica respira, nunca amontoada.

## Componentes

- **Nav:** barra fina fixa, translúcida com `backdrop-blur`. Esquerda: PRISMA SUITE (mono). Centro: Radian · Quadra · Prisma · Sobre · FAQ. Direita: sem CTA pesado (minimal). Colapsa em menu no mobile.
- **Botão primário:** pill preto (`bg ink`, texto branco) em claro / pill branco (texto ink) em escuro. Padding 14×28. Active: `scale(0.96)`. Sem sombra.
- **Botão fantasma:** borda 1px, transparente, mesma cor do texto.
- **App tile:** full-bleed, stack central → eyebrow mono → nome (Montserrat) → tagline (Inter 300) → 2 CTAs (Abrir PWA / Saber mais) → forma geométrica animada com sombra única.
- **Feature comparison:** tabela editorial, linhas hairline, headers mono.
- **FAQ:** acordeão minimal, hairline entre itens, chevron lucide.
- **Footer:** parchment, colunas de links mono-label + dense links, linha legal fine-print.

## Formas geométricas (SVG, traço fino)

- **Radian:** circunferência traço 2px + raio/agulha que gira lentamente (loop).
- **Quadra:** quadrado cantos levemente arredondados + diagonal; leve float + rotação 3D sutil.
- **Prisma:** triângulo (prisma) com um feixe entrando (linha branca/preta) e saindo refratado em 3 raios finos; leve parallax.

Todas monocromáticas, stroke only (sem preenchimento), com a sombra única quando "pousadas" na superfície. Animação via `motion` (Motion library) — um page-load orquestrado com reveals escalonados, não micro-interações espalhadas.

## Movimento

- Entrada: fade + translateY(24px) escalonado por seção (stagger 0.08s).
- Formas: loop suave e contínuo (rotação/float lento), respeitando `prefers-reduced-motion`.
- Hover em tiles/cards: só escurece/clareia levemente e afina borda. Sem sombra colorida, sem glass exagerado.

## Responsivo

Breakpoints relevantes: 1200 (lock), 1024, 768 (nav → menu, tiles 1 coluna), 640, 420 (hero encolhe). Touch targets ≥ 44px.

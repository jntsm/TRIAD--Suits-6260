# TRIAD — Deploy

Monorepo Bun + Vite + React (web) + Hono (API) + Drizzle. Landing em `/`, app TRIAD em `/app`.

## Opção 1 — Publish do Runable (recomendado)
Clique em **Publish** no preview. Um único domínio serve a landing (`/`) e o app (`/app`).
Nada para configurar: build, hospedagem e HTTPS já vêm prontos.

## Opção 2 — Deploy manual (Vercel / Netlify / qualquer host estático)
O front é 100% estático (dados ficam em `localStorage`, sem backend obrigatório).

```bash
bun install
bun run build          # gera packages/web/dist
```

Configuração no host:

- Build command: `bun install && bun run build`
- Output directory: `packages/web/dist`
- Node/Bun: Bun 1.x (ou Node 20+ com `npm i && npm run build`)
- **SPA rewrite obrigatório** (senão `/app` dá 404 no refresh):

`vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

`netlify.toml`
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Para servir localmente o build:
```bash
bunx serve packages/web/dist -s
```

## Estrutura relevante
```
packages/web/
  index.html                     meta tags, OG, PWA, registro do service worker
  public/
    manifest.webmanifest         PWA (start_url: /app, standalone)
    sw.js                        service worker (offline shell)
    icon-192/512/maskable        ícones do PWA
    og-image.png                 1200x630
  src/web/
    app.tsx                      rotas: / e /app
    pages/index.tsx              landing
    pages/app.tsx                shell do TRIAD (login -> onboarding -> abas)
    app/store.ts                 estado + persistência em localStorage
    app/module-radian.tsx        vértice Foco (timer)
    app/module-quadra.tsx        vértice Tarefas (blocos)
    app/module-prisma.tsx        vértice Tempo & Dinheiro (calendário + orçamento)
    app/module-settings.tsx      liga/desliga vértices, modo escuro, perfil
    styles.css                   design system (tokens --su-* e --t-*)
design.md / design-app.md        documentação do design
```

## Notas
- Dados do usuário ficam apenas no dispositivo (`localStorage`, chaves `triad.*`). Não há banco nem login real.
- Desativar um vértice apenas o esconde da navegação; os dados voltam ao reativar.
- PWA instalável: no celular, abrir `/app` → "Adicionar à tela de início".
- Falta apenas o `<link rel="canonical">` — adicione com o domínio final depois do deploy.

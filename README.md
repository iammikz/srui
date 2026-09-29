# srui

**srui** = **S**upercomponent **R**eact **UI**. A React + Tailwind v4
super-component library with four runtime-switchable visual presets (flat,
glass, neumorphic, skeuomorphic), shadcn-style design tokens, and animated
charts/loaders. Distributed as an npm package (`@srui/react`) — components
are the product; consumers don't edit the source.

## Repository layout

| Path | What it is |
|---|---|
| `packages/react` | The library, published as `@srui/react` |
| `apps/demo` | Vite showcase app for local development |
| `apps/docs` | Documentation & component-library site (Next.js + Fumadocs) |

## Getting started

```bash
pnpm install          # at the repo root
pnpm build            # build @srui/react
pnpm dev              # run the demo app
pnpm dev:docs         # run the docs site
```

Requires Node.js 20 LTS or newer and pnpm 9.x (`corepack enable` picks up
the pinned version from `packageManager`).

See `implementation-plan.md` for the full project contract.

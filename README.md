# srui

**srui** = **S**upercomponent **R**eact **UI**. A React + Tailwind v4
super-component library with four runtime-switchable visual presets (flat,
glass, neumorphic, skeuomorphic), shadcn-style design tokens, and animated
charts/loaders. Distributed as an npm package (`@iammikz/srui`) — components
are the product; consumers don't edit the source.

## Repository layout

| Path | What it is |
|---|---|
| `packages/react` | The library, published as `@iammikz/srui` |
| `apps/demo` | Vite showcase app for local development (all components, preset switcher) |
| `apps/docs` | Documentation & component-library site (Vite + React Router + `vite-react-ssg`, dogfooding `@iammikz/srui`) |

## Getting started

Requires Node.js 20+ and pnpm 9.x (`corepack enable` picks up the pinned
version from `packageManager`).

```bash
pnpm install            # at the repo root
pnpm build              # build @iammikz/srui (dist + types + srui.css)
pnpm dev                # run the demo app (port 5199)
pnpm dev:docs           # run the docs site (port 5211)
```

## Testing

```bash
pnpm test:a11y          # axe (4 presets), reduced-motion, keyboard suites
pnpm test:visual        # visual regression: 30 docs pages × 4 presets (0.1% threshold)
node packages/react/scripts/contrast-check.mjs   # WCAG token matrix (104 pairs)
pnpm --filter demo exec tsc --noEmit             # demo type-check
pnpm build:docs         # docs production build
```

Visual baselines live in
`packages/react/tests/visual.spec.ts-snapshots/`. Regenerate after an
intentional visual change with
`pnpm exec playwright test --project=visual --update-snapshots`.

## Development notes

- **After editing `packages/react/src`, run `pnpm build`** — the demo and
  docs consume the built `dist/`; restart their dev servers if they serve
  stale components.
- The docs site builds to static HTML per route
  (`vite-react-ssg build`, `dirStyle: "nested"` → `dist/**/index.html`);
  plain `vite` dev has no prerendering, matching the tech-stack plan.
- `vite preview` only serves nested pages with a trailing slash
  (`/components/card/`, not `/components/card`) — real static hosts map
  both; the visual suite uses the trailing-slash form.
- The visual suite screenshots the prerendered artifact with script
  requests blocked (deterministic, no hydration race); interactive
  behavior is covered by the a11y suite against the demo app.
- **Docs search** is Pagefind over the static build (`pnpm build:docs` runs
  the index step); the topbar search works on the built/preview site, not in
  `vite dev` (no index exists there).
- **Storybook** (§7.2): `pnpm --filter @iammikz/srui storybook` (dev, port
  6006) / `build-storybook`. Stories live next to each component
  (`src/**/*.stories.tsx`), with a preset switcher in the toolbar.
- **Docs blocks** (Phase 8): Dashboard / Auth / Settings / Pricing under
  `/blocks/*`, plus a Theme Builder at `/theming/theme-builder`.
- Still deferred (Phase 8, needs publishing first): `examples/` framework
  templates installed from the registry; RTL (`dir="rtl"`) visual pass.
- The demo/docs Tailwind setups include an `@source` line pointing at the
  package build — Tailwind v4 skips `node_modules` by default, and on
  Windows the scanner can't traverse pnpm's junction via deep `..` paths
  (use the one-level-up `../node_modules/@iammikz/srui/dist` form).
- Publishing: manual via `pnpm release` (build + publish; see
  [`publish-package.md`](./docs/publish-package.md)) — no release workflow by
  choice. The npm-facing README lives at
  `packages/react/README.md` and ships with every publish.

See [`docs/implementation-plan.md`](./docs/implementation-plan.md) for the full project contract and
`packages/react/ACCESSIBILITY.md` for the accessibility state.

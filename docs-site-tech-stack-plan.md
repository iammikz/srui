# srui docs site — tech stack review & migration plan

Companion document to `implementation-plan.md`. That plan's Phase 2 now
states the *outcome* of this review (Vite + React + React Router, no
Next.js, dogfooding `@srui/react`); this document is the *why*, plus the
concrete steps to get from nothing (or from an already-started Next.js
attempt) to that outcome.

## 1. Why this needed a review

The original Phase 2 draft specified Next.js (App Router) + Fumadocs for
the documentation site. Two decisions changed that:
1. **Next.js is out.** The project should not take on a server framework
   just to host documentation.
2. **The docs site should showcase srui by being built with it** — its own
   nav, sidebar, tabs, cards, and callouts should be real `@srui/react`
   components, not framework-provided or hand-rolled equivalents.

Fumadocs is a Next.js-specific docs framework — dropping Next.js means
dropping Fumadocs too, and its replacements (routing, MDX compilation,
sidebar generation, dark mode, search) need to be sourced individually.

## 2. Requirements the new stack must satisfy

| Requirement | Why it matters |
|---|---|
| No Next.js, no other server framework | Explicit constraint |
| Plain React + Vite | Matches `apps/demo`, keeps one build toolchain across the monorepo, keeps the team's existing mental model |
| MDX content pages | Every page in Phase 2 (Introduction, Installation, Theming, Presets, one per component) is authored as prose + live examples; hand-writing each as a `.tsx` file would be far slower to author and review than Markdown-with-embedded-JSX |
| Multi-page routing with a persistent sidebar | Same shape as ui.shadcn.com/docs |
| Live, interactive component previews | The entire point of the site — static screenshots aren't acceptable per Phase 2's Definitions of Done |
| The site's own UI built from `@srui/react` | The dogfooding requirement — nav, sidebar, tabs, cards, callouts are real library components |
| Reasonably fast first paint, crawlable by search engines | It's a public docs site; a blank `<div id="root">` until JS loads is a real regression from what Next.js gave for free |
| Fits the existing pnpm workspace | `apps/docs` alongside `apps/demo`, same `pnpm install`/`pnpm dev` flow |

## 3. Options considered

### Option A — Plain Vite + React Router, client-rendered only
Just `apps/demo`'s setup, with routes added. `vite build` produces one
`index.html` and a JS bundle; React Router handles all navigation
client-side after that first load.

- **Pros:** simplest possible setup, zero new concepts beyond what
  `apps/demo` already uses, fastest to stand up.
- **Cons:** every route serves the same near-empty `index.html` — nothing
  to crawl per-page, and the visible page is blank until the JS bundle
  parses and runs. For a public docs site meant to be found via search and
  opened cold on a slow connection, this is a real regression from what
  Next.js provided for free.

### Option B — Vite + React Router + `vite-react-ssg`
Same app as Option A, plus `vite-react-ssg`, which pre-renders every route
in `routes.tsx` to its own static `index.html` at build time (by actually
running the React tree per route in a headless environment during
`vite-react-ssg build`), then hands off to normal client-side React Router
navigation once the page's JS loads (this handoff is standard React
hydration — same mechanism used by any server-rendered React app,
performed here at build time instead of on a live server).

- **Pros:** every route gets real static HTML — fast first paint,
  crawlable, works with JS disabled for initial content. No server
  process, no framework lock-in: the app is a completely ordinary Vite +
  React Router app; `vite-react-ssg` only changes how `vite build` is
  invoked (`vite-react-ssg build` instead of `vite build`) and how
  `main.tsx` bootstraps the router. `pnpm dev` is unaffected — normal Vite
  dev server, no prerendering in development.
- **Cons:** one more dependency; prerendering assumes each route's content
  doesn't depend on browser-only globals at module scope (component code
  that reads `window`/`localStorage` must guard those reads for the
  prerender pass — `UIProvider` already does this correctly, since Phase 0
  wrapped its `localStorage` reads in `try/catch` and deferred them to
  `useEffect`).

### Option C — Astro (with React "islands")
A different framework entirely: content-first, ships zero JS by default,
React components are opted into individually as interactive "islands."

- **Pros:** excellent default performance, first-class MDX support.
- **Cons:** trades "no Next.js" for "a different framework with its own
  routing, config, and content-collection conventions to learn" — doesn't
  satisfy "stays plain React," and the docs site's `@srui/react` chrome
  would need explicit `client:` hydration directives throughout, adding
  friction to the exact dogfooding goal this phase cares about.

### Option D — `vite build` + a custom prerendering script
Hand-write a script (e.g., using Puppeteer or `react-dom/server`) that
renders each route to a string and writes it to disk after the normal
Vite build.

- **Pros:** no new framework-shaped dependency.
- **Cons:** reinvents what `vite-react-ssg` already does correctly
  (route enumeration, asset path rewriting, per-route `<head>` tags),
  with more code to maintain for no real benefit over Option B.

## 4. Decision

**Option B: Vite + React Router + `vite-react-ssg`.** It's the only option
that satisfies every requirement in section 2 without introducing a
second framework or reinventing prerendering by hand. This is what
`implementation-plan.md`'s Phase 2 now specifies.

MDX compilation is handled by `@mdx-js/rollup` (a Vite/Rollup plugin, not
part of `vite-react-ssg`) — this is what lets `.mdx` files under
`content/docs/` be imported directly as React components in `routes.tsx`,
same as any other component.

## 5. What Fumadocs provided, and its replacement in the new stack

| Fumadocs feature | Replacement | Where it's specified |
|---|---|---|
| File-based routing under `app/` | Explicit route list in `src/routes.tsx` | Phase 2.1 |
| `meta.json` sidebar ordering | Plain `src/nav.ts` config array | Phase 2.1 |
| MDX compilation | `@mdx-js/rollup` in `vite.config.ts` | Phase 2 intro |
| Page shell / layout | `DocsLayout.tsx`, built from `AppShell` (dogfooding) | Phase 2.1 |
| Dark mode | Already solved — `UIProvider` from Phase 0, no framework needed | Phase 2.1 |
| Static export / prerendering | `vite-react-ssg build` | Phase 2 intro, this document §3 |
| Full-text search | **Not replaced yet — explicitly deferred.** Fumadocs bundles search; the new stack doesn't. Track this as a Phase 7 or Phase 8 addition (e.g., client-side search via a small index built at build time — Pagefind is a reasonable option since it works against static HTML output and needs no server) | New backlog item, see §7 |

## 6. Package changes

Remove (if any were already installed from an earlier Fumadocs attempt):
```bash
pnpm --filter docs remove next fumadocs-ui fumadocs-core fumadocs-mdx
```

Add:
```bash
pnpm --filter docs add react react-dom react-router-dom @srui/react
pnpm --filter docs add -D vite @vitejs/plugin-react @tailwindcss/vite \
  tailwindcss @mdx-js/rollup vite-react-ssg typescript \
  @types/react @types/react-dom
```

## 7. Migration steps (if `apps/docs` was already scaffolded with Fumadocs)

If Phase 2 hasn't been started yet, skip this section and follow
`implementation-plan.md`'s Phase 2 directly — there's nothing to migrate.

If a Fumadocs-based `apps/docs` already exists:
1. **Inventory content first.** List every `.mdx` file already written
   under the old `content/docs/` structure — this prose is reusable
   as-is; only the surrounding framework changes.
2. Delete the Next.js scaffold: `app/`, `next.config.mjs`,
   `next-env.d.ts`, and the `next`/`fumadocs-*` dependencies (§6).
3. Scaffold the Vite app per Phase 2's intro (`vite.config.ts`,
   `package.json` scripts, `src/main.tsx`, `src/routes.tsx`, `src/nav.ts`).
4. Rebuild `DocsLayout.tsx` from `AppShell` per Phase 2.1 — this replaces
   Fumadocs' layout component and its `layout.config.tsx`.
5. Move each existing `.mdx` file into the new `content/docs/` tree
   unchanged, then add one `routes.tsx` entry per file (Fumadocs
   discovered these automatically via file-based routing; the new stack
   requires one explicit line per route — this is the main mechanical
   cost of the migration).
6. Rebuild `<LivePreview>`, `<PresetGrid>`, and `<TokenPlayground>` as
   plain `.tsx` components under `src/components/` and wire them into the
   MDX provider (Phase 2.6) — if these already existed as Fumadocs MDX
   components, their internals are largely reusable; only the import
   mechanism changes.
7. Run `pnpm --filter docs build` and confirm static HTML exists per
   route (`apps/docs/dist/**/index.html`) before considering the
   migration complete.

## 8. Definition of done for this review

- [ ] This document and `implementation-plan.md`'s Phase 2 agree with
      each other (any future edit to one should be checked against the
      other)
- [ ] No `next` or `fumadocs-*` package appears in `apps/docs/package.json`
- [ ] `pnpm --filter docs dev` and `pnpm --filter docs build` both succeed
- [ ] At least one route's built output (`apps/docs/dist/index.html` for
      the Introduction page) contains real rendered HTML content when
      viewed with JavaScript disabled — this is the concrete test that
      prerendering is actually working, not just configured
- [ ] Full-text search is logged as a deferred item (§5) rather than
      silently dropped

# srui — Implementation Plan

**srui** = **S**upercomponent **R**eact **UI**. A React + Tailwind v4
super-component library with four runtime-switchable visual presets (flat,
glass, neumorphic, skeuomorphic), shadcn-style design tokens, and animated
charts/loaders. Distributed as an npm package (`@srui/react`), not a
copy-in CLI — components are the product; consumers don't edit the source.

The project ships as three things: the library package, a documentation
and component-library website (introduction, installation, theming,
presets, and one page per component — the same shape as ui.shadcn.com/docs),
and a lightweight demo app used for local development. All three live in
one monorepo.

## How to use this document

This plan is written so that every task is self-contained: the file to
create or edit, the exact dependencies, the exact prop interface or CSS
variables involved, and a testable Definition of Done. Nothing depends on
inferring intent from earlier conversation — if a task references a
decision, that decision is restated in the task or in the reference tables
below.

Rules for working through it:
1. Do phases in order. Later phases assume earlier ones are complete and
   passing their Definition of Done.
2. Inside a phase, tasks can be done in any order unless a task explicitly
   says it depends on another.
3. Never invent a new CSS variable name. If a component needs a token that
   isn't in the **Canonical token reference** table below, that's a sign
   the task is under-specified — stop and add the token to that table
   first (with a value for every one of the four presets), then proceed.
4. Every new component gets a Definition of Done checked off before moving
   on — "looks right in the demo" is not sufficient; go through the actual
   checklist items. From Phase 3 onward, "done" also includes the
   component's documentation page (see Phase 2.6) — a component without a
   docs page is not finished.
5. If a task's instructions and the **Standing technical decisions** table
   near the end conflict, the table wins.

This plan starts from an empty repository. Phase 0 builds the foundation;
every later phase assumes Phase 0's Definition of Done is fully checked
off before work begins.

---

## Prerequisites & environment

- Node.js 20 LTS or newer (`node --version`)
- pnpm 9.x (`corepack enable && corepack prepare pnpm@9.12.0 --activate`,
  or `npm install -g pnpm@9.12.0`)
- Git
- A code editor with TypeScript support (for inline type errors as you go)

Confirm before starting Phase 0:
```bash
node --version   # v20.x or newer
pnpm --version   # 9.x
```

---

## Canonical repository structure

This is the target shape by the end of Phase 2. Every file path referenced
later in this document is relative to the `srui/` root shown here.

```
srui/
├─ package.json                  # workspace root, pnpm scripts
├─ pnpm-workspace.yaml
├─ .gitignore
├─ README.md
├─ packages/
│  └─ react/                     # the library package, published as @srui/react
│     ├─ package.json
│     ├─ tsconfig.json
│     └─ src/
│        ├─ index.ts             # public API surface — every export goes through here
│        ├─ lib/
│        │  └─ cn.ts             # clsx + tailwind-merge helper
│        ├─ UIProvider.tsx       # style/scheme context, persistence, no-flash script
│        ├─ styles/
│        │  ├─ theme.css         # token contract (see reference table below)
│        │  ├─ animations.css    # keyframes registered as Tailwind utilities
│        │  └─ presets/
│        │     ├─ flat.css
│        │     ├─ glass.css
│        │     ├─ neumorphic.css
│        │     └─ skeuomorphic.css
│        └─ components/
│           ├─ Button.tsx
│           ├─ Card.tsx
│           ├─ Input.tsx
│           ├─ Dialog.tsx
│           ├─ Loader.tsx        # Spinner, DotsLoader, Skeleton, LoadingOverlay
│           ├─ StatCard.tsx
│           ├─ chart/
│           │  ├─ LineChart.tsx
│           │  └─ BarChart.tsx
│           ├─ Select.tsx        # Phase 3
│           ├─ Combobox.tsx      # Phase 3
│           ├─ Tabs.tsx          # Phase 3
│           ├─ Tooltip.tsx       # Phase 3
│           ├─ Popover.tsx       # Phase 3
│           ├─ Toast.tsx         # Phase 3
│           ├─ Checkbox.tsx      # Phase 3
│           ├─ RadioGroup.tsx    # Phase 3
│           ├─ Switch.tsx        # Phase 3
│           ├─ Textarea.tsx      # Phase 3
│           ├─ Label.tsx         # Phase 3
│           ├─ FormField.tsx     # Phase 3
│           ├─ Avatar.tsx        # Phase 3
│           ├─ Badge.tsx         # Phase 3
│           ├─ Separator.tsx     # Phase 3
│           ├─ Accordion.tsx     # Phase 3
│           ├─ Collapsible.tsx   # Phase 3
│           ├─ AppShell.tsx      # Phase 5
│           ├─ DataTable.tsx     # Phase 5
│           ├─ ChartCard.tsx     # Phase 5
│           ├─ FormBuilder.tsx   # Phase 5
│           ├─ CommandPalette.tsx# Phase 5
│           ├─ NotificationCenter.tsx # Phase 5
│           └─ Wizard.tsx        # Phase 5
└─ apps/
   ├─ demo/                      # Vite showcase app, consumes @srui/react like any external app
   │  ├─ package.json
   │  ├─ vite.config.ts
   │  ├─ tsconfig.json
   │  ├─ index.html
   │  └─ src/
   │     ├─ main.tsx
   │     ├─ App.tsx
   │     └─ app.css
   └─ docs/                      # documentation & component-library site (Phase 2)
      ├─ package.json
      ├─ vite.config.ts           # Vite + @vitejs/plugin-react + @tailwindcss/vite + @mdx-js/rollup
      ├─ tsconfig.json
      ├─ index.html
      ├─ src/
      │  ├─ main.tsx              # ViteReactSSG entry point
      │  ├─ routes.tsx            # explicit React Router route list
      │  ├─ nav.ts                # sidebar config, consumed by DocsLayout
      │  ├─ DocsLayout.tsx         # shared page shell, built from AppShell (Phase 5)
      │  └─ components/
      │     ├─ LivePreview.tsx    # <LivePreview>, see Phase 2.6
      │     ├─ PresetGrid.tsx     # see Phase 2.2
      │     └─ TokenPlayground.tsx # see Phase 2.4
      └─ content/docs/
         ├─ index.mdx            # Introduction
         ├─ installation.mdx
         ├─ theming.mdx
         ├─ theming/
         │  └─ presets.mdx
         └─ components/
            ├─ _template.mdx     # reference only, never routed or linked in nav.ts
            ├─ button.mdx
            ├─ card.mdx
            ├─ input.mdx
            ├─ dialog.mdx
            ├─ loader.mdx
            ├─ stat-card.mdx
            ├─ charts.mdx
            ├─ select.mdx              # Phase 3
            ├─ combobox.mdx            # Phase 3
            ├─ tabs.mdx                # Phase 3
            ├─ tooltip.mdx             # Phase 3
            ├─ popover.mdx             # Phase 3
            ├─ toast.mdx               # Phase 3
            ├─ checkbox.mdx            # Phase 3
            ├─ radio-group.mdx         # Phase 3
            ├─ switch.mdx              # Phase 3
            ├─ textarea.mdx            # Phase 3
            ├─ form-field.mdx          # Phase 3
            ├─ avatar.mdx              # Phase 3
            ├─ badge.mdx               # Phase 3
            ├─ separator.mdx           # Phase 3
            ├─ accordion.mdx           # Phase 3
            ├─ app-shell.mdx           # Phase 5
            ├─ data-table.mdx          # Phase 5
            ├─ chart-card.mdx          # Phase 5
            ├─ form-builder.mdx        # Phase 5
            ├─ command-palette.mdx     # Phase 5
            ├─ notification-center.mdx # Phase 5
            └─ wizard.mdx              # Phase 5
```

---

## Canonical token reference

Every component and preset must use only these variable names. This table
is the single source of truth — if a new component needs a color, spacing,
or motion value not listed here, add the token here first (with a
per-preset value, or "same across presets" if it doesn't vary), then use
it. Do not invent a one-off variable inline in a component file. This
table is also reproduced on the Theming docs page (Phase 2.4) — keep both
in sync.

**Color tokens** (set in `theme.css` under `:root` / `.dark`, aliased to
Tailwind utilities under `@theme inline`):

| Token | Tailwind utility | Notes |
|---|---|---|
| `--background` / `--foreground` | `bg-background` / `text-foreground` | page-level |
| `--card` / `--card-foreground` | `bg-card` / `text-card-foreground` | must equal `--background` in the neumorphic preset |
| `--popover` / `--popover-foreground` | `bg-popover` / `text-popover-foreground` | dialogs, dropdowns, tooltips |
| `--primary` / `--primary-foreground` | `bg-primary` / `text-primary-foreground` | |
| `--secondary` / `--secondary-foreground` | `bg-secondary` / `text-secondary-foreground` | |
| `--muted` / `--muted-foreground` | `bg-muted` / `text-muted-foreground` | de-emphasized text, skeleton base |
| `--accent` / `--accent-foreground` | `bg-accent` / `text-accent-foreground` | hover states |
| `--destructive` / `--destructive-foreground` | `bg-destructive` / `text-destructive-foreground` | |
| `--success` / `--success-foreground` | `bg-success` / `text-success-foreground` | not in shadcn's set — our extension |
| `--warning` / `--warning-foreground` | `bg-warning` / `text-warning-foreground` | our extension |
| `--info` / `--info-foreground` | `bg-info` / `text-info-foreground` | our extension |
| `--border` | `border-border` | |
| `--input` | `bg-input` (at low opacity, e.g. `bg-input/30`) | |
| `--ring` | used via `outline-ring`, never `ring-*` (see gotcha table) | |
| `--sidebar*` (7 tokens, mirrors the main set) | `bg-sidebar`, etc. | for AppShell, Phase 5 |
| `--chart-1` through `--chart-8` | referenced directly as `stroke`/`fill` in chart SVGs, not as Tailwind classes | |

**Surface recipe tokens** (structure, not color — every preset overrides
all five):

| Token | Used by | Meaning |
|---|---|---|
| `--surface-shadow` | `surface` utility, resting state | |
| `--surface-shadow-hover` | components with a hover elevation change | |
| `--surface-shadow-pressed` | active/pressed state | |
| `--surface-blur` | `surface` utility's `backdrop-filter` | `0px` except glass |
| `--surface-image` | `surface` utility's `background-image` | gradients/highlights; `none` except glass and skeuomorphic |

**Motion tokens:**

| Token | Value | Used for |
|---|---|---|
| `--dur-fast` | `120ms` | micro-interactions (input focus) |
| `--dur-base` | `200ms` | default transitions (button, card hover) |
| `--dur-slow` | `500ms` | large state changes |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | default easing |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | dialog/popover entrance |

**Radius tokens:** `--radius` (preset sets the base value) aliased to
`--radius-sm` / `--radius-md` / `--radius-lg` / `--radius-xl` via `@theme inline`.

**Animation utilities** (registered in `animations.css` under `@theme`,
usable as plain Tailwind classes): `animate-draw`, `animate-grow-y`,
`animate-grow-x`, `animate-shimmer`, `animate-spin-slow`,
`animate-count-fade`, `animate-scale-in`, `animate-fade-in`. Always pair
usage with `motion-safe:`/`motion-reduce:` — see the gotcha table.

---

## Phase 0 — Foundation

Build every item below before starting Phase 1 — everything after this
phase assumes these files exist and pass their Definition of Done. Start
by scaffolding the repository exactly as shown in **Canonical repository
structure** above (`srui/` root, `packages/react`, `apps/demo`), with
`packages/react/package.json` named `"@srui/react"` from the start.
(`apps/docs` is built in Phase 2 — skip it for now.)

- [ ] `packages/react/src/styles/theme.css` — full token contract (every
      token in the reference table above, both `:root` and `.dark`)
- [ ] `packages/react/src/styles/presets/{flat,glass,neumorphic,skeuomorphic}.css`
- [ ] `packages/react/src/styles/animations.css`
- [ ] `packages/react/src/UIProvider.tsx` — exports `UIProvider`,
      `useUIStyle`, `noFlashScript`; types `UIStyle` = `"flat" | "glass" |
      "neumorphic" | "skeuomorphic"`, `UIScheme` = `"light" | "dark" |
      "system"`; persists the chosen style/scheme to `localStorage` under
      the keys `"srui-style"` and `"srui-scheme"`
- [ ] `packages/react/src/lib/cn.ts` — `cn(...inputs: ClassValue[]): string`
- [ ] `packages/react/src/components/Button.tsx` — `ButtonProps` extends
      `React.ButtonHTMLAttributes<HTMLButtonElement>` plus `variant:
      "default" | "secondary" | "destructive" | "outline" | "ghost" |
      "link"`, `size: "sm" | "md" | "lg" | "icon"`, `loading?: boolean`
- [ ] `packages/react/src/components/Card.tsx` — `Card`, `CardHeader`,
      `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- [ ] `packages/react/src/components/Input.tsx` — `InputProps` extends
      `React.InputHTMLAttributes<HTMLInputElement>` plus `invalid?: boolean`
- [ ] `packages/react/src/components/Dialog.tsx` — wraps
      `@radix-ui/react-dialog`; exports `Dialog`, `DialogTrigger`,
      `DialogClose`, `DialogContent`, `DialogHeader`, `DialogTitle`,
      `DialogDescription`, `DialogFooter`
- [ ] `packages/react/src/components/Loader.tsx` — `Spinner`,
      `DotsLoader`, `Skeleton`, `LoadingOverlay` (props: `active: boolean`,
      `label?: string`, `delayMs?: number` default `200`, `minDisplayMs?:
      number` default `400`, `variant?: "spinner" | "dots"`)
- [ ] `packages/react/src/components/StatCard.tsx` — `StatCardProps`:
      `label: string`, `value: number`, `formatValue?: (v: number) =>
      string`, `delta?: { value: number; direction: "up" | "down" }`
- [ ] `packages/react/src/components/chart/LineChart.tsx` — built on
      `d3-scale`/`d3-shape`, uses `pathLength={1}` draw-in
- [ ] `packages/react/src/components/chart/BarChart.tsx` — built on
      `d3-scale`, uses `transform-box: fill-box` + staggered `animate-grow-y`
- [ ] `apps/demo/` — Vite app with a live preset switcher and dark-mode
      toggle, consuming the package via `workspace:*`

**Definition of done:**
- [ ] `pnpm install` at the repo root completes with no errors
- [ ] `pnpm --filter @srui/react build` produces `dist/index.js` and
      `dist/index.d.ts`
- [ ] `pnpm dev` starts the demo app and its style switcher flips cleanly
      between all four presets, with dark mode working in each

---

## Phase 1 — Package it properly (~1 week)

### 1.1 Confirm the library build

- **File:** `packages/react/package.json` (already has the `build` script:
  `tsup src/index.ts --format esm --dts --external react`)
- **Command:** `pnpm --filter @srui/react build`
- **Expected output:** `packages/react/dist/index.js` and
  `packages/react/dist/index.d.ts` are created and non-empty
- **Definition of done:**
  - [ ] Build completes with zero TypeScript errors
  - [ ] `dist/index.d.ts` contains a type declaration for every export
        listed in `src/index.ts`

### 1.2 Verify subpath exports in isolation

The `exports` map in `packages/react/package.json` should read:
```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./theme.css": "./src/styles/theme.css",
    "./presets/*.css": "./src/styles/presets/*.css",
    "./animations.css": "./src/styles/animations.css"
  }
}
```
- **Command to verify each path resolves:**
  ```bash
  node -e "console.log(require.resolve('@srui/react'))"
  ```
  (run from `apps/demo`, where the package is linked via the workspace)
- **Definition of done:**
  - [ ] The command above prints a path ending in `dist/index.js`
  - [ ] `apps/demo/src/app.css`'s four `@import "@srui/react/..."` lines
        resolve with no Vite warning about a missing module

### 1.3 Verify Tailwind `@source` in a project outside the monorepo

This is the step most likely to fail silently — Tailwind v4 does not scan
`node_modules` by default, so a real external consumer needs an explicit
`@source` line. Test this in a throwaway project, not the monorepo demo
(the demo works via a workspace symlink, which behaves differently from a
real installed package).

```bash
# outside the srui/ repo entirely
npm create vite@latest srui-consumer-test -- --template react-ts
cd srui-consumer-test
npm install
npm install tailwindcss @tailwindcss/vite
npm install /absolute/path/to/srui/packages/react   # local install to simulate a published package
```
In `src/index.css`:
```css
@import "tailwindcss";
@import "@srui/react/theme.css";
@import "@srui/react/presets/flat.css";
@source "../node_modules/@srui/react/dist";
```
- **Definition of done:**
  - [ ] A `<button className="bg-primary text-primary-foreground rounded-lg px-4 py-2">Test</button>`
        placed in `App.tsx` actually renders with the theme's colors — if
        it renders unstyled, the `@source` path is wrong or the build in
        1.1 wasn't run before `npm install`

### 1.4 Precompiled CSS fallback

For consumers not using Tailwind v4 at all.
- **New file:** `packages/react/scripts/build-css.mjs` — uses the Tailwind
  CLI to compile `theme.css` + all four presets + `animations.css` into a
  single `packages/react/dist/srui.css`, with `prefix(srui)` so it can't
  collide with a host app's own utility classes
- **New export in `package.json`:** `"./styles.css": "./dist/srui.css"`
- **Definition of done:**
  - [ ] `packages/react/dist/srui.css` exists after `pnpm build`
  - [ ] Importing only that one file in a plain HTML page (no Tailwind)
        renders a `Button` with correct colors and a working `surface` shadow

### 1.5 Versioning and publish

```bash
pnpm add -D -w @changesets/cli
pnpm changeset init
pnpm changeset            # describe the 0.1.0 release
pnpm changeset version
pnpm --filter @srui/react publish --access public   # or a private registry
```
- **Definition of done:**
  - [ ] `@srui/react@0.1.0` is installable by version number from your
        chosen registry, not just via `workspace:*`

---

## Phase 2 — Documentation & component-library site (~1 week to scaffold; grows continuously after)

This is srui's public face — the equivalent of ui.shadcn.com/docs. Build
the shell and the four non-component pages (Introduction, Installation,
Theming, Presets) now, while only Phase 0's components exist. Phase 3 and
Phase 5 each add their own component's docs page as part of finishing that
component — the site is never "caught up" in one batch pass, it grows in
lockstep with the library.

**Stack: Vite + React + React Router, no Next.js.** MDX content is
compiled by a Vite plugin rather than a Next.js-specific docs framework.
Static HTML per route is produced by `vite-react-ssg` so the site is
fast and crawlable without adopting a server framework — see
`docs-site-tech-stack-plan.md` (delivered alongside this plan) for the
full comparison of options and why this combination was chosen.

**Dogfooding principle — read this before building anything in this
phase:** the docs site's own UI chrome is built using `@srui/react`
itself, not plain unstyled `<div>`s. The top nav's style switcher is a row
of `Button`s. The sidebar is rendered inside `AppShell`. Framework-specific
snippets use `Tabs`. Callouts and the live-preview box use `Card`. A
"copy" button is `Button` with `variant="ghost"`. This isn't cosmetic —
the site being visibly built from srui's own components, in production,
under real content, is itself part of what proves the library works. If a
page needs a UI element that has no srui component yet, that's a signal
the component library is missing something real — flag it, don't reach
for a plain HTML element as a workaround.

```bash
mkdir -p apps/docs/src apps/docs/content/docs
cd apps/docs
pnpm init
pnpm add react react-dom react-router-dom @srui/react
pnpm add -D vite @vitejs/plugin-react @tailwindcss/vite tailwindcss \
  @mdx-js/rollup vite-react-ssg typescript @types/react @types/react-dom
```

`apps/docs/vite.config.ts`:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx({ providerImportSource: "@mdx-js/react" }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
  ],
  ssgOptions: { script: "async", formatting: "minify" }, // consumed by vite-react-ssg
});
```
`apps/docs/package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite-react-ssg build",
    "preview": "vite preview"
  }
}
```

### 2.1 Site shell and navigation

- **File:** `apps/docs/src/main.tsx` — entry point used by `vite-react-ssg`;
  exports `ViteReactSSG(<App />, ({ router }) => {})` per that package's
  API, with routes defined in `src/routes.tsx`
- **File:** `apps/docs/src/routes.tsx` — a plain array of React Router
  route objects (`{ path, element }`), one per page. No file-based routing
  convention to learn — every route is an explicit line in this file
- **File:** `apps/docs/src/DocsLayout.tsx` — the shared page shell, built
  from `AppShell` (imported from `@srui/react`, built in Phase 5 — until
  Phase 5 lands, use a minimal flex layout and swap in `AppShell` once it
  exists; do not build a second, throwaway shell component to avoid this
  ordering issue). Wraps everything in `<UIProvider>` so every live
  example on every page can be flipped between presets and light/dark
  using one shared switcher
- **File:** `apps/docs/src/nav.ts` — a plain TypeScript config, not a
  framework convention, describing the sidebar:
  ```ts
  export const nav = [
    { section: "Getting Started", items: [
      { label: "Introduction", href: "/" },
      { label: "Installation", href: "/installation" },
    ]},
    { section: "Theming", items: [
      { label: "Theming", href: "/theming" },
      { label: "Presets", href: "/theming/presets" },
    ]},
    { section: "Components", items: [
      { label: "Button", href: "/components/button" },
      { label: "Card", href: "/components/card" },
      { label: "Input", href: "/components/input" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Loader", href: "/components/loader" },
      { label: "Stat Card", href: "/components/stat-card" },
      { label: "Charts", href: "/components/charts" },
      // Select, Combobox, Tabs, Tooltip, Popover, Toast, Checkbox,
      // Radio Group, Switch, Textarea, Form Field, Avatar, Badge,
      // Separator, Accordion — appended one at a time in Phase 3
      // App Shell, Data Table, Chart Card, Form Builder, Command
      // Palette, Notification Center, Wizard — appended in Phase 5
    ]},
  ];
  ```
  `DocsLayout` renders this array as the `AppShell`'s `sidebar` prop —
  each item is a `Button variant="ghost"` styled as a nav link (active
  route gets `variant="secondary"`)
- **Definition of done:**
  - [ ] The sidebar renders with all three top-level sections, sourced
        entirely from `nav.ts` (no hardcoded links duplicated elsewhere)
  - [ ] The style/dark-mode switcher in the top nav affects every live
        preview on the current page instantly, with no page reload
  - [ ] `pnpm --filter docs build` produces static HTML for every route in
        `routes.tsx` (confirm via `apps/docs/dist/**/index.html`)

### 2.2 Introduction page

- **File:** `apps/docs/content/docs/index.mdx`, routed at `/` in
  `routes.tsx` (import the `.mdx` file directly as a component:
  `import Introduction from "../content/docs/index.mdx"`)
- **Required content:**
  - What srui is (Supercomponent React UI) and the one-paragraph pitch:
    shadcn-style tokens, four runtime-switchable presets, Tailwind v4,
    distributed as an npm package rather than copy-in source
  - A line noting that this site is itself built with `@srui/react` — the
    dogfooding point from this phase's intro, stated for the reader
  - A short "why four presets" explainer with one live side-by-side
    preview of the same `Card` rendered in all four presets — build this
    as a small reusable `<PresetGrid>` component (a plain `.tsx` component
    under `apps/docs/src/components/`, imported into MDX like any other
    component; used again on the Presets page in 2.5)
  - Links to Installation and to the Components section (real
    `<Link to="...">` from `react-router-dom`, not `<a href>`)
- **Definition of done:**
  - [ ] `<PresetGrid>` renders four live `Card`s, each showing a different
        preset simultaneously on screen (each instance sets `data-style`
        on its own wrapping element, not on `<html>` — see the "scoped
        tokens" gotcha in the reference table if this needs more than
        Phase 0's `UIProvider` already supports)

### 2.3 Installation page

- **File:** `apps/docs/content/docs/installation.mdx`, routed at
  `/installation`
- **Required content, in this order:**
  1. `pnpm add @srui/react` (with npm/yarn equivalents shown in a `Tabs`
     component from `@srui/react`, not a Markdown code-fence switcher)
  2. The three `@import` lines plus the `@source` line from Phase 1.3,
     with a callout (a `Card` with `variant="outline"`-style treatment)
     explaining why `@source` is required (Tailwind v4 skips
     `node_modules` by default)
  3. Wrapping the app in `<UIProvider>`, plus the no-flash inline script
     from `UIProvider.tsx`'s exported `noFlashScript`, shown as a
     copy-pasteable snippet
  4. A note on the precompiled CSS fallback from Phase 1.4, for consumers
     not using Tailwind
  5. One Vite setup walkthrough (this project's own supported consumer
     path — no other framework's setup is documented at this stage; if a
     future phase adds support for another bundler/framework, add its tab
     here then)
- **Definition of done:**
  - [ ] Following this page exactly, in the throwaway consumer project
        from Phase 1.3, produces a correctly styled page with no steps
        beyond what the page describes

### 2.4 Theming page

- **File:** `apps/docs/content/docs/theming.mdx`, routed at `/theming`
- **Required content:**
  - The full **Canonical token reference** table from this plan (color
    tokens, surface recipe tokens, motion tokens, radius tokens),
    reproduced as an actual table on the page
  - How to override a token: a plain CSS example redefining `--primary`
    after the `@import`s
  - How dark mode works: the `.dark` class, toggled by `UIProvider`'s
    `scheme` state
  - A live "token playground": text/color inputs (rendered with `Input`
    from `@srui/react`) bound to `--primary`, `--radius`, and
    `--background`, applied to a preview `Card` in real time (a small
    component under `apps/docs/src/components/TokenPlayground.tsx`,
    imported into the MDX file; no persistence needed)
- **Definition of done:**
  - [ ] Changing a value in the token playground visibly updates the
        preview immediately, with no page reload

### 2.5 Presets page

- **File:** `apps/docs/content/docs/theming/presets.mdx`, routed at
  `/theming/presets`
- **Required content:** one section per preset — Flat, Glass, Neumorphic,
  Skeuomorphic — each containing:
  - A one-paragraph description of the visual approach and when to use it
  - The `<PresetGrid>` component from 2.2, this time scoped to just that
    one preset, showing `Button`, `Card`, and `Input` together
  - That preset's specific caution, pulled verbatim from the **Known
    gotchas** section at the end of this document (e.g. glass needs
    contrast behind it; neumorphic's `--card` must equal `--background`)
  - The exact `data-style` value that activates it
- **Definition of done:**
  - [ ] All four presets are demonstrated with live, interactive examples
        — not static screenshots or hard-coded images

### 2.6 Components section skeleton + page template

Every component page (added incrementally in Phase 3 and Phase 5) follows
this exact template. Create it now at
`apps/docs/content/docs/components/_template.mdx` as the reference every
later task copies from:

```mdx
# ComponentName

One-sentence description of what it's for.

## Installation

\`\`\`tsx
import { ComponentName } from "@srui/react";
\`\`\`

## Usage

<LivePreview>
  <ComponentName {...basicProps} />
</LivePreview>

\`\`\`tsx
<ComponentName {...basicProps} />
\`\`\`

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| ... | ... | ... | ... |

## Examples

(one <LivePreview> + code block per notable prop combination — variants,
sizes, loading/error/disabled states, etc.)

## Accessibility

(keyboard interactions, ARIA roles applied, anything from Phase 6 that's
specific to this component)
```

- **New file:** `apps/docs/src/components/LivePreview.tsx` — the
  `<LivePreview>` component referenced above (a plain component, globally
  available to MDX via the `providerImportSource`/MDX provider set up in
  `vite.config.ts`); renders its children inside a bordered `Card` (from
  `@srui/react`) that reflects the current `UIProvider` style/scheme, plus
  a "view code" `Button` that toggles the matching code block
- **Definition of done:**
  - [ ] `_template.mdx` exists but has no entry in `nav.ts` and no route
        in `routes.tsx` — it is copy-from reference material, not a
        published page

### Phase 2 cross-cutting requirement (applies to every later phase)

Starting with Phase 3, **every task that adds a new exported component
also adds that component's docs page**, using the template from 2.6, adds
a route for it in `routes.tsx`, and adds it to `nav.ts`. This requirement
is stated once here rather than repeated in every later task — from this
point on, a component task is not complete until its docs page exists
(see rule 4 in "How to use this document").

**Definition of done for Phase 2 as a whole:**
- [ ] `apps/docs` runs (`pnpm --filter docs dev`) and its sidebar shows
      Introduction, Installation, Theming, and Presets
- [ ] Every component that exists at the end of Phase 0 — Button, Card,
      Input, Dialog, the Loader family, StatCard, LineChart, BarChart —
      has a docs page following the 2.6 template
- [ ] The style/dark-mode switcher in the docs site's top nav uses the
      same `useUIStyle` hook as `apps/demo`, not a second, separate
      implementation of style state
- [ ] Every piece of the site's own chrome (nav, sidebar, callouts,
      framework tabs, the live-preview box) is built from `@srui/react`
      components — a quick audit: `grep -rn "<div" apps/docs/src` should
      turn up layout wrappers only, not buttons/cards/tabs reimplemented
      by hand

---

## Phase 3 — Round out the primitives (~1–2 weeks)

General pattern for every primitive in this phase (matches `Dialog.tsx`
from Phase 0): wrap the Radix package's behavior, expose only srui's own
component names from `src/index.ts` (never re-export the Radix package
itself), style with shadcn-style token classes plus `surface` where the
component has a raised or bordered appearance, and support all four
presets without preset-specific code inside the component (the preset
stylesheet does that work). Per the Phase 2 cross-cutting requirement,
each entry below also gets a docs page before it counts as done.

Each entry below: file, exact dependency to install, prop interface, and
Definition of Done. Install all Phase 3 dependencies at once:
```bash
pnpm --filter @srui/react add @radix-ui/react-select @radix-ui/react-tabs \
  @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-toast \
  @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch \
  @radix-ui/react-avatar @radix-ui/react-separator @radix-ui/react-accordion \
  @radix-ui/react-collapsible @radix-ui/react-label
pnpm --filter @srui/react add cmdk
```

### Select
- **File:** `components/Select.tsx` · **Wraps:** `@radix-ui/react-select`
- **Exports:** `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`,
  `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`
- **Props (SelectTrigger):** `React.ComponentPropsWithoutRef<typeof
  RadixSelect.Trigger>` — style with `surface bg-input/30`, same focus
  treatment as `Input`
- **DoD:** opens/closes on click and keyboard (Enter/Space/Arrow keys),
  `SelectContent` uses `bg-popover` + `surface` + `animate-scale-in`;
  docs page at `content/docs/components/select.mdx` published

### Combobox
- **File:** `components/Combobox.tsx` · **Wraps:** `cmdk` inside `Popover`
  (built below)
- **Props:**
  ```ts
  interface ComboboxOption { value: string; label: string }
  interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    emptyText?: string;
  }
  ```
- **DoD:** typing filters options client-side; arrow keys move selection;
  Enter commits; matches `Select`'s visual footprint (same trigger height);
  docs page at `content/docs/components/combobox.mdx` published

### Tabs
- **File:** `components/Tabs.tsx` · **Wraps:** `@radix-ui/react-tabs`
- **Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- **Props:** pass through Radix's own prop types for each part
- **DoD:** `TabsList` uses `bg-muted` with an animated active-tab
  indicator (`animate-fade-in` on content change); keyboard arrow-key
  navigation between triggers works; docs page at
  `content/docs/components/tabs.mdx` published

### Tooltip
- **File:** `components/Tooltip.tsx` · **Wraps:** `@radix-ui/react-tooltip`
- **Exports:** `TooltipProvider`, `Tooltip`, `TooltipTrigger`,
  `TooltipContent`
- **Props (TooltipContent):** add `sideOffset?: number` (default `6`)
- **DoD:** `TooltipContent` uses `bg-popover` + `surface`, appears after
  Radix's default delay, dismisses on Escape; docs page at
  `content/docs/components/tooltip.mdx` published

### Popover
- **File:** `components/Popover.tsx` · **Wraps:** `@radix-ui/react-popover`
- **Exports:** `Popover`, `PopoverTrigger`, `PopoverContent`,
  `PopoverAnchor`
- **DoD:** same visual treatment as `DialogContent` (`surface`, `bg-popover`,
  `animate-scale-in`) but non-modal (doesn't block page interaction); docs
  page at `content/docs/components/popover.mdx` published

### Toast
- **File:** `components/Toast.tsx` · **Wraps:** `@radix-ui/react-toast`
- **Exports:** `ToastProvider` (place once near the app root, alongside
  `UIProvider`), `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`,
  `ToastViewport`, plus a `useToast()` hook that returns a `toast(options)`
  function
- **Props:**
  ```ts
  interface ToastOptions {
    title: string;
    description?: string;
    variant?: "default" | "success" | "destructive";
    action?: { label: string; onClick: () => void };
  }
  ```
- **DoD:** calling `toast({...})` from any descendant of `ToastProvider`
  renders a dismissible, auto-expiring toast; `variant="destructive"` uses
  `bg-destructive`, `variant="success"` uses `bg-success`; docs page at
  `content/docs/components/toast.mdx` published

### Checkbox / RadioGroup / Switch
- **Files:** `components/Checkbox.tsx`, `components/RadioGroup.tsx`,
  `components/Switch.tsx` · **Wrap:** the three matching Radix packages
- **DoD for all three:** checked/selected state uses `bg-primary`;
  transition uses `duration-(--dur-fast)`; all three are usable with a
  plain `<label>` wrapping them for click-to-toggle; docs pages at
  `content/docs/components/checkbox.mdx`, `radio-group.mdx`, `switch.mdx`
  published

### Textarea, Label, FormField
- **Files:** `components/Textarea.tsx` (same pattern as `Input.tsx`,
  `invalid?: boolean` prop, `<textarea>` instead of `<input>`),
  `components/Label.tsx` (wraps `@radix-ui/react-label`),
  `components/FormField.tsx` (new, no Radix dependency)
- **FormField props:**
  ```ts
  interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    children: React.ReactNode; // the Input/Select/Textarea/etc.
  }
  ```
- **DoD:** `FormField` renders `Label` + `children` + either `error`
  (in `text-destructive`) or `hint` (in `text-muted-foreground`), never
  both; docs page at `content/docs/components/form-field.mdx` published
  (Textarea and Label can share that page or get their own — pick one and
  stay consistent for the rest of Phase 3)

### Avatar, Badge, Separator
- **Files:** `components/Avatar.tsx` (wraps `@radix-ui/react-avatar`,
  falls back to initials when the image fails to load),
  `components/Badge.tsx` (no Radix dependency; `variant: "default" |
  "secondary" | "destructive" | "outline" | "success" | "warning"`),
  `components/Separator.tsx` (wraps `@radix-ui/react-separator`)
- **DoD:** `Avatar`'s fallback initials render within 100ms of an image
  load failure (Radix handles this via `onLoadingStatusChange`); docs
  pages at `content/docs/components/avatar.mdx`, `badge.mdx`,
  `separator.mdx` published

### Accordion / Collapsible
- **Files:** `components/Accordion.tsx` (wraps
  `@radix-ui/react-accordion`), `components/Collapsible.tsx` (wraps
  `@radix-ui/react-collapsible`)
- **DoD:** expand/collapse animates height via `animate-grow-y` combined
  with Radix's `--radix-accordion-content-height` CSS variable (see Radix
  docs for the exact selector), respecting `motion-reduce`; docs page at
  `content/docs/components/accordion.mdx` published

### Phase 3 cross-cutting Definition of Done

- [ ] Every component above renders correctly in all four presets (spot
      check by toggling the demo's style switcher with each one visible)
- [ ] `:focus-visible` is legible on every interactive element when
      `data-style="neumorphic"` is active (this is the contrast risk case —
      see the gotcha table)
- [ ] Every new export is added to `packages/react/src/index.ts`
- [ ] Every component above has a published docs page and a sidebar entry
      under Components in `apps/docs`

---

## Phase 4 — Three-tier component API (discipline, not a milestone)

Every super-component built from Phase 5 onward must expose three tiers.
This section defines the pattern once; apply it to each component in
Phase 5 rather than re-deriving it per component.

```ts
// Tier 1 — props, covers the common case
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  sortable?: boolean;
  selectable?: boolean;
  pageSize?: number;
}

// Tier 2 — slots + per-part classNames, for layout/branding overrides
interface DataTableSlots<T> {
  toolbar?: React.ComponentType<{ table: TableInstance<T> }>;
  empty?: React.ReactNode;
}
interface DataTableClassNames {
  root?: string; header?: string; row?: string; cell?: string;
}
// added to DataTableProps as `slots?: DataTableSlots<T>` and
// `classNames?: DataTableClassNames`

// Tier 3 — headless hook, for full custom markup
function useDataTable<T>(config: {
  columns: ColumnDef<T>[];
  data: T[];
  sortable?: boolean;
}): TableInstance<T>;
```

**Definition of done for the pattern, applied per component:**
- [ ] Tier 1 alone reproduces every example in that component's section of
      Phase 5
- [ ] Tier 2's `classNames` keys match the actual DOM parts one-to-one
      (name them after the part, e.g. `header`/`row`/`cell`, not generic
      names like `wrapper1`)
- [ ] Tier 3's hook returns plain data/handlers with zero JSX — it must be
      usable to build a completely different visual layout than the
      Tier 1 component renders
- [ ] Each component's docs page (Phase 2.6 template) documents all three
      tiers, not just Tier 1

---

## Phase 5 — Super-components (~3–5 weeks)

Build in this order — each is independent of the others except where
noted. As in Phase 3, each entry below is only done once its docs page
(Phase 2.6 template, all three API tiers per Phase 4) is published.

### 1. AppShell
- **File:** `components/AppShell.tsx` · **No new dependency**
- **Props:**
  ```ts
  interface AppShellProps {
    sidebar: React.ReactNode;
    topbar?: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
  }
  ```
- **Behavior:** sidebar is fixed-width on desktop (`sidebar` token colors:
  `bg-sidebar`, `text-sidebar-foreground`), collapses into a
  `Dialog`-based drawer below a 768px breakpoint (reuse `Dialog` from
  Phase 0, don't build a second overlay system)
- **DoD:** resizing the viewport across 768px swaps sidebar↔drawer with no
  layout shift in the main content area; docs page at
  `content/docs/components/app-shell.mdx` published

### 2. DataTable
- **File:** `components/DataTable.tsx` · **Dependency:** `@tanstack/react-table`
- **Props:** see Phase 4's Tier 1 example, plus `onRowSelectionChange?:
  (rows: T[]) => void`
- **Behavior:** sort (click header), filter (per-column text input in the
  header row), paginate (`pageSize` prop + a footer with page controls
  using `Button`), select (checkbox column using `Checkbox` from Phase 3),
  column pinning (first/last column sticky via CSS `position: sticky`),
  virtualization for datasets over ~200 rows (`@tanstack/react-virtual`),
  CSV export (client-side, a `Button` that serializes visible columns)
- **DoD:** a 10,000-row dataset scrolls at 60fps (virtualization working);
  sort/filter/paginate compose correctly (filtering then sorting then
  paginating gives the same result as any other order); docs page at
  `content/docs/components/data-table.mdx` published

### 3. ChartCard
- **File:** `components/ChartCard.tsx` · **No new dependency** (wraps
  `Card` + `LineChart`/`BarChart` from Phase 0)
- **Props:**
  ```ts
  interface ChartCardProps {
    title: string;
    description?: string;
    chart: "line" | "bar";
    labels: string[];
    series: LineChartSeries[] | { values: number[] };
    timeRanges?: string[]; // e.g. ["7d", "30d", "90d"]
    onTimeRangeChange?: (range: string) => void;
    loading?: boolean;
  }
  ```
- **Behavior:** `loading` shows `LoadingOverlay` from Phase 0 over the
  chart area; `timeRanges` renders as a small button group in the header
  (reuse the demo's `StyleSwitcher` button-group pattern)
- **DoD:** switching `timeRanges` re-triggers the chart's draw-in
  animation (remount the chart, don't just update its data in place);
  docs page at `content/docs/components/chart-card.mdx` published

### 4. FormBuilder
- **File:** `components/FormBuilder.tsx` · **Dependencies:**
  `react-hook-form`, `@hookform/resolvers`, `zod`
- **Props:**
  ```ts
  interface FormBuilderProps<Schema extends z.ZodType> {
    schema: Schema;
    fields: FormFieldConfig[]; // { name, label, type: "text"|"email"|"select"|"checkbox"|..., options? }
    onSubmit: (values: z.infer<Schema>) => void | Promise<void>;
    submitLabel?: string;
  }
  ```
- **Behavior:** generates one `FormField` (Phase 3) per entry in `fields`,
  wired to `react-hook-form` + the Zod schema; shows field-level errors
  from Zod validation; disables the submit `Button` (via its `loading`
  prop) while `onSubmit` is pending
- **DoD:** submitting with an invalid field shows the Zod error message
  under that field without a page reload or console error; docs page at
  `content/docs/components/form-builder.mdx` published

### 5. CommandPalette, NotificationCenter, Wizard
- **CommandPalette** — `components/CommandPalette.tsx`, wraps `cmdk`
  inside `Dialog`; props: `commands: { label: string; onSelect: () =>
  void; shortcut?: string }[]`; opens on Cmd/Ctrl+K (register the listener
  inside the component, clean up on unmount); docs page at
  `content/docs/components/command-palette.mdx`
- **NotificationCenter** — `components/NotificationCenter.tsx`, a
  `Popover` (Phase 3) containing a scrollable list of items rendered with
  `Card`; props: `notifications: { id: string; title: string; read: boolean;
  timestamp: Date }[]`, `onMarkRead: (id: string) => void`; docs page at
  `content/docs/components/notification-center.mdx`
- **Wizard** — `components/Wizard.tsx`, multi-step form shell; props:
  `steps: { label: string; content: React.ReactNode }[]`, `onComplete: ()
  => void`; renders a step indicator (reuse `Badge` for step numbers) and
  Next/Back `Button`s; docs page at `content/docs/components/wizard.mdx`

### Additional charts (build alongside ChartCard)
- **Donut/gauge** — new file `components/chart/DonutChart.tsx`; animate
  `stroke-dashoffset` the same way `LineChart` animates its path — see the
  `pathLength={1}` technique already implemented there
- **Sparkline** — `components/chart/Sparkline.tsx`; a minimal `LineChart`
  variant with no axes/gridlines/labels, sized for inline use in a table
  cell or `StatCard`
- **Multi-series Area** — extend `LineChart.tsx` with an optional `area?:
  boolean` prop that fills under the path using the same `d3-shape` import
  (add `area` from `d3-shape` alongside the existing `line` import)
- Document all three on the existing `content/docs/components/charts.mdx`
  page rather than creating new pages

---

## Phase 6 — Accessibility and motion hardening (ongoing, gate before 1.0)

### 6.1 Automated checks
```bash
pnpm add -D -w @axe-core/playwright
```
- **New file:** `packages/react/tests/a11y.spec.ts` — for every component
  in `src/components/`, render it in a Playwright page under each of the
  four `data-style` values and run `axe` against it
- **DoD:** zero axe violations of "serious" or "critical" impact across
  all components × all four presets

### 6.2 Manual contrast check
- Check every text/background pairing in the token reference table above
  against WCAG AA (4.5:1 for normal text, 3:1 for large text) — neumorphic
  and glass are the risk cases because their `--card`/`--background` values
  are close to each other by design
- **DoD:** a written note in `packages/react/ACCESSIBILITY.md` listing the
  contrast ratio for each preset's `--foreground` on `--background` and
  `--card-foreground` on `--card`

### 6.3 Motion and transparency preferences
- **DoD, checked per component:**
  - [ ] Every `animate-*` class usage is paired with a `motion-reduce:`
        override (either `motion-reduce:animate-none` or
        `motion-reduce:transition-none`)
  - [ ] `presets/glass.css` has a `@media (prefers-reduced-transparency:
        reduce)` block (already present — confirm it still applies after
        any glass-preset edits)
  - [ ] Test with OS-level "reduce motion" and "reduce transparency"
        settings enabled, not just by reading the CSS

### 6.4 Keyboard and screen reader pass
- **DoD:** for `Dialog`, `Select`, `Combobox`, `Tabs`, `Toast`,
  `DataTable`, and `CommandPalette` — complete the component's primary
  task using only the keyboard, then again with a screen reader (VoiceOver
  or NVDA) enabled, and confirm announced state changes make sense
- **DoD:** the Accessibility section of each component's docs page (Phase
  2.6 template) is filled in with the findings from this phase, not left
  as a placeholder

---

## Phase 7 — Visual regression, Storybook, and AI-discoverability (~1–2 weeks, can overlap Phase 5)

### 7.1 Visual regression
```bash
pnpm add -D -w @playwright/test
pnpm exec playwright install
```
- **New file:** `packages/react/tests/visual.spec.ts` — screenshot every
  component in `apps/docs`'s live previews, once per preset (4 screenshots
  per component minimum)
- **DoD:** CI fails on any pixel diff above a defined threshold (start at
  0.1%) against the committed baseline screenshots

### 7.2 Storybook (optional but recommended)
```bash
pnpm dlx storybook@latest init --type react-vite
```
- **DoD:** each component in Phase 3/5 has a `.stories.tsx` file with one
  story per meaningful prop combination

### 7.3 AI-discoverability
- **New file:** `packages/react/llms.txt` — plain-text list of every
  exported component, its prop interface, and a one-line usage example
- **DoD:** the file is kept in sync manually for now; consider generating
  it from `src/index.ts` + TSDoc comments, or from the `apps/docs` MDX
  content directly, once the API stabilizes

---

## Phase 8 — Blocks and polish (later, optional)

- [ ] Ready-made pages per preset: Dashboard (`AppShell` + `DataTable` +
      `ChartCard` + `StatCard`), Auth (`FormBuilder`), Settings
      (`FormBuilder` + `Tabs`), Pricing (`Card` grid) — published as
      additional pages under `apps/docs/content/docs/blocks/`
- [ ] Theme builder: expand the Phase 2.4 token playground into a full
      page with color pickers bound to the `--primary`/`--radius`/density
      tokens, exporting the resulting CSS block
- [ ] RTL: add `dir="rtl"` testing to the Phase 7 visual regression suite;
      audit any component using `left`/`right` instead of logical
      properties (`inline-start`/`inline-end`)
- [ ] i18n: no component should hardcode user-facing strings; audit
      `LoadingOverlay`'s default `label`, `Combobox`'s default
      `emptyText`, etc. — make them required or clearly documented as
      English defaults meant to be overridden
- [ ] Framework templates: a minimal working example per bundler/framework
      the library is meant to support (Vite is the only one documented as
      of Phase 2 — add others here only once they're actually verified) in
      `examples/`, each importing `@srui/react` from the registry (not via
      `workspace:*`); link them from the Installation page (Phase 2.3)

---

## Standing technical decisions (reference — do not deviate without updating this table)

| Decision | Choice | Why |
|---|---|---|
| Name | `srui` (Supercomponent React UI), package `@srui/react` | — |
| Distribution | npm package (not copy-in CLI) | Super-components are the product; consumers shouldn't need to edit source |
| Token naming | shadcn/ui convention (`background`, `card`, `primary`, `muted`, …) | Familiar mental model, portable themes |
| Token values / presets | Ours | The four-preset system is the differentiator |
| Interaction primitives | Radix, wrapped (never re-exported directly) | Don't reimplement focus management and keyboard handling; the wrapper lets the underlying library be swapped later without a breaking change |
| Charts | Hand-rolled SVG on `d3-scale`/`d3-shape` | Full control over preset-specific styling and animation |
| Styling engine | `tailwind-variants` (slots) + `tailwind-merge` | Slots map onto the Tier 2 API; merge avoids class-order bugs |
| CSS structure | `surface` utility never sets `background-color` | Stays composable with `bg-primary`/`bg-card`/etc. regardless of stylesheet output order |
| Focus rings | `outline-*`, never `ring-*` | Tailwind's `ring-*` utilities use `box-shadow`, which would collide with preset surface shadows |
| Forms | `react-hook-form` + `zod` | Matches `FormBuilder`'s schema-driven design |
| Tables | `@tanstack/react-table` + `@tanstack/react-virtual` | Headless, matches the three-tier API pattern |
| Docs site | Vite + React + React Router + `vite-react-ssg`, in `apps/docs`; MDX via `@mdx-js/rollup`; no Next.js | Stays "just React," matches the ui.shadcn.com/docs shape without adopting a server framework; see `docs-site-tech-stack-plan.md` for the option comparison |
| Docs site UI | Built from `@srui/react` itself (dogfooding) | The site doubles as a live, production showcase of the library it documents |

## Known gotchas (checked in relevant Definitions of Done above, listed together for reference)

- **Neumorphism's `--card` must equal `--background`.** Any drift breaks
  the "extruded from the page" illusion.
- **Glass needs contrast behind it.** Reads badly over a flat single-color
  background; cap nested glass surfaces around 2, since `backdrop-filter`
  isn't free.
- **`transform-box: fill-box` is required on animated SVG bars/paths.**
  Without it, `scaleY`/`scaleX` animate from the SVG viewport's origin, not
  the shape's own edge.
- **Every animation needs a `motion-safe:`/`motion-reduce:` pair.** The
  `pathLength={1}` trick specifically needs the initial
  `stroke-dashoffset` scoped to `motion-safe:`, or reduced-motion users see
  a line stuck mid-draw.
- **Tailwind v4 skips `node_modules` by default.** Consumers need an
  explicit `@source` pointing at the package's `dist/` folder (see 1.3).
- **If you ever rename `@srui/react` itself, pnpm's workspace symlinks go
  stale** and produce "Failed to resolve entry for package" — delete
  `node_modules` and `pnpm-lock.yaml`, then `pnpm install` again.
- **Radix packages must be wrapped, never re-exported.** Re-exporting
  `@radix-ui/react-dialog` directly from `@srui/react` would make swapping
  the underlying primitives library later a breaking change for every
  consumer.
- **A single `data-style` on `<html>` styles the whole page, not one
  element.** `apps/docs`'s `<PresetGrid>` (Phase 2.2) needs several
  presets visible at once, side by side — scope `data-style` to each
  grid cell's own wrapper rather than relying on the page-level attribute
  `UIProvider` sets.

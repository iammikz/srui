# @iammikz/srui

## 1.1.0

### Minor Changes

- a92e86b: DataTable: replace the per-column filter row with one global search input above the columns (case-insensitive, matches any column), and add a rows-per-page selector next to the paginated footer's Prev/Next buttons. The headless `useDataTable()` now wires `globalFilter` with `includesString`.

  Docs Theme Builder: derive contrasting `*-foreground` tokens for every picked palette color (light picks like `#f4f4f5` get `oklch(35% 0 0)` text), and the preview background now follows the page's light/dark scheme — the generated CSS emits the derived foregrounds plus a `.dark` background override.

## 1.0.1

### Patch Changes

- 571921b: Add the package README shown on npm — install steps, the Tailwind v4 setup (CSS imports + `@source`), `UIProvider` + no-flash-script quick start, preset reference table, component inventory, and the precompiled CSS fallback.

## 1.0.0

### Major Changes

- version 0.1

## 0.1.0

### Minor Changes

- Initial 0.1.0 release: four runtime-switchable presets (flat, glass, neumorphic, skeuomorphic) on shadcn-style Tailwind v4 tokens; UIProvider/useUIStyle/noFlashScript; Button, Card, Input, Dialog, Loader family (Spinner, DotsLoader, Skeleton, LoadingOverlay), StatCard, LineChart, BarChart; precompiled CSS fallback (`@iammikz/srui/styles.css`).

# @iammikz/srui

**srui** — Supercomponent React UI. A React component library for
Tailwind CSS v4 with **four runtime-switchable visual presets** (flat,
glass, neumorphic, skeuomorphic), shadcn-style design tokens, animated
charts and loaders, and super-components with a three-tier API.

Distributed as an npm package — components are the product. You install
them and style them with tokens; you never edit their source.

## Requirements

- React 18 or 19
- Tailwind CSS v4 (or use the [precompiled CSS fallback](#not-using-tailwind-precompiled-css) with no Tailwind at all)

## Install

```bash
pnpm add @iammikz/srui
# npm install @iammikz/srui
# yarn add @iammikz/srui
```

## Setup (Tailwind v4)

**1. Import the styles** in your global CSS entry. Add the token contract,
the animations, and every preset you want available:

```css
@import "tailwindcss";
@import "@iammikz/srui/theme.css";
@import "@iammikz/srui/animations.css";
@import "@iammikz/srui/presets/flat.css";
@import "@iammikz/srui/presets/glass.css";
@import "@iammikz/srui/presets/neumorphic.css";
@import "@iammikz/srui/presets/skeuomorphic.css";
@source "../node_modules/@iammikz/srui/dist";
```

The `@source` line is required: Tailwind v4 skips `node_modules` by
default, and the utilities srui's components rely on
(`bg-primary`, `surface`, …) live in the package's `dist/`.

**2. Wrap your app** in `UIProvider` — it owns the active preset
(`data-style` on `<html>`) and the color scheme (the `dark` class), and
persists both to `localStorage`:

```tsx
import { UIProvider } from "@iammikz/srui";

createRoot(document.getElementById("root")!).render(
  <UIProvider>
    <App />
  </UIProvider>,
);
```

**3. Avoid the theme flash** — inline this script (the return value of the
library's `noFlashScript()`) in your `index.html` `<head>`, before any
stylesheet:

```js
(function(){try{var s=localStorage.getItem('srui-style');var c=localStorage.getItem('srui-scheme');var sv=(s==='glass'||s==='neumorphic'||s==='skeuomorphic'||s==='flat')?s:'flat';var cv=(c==='light'||c==='dark'||c==='system')?c:'system';var dark=cv==='dark'||(cv==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.setAttribute('data-style',sv);e.classList.toggle('dark',dark);e.style.colorScheme=dark?'dark':'light';}catch(err){}})();
```

**4. Done.** Flip presets at runtime:

```tsx
import { useUIStyle } from "@iammikz/srui";

function StyleSwitcher() {
  const { style, setStyle } = useUIStyle();
  return <Button onClick={() => setStyle("glass")}>glass ({style})</Button>;
}
```

The switch is pure CSS variable cascading — no reload, no remount.

## The four presets

| `data-style` | Look | Notes |
|---|---|---|
| `flat` | Minimal, border-driven, barely-there shadows | default |
| `glass` | Translucent surfaces over a blurred, colorful backdrop | needs contrast behind it; cap nested glass ~2 |
| `neumorphic` | Soft extruded shapes on one base tone | `--card` equals `--background` by design |
| `skeuomorphic` | Paper base, glossy gradients, beveled edges | the gloss comes from the surface recipe |

(Switch with `setStyle(...)` from `useUIStyle()`, or set the attribute
yourself anywhere you want a preset scoped to a subtree.)

## Components

- **Primitives** — Button, Card, Input, Textarea, Label, FormField,
  Select, Combobox, Tabs, Tooltip, Popover, Toast (+ `useToast`), Dialog,
  Checkbox, RadioGroup, Switch, Avatar, Badge, Separator, Accordion,
  Collapsible
- **Charts** (hand-rolled SVG on d3-scale/d3-shape, animated draw-in) —
  LineChart (multi-series + area), BarChart, DonutChart, Sparkline
- **Loaders** — Spinner, DotsLoader, Skeleton, LoadingOverlay
  (delay + min-display logic built in)
- **Super-components** (each with a three-tier API: props / slots +
  classNames / headless hook) — AppShell, DataTable (sort, filter,
  paginate, select, pin, CSV export, 10k-row virtualization), ChartCard,
  FormBuilder (react-hook-form + Zod), CommandPalette (⌘K),
  NotificationCenter, Wizard, StatCard

Behavior primitives are Radix, wrapped — never re-exported — so the
underlying library can be swapped later without a breaking change.

## Theming

Everything routes through shadcn-style CSS custom properties
(`--background`, `--card`, `--primary`, `--muted`, `--destructive`,
`--success`, `--warning`, `--info`, plus surface-recipe, motion, and
radius tokens). Override any token after the imports:

```css
:root {
  --primary: oklch(0.55 0.18 295);
  --radius: 0.75rem;
}
```

## Not using Tailwind? (precompiled CSS)

```css
@import "@iammikz/srui/styles.css";
```

One file — tokens, presets, and every utility the components use,
compiled with `prefix(srui)` so it can't collide with your own classes.
Skip the `@source` line entirely in this setup.

## Accessibility

Focus rings via `outline-*` (never `ring-*`, which would collide with
preset shadows), WCAG-AA-checked token contrast for all four presets
(both light and dark), every animation gated behind `motion-safe:`, and
full keyboard behavior from the wrapped Radix primitives. See
`ACCESSIBILITY.md` in the package for the measured contrast matrix.

## License

MIT

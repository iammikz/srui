# srui accessibility notes

This file records the Phase 6 (accessibility and motion hardening) state of
`@iammikz/srui`. Regenerate the contrast numbers with
`node scripts/contrast-check.mjs` from `packages/react`.

## 6.1 Automated axe checks

`packages/react/tests/a11y.spec.ts` renders every component (the demo app
mounts all of them, one section per component family) under each of the
four `data-style` values and runs axe-core against each section.

**Result: zero axe violations of "serious" or "critical" impact across all
components × all four presets.** (16/16 tests green, including the reduced
motion and keyboard suites below.)

## 6.2 Contrast ratios (WCAG AA, 4.5:1 for normal text)

Computed from the actual token values by `scripts/contrast-check.mjs`
(oklch → sRGB → relative luminance; translucent surfaces composited over
the preset's page background). Full matrix: 104 pairs, all ≥ 4.5:1.

| Preset | Mode | `--foreground` on `--background` | `--card-foreground` on `--card` |
|---|---|---|---|
| flat | light | 19.79:1 | 19.79:1 |
| flat | dark | 18.96:1 | 17.16:1 |
| glass | light | 15.65:1 | 8.98:1 |
| glass | dark | 15.91:1 | 15.34:1 |
| neumorphic | light | 10.33:1 | 10.33:1 (identical values — by design, see below) |
| neumorphic | dark | 12.04:1 | 12.04:1 |
| skeuomorphic | light | 11.71:1 | 13.63:1 |
| skeuomorphic | dark | 12.37:1 | 10.65:1 |

Neumorphic and glass were the risk cases called out in the plan:

- **Neumorphic**: `--card` equals `--background` in both modes (the
  "extruded from the page" illusion), so card text sits on the page color —
  the ratio is identical by construction and comfortably above AA.
- **Glass**: translucent cards composite over the page background; the
  effective blend keeps `--card-foreground` at 8.98:1 (light) / 15.34:1
  (dark). The glass preset also ships a
  `@media (prefers-reduced-transparency: reduce)` block that replaces the
  translucent surfaces with near-opaque ones.

Notes on the risk pairs that required token tuning (all now ≥ 4.5:1):

- `--muted-foreground` on `--muted` (tab strips, avatar fallbacks, time
  range groups): tuned per preset.
- `--destructive`: in dark modes it is a mid-light red paired with a
  near-black `--destructive-foreground` (both directions ≥ 4.5:1); in light
  modes it is dark enough to double as text color on `--background`.
- Colored text directly on `--muted` (e.g. the old StatCard delta style) is
  **not a supported pattern** — use the solid chip treatment
  (`bg-success text-success-foreground` / `bg-destructive
  text-destructive-foreground`) instead, which the components now do.

## 6.3 Motion and transparency preferences

- Every `animate-*` usage in the library is written as
  `motion-safe:animate-*` (or paired with a `motion-reduce:transition-none`
  override, e.g. Accordion heights), and animations specify their **end
  state as the underlying value** — so under reduced motion nothing is left
  stuck mid-draw. The automated check (part of the a11y suite) verifies
  with `prefers-reduced-motion: reduce` emulated that no animations run and
  chart paths render fully drawn (`stroke-dashoffset: 0`) in all four
  presets.
- `presets/glass.css` contains the
  `@media (prefers-reduced-transparency: reduce)` block (blur off, surface
  image off, near-opaque cards/popovers, body gradient removed); it has
  survived all preset edits and is covered by the contrast script's
  compositing math.
- OS-level spot check: performed via Playwright emulation of
  `reducedMotion: reduce` (see `tests/a11y.spec.ts`). Real OS-level
  "reduce transparency" toggling should additionally be spot-checked on
  macOS/Windows before a 1.0 release — noted as a manual follow-up.

## 6.4 Keyboard and screen reader pass

Keyboard coverage is automated in `tests/a11y.spec.ts` for **Dialog**
(Enter opens, Escape closes), **Select** (type-ahead + Enter commits),
**Combobox** (type to filter, Enter commits), **Tabs** (arrow keys move
between triggers), **Toast** (keyboard-triggered, `role=status`
announcement), **DataTable** (header sort via Enter on the sort button,
`aria-sort` maintained), and **CommandPalette** (Ctrl+K opens, input
focused, Enter runs the filtered command and closes).

Screen reader pass: the components' ARIA wiring comes from Radix
(labelled dialogs, combobox pattern, tablist pattern, switch/checkbox
roles) plus srui additions (`aria-live` row counts and loading status,
`aria-current` breadcrumbs and wizard steps, per-item mark-read labels).
A full manual VoiceOver/NVDA walkthrough remains a human step before the
1.0 gate — the per-component Accessibility sections of the docs site
(`apps/docs/content/docs/components/*.mdx`) document the expected
announcements to verify against.

## Known limitations

- The axe suite runs in light mode; dark mode uses the same DOM/ARIA
  structures and is covered by the token contrast matrix above.
- `prefers-reduced-transparency` cannot be emulated in Chromium today;
  its CSS block is verified structurally and by the contrast math instead.

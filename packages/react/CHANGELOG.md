# @iammikz/srui

## 1.5.0

### Minor Changes

- ba7104c: Seven shadcn-parity medium builds. `Field` wires form fields through context — label, description and error register themselves and `FieldControl` injects `id`/`aria-describedby`/`aria-invalid` into any control. `Command` exports the raw cmdk primitives (input/list/empty/group/item/shortcut/separator/dialog) that were previously locked inside CommandPalette. `InputOTP` adds a verification-code input (input-otp), `Carousel` an embla-powered carousel with auto-disabling arrow controls, `Resizable` panel layouts (react-resizable-panels v4), and `Menubar` the desktop menu-bar family with the full DropdownMenu item API. `ToastProvider` gains a `position` prop, `useToast()` returns `dismiss`/`update` alongside `toast()` (which now returns an id), and toasts accept per-instance `duration` and `onDismiss`. One type rename: `CommandPalette`'s exported `CommandItem` type is now `CommandPaletteItem` — `CommandItem` is the Command primitive component.
- ba7104c: Eleven new shadcn-parity primitives: `Table` (plain styled table parts), `Toggle` and `ToggleGroup` (Radix), `HoverCard` (Radix), `ContextMenu` (right-click menu mirroring DropdownMenu's surface and item API, including checkbox/radio/submenu parts), `Kbd`, `AspectRatio`, `ButtonGroup` (joined buttons with merged corners, horizontal or vertical), `NativeSelect` (SSR-safe styled `<select>` with size/invalid props), `Empty` (empty-state layout with media/title/description/action slots), and `Item` (list-row layout with media/content/end slots). All exported from the package root with docs pages, stories, and demo-app coverage.
- ba7104c: The strategic layer. `LineChart` and `BarChart` gain an interactive tooltip layer (`tooltip?: boolean`, on by default): hovering shows a guide line with per-series dots (lines) or a band highlight (bars) plus a value bubble, and focusing the chart enables ←/→/Home/End inspection — the hand-rolled charts now cover shadcn Chart's core interactive feature without adopting recharts. `ChartTooltip` is exported for custom chart compositions, and `DirectionProvider` (Radix) lands as the RTL building block. Deliberate non-goals recorded in the docs: `AppShell` remains srui's answer to shadcn's Sidebar (no parallel component family), and charts stay hand-rolled SVG rather than wrapping recharts.
- ba7104c: shadcn-parity polish across the primitives. `Button`, `BreadcrumbLink` and `PaginationLink` gain `asChild` (render a router `<Link>`/anchor with the component styling — the Button spinner is skipped in that mode). `Alert` gains `AlertTitle`/`AlertDescription` subcomponents alongside the existing `title`-prop shorthand. `Popover` exports `PopoverClose`; `Select` exports `SelectItemText` and the scroll buttons, and `SelectTrigger` gains `size="sm"|"default"|"lg"` plus `invalid`. `Tooltip` now opens instantly by default (`delayDuration={0}`, overridable). `Input` styles `type="file"`. Invalid/error states (`aria-invalid` + destructive styling) land on `Checkbox` (which also renders a proper minus for `checked="indeterminate"`), `RadioGroup`, `Switch`, `Label`, `Combobox`, `TagInput` and `SelectTrigger`, matching the existing `Input`/`Textarea` pattern. `AccordionTrigger` can override or hide its chevron via `icon`, and `BreadcrumbSeparator`/`BreadcrumbEllipsis` accept children to replace the default icons.

## 1.4.0

### Minor Changes

- DataTable gains server-side (manual) pagination, matching TanStack Table semantics: pass `manualPagination` with `rowCount` (or `pageCount` when the API only knows pages) and keep `data` as just the current page — refetch in `onPaginationChange`, which fires with the resolved `{ pageIndex, pageSize }` on Prev/Next and rows-per-page changes. `pagination` optionally makes the state controlled. The footer, toolbar row count, and page math all follow the server's totals; `autoResetPageIndex` is disabled in manual mode so freshly fetched pages don't snap back to page 1.

### Patch Changes

- fef0403: Fix the AppShell mobile navigation drawer not scrolling — the drawer's DialogContent kept its grid display with an auto-height row, so the sidebar column never got a height constraint and the nav's `overflow-y-auto` never engaged; long menus overflowed past the screen. The drawer is now a height-constrained flex column with `overflow-hidden`, so the nav scrolls inside the viewport.

## 1.3.1

### Patch Changes

- 1f41beb: Fix ScrollArea not scrolling — the component was a bare Radix Root re-export without the required Viewport, so content overflowed its box instead of scrolling. It now composes the viewport internally (content drops straight in), mounts themed scrollbars via a new `orientation` prop (`"vertical"` default, `"horizontal"`, `"both"`; thumbs reveal on hover), and the viewport is tabbable so keyboard users can scroll it.
- 656e507: Fix TimePicker/TimeRangePicker/DatePicker time-panel options rendering empty — the column option buttons were missing their labels, so times were invisible in the panel. Selection, keyboard map, and values were unaffected; only the option text was gone.
- 0f1e4bb: Fix StatCard collapsing to content width in flex rows — the card now fills its slot (`w-full`), so tiles stay equal-sized regardless of value length (a 1–2 digit value no longer renders a narrow card). Grid layouts are unaffected.

## 1.3.0

### Minor Changes

- a2d72fd: Add value-input components:

  - **Slider** — Radix Slider wrapper: single values or two-thumb spans, `min`/`max`/`step`, `invalid` treatment, and track/thumb/range class+style escape hatches (gradient tracks).
  - **ColorPicker** — swatch trigger over an anchored color panel: saturation/value square (pointer + arrow keys), hue slider, optional `alpha` slider, hex field with typed commit (`f09`, `#FF6600`, `rgba(37,99,235,.8)` all parse), preset swatches, and the screen eyedropper where the browser supports it. Values are normalized hex keys — `#RRGGBB`, or `#RRGGBBAA` with `alpha`.
  - New `lib/color` helpers (`hexToRgb`, `rgbToHsv`, `hsvToHex`, `parseColorInput`, `toCssString`, …) exported from the package root.

## 1.2.0

### Minor Changes

- d3ca815: Add the date/time picker family and twelve missing primitives (parity with the PRUI component set):

  - **Calendar** — month-grid engine with grid semantics, arrows/Home/End/PageUp/PageDown, `disabledDates`, `weekStartsOn`, range overlay.
  - **DatePicker** — text trigger over an anchored calendar; typed input commits; optional built-in time panel (`timepicker`, `seconds`, `minuteStep`, `hour12`); clear button, custom `format`, `name` hidden input.
  - **DateRangePicker** — anchor/complete/restart range selection on one calendar; `maxRange` span caps (`'90d'|'12w'|'3m'|'1y'` or days); preset chips; live `onChange`; hover preview; from/to time panels.
  - **TimePicker / TimePanel** — column listboxes (hour/minute/second/AM-PM), stepped minutes, min/max windows, typed-input parsing; wire format `HH:mm(:ss)`.
  - **TimeRangePicker** — from/to column pairs; the To panel constrains itself after From so inverted spans are unbuildable.
  - **DropdownMenu** — Radix menu family with `destructive` item variant, shortcuts, submenus, checkbox/radio items.
  - **Alert** — inline callout, four tones, dismiss button, icon override.
  - **Progress** — determinate/indeterminate bar, `role="progressbar"`, tones, value readout.
  - **Sheet / Drawer / Modal** — edge-anchored panel, bottom sheet with pointer drag-to-dismiss, and the one-prop confirm dialog.
  - **TagInput** — chips field with delimiters, `maxTags`, `validate`, `addOnBlur`.
  - **ScrollArea** — themed cross-browser scrollbars (Radix).
  - **FileUpload** — keyboard-accessible dropzone + managed list with type/size/count rejection reasons.
  - **Breadcrumb** — nav+ol trail primitives with `aria-current` page and a DropdownMenu-composable ellipsis.
  - **AlertDialog / ConfirmDialog** — interruption-level confirms on Radix alert-dialog: `role="alertdialog"`, focus trapped, no overlay/Escape dismissal; ConfirmDialog is the one-prop form with `tone="destructive"`.
  - **Pagination** — standalone page navigation (`nav` + list semantics, `aria-current`, prev/next) plus the `usePaginationRange(page, totalPages, siblings?)` ellipsis-window hook.
  - **TreeView** — single-select tree with full tree semantics and arrow-key map.
  - **Timeline** — activity feed with tone markers and timestamp slot.
  - New `lib/date` helpers (`toDateKey`, `addDays`, `parseTimeInput`, …) exported from the package root; new slide-in and indeterminate-progress animations.

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

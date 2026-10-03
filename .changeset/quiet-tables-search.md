---
"@iammikz/srui": minor
---

DataTable: replace the per-column filter row with one global search input above the columns (case-insensitive, matches any column), and add a rows-per-page selector next to the paginated footer's Prev/Next buttons. The headless `useDataTable()` now wires `globalFilter` with `includesString`.

Docs Theme Builder: derive contrasting `*-foreground` tokens for every picked palette color (light picks like `#f4f4f5` get `oklch(35% 0 0)` text), and the preview background now follows the page's light/dark scheme — the generated CSS emits the derived foregrounds plus a `.dark` background override.

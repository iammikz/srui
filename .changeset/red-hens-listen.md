---
"@iammikz/srui": minor
---

The strategic layer. `LineChart` and `BarChart` gain an interactive tooltip layer (`tooltip?: boolean`, on by default): hovering shows a guide line with per-series dots (lines) or a band highlight (bars) plus a value bubble, and focusing the chart enables ←/→/Home/End inspection — the hand-rolled charts now cover shadcn Chart's core interactive feature without adopting recharts. `ChartTooltip` is exported for custom chart compositions, and `DirectionProvider` (Radix) lands as the RTL building block. Deliberate non-goals recorded in the docs: `AppShell` remains srui's answer to shadcn's Sidebar (no parallel component family), and charts stay hand-rolled SVG rather than wrapping recharts.

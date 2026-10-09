---
"@iammikz/srui": minor
---

Closes the last three stragglers from the shadcn gap report. `NavigationMenu` adds the header-navigation family (trigger/content/link/indicator + shared animated viewport) over Radix NavigationMenu. `InputGroup` composes inputs with leading/trailing add-ons — the group owns the border and focus-within ring, with transparent input/textarea parts and flush stretch-height buttons. `Typography` maps styled semantic text variants (h1–h4, p, lead, large, small, muted, blockquote, ul, code, inlineCode) onto the design tokens with `asChild` support. Also adds a `test:visual:update` root script so visual baselines can be regenerated without the pnpm `--` forwarding pitfall.

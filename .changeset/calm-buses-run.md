---
"@iammikz/srui": patch
---

Fix the AppShell mobile navigation drawer not scrolling — the drawer's DialogContent kept its grid display with an auto-height row, so the sidebar column never got a height constraint and the nav's `overflow-y-auto` never engaged; long menus overflowed past the screen. The drawer is now a height-constrained flex column with `overflow-hidden`, so the nav scrolls inside the viewport.

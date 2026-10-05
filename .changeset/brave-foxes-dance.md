---
"@iammikz/srui": patch
---

Fix ScrollArea not scrolling — the component was a bare Radix Root re-export without the required Viewport, so content overflowed its box instead of scrolling. It now composes the viewport internally (content drops straight in), mounts themed scrollbars via a new `orientation` prop (`"vertical"` default, `"horizontal"`, `"both"`; thumbs reveal on hover), and the viewport is tabbable so keyboard users can scroll it.

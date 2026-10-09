---
"@iammikz/srui": minor
---

Completes the parity roadmap. Chat building blocks: `Bubble` (sent/received variants with avatar slot), `Message` (row with avatar/name/time and a hover action row), `MessageScroller` (stick-to-bottom transcript that follows new content only while scrolled to the bottom), and `Attachment` (file/image chip with size and upload progress). `DataTable` gains server-side sorting and filtering — `manualSorting` with controlled `sorting`/`onSortingChange` (`[{ id, desc }]`) and `manualFiltering` with `globalFilter`/`onGlobalFilterChange` follow the same pattern as manual pagination, completing the TanStack manual-mode story. The docs date/time demos now render from a fixed reference date so visual baselines stop changing every day.

---
"@iammikz/srui": minor
---

Add the date/time picker family and twelve missing primitives (parity with the PRUI component set):

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

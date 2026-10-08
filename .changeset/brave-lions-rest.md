---
"@iammikz/srui": minor
---

Seven shadcn-parity medium builds. `Field` wires form fields through context — label, description and error register themselves and `FieldControl` injects `id`/`aria-describedby`/`aria-invalid` into any control. `Command` exports the raw cmdk primitives (input/list/empty/group/item/shortcut/separator/dialog) that were previously locked inside CommandPalette. `InputOTP` adds a verification-code input (input-otp), `Carousel` an embla-powered carousel with auto-disabling arrow controls, `Resizable` panel layouts (react-resizable-panels v4), and `Menubar` the desktop menu-bar family with the full DropdownMenu item API. `ToastProvider` gains a `position` prop, `useToast()` returns `dismiss`/`update` alongside `toast()` (which now returns an id), and toasts accept per-instance `duration` and `onDismiss`. One type rename: `CommandPalette`'s exported `CommandItem` type is now `CommandPaletteItem` — `CommandItem` is the Command primitive component.

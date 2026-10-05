---
"@iammikz/srui": patch
---

Fix StatCard collapsing to content width in flex rows — the card now fills its slot (`w-full`), so tiles stay equal-sized regardless of value length (a 1–2 digit value no longer renders a narrow card). Grid layouts are unaffected.

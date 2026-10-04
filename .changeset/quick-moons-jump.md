---
"@iammikz/srui": minor
---

Add value-input components:

- **Slider** — Radix Slider wrapper: single values or two-thumb spans, `min`/`max`/`step`, `invalid` treatment, and track/thumb/range class+style escape hatches (gradient tracks).
- **ColorPicker** — swatch trigger over an anchored color panel: saturation/value square (pointer + arrow keys), hue slider, optional `alpha` slider, hex field with typed commit (`f09`, `#FF6600`, `rgba(37,99,235,.8)` all parse), preset swatches, and the screen eyedropper where the browser supports it. Values are normalized hex keys — `#RRGGBB`, or `#RRGGBBAA` with `alpha`.
- New `lib/color` helpers (`hexToRgb`, `rgbToHsv`, `hsvToHex`, `parseColorInput`, `toCssString`, …) exported from the package root.

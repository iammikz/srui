/**
 * Wire-format color helpers — pure string math, no color library.
 *
 * Conventions (matching the picker family's string-value philosophy):
 * - HexKey: `'#RRGGBB'` (opaque), or `'#RRGGBBAA'` when the picker carries
 *   alpha. Always normalized to uppercase with the leading `#`.
 * - HSV is the interaction model: h ∈ [0,360), s/v ∈ [0,100].
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
  /** 0–1; omitted means fully opaque. */
  a?: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function isValidHexColor(hex: string): boolean {
  return HEX_RE.test(hex);
}

const clamp255 = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

function byteToHex(n: number): string {
  return clamp255(n).toString(16).padStart(2, "0").toUpperCase();
}

export function rgbToHex({ r, g, b, a }: RGB): string {
  const base = `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;
  return a === undefined || a >= 1 ? base : `${base}${byteToHex(a * 255)}`;
}

export function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "");
  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : undefined;
  if ([r, g, b].some(Number.isNaN)) return { r: 0, g: 0, b: 0 };
  return a === undefined ? { r, g, b } : { r, g, b, a };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = 60 * (((gg - bb) / d) % 6);
    else if (max === gg) h = 60 * ((bb - rr) / d + 2);
    else h = 60 * ((rr - gg) / d + 4);
  }
  if (h < 0) h += 360;
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const hh = ((h % 360) + 360) % 360;
  const c = (v / 100) * (s / 100);
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = v / 100 - c;
  const seg = Math.floor(hh / 60) % 6;
  const table: Array<[number, number, number]> = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ];
  const [r1, g1, b1] = table[seg];
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function hsvToHex(hsv: HSV, alpha?: number): string {
  return rgbToHex(alpha === undefined || alpha >= 1 ? hsvToRgb(hsv) : { ...hsvToRgb(hsv), a: alpha });
}

export function hexToHsv(hex: string): HSV {
  return rgbToHsv(hexToRgb(hex));
}

/** `'#RRGGBBAA'` → `rgba(37, 99, 235, 0.8)`; opaque → `#RRGGBB`. */
export function toCssString(hex: string): string {
  const { r, g, b, a } = hexToRgb(hex);
  return a === undefined ? rgbToHex({ r, g, b }) : `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

/**
 * Parse loosely-typed user input into a normalized hex key. Accepts `f09`,
 * `#f09a`, `FF6600`, `#FF6600CC`, `rgb(37, 99, 235)` and
 * `rgba(37, 99, 235, .8)` — returns null when unparseable.
 */
export function parseColorInput(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  if (HEX_RE.test(text)) {
    const hex = text.startsWith("#") ? text : `#${text}`;
    const { a } = hexToRgb(hex);
    return rgbToHex(hexToRgb(a === undefined ? hex.slice(0, 7) : hex));
  }
  const m = text.match(/^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i);
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if (r > 255 || g > 255 || b > 255) return null;
  if (m[4] === undefined) return rgbToHex({ r, g, b });
  const raw = m[4].endsWith("%") ? Number(m[4].slice(0, -1)) / 100 : Number(m[4]);
  if (Number.isNaN(raw) || raw < 0 || raw > 1) return null;
  return rgbToHex({ r, g, b, a: raw });
}

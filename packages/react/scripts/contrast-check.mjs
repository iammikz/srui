/**
 * §6.2 — WCAG contrast check for every preset's key text/background pairs.
 * Parses oklch() values from the preset stylesheets, converts to sRGB,
 * computes WCAG relative luminance and contrast ratios.
 *
 * Usage: node scripts/contrast-check.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const styles = join(here, "..", "src", "styles");

function parseOklch(css) {
  const m = css.match(/oklch\(\s*([\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/);
  if (!m) return null;
  return { l: +m[1], c: +m[2], h: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}

function oklchToSrgb({ l, c, h, a = 1 }) {
  // OKLab → LMS → linear sRGB (Björn Ottosson's reference)
  const hr = (h * Math.PI) / 180;
  const L = l + 0.3963377774 * c * Math.cos(hr) + 0.2158037573 * c * Math.sin(hr);
  const M = l - 0.1055613458 * c * Math.cos(hr) - 0.0638541728 * c * Math.sin(hr);
  const S = l - 0.0894841775 * c * Math.cos(hr) - 1.291485548 * c * Math.sin(hr);
  const l_ = L ** 3, m_ = M ** 3, s_ = S ** 3;
  let r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  let g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  let b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
  const enc = (v) => {
    v = Math.min(1, Math.max(0, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };
  return {
    r: enc(r) * a, // alpha over white page background approximated by a·color + (1−a)·bg below
    g: enc(g) * a,
    b: enc(b) * a,
    a,
  };
}

function srgb({ r, g, b }) {
  const chan = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function composite(fg, bg) {
  // approximate alpha compositing over an opaque background
  const a = fg.a ?? 1;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

function contrast(fgCss, bgCss, pageBgCss = "oklch(1 0 0)") {
  const fg = parseOklch(fgCss);
  const bg = parseOklch(bgCss);
  const page = parseOklch(pageBgCss);
  if (!fg || !bg) return null;
  const to255 = (s) => ({ r: s.r * 255, g: s.g * 255, b: s.b * 255, a: s.a });
  // Translucent colors composite over the page background.
  const pageBg = to255(oklchToSrgb(page ?? { l: 1, c: 0, h: 0, a: 1 }));
  const bgC = composite(to255(oklchToSrgb(bg)), pageBg);
  const fgC = composite(to255(oklchToSrgb(fg)), bgC);
  const l1 = srgb(fgC);
  const l2 = srgb(bgC);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

function tokensOf(file, selector) {
  const css = readFileSync(file, "utf8");
  const start = css.indexOf(selector);
  if (start < 0) return {};
  const open = css.indexOf("{", start);
  let depth = 1, i = open + 1;
  while (depth > 0 && i < css.length) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    i++;
  }
  const block = css.slice(open + 1, i - 1);
  const out = {};
  for (const line of block.match(/--[\w-]+:[^;]+;/g) ?? []) {
    const idx = line.indexOf(":");
    out[line.slice(0, idx)] = line.slice(idx + 1, -1).trim();
  }
  return out;
}

const presets = ["flat", "glass", "neumorphic", "skeuomorphic"];
const report = {};
for (const p of presets) {
  const file = join(styles, "presets", `${p}.css`);
  for (const [mode, sel] of [["light", `[data-style="${p}"] {`], ["dark", `[data-style="${p}"].dark,`]]) {
    const t = tokensOf(file, sel);
    if (!t["--foreground"]) continue;
    const page = t["--background"];
    const pairs = {
      "foreground on background": contrast(t["--foreground"], t["--background"], page),
      "card-foreground on card": contrast(t["--card-foreground"], t["--card"], page),
      "popover-foreground on popover": contrast(t["--popover-foreground"], t["--popover"], page),
      "primary-foreground on primary": contrast(t["--primary-foreground"], t["--primary"], page),
      "secondary-foreground on secondary": contrast(t["--secondary-foreground"], t["--secondary"], page),
      "muted-foreground on background": contrast(t["--muted-foreground"], t["--background"], page),
      "muted-foreground on muted": contrast(t["--muted-foreground"], t["--muted"], page),
      "accent-foreground on accent": contrast(t["--accent-foreground"], t["--accent"], page),
      "destructive-foreground on destructive": contrast(t["--destructive-foreground"], t["--destructive"], page),
      "destructive (text) on background": contrast(t["--destructive"], t["--background"], page),
      "success-foreground on success": contrast(t["--success-foreground"], t["--success"], page),
      "warning-foreground on warning": contrast(t["--warning-foreground"], t["--warning"], page),
      "info-foreground on info": contrast(t["--info-foreground"], t["--info"], page),
    };
    report[`${p} ${mode}`] = pairs;
  }
}

const failing = [];
for (const [preset, pairs] of Object.entries(report)) {
  for (const [pair, ratio] of Object.entries(pairs)) {
    if (ratio == null) continue;
    const pass = ratio >= 4.5;
    if (!pass) failing.push(`${preset}: ${pair} = ${ratio}:1 ✗`);
    console.log(
      `${pass ? "PASS" : "FAIL"}  ${preset.padEnd(18)} ${pair.padEnd(36)} ${ratio}:1`,
    );
  }
}
console.log("\n" + (failing.length ? "FAILURES:\n" + failing.join("\n") : "all pairs ≥ 4.5:1"));

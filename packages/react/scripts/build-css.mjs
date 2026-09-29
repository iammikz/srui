/**
 * Precompiled CSS fallback (implementation plan §1.4).
 *
 * Compiles theme.css + all four presets + animations.css into a single
 * dist/srui.css with `prefix(srui)` so it can't collide with a host app's
 * own utility classes.
 *
 * Two wrinkles, handled here:
 *
 * 1. With `prefix(srui)` active, Tailwind's scanner only detects candidates
 *    that already carry the prefix (in its `srui:` variant-like form) — but
 *    the class names inside dist/index.js are unprefixed (they're authored
 *    for hosts using Tailwind directly). So we extract every candidate token
 *    from dist/index.js and feed the scanner an HTML candidates file listing
 *    `srui:<token>` for each one.
 *
 * 2. The generated `.srui-*` rules are additionally aliased under their
 *    standard unprefixed selectors, so the shipped class names resolve.
 *    Those aliases are token-based srui names (bg-primary, surface, …) that
 *    a non-Tailwind host has no competing definitions for.
 *
 * Result: importing ONLY "@srui/react/styles.css" in a plain page (no
 * Tailwind at all) renders srui components with correct colors and the
 * working `surface` recipe.
 */
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");
const distDir = join(pkgRoot, "dist");
mkdirSync(distDir, { recursive: true });

// "./" prefix keeps these CSS-relative imports (not bare package specifiers)
const toPosix = (p) => "./" + relative(pkgRoot, p).split(sep).join("/");

const distJs = join(distDir, "index.js");

// Candidate extraction: mirror Tailwind's source tokenizer (runs of
// non-whitespace), then write each token into an HTML class attribute in
// its `srui:`-prefixed form — the prefixed shape the scanner detects
// (only the HTML extractor understands class attributes reliably).
const escapeHtml = (t) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const candidates = [
  ...new Set(
    (readFileSync(distJs, "utf8").match(/[^\s'"`]+/g) ?? []).filter(
      (t) => t.length <= 120 && /[a-zA-Z-]/.test(t),
    ),
  ),
]
  .map((t) => `srui:${t}`)
  .join(" ");
const candidatesFile = join(pkgRoot, "srui-candidates.html");
writeFileSync(candidatesFile, `<div class="${candidates}"></div>`, "utf8");

// Keep the input inside the package so `@import "tailwindcss"` resolves
// from node_modules; `@import`/`@source` paths stay relative to it.
const inputFile = join(pkgRoot, "srui-fallback.css");
const outputFile = join(tmpdir(), `srui-out-${process.pid}.css`);
writeFileSync(
  inputFile,
  `@import "tailwindcss" prefix(srui);
@import "${toPosix(join(pkgRoot, "src/styles/theme.css"))}";
@import "${toPosix(join(pkgRoot, "src/styles/animations.css"))}";
@import "${toPosix(join(pkgRoot, "src/styles/presets/flat.css"))}";
@import "${toPosix(join(pkgRoot, "src/styles/presets/glass.css"))}";
@import "${toPosix(join(pkgRoot, "src/styles/presets/neumorphic.css"))}";
@import "${toPosix(join(pkgRoot, "src/styles/presets/skeuomorphic.css"))}";
@source "${toPosix(candidatesFile)}";
`,
  "utf8",
);

const cliPkg = require.resolve("@tailwindcss/cli/package.json");
const cli = join(dirname(cliPkg), "dist", "index.mjs");
const res = spawnSync(process.execPath, [cli, "-i", inputFile, "-o", outputFile], {
  stdio: "inherit",
  cwd: pkgRoot,
});
const cleanup = () => {
  for (const f of [inputFile, candidatesFile, outputFile]) rmSync(f, { force: true });
};
if (res.status !== 0) {
  cleanup();
  process.exit(res.status ?? 1);
}

let css = readFileSync(outputFile, "utf8");

// Alias every generated prefixed selector with its unprefixed twin so the
// class names inside dist/index.js resolve. The prefix renders into
// selectors as `.srui\:` (escaped colon) or `.srui-` (hyphenated theme
// utility names); both appear only inside selectors, never inside
// declarations, and at-rule blocks (@keyframes, @property, @layer) are left
// untouched.
css = css.replace(/(^|[^{}]+)\{([^{}]*)\}/g, (rule, selBlock, body) => {
  if (!selBlock.includes(".srui")) return rule;
  if (selBlock.trim().startsWith("@")) return rule;
  const aliased = selBlock
    .replace(/\.srui\\:/g, ".")
    .replace(/\.srui-/g, ".");
  if (aliased === selBlock) return rule;
  return `${selBlock}{${body}}\n${aliased}{${body}}`;
});

writeFileSync(join(distDir, "srui.css"), css, "utf8");
cleanup();
console.log(
  "wrote dist/srui.css (%d bytes, %d candidates)",
  Buffer.byteLength(css),
  candidates.length,
);

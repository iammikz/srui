import io, sys

def edit(path, pairs):
    s = io.open(path, encoding="utf8").read()
    for old, new in pairs:
        assert old in s, path + ": missing " + old[:60]
        s = s.replace(old, new)
    io.open(path, "w", encoding="utf8").write(s)

ROOT = "packages/react/src/styles/"

# script: composite over the preset's own background + extra destructive-on-muted pair
p = "packages/react/scripts/contrast-check.mjs"
s = io.open(p, encoding="utf8").read()
s = s.replace(
    'function contrast(fgCss, bgCss) {',
    'function contrast(fgCss, bgCss, pageBgCss) {'
)
s = s.replace(
    '  const white = { r: 255, g: 255, b: 255, a: 1 };\n'
    '  const to255 = (s) => ({ r: s.r * 255, g: s.g * 255, b: s.b * 255, a: s.a });\n'
    '  // Translucent colors composite over white (the page background).\n'
    '  const bgC = composite(to255(oklchToSrgb(bg)), white);',
    '  const to255 = (s) => ({ r: s.r * 255, g: s.g * 255, b: s.b * 255, a: s.a });\n'
    '  // Translucent colors composite over the page background.\n'
    '  const page = parseOklch(pageBgCss ?? bgCss) ?? { l: 1, c: 0, h: 0, a: 1 };\n'
    '  const pageBg = to255(oklchToSrgb(page));\n'
    '  const bgC = composite(to255(oklchToSrgb(bg)), pageBg);'
)
s = s.replace(
    '"destructive (text) on background": contrast(t["--destructive"], t["--background"]),',
    '"destructive (text) on background": contrast(t["--destructive"], t["--background"], t["--background"]),\n'
    '      "destructive (text) on muted": contrast(t["--destructive"], t["--muted"], t["--background"]),'
)
io.open(p, "w", encoding="utf8").write(s)

# flat: light destructive slightly darker; dark destructive mid-red with near-black fg
edit(ROOT + "presets/flat.css", [
    ("--destructive: oklch(0.577 0.245 27.325);\n  --destructive-foreground: oklch(0.985 0 0);",
     "--destructive: oklch(0.53 0.2 25);\n  --destructive-foreground: oklch(0.985 0 0);"),
    ("--destructive: oklch(0.55 0.19 25);\n  --destructive-foreground: oklch(0.985 0 0);",
     "--destructive: oklch(0.63 0.19 25);\n  --destructive-foreground: oklch(0.16 0.02 25);"),
])

# glass light destructive slightly darker
edit(ROOT + "presets/glass.css", [
    ("--destructive: oklch(0.55 0.2 25);\n  --destructive-foreground: oklch(0.985 0 0);\n\n  --success: oklch(0.52 0.13 155);\n  --success-foreground: oklch(0.985 0 0);\n\n  --warning: oklch(0.76 0.14 78);\n  --warning-foreground: oklch(0.27 0.06 70);\n\n  --info: oklch(0.55 0.16 250);\n  --info-foreground: oklch(0.985 0 0);\n\n  --border: oklch(1 0 0 / 0.5);",
     "--destructive: oklch(0.53 0.2 25);\n  --destructive-foreground: oklch(0.985 0 0);\n\n  --success: oklch(0.52 0.13 155);\n  --success-foreground: oklch(0.985 0 0);\n\n  --warning: oklch(0.76 0.14 78);\n  --warning-foreground: oklch(0.27 0.06 70);\n\n  --info: oklch(0.55 0.16 250);\n  --info-foreground: oklch(0.985 0 0);\n\n  --border: oklch(1 0 0 / 0.5);"),
])

# neumorphic dark destructive: mid-red + near-black fg
edit(ROOT + "presets/neumorphic.css", [
    ("--destructive: oklch(0.55 0.19 25);\n  --destructive-foreground: oklch(0.985 0 0);",
     "--destructive: oklch(0.63 0.19 25);\n  --destructive-foreground: oklch(0.16 0.02 25);"),
])

# skeuomorphic dark: brighter muted-foreground; destructive mid-red + near-black fg
edit(ROOT + "presets/skeuomorphic.css", [
    ("--muted: oklch(0.33 0.006 90);\n  --muted-foreground: oklch(0.62 0.008 90);",
     "--muted: oklch(0.33 0.006 90);\n  --muted-foreground: oklch(0.72 0.008 90);"),
    ("--destructive: oklch(0.55 0.19 25);\n  --destructive-foreground: oklch(0.985 0 0);",
     "--destructive: oklch(0.63 0.19 25);\n  --destructive-foreground: oklch(0.16 0.02 25);"),
])

# theme.css base mirrors flat
edit(ROOT + "theme.css", [
    ("--destructive: oklch(0.577 0.245 27.325);", "--destructive: oklch(0.53 0.2 25);"),
    ("--destructive: oklch(0.55 0.19 25);\n  --destructive-foreground: oklch(0.985 0 0);",
     "--destructive: oklch(0.63 0.19 25);\n  --destructive-foreground: oklch(0.16 0.02 25);"),
])

print("patched all")

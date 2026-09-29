import { test, expect } from "@playwright/test";

/**
 * Implementation plan §7.1 — screenshot every component in apps/docs's live
 * previews, once per preset (4 screenshots per component minimum). The docs
 * site is driven per-preset by setting the persisted srui-style before
 * navigation (same mechanism the top-nav switcher uses). CI fails on any
 * pixel diff above 0.1% (maxDiffPixelRatio) against the committed baselines
 * in tests/visual.spec.ts-snapshots/.
 */
const PRESETS = ["flat", "glass", "neumorphic", "skeuomorphic"] as const;

const PAGES: Record<string, string> = {
  button: "/docs/components/button",
  card: "/docs/components/card",
  input: "/docs/components/input",
  dialog: "/docs/components/dialog",
  loader: "/docs/components/loader",
  "stat-card": "/docs/components/stat-card",
  charts: "/docs/components/charts",
  select: "/docs/components/select",
  combobox: "/docs/components/combobox",
  tabs: "/docs/components/tabs",
  tooltip: "/docs/components/tooltip",
  popover: "/docs/components/popover",
  toast: "/docs/components/toast",
  checkbox: "/docs/components/checkbox",
  "radio-group": "/docs/components/radio-group",
  switch: "/docs/components/switch",
  textarea: "/docs/components/textarea",
  "form-field": "/docs/components/form-field",
  avatar: "/docs/components/avatar",
  badge: "/docs/components/badge",
  separator: "/docs/components/separator",
  accordion: "/docs/components/accordion",
  collapsible: "/docs/components/collapsible",
  "app-shell": "/docs/components/app-shell",
  "data-table": "/docs/components/data-table",
  "chart-card": "/docs/components/chart-card",
  "form-builder": "/docs/components/form-builder",
  "command-palette": "/docs/components/command-palette",
  "notification-center": "/docs/components/notification-center",
  wizard: "/docs/components/wizard",
};

for (const preset of PRESETS) {
  test.describe(`visual regression — ${preset}`, () => {
    for (const [name, path] of Object.entries(PAGES)) {
      test(`${name} (${preset})`, async ({ page }) => {
        // Drive the docs site the same way the switcher does: persisted
        // style + light scheme, applied pre-paint by the no-flash script.
        await page.addInitScript(
          ([style]) => {
            localStorage.setItem("srui-style", style);
            localStorage.setItem("srui-scheme", "light");
          },
          [preset],
        );
        await page.goto(path);
        await page.waitForLoadState("domcontentloaded");
        // Wait for fonts + the first live preview to settle.
        await page.evaluate(() => document.fonts.ready);
        const article = page.locator("article").first();
        await article.waitFor();
        await page.waitForTimeout(1200);

        await expect(article).toHaveScreenshot(`${name}-${preset}.png`, {
          maxDiffPixelRatio: 0.001,
          fullPage: true,
          // Freeze CSS animations/transitions at their end state (charts,
          // count-ups, entrance effects) for deterministic baselines.
          animations: "disabled",
          caret: "hide",
        });
      });
    }
  });
}

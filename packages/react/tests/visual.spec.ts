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
  button: "/components/button/",
  card: "/components/card/",
  input: "/components/input/",
  dialog: "/components/dialog/",
  loader: "/components/loader/",
  "stat-card": "/components/stat-card/",
  charts: "/components/charts/",
  select: "/components/select/",
  combobox: "/components/combobox/",
  tabs: "/components/tabs/",
  tooltip: "/components/tooltip/",
  popover: "/components/popover/",
  toast: "/components/toast/",
  checkbox: "/components/checkbox/",
  "radio-group": "/components/radio-group/",
  switch: "/components/switch/",
  textarea: "/components/textarea/",
  "form-field": "/components/form-field/",
  avatar: "/components/avatar/",
  badge: "/components/badge/",
  separator: "/components/separator/",
  accordion: "/components/accordion/",
  collapsible: "/components/collapsible/",
  "app-shell": "/components/app-shell/",
  "data-table": "/components/data-table/",
  "chart-card": "/components/chart-card/",
  "form-builder": "/components/form-builder/",
  "command-palette": "/components/command-palette/",
  "notification-center": "/components/notification-center/",
  wizard: "/components/wizard/",
  calendar: "/components/calendar/",
  "date-picker": "/components/date-picker/",
  "date-range-picker": "/components/date-range-picker/",
  "time-picker": "/components/time-picker/",
  "time-range-picker": "/components/time-range-picker/",
  "dropdown-menu": "/components/dropdown-menu/",
  alert: "/components/alert/",
  progress: "/components/progress/",
  sheet: "/components/sheet/",
  drawer: "/components/drawer/",
  modal: "/components/modal/",
  "tag-input": "/components/tag-input/",
  "scroll-area": "/components/scroll-area/",
  "file-upload": "/components/file-upload/",
  breadcrumb: "/components/breadcrumb/",
  "tree-view": "/components/tree-view/",
  timeline: "/components/timeline/",
  "alert-dialog": "/components/alert-dialog/",
  pagination: "/components/pagination/",
  slider: "/components/slider/",
  "color-picker": "/components/color-picker/",
};

for (const preset of PRESETS) {
  test.describe(`visual regression — ${preset}`, () => {
    for (const [name, path] of Object.entries(PAGES)) {
      test(`${name} (${preset})`, async ({ page }) => {
        // Screenshot the prerendered artifact: block script requests so no
        // hydration runs during the stability check (the SSG HTML is
        // complete; the inline no-flash script still applies the preset
        // pre-paint). Interaction coverage lives in the a11y suite.
        await page.route("**/*", (route) =>
          route.request().resourceType() === "script"
            ? route.abort()
            : route.continue(),
        );
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
          // Element screenshots capture the whole element already; fullPage
          // triggers a viewport resize that fights AppShell's re-renders
          // during the stability check.
          // Freeze CSS animations/transitions at their end state (charts,
          // count-ups, entrance effects) for deterministic baselines.
          animations: "disabled",
          caret: "hide",
          // Full-page shots of the AppShell-framed pages are heavier than
          // the default 5s expect budget allows for the stability passes.
          timeout: 30_000,
        });
      });
    }
  });
}

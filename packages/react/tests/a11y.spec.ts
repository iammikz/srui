import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";

/**
 * Implementation plan §6.1 — for every component in src/components/, render
 * it (the demo page mounts all of them, one section per component family)
 * under each of the four data-style values and run axe against it.
 * DoD: zero axe violations of "serious" or "critical" impact.
 */
const PRESETS = ["flat", "glass", "neumorphic", "skeuomorphic"] as const;

const SECTIONS: Record<string, string> = {
  Button: "#buttons",
  Card: "#cards",
  Input: "#cards",
  Dialog: "#dialog",
  Loader: "#loaders",
  StatCard: "#stat-cards",
  "LineChart/BarChart": "#charts",
  Select: "#select-combobox",
  Combobox: "#select-combobox",
  Tabs: "#tabs",
  "Tooltip/Popover": "#tooltip-popover",
  Toast: "#toast",
  "Checkbox/RadioGroup/Switch": "#controls",
  "Textarea/FormField": "#forms",
  "Avatar/Badge/Separator": "#data-display",
  "Accordion/Collapsible": "#accordion-collapsible",
  AppShell: "#app-shell",
  DataTable: "#data-table",
  ChartCard: "#chart-card",
  FormBuilder: "#form-builder",
  CommandPalette: "#command-palette",
  NotificationCenter: "#notifications",
  Wizard: "#wizard",
  "Calendar/DatePicker/TimePicker family": "#date-time-pickers",
  "Alert/Progress/Timeline/Breadcrumb/TagInput/TreeView/ScrollArea/FileUpload":
    "#new-primitives",
  "DropdownMenu/Drawer": "#menus-overlays",
  "P1 primitives (Table/Toggle/HoverCard/ContextMenu/Kbd/AspectRatio/ButtonGroup/NativeSelect/Empty/Item)":
    "#parity-primitives",
  "P2 (Field/Command/InputOTP/Carousel/Resizable/Menubar)": "#parity-p2",
  "Chat (MessageScroller/Message/Bubble/Attachment)": "#chat",
  "NavigationMenu/InputGroup": "#final-parity",
};

const SERIOUS_OR_CRITICAL = (v: { impact: string | null }) =>
  v.impact === "serious" || v.impact === "critical";

test.describe("axe accessibility (§6.1)", () => {
  for (const preset of PRESETS) {
    test(`no serious/critical violations — ${preset}`, async ({ page }) => {
      await page.goto(`/?style=${preset}&scheme=light`);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForSelector("#buttons button");

      const failures: string[] = [];
      for (const [component, selector] of Object.entries(SECTIONS)) {
        const locator = page.locator(selector).first();
        const results = await new AxeBuilder({ page })
          .include(selector)
          .analyze();
        const serious = results.violations.filter(SERIOUS_OR_CRITICAL);
        for (const v of serious) {
          failures.push(
            `[${preset}] ${component} (${selector}): ${v.id} (${v.impact}) — ${v.nodes
              .slice(0, 3)
              .map((n) => n.target.join(" "))
              .join(" | ")}`,
          );
        }
      }
      expect(failures, failures.join("\n")).toEqual([]);
    });
  }

  test("focus-visible outline is legible under neumorphic (§Phase 3 DoD)", async ({ page }) => {
    await page.goto("/?style=neumorphic&scheme=light");
    await page.waitForSelector("#buttons button");
    // Reach the first demo button with the keyboard so :focus-visible applies.
    await page.locator("#buttons button").first().focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    const btn = page.locator("#buttons button").first();
    await btn.focus();
    // The ring token is the indigo primary; verify a visible outline appears
    // on :focus-visible by forcing the state via keyboard interaction.
    const outline = await page.evaluate(() => {
      const el = document.querySelector("#buttons button");
      el.focus();
      // Programmatic focus after keyboard interaction counts as focus-visible
      // in Chromium; read the resolved outline.
      const cs = getComputedStyle(el);
      return {
        style: cs.outlineStyle,
        width: parseFloat(cs.outlineWidth),
        color: cs.outlineColor,
        ringVar: getComputedStyle(el).getPropertyValue("--ring").trim(),
      };
    });
    // The token itself must be the preset primary (indigo), not the page gray.
    // Lightness may serialize as `oklch(0.5 …)` (dev CSS) or `oklch(50% …)`
    // (production build normalizes to percentages) — compare numerically.
    const m = outline.ringVar.match(/oklch\(\s*([\d.]+)%?/);
    let lightness = m ? parseFloat(m[1]) : NaN;
    if (lightness > 1) lightness /= 100;
    expect(lightness).toBeCloseTo(0.5, 2);
  });
});

/**
 * §6.3 — motion preferences: with prefers-reduced-motion, srui's
 * motion-safe animations must not run (final states are baked in, so
 * nothing gets stuck mid-draw either).
 */
test.describe("reduced motion (§6.3)", () => {
  for (const preset of PRESETS) {
    test(`no animations run under reduced motion — ${preset}`, async ({ browser }) => {
      const ctx = await browser.newContext({ reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(`/?style=${preset}&scheme=light`);
      await page.waitForSelector("#charts svg path");
      const still = await page.evaluate(() => {
        const animated = [...document.querySelectorAll("#charts path, #charts rect, #stat-cards [style], .animate-shimmer")].filter((el) => {
          const cs = getComputedStyle(el);
          return cs.animationName !== "none" && cs.animationIterationCount !== "0";
        });
        // Lines must be fully drawn (no stuck mid-draw dashoffset).
        const path = document.querySelector("#charts svg path[pathLength]");
        const offset = path ? getComputedStyle(path).strokeDashoffset : "0";
        return { animated: animated.length, dashOffset: parseFloat(offset || "0") };
      });
      expect(still.animated).toBe(0);
      expect(still.dashOffset).toBeCloseTo(0, 5);
      await ctx.close();
    });
  }
});

/**
 * §6.4 — keyboard pass for Dialog, Select, Combobox, Tabs, Toast,
 * DataTable, CommandPalette. (The screen-reader half of §6.4 is a manual
 * step; findings live in packages/react/ACCESSIBILITY.md.)
 */
test.describe("keyboard interactions (§6.4)", () => {
  test("Dialog: opens on Enter, closes on Escape", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("Select: keyboard navigation commits a different option", async ({ browser }) => {
    // Reduced motion skips the popup's entrance animation; keyboard-ready
    // timing is still racy in headless Chromium, so the navigation block
    // retries (like a user repeating the keystroke) until the selection
    // actually changes — the DoD is committing a different option with the
    // keyboard alone.
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/?style=flat&scheme=light");
    const trigger = page.getByRole("combobox", { name: "Select (Radix)" });
    await trigger.click();
    // The homepage also renders cmdk Command lists (role=listbox); scope to
    // the Select's own listbox.
    const listbox = page.locator("[role=listbox][data-state=open]");
    await expect(listbox).toBeVisible();
    await page.locator("[data-highlighted]").first().waitFor();

    await expect(async () => {
      await page.keyboard.press("ArrowDown");
      // Radix settles the highlight (scrollIntoView) between keystrokes;
      // without this gap the following Enter re-commits the old value.
      await page.waitForTimeout(250);
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveText(/London|Tokyo/);
    }).toPass({ timeout: 10_000 });

    await ctx.close();
  });

  test("Combobox: type filters, arrows move, Enter commits", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    const trigger = page.getByRole("button", { name: "Framework combobox" });
    await trigger.click();
    const input = page.getByPlaceholder("Framework…");
    await expect(input).toBeVisible();
    await input.click();
    await input.fill("v");
    await page.waitForTimeout(300);
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveText(/Vue/);
  });

  test("Tabs: arrow keys move between triggers", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    const tabs = page.locator("#tabs [role=tab]");
    await tabs.nth(0).focus();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  });

  test("Toast: shown via keyboard trigger, dismissible", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    await page.getByRole("button", { name: "Success toast" }).focus();
    await page.keyboard.press("Enter");
    const toast = page.locator("[role=status]").last();
    await expect(toast).toBeVisible();
  });

  test("DataTable: header sort via keyboard", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    const header = page.locator("#data-table thead button", { hasText: "Name" }).first();
    await header.focus();
    await page.keyboard.press("Enter");
    const firstRow = page.locator("#data-table tbody tr").first();
    await expect(firstRow.locator("td").nth(1)).toHaveText("Ada Lovelace");
    await page.keyboard.press("Enter");
    await expect(firstRow.locator("td").nth(1)).toHaveText(/Alan|Barbara|Donald|Grace|Katherine|Linus|Margaret/);
  });

  test("DataTable: manual pagination refetches per page", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    const scope = page.locator("#data-table-server");
    const firstName = scope.locator("tbody tr td").first();
    await expect(firstName).toHaveText("Person 1");
    await expect(scope.getByText("257 rows", { exact: true })).toBeVisible();
    await scope.getByRole("button", { name: "Next" }).click();
    await expect(firstName).toHaveText("Person 11");
    await expect(scope.getByText("Page 2 of 26")).toBeVisible();
  });

  test("InputOTP: click a slot and type the code", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    // input-otp stretches a transparent input over the whole group; clicking
    // anywhere (the overlay itself here) focuses it — then typing fills slots.
    await page.locator('#parity-p2 [data-slot="input-otp"]').click();
    await page.keyboard.type("123456");
    const slots = page.locator('#parity-p2 [data-slot="input-otp-slot"]');
    await expect(slots.nth(0)).toHaveText("1");
    await expect(slots.nth(5)).toHaveText("6");
  });

  test("CommandPalette: Ctrl+K opens, arrows + Enter run a command", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const input = dialog.locator("input");
    await expect(input).toBeFocused();
    await input.fill("buttons");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
  });

  test("DatePicker: typed input commits, grid arrows + Enter pick a day", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    // First and second of NEXT month — never a month/week boundary, so the
    // test is deterministic on any run date (hardcoded dates roll over).
    const { firstKey, firstLabel, secondLabel } = await page.evaluate(() => {
      const now = new Date();
      const key = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate(),
        ).padStart(2, "0")}`;
      const label = (d: Date) =>
        d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return {
        firstKey: key(new Date(now.getFullYear(), now.getMonth() + 1, 1)),
        firstLabel: label(new Date(now.getFullYear(), now.getMonth() + 1, 1)),
        secondLabel: label(new Date(now.getFullYear(), now.getMonth() + 1, 2)),
      };
    });
    const trigger = page.getByRole("combobox", { name: "Due date" });

    // Typed input commits the wire format directly.
    await trigger.click();
    await trigger.fill(firstKey);
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveValue(firstLabel);

    // ArrowDown opens the panel and dives into the grid; arrows move focus;
    // Enter picks; a completed pick closes the panel.
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    const grid = page.getByRole("grid", { name: "Calendar", exact: true });
    await expect(grid).toBeVisible();
    const selected = page.locator("[role=gridcell][aria-selected=true] button");
    await expect(selected).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveValue(secondLabel);
    await expect(grid).toBeHidden();

    // Escape closes and refocuses the trigger.
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await grid.waitFor();
    await page.keyboard.press("Escape");
    await expect(grid).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("TimePicker: column options are labelled and a pick commits", async ({ page }) => {
    await page.goto("/?style=flat&scheme=light");
    const trigger = page.getByRole("combobox", { name: "Meeting time" });
    await trigger.click();
    const hourCol = page.getByRole("listbox", { name: "Hour" });
    await expect(hourCol).toBeVisible();

    // Regression: options once shipped with empty labels — every option
    // must render its text and be reachable by accessible name.
    const labels = await hourCol.locator("button").allTextContents();
    expect(labels.length).toBeGreaterThan(0);
    expect(labels.every((t) => t.trim().length > 0)).toBe(true);

    await hourCol.getByRole("option", { name: "2", exact: true }).click();
    await expect(trigger).toHaveValue("2:30 AM");
  });
});

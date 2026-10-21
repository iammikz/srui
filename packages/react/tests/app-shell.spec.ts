import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { AppShell } from "../dist/index.js";

const require = createRequire(import.meta.url);
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

test.beforeEach(async ({ page }) => {
  await page.goto("/components/app-shell/");
});

test("server-rendered shell hides desktop navigation on mobile before hydration", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const html = renderToStaticMarkup(createElement(AppShell, {
    sidebar: createElement("a", { href: "/overview" }, "Overview"),
    children: "Page content",
  }));
  const css = readFileSync(new URL("../dist/srui.css", import.meta.url), "utf8");
  await page.setContent(`<style>${css}</style>${html}`);
  await expect(page.getByRole("link", { name: "Overview" })).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
  await context.close();
});

test("desktop hamburger hides and restores the sidebar without losing expanded groups", async ({ page }) => {
  const demo = page.getByRole("region", { name: "AppShell example" });
  const nav = demo.getByRole("navigation", { name: "Example navigation" });
  const projects = nav.getByRole("button", { name: "Projects", exact: true });
  await expect(projects).toHaveAttribute("aria-expanded", "true");
  await projects.click();
  await demo.getByRole("button", { name: "Hide navigation", exact: true }).click();
  await expect(nav).toBeHidden();
  const open = demo.getByRole("button", { name: "Open navigation", exact: true });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(nav).toBeVisible();
  await expect(projects).toHaveAttribute("aria-expanded", "false");
  await expect(demo.getByRole("button", { name: "Hide navigation", exact: true }))
    .toHaveAttribute("aria-expanded", "true");
});

test("desktop link selection hides the sidebar and returns keyboard focus to its toggle", async ({ page }) => {
  const demo = page.getByRole("region", { name: "AppShell example" });
  const nav = demo.getByRole("navigation", { name: "Example navigation" });
  await nav.getByRole("link", { name: "Team", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(nav).toBeHidden();
  const open = demo.getByRole("button", { name: "Open navigation", exact: true });
  await expect(open).toBeFocused();
  await open.click();
  await expect(nav.getByRole("link", { name: "Team", exact: true }))
    .toHaveAttribute("aria-current", "page");
});

test("group expansion and modified link clicks keep the sidebar open", async ({ page }) => {
  const demo = page.getByRole("region", { name: "AppShell example" });
  const nav = demo.getByRole("navigation", { name: "Example navigation" });
  await nav.getByRole("button", { name: "Projects", exact: true }).click();
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: "Dashboard", exact: true }).click({ modifiers: ["Control"] });
  await expect(nav).toBeVisible();
});

test("closeOnSelect and sidebarCollapsible can be disabled independently", async ({ page }) => {
  const demo = page.getByRole("region", { name: "AppShell example" });
  const nav = demo.getByRole("navigation", { name: "Example navigation" });
  await demo.getByRole("switch", { name: "Close on selection" }).uncheck();
  await nav.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(nav).toBeVisible();
  await demo.getByRole("button", { name: "Hide navigation", exact: true }).click();
  await expect(nav).toBeHidden();
  await demo.getByRole("switch", { name: "Collapsible desktop sidebar" }).uncheck();
  await expect(nav).toBeVisible();
  await expect(demo.getByRole("button", { name: /navigation$/ })).toHaveCount(0);
  await demo.getByRole("switch", { name: "Close on selection" }).check();
  await nav.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(nav).toBeVisible();
});

test("mobile link selection closes the drawer; groups stay open and focus returns to the opener", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const demo = page.getByRole("region", { name: "AppShell example" });
  const open = demo.getByRole("button", { name: "Open navigation", exact: true });
  await open.click();
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true });
  const nav = drawer.getByRole("navigation", { name: "Example navigation" });
  await nav.getByRole("button", { name: "Projects", exact: true }).click();
  await expect(drawer).toBeVisible();
  await nav.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(open).toBeFocused();
  await demo.getByRole("switch", { name: "Close on selection" }).uncheck();
  await open.click();
  await drawer.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("viewport changes preserve the desktop preference and close the mobile drawer", async ({ page }) => {
  const demo = page.getByRole("region", { name: "AppShell example" });
  await demo.getByRole("button", { name: "Hide navigation", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await demo.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Navigation", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("dialog", { name: "Navigation", exact: true })).toBeHidden();
  await expect(demo.getByRole("navigation", { name: "Example navigation" })).toBeHidden();
  await demo.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect(demo.getByRole("navigation", { name: "Example navigation" })).toBeVisible();
});

test("default AppShell keeps desktop navigation docked and mobile navigation open on selection", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "Documentation", exact: true });
  await expect(nav).toBeVisible();
  // The outer docs shell uses neither opt-in prop.
  await expect(page.getByRole("button", { name: /^(Hide|Open) navigation$/ })).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation", exact: true }).first().click();
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true });
  await drawer.getByRole("link", { name: "Introduction", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(drawer).toBeVisible();
});

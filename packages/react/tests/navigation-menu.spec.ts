import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("active third-level page opens its ancestors and branches toggle with the keyboard", async ({
  page,
}) => {
  await page.goto("/components/button/");
  const nav = page.getByRole("navigation", {
    name: "Documentation",
    exact: true,
  });
  const components = nav.getByRole("button", {
    name: "Components",
    exact: true,
  });
  const inputs = nav.getByRole("button", {
    name: "Inputs & Forms",
    exact: true,
  });
  await expect(components).toHaveAttribute("aria-expanded", "true");
  await expect(inputs).toHaveAttribute("aria-expanded", "true");
  await expect(
    nav.getByRole("link", { name: "Button", exact: true })
  ).toHaveAttribute("aria-current", "page");
  await inputs.focus();
  await page.keyboard.press("Enter");
  await expect(inputs).toHaveAttribute("aria-expanded", "false");
  await expect(
    nav.getByRole("link", { name: "Button", exact: true })
  ).toBeHidden();
  await page.keyboard.press("Space");
  await expect(
    nav.getByRole("link", { name: "Button", exact: true })
  ).toBeVisible();
  await nav.getByRole("link", { name: "Input", exact: true }).click();
  await expect(page).toHaveURL(/\/components\/input\/?$/);
  await expect(
    nav.getByRole("link", { name: "Input", exact: true })
  ).toHaveAttribute("aria-current", "page");
  await components.click();
  await expect(components).toHaveAttribute("aria-expanded", "false");
  await nav.getByRole("link", { name: "Introduction", exact: true }).click();
  await page.goBack();
  await expect(components).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Input", exact: true })).toBeVisible();
});

test("sidebar navigation is accessible in the mobile drawer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/components/navigation-menu");
  await page.getByRole("button", { name: "Open navigation" }).first().click();
  const drawer = page.getByRole("dialog", { name: "Navigation", exact: true });
  const nav = drawer.getByRole("navigation", {
    name: "Documentation",
    exact: true,
  });
  await expect(
    nav.getByRole("button", { name: "Navigation", exact: true })
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    nav.getByRole("link", { name: "Navigation Menu", exact: true })
  ).toHaveAttribute("aria-current", "page");
  const results = await new AxeBuilder({ page })
    .include('[data-slot="navigation-menu-sidebar"]')
    .analyze();
  expect(results.violations).toEqual([]);
});

test("header flyouts remain usable", async ({ page }) => {
  await page.goto("/components/navigation-menu");
  const trigger = page
    .locator("main")
    .getByRole("button", { name: "Components", exact: true })
    .first();
  await trigger.click();
  await expect(
    page
      .locator("main")
      .getByRole("link", { name: /Data Table/ })
      .first()
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

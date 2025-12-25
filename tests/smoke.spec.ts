import { test, expect } from "@playwright/test";

test("home loads", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveTitle(/.+/);
});

test("portfolio loads", async ({ page }) => {
  await page.goto("/en/portfolio");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("about loads", async ({ page }) => {
  await page.goto("/en/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});



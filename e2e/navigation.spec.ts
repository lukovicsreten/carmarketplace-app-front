import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Car Point")).toBeVisible();
  });

  test("should have login and register buttons when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Prijava")).toBeVisible();
    await expect(page.locator("text=Registracija")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Prijava");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("text=Prijavite se na svoj nalog")).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Registracija");
    await expect(page).toHaveURL(/\/register/);
  });

  test("should show 404 for unknown routes", async ({ page }) => {
    await page.goto("/nepostojeca-stranica");
    await expect(page.locator("text=404")).toBeVisible();
  });
});

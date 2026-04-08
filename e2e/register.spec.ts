import { test, expect } from "@playwright/test";

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("should display registration form", async ({ page }) => {
    await expect(page.locator("label:has-text('Korisničko ime')")).toBeVisible();
    await expect(page.locator("label:has-text('Email')")).toBeVisible();
    await expect(page.locator("label:has-text('Lozinka')")).toBeVisible();
  });

  test("should show validation error on empty submit", async ({ page }) => {
    await page.click("button:has-text('Registruj se')");
    await expect(page.locator("text=Popunite sva polja")).toBeVisible();
  });

  test("should have link to login", async ({ page }) => {
    const loginLink = page.locator("text=Prijavite se");
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});

import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display login form", async ({ page }) => {
    await expect(page.locator("label:has-text('Korisničko ime')")).toBeVisible();
    await expect(page.locator("label:has-text('Lozinka')")).toBeVisible();
    await expect(page.locator("button:has-text('Prijavi se')")).toBeVisible();
  });

  test("should show error on empty submit", async ({ page }) => {
    await page.click("button:has-text('Prijavi se')");
    await expect(page.locator("text=Unesite korisničko ime i lozinku")).toBeVisible();
  });

  test("should have link to registration", async ({ page }) => {
    await expect(page.locator("text=Registrujte se")).toBeVisible();
    await page.click("text=Registrujte se");
    await expect(page).toHaveURL(/\/register/);
  });

  test("should have back button", async ({ page }) => {
    await page.click("text=Nazad");
    await expect(page).toHaveURL("/");
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.fill("#username", "nepostojeci_user");
    await page.fill("#password", "pogresna_lozinka");
    await page.click("button:has-text('Prijavi se')");
    // Should show an error toast (requires backend running)
    await expect(page.locator("[role='status'], [data-sonner-toast]").first()).toBeVisible({ timeout: 5000 });
  });
});

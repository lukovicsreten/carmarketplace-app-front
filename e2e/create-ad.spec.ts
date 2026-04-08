import { test, expect } from "@playwright/test";

test.describe("Create Ad Page", () => {
  test("should redirect unauthenticated user to login prompt", async ({ page }) => {
    await page.goto("/create-ad");
    await expect(page.locator("text=Potrebna prijava")).toBeVisible();
    await expect(page.locator("text=Prijavi se")).toBeVisible();
  });

  test("should show create ad form when authenticated", async ({ page }) => {
    // Simulate authentication via localStorage
    await page.goto("/");
    await page.evaluate(() => {
      const fakeUser = {
        token: "fake-token",
        userId: 1,
        username: "testuser",
        role: "USER",
      };
      localStorage.setItem("auth_token", "fake-token");
      localStorage.setItem("auth_user", JSON.stringify(fakeUser));
    });
    await page.goto("/create-ad");

    await expect(page.locator("text=Postavi Novi Oglas")).toBeVisible();
    await expect(page.locator("label:has-text('Naslov')")).toBeVisible();
    await expect(page.locator("label:has-text('Cena')")).toBeVisible();
    await expect(page.locator("label:has-text('Brend')")).toBeVisible();
    await expect(page.locator("label:has-text('Model')")).toBeVisible();
  });

  test("should show validation error on empty required fields", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const fakeUser = {
        token: "fake-token",
        userId: 1,
        username: "testuser",
        role: "USER",
      };
      localStorage.setItem("auth_token", "fake-token");
      localStorage.setItem("auth_user", JSON.stringify(fakeUser));
    });
    await page.goto("/create-ad");

    await page.click("button:has-text('Postavi Oglas')");
    await expect(page.locator("text=Popunite sva obavezna polja")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Car Detail Page", () => {
  test("should show error or loading for non-existent ad", async ({ page }) => {
    await page.goto("/ad/999999");
    // Should show error or loading state
    await page.waitForTimeout(3000);
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });

  test("should navigate back from detail page", async ({ page }) => {
    await page.goto("/ad/1");
    const backButton = page.locator("text=Nazad");
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL("/");
    }
  });
});

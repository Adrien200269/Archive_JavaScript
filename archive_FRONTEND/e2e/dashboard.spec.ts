import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "user@test.com");
    await page.fill("#password", "user1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test("displays product catalog", async ({ page }) => {
    await expect(page.locator("text=Most Selling")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h3").filter({ hasText: "Classic Leather Jacket" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Denim Jacket" })).toBeVisible();
  });

  test("search filters products", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("Denim");

    await expect(page.locator("h3").filter({ hasText: "Denim Jacket" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Classic Leather Jacket" })).not.toBeVisible();
  });

  test("favorites filter shows only favorites", async ({ page }) => {
    await page.locator('button[title*="Favorite"]').click();

    await expect(page.locator("text=Favourites")).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Denim Jacket" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Canvas Sneakers" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Classic Leather Jacket" })).not.toBeVisible();
  });

  test("add product to cart", async ({ page }) => {
    await page.locator("button:has-text('Add to Cart')").first().click();

    await expect(page.locator("h2").filter({ hasText: /Cart.*1/ })).toBeVisible();
  });

  test("cart quantity badge updates", async ({ page }) => {
    await page.locator("button:has-text('Add to Cart')").first().click();
    const badge = page.locator("button.header-btn span").first();
    await expect(badge).toContainText("1");
  });

  test("profile tab shows user info", async ({ page }) => {
    await page.locator("button.tab-btn").nth(2).click();

    await expect(page.locator("text=Test User")).toBeVisible();
    await expect(page.locator("text=user@test.com")).toBeVisible();
  });
});

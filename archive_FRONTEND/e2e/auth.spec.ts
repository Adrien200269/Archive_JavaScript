import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  const uniqueEmail = `e2e-${Date.now()}@test.com`;

  test("splash page navigates to login", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".splash-logo")).toContainText("archive");
    await page.click("text=Enter");
    await expect(page).toHaveURL("/login");
  });

  test("register a new user", async ({ page }) => {
    await page.goto("/register");

    await page.fill("#fullName", "E2E User");
    await page.fill("#email", uniqueEmail);
    await page.fill("#dob", "2000-01-15");
    await page.fill("#password", "e2etest123");
    await page.fill("#confirmPassword", "e2etest123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/login", { timeout: 10000 });
    await expect(page.locator("#email")).toBeVisible();
  });

  test("register shows validation errors", async ({ page }) => {
    await page.goto("/register");

    await page.fill("#fullName", "A");
    await page.fill("#email", "bad-email");
    await page.fill("#password", "short");
    await page.fill("#confirmPassword", "mismatch");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Full name must be at least 2 characters")).toBeVisible();
  });

  test("login with valid credentials and redirect to dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "user@test.com");
    await page.fill("#password", "user1234");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.locator("text=Most Selling")).toBeVisible({ timeout: 10000 });
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "user@test.com");
    await page.fill("#password", "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("login validation errors", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "bad");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Enter a valid email")).toBeVisible();
  });

  test("forgot password flow", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.locator("text=Forgot Password")).toBeVisible();

    await page.fill("#email", "user@test.com");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Check your email")).toBeVisible({ timeout: 10000 });
  });

  test("logout", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "user@test.com");
    await page.fill("#password", "user1234");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    await page.locator("button.tab-btn").nth(2).click();
    await page.waitForTimeout(500);

    await page.locator("text=Log Out").click();
    await expect(page).toHaveURL("/login", { timeout: 10000 });
  });
});

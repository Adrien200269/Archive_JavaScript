import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command:
        "npx ts-node src/__tests__/e2e/test-server.ts",
      cwd: "../archive_BACKEND",
      port: 5000,
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        NODE_ENV: "test",
        JWT_SECRET: "e2e-test-secret",
        JWT_EXPIRES_IN: "7d",
        PORT: "5000",
      },
    },
    {
      command: "npx next dev",
      port: 3000,
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        NODE_ENV: "test",
      },
    },
  ],
});

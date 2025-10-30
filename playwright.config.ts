import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 5000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    trace: "on-first-retry",
  },

  globalSetup: resolve("./tests/playwright/global-setup.ts"),

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  webServer: [
    {
      command: "npm run test:server",
      url: "http://localhost:5080/tests/playwright/http-ok.html",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "cd examples/vanilla && npm run dev",
      url: "http://localhost:5081",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "cd examples/react && npm run dev",
      url: "http://localhost:5082",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "cd examples/vue && npm run dev",
      url: "http://localhost:5083",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "cd examples/svelte && npm run dev",
      url: "http://localhost:5084",
      reuseExistingServer: !process.env.CI,
    },
  ],
});

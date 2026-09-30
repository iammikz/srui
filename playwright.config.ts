import { defineConfig } from "@playwright/test";

const DEMO_PORT = 5199;

export default defineConfig({
  testDir: "packages/react/tests",
  outputDir: "packages/react/tests/.playwright",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://localhost:${DEMO_PORT}`,
    trace: "off",
  },
  webServer: [
    {
      command: `corepack pnpm --filter demo dev --port ${DEMO_PORT}`,
      url: `http://localhost:${DEMO_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [{ name: "a11y", testMatch: /a11y\.spec\.ts/ }],
});

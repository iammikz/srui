import { defineConfig } from "@playwright/test";

const DEMO_PORT = 5199;
const DOCS_PORT = 5211;

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
  projects: [
    { name: "a11y", testMatch: /a11y\.spec\.ts/ },
    {
      name: "visual",
      testMatch: /visual\.spec\.ts/,
      use: {
        baseURL: `http://localhost:${DOCS_PORT}`,
        viewport: { width: 1280, height: 900 },
      },
      webServer: [
        {
          command: `corepack pnpm --filter demo dev --port ${DEMO_PORT}`,
          url: `http://localhost:${DEMO_PORT}`,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
        {
          command: `corepack pnpm --filter docs dev --port ${DOCS_PORT}`,
          url: `http://localhost:${DOCS_PORT}/docs`,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      ],
    },
  ],
});

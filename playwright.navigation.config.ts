import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "packages/react/tests",
  testMatch: /navigation-menu\.spec\.ts/,
  outputDir: "packages/react/tests/.playwright",
  use: {
    baseURL: "http://localhost:5212",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "corepack pnpm --filter docs dev --port 5212 --strictPort",
    url: "http://localhost:5212",
    reuseExistingServer: !process.env.CI,
  },
});

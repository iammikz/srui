import { defineConfig } from "@playwright/test";

const DEMO_PORT = 5199;
const DOCS_PORT = 5211;

export default defineConfig({
  testDir: "packages/react/tests",
  outputDir: "packages/react/tests/.playwright-visual",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://localhost:${DOCS_PORT}`,
    viewport: { width: 1280, height: 900 },
    trace: "off",
  },
  webServer: [
    {
      // The a11y/demo server is required too (shared snapshots dir hygiene
      // and potential cross-checks), but the docs one matters here:
      // Visual baselines must come from the production artifact —
      // dev-mode rendering (backdrop-filter in the glass preset) is not
      // rasterization-stable between screenshot passes.
      command: `corepack pnpm --filter docs build && corepack pnpm --filter docs preview --port ${DOCS_PORT} --strictPort`,
      url: `http://localhost:${DOCS_PORT}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
    },
  ],
  projects: [{ name: "visual", testMatch: /visual\.spec\.ts/ }],
});

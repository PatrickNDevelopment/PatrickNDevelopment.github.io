import { defineConfig } from '@playwright/test';

// End-to-end tests run against the production build served like GitHub Pages (scripts/serve.mjs).
// Locally the installed Microsoft Edge is used (no browser download); CI installs Chromium.
const WEB_PORT = 4183;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${WEB_PORT}/`,
    channel: process.env['CI'] ? undefined : 'msedge',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: `http://localhost:${WEB_PORT}/`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    channel: 'chrome',
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});

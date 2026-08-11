import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/storybook',
  fullyParallel: false,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: [
    { command: 'python3 -m http.server 6016 --bind 127.0.0.1 --directory apps/storybook/storybook-static', url: 'http://127.0.0.1:6016/index.html', reuseExistingServer: true },
    { command: 'python3 -m http.server 6017 --bind 127.0.0.1 --directory apps/storybook-vue/storybook-static', url: 'http://127.0.0.1:6017/index.html', reuseExistingServer: true }
  ]
})

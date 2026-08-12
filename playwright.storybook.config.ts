import { defineConfig, devices } from '@playwright/test'

const reactPort = process.env.ATLAS_EIDS_TEST_STORYBOOK_REACT_PORT ?? '6216'
const vuePort = process.env.ATLAS_EIDS_TEST_STORYBOOK_VUE_PORT ?? '6217'

export default defineConfig({
  testDir: './tests/storybook',
  fullyParallel: false,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: [
    { command: `python3 -m http.server ${reactPort} --bind 127.0.0.1 --directory apps/storybook/storybook-static`, url: `http://127.0.0.1:${reactPort}/index.html`, reuseExistingServer: false },
    { command: `python3 -m http.server ${vuePort} --bind 127.0.0.1 --directory apps/storybook-vue/storybook-static`, url: `http://127.0.0.1:${vuePort}/index.html`, reuseExistingServer: false }
  ]
})

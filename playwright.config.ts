import { defineConfig, devices } from '@playwright/test'
import { testPorts, testUrls } from './tests/e2e/support/urls.js'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  timeout: 30_000,
  expect: {
    timeout: 7_000,
    toHaveScreenshot: {
      animations: 'disabled',
      threshold: 0.3,
      maxDiffPixelRatio: 0.04
    }
  },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: testUrls.templates, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } }
  ],
  webServer: [
    { command: `python3 -m http.server ${testPorts.portal} --bind 127.0.0.1`, url: `${testUrls.portal}/index.html`, reuseExistingServer: false },
    { command: `npm run dev -w atlas-eids-react -- --host 127.0.0.1 --port ${testPorts.react} --strictPort`, url: testUrls.react, reuseExistingServer: false },
    { command: `npm run dev -w atlas-eids-vue3 -- --host 127.0.0.1 --port ${testPorts.vue} --strictPort`, url: testUrls.vue, reuseExistingServer: false },
    { command: `npm run dev -w atlas-eids-templates -- --host 127.0.0.1 --port ${testPorts.templates} --strictPort`, url: testUrls.templates, reuseExistingServer: false }
  ]
})

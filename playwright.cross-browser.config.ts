import { defineConfig, devices } from '@playwright/test'
import base from './playwright.config.js'

export default defineConfig({
  ...base,
  testMatch: 'cross-browser.spec.ts',
  retries: process.env.CI ? 1 : 0,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1366, height: 768 } } },
    { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1366, height: 768 } } }
  ]
})

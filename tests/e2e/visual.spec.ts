import { expect, test } from '@playwright/test'
import { testUrls } from './support/urls.js'

test('Pattern Lab 工作台视觉基线', async ({ page }) => {
  await page.goto('/#/workbench')
  await expect(page.getByRole('heading', { name: '角色工作台', level: 1 })).toBeVisible()
  await page.waitForTimeout(2_200)
  await page.addStyleTag({ content: '.atlas-living-orb * { animation: none !important; transition: none !important; }' })
  await expect(page).toHaveScreenshot('pattern-workbench.png', { fullPage: true, animations: 'allow' })
})

test('Pattern Lab AI 对话视觉基线', async ({ page }) => {
  await page.goto('/#/ai-chat')
  await expect(page.getByRole('heading', { name: 'AI 对话页', level: 1 })).toBeVisible()
  await page.waitForTimeout(400)
  await page.addStyleTag({ content: '.atlas-living-orb * { animation: none !important; transition: none !important; }' })
  await expect(page).toHaveScreenshot('pattern-ai-chat.png', { fullPage: true, animations: 'allow' })
})

test('官网模式库视觉基线', async ({ page }) => {
  await page.goto(`${testUrls.portal}/patterns.html`)
  await expect(page).toHaveScreenshot('website-patterns.png')
})

test('官网开发者入口视觉基线', async ({ page }, testInfo) => {
  await page.goto(`${testUrls.portal}/index.html`)
  await expect(page).toHaveScreenshot(`website-home-${testInfo.project.name}.png`)
})

test('Launcher 开发者控制台视觉基线', async ({ page }, testInfo) => {
  await page.goto(`${testUrls.portal}/launcher.html`)
  await expect(page).toHaveScreenshot(`launcher-${testInfo.project.name}.png`)
})

test('统一文档站组件 API 视觉基线', async ({ page }, testInfo) => {
  await page.goto(`${testUrls.portal}/docs-site.html#/components/api`)
  await expect(page).toHaveScreenshot(`docs-api-${testInfo.project.name}.png`)
})

test('React 与 Vue 示例首屏视觉基线', async ({ page }, testInfo) => {
  const url = testInfo.project.name === 'mobile' ? testUrls.vue : testUrls.react
  await page.goto(url)
  await expect(page).toHaveScreenshot(`framework-${testInfo.project.name}.png`)
})

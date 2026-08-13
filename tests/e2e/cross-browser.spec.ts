import { expect, test } from '@playwright/test'
import { testUrls } from './support/urls.js'

test('核心入口在三大浏览器保持可用', async ({ page }) => {
  await page.goto(`${testUrls.portal}/index.html`)
  await expect(page.getByRole('heading', { level: 1, name: 'Atlas EIDS' })).toBeVisible()
  await expect(page.locator('.orb-core, .orb').first()).toBeVisible()
  await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll')
})

test('React 与 Vue 知识库采用案例保留关键任务', async ({ page }, testInfo) => {
  const url = testInfo.project.name === 'webkit' ? testUrls.vue : testUrls.react
  await page.goto(`${url}/knowledge.html`)
  await expect(page.getByRole('heading', { level: 1, name: '知识库管理' })).toBeVisible()
  await expect(page.getByRole('button', { name: '导入文档' })).toBeVisible()
  await expect(page.getByRole('table', { name: '企业知识文档列表' })).toBeVisible()
})

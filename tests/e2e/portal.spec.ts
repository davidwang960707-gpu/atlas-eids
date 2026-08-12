import { expect, test } from '@playwright/test'
import { testUrls } from './support/urls.js'

const portal = testUrls.portal

test('首页提供完整开发者快速入口', async ({ page }) => {
  await page.goto(`${portal}/index.html`)
  await expect(page.getByRole('link', { name: '开发者快速开始' })).toBeVisible()
  await expect(page.getByRole('link', { name: '打开 Storybook' })).toHaveAttribute('href', 'http://127.0.0.1:6006/')
  await expect(page.getByRole('heading', { name: '从设计语言直接进入可运行工程' })).toBeVisible()
  await expect(page.getByText(/npm packages 尚未发布/)).toBeVisible()
})

test('Pattern Lab 为每个模式提供完整模板、源码和 CLI 动作', async ({ page }) => {
  await page.goto(`${portal}/patterns.html`)
  await page.locator('.pattern-card').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText(/角色工作台 \/ workbench/)).toBeVisible()
  await expect(page.getByRole('link', { name: '打开完整 Demo' })).toHaveAttribute('href', 'http://127.0.0.1:4176/#/workbench')
  await expect(page.locator('#dialogSourceLink')).toHaveAttribute('href', /WorkbenchPage\.tsx$/)
  await expect(page.getByRole('button', { name: '用 CLI 创建' })).toHaveAttribute('data-copy', /--local/)
})

test('统一文档站支持文档导航和组件 API 搜索', async ({ page }) => {
  await page.goto(`${portal}/docs-site.html#/getting-started`)
  await expect(page.getByRole('heading', { name: '快速开始', level: 1 })).toBeVisible()
  if ((page.viewportSize()?.width ?? 1000) < 820) await page.getByRole('button', { name: '目录' }).click()
  await page.getByRole('link', { name: '组件 API', exact: true }).click()
  await expect(page.getByRole('heading', { name: '组件 API', level: 1 })).toBeVisible()
  await page.getByPlaceholder('搜索组件、Prop 或类型').fill('Orb')
  await page.getByRole('button', { name: /AtlasOrb/ }).click()
  await expect(page.getByRole('heading', { name: 'AtlasOrb' })).toBeVisible()
  await expect(page.getByText('showRing', { exact: true })).toBeVisible()
})

test('Launcher 汇总模板、Storybook、CLI、Java 和质量入口', async ({ page }) => {
  await page.goto(`${portal}/launcher.html`)
  await expect(page.locator('.launcher-card')).toHaveCount(10)
  for (const title of ['15 个页面模板', 'React Storybook', 'Vue Storybook', '生成项目源码', 'Java 企业后端', '质量检查']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  }
  await expect(page.getByText(/npm packages 发布前请 Clone/)).toBeVisible()
})

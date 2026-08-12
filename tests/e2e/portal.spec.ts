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

test('官网企业组件遵守 Orb 语义与共享视觉基线', async ({ page }) => {
  await page.goto(`${portal}/index.html#enterprise-data`)
  await expect(page.locator('#enterprise-ui .data-table .orb-wrapper')).toHaveCount(0)
  await expect(page.locator('#enterprise-ui .table-object-icon')).toHaveCount(3)

  const geometry = await page.locator('#enterprise-ui .card-living-orb').first().evaluate((wrapper) => {
    const core = wrapper.querySelector('.orb')!
    return {
      wrapper: wrapper.getBoundingClientRect().width,
      core: core.getBoundingClientRect().width,
      position: getComputedStyle(core).position
    }
  })
  expect(geometry.position).toBe('absolute')
  expect(geometry.core).toBeGreaterThan(geometry.wrapper * .88)
})

test('Pattern Lab 为每个模式提供完整模板、源码和 CLI 动作', async ({ page }) => {
  await page.goto(`${portal}/patterns.html`)
  await page.locator('.pattern-card').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText(/角色工作台 \/ workbench/)).toBeVisible()
  await expect(page.getByRole('link', { name: '打开完整 Demo' })).toHaveAttribute('href', `${testUrls.templates}/#/workbench`)
  await expect(page.locator('#dialogSourceLink')).toHaveAttribute('href', /WorkbenchPage\.tsx$/)
  await expect(page.getByRole('button', { name: '用 CLI 创建' })).toHaveAttribute('data-copy', /--local/)
  const frame = page.frameLocator('.dialog-runtime-frame')
  await expect(frame.getByRole('heading', { name: '角色工作台', level: 1 })).toBeVisible()
  await expect(frame.locator('.atlas-panel').first()).toBeVisible()

  await page.getByRole('button', { name: '关闭预览' }).click()
  await page.getByPlaceholder('搜索模板、结构或场景').fill('数据列表页')
  await page.locator('.pattern-card').first().click()
  const tableFrame = page.frameLocator('.dialog-runtime-frame')
  await expect(tableFrame.locator('.atlas-data-table')).toBeVisible()
  await expect(tableFrame.locator('.atlas-table .atlas-living-orb')).toHaveCount(0)
  const rowHeight = await tableFrame.locator('.atlas-table tbody tr').first().evaluate((row) => row.getBoundingClientRect().height)
  expect(rowHeight).toBe(42)
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
  for (const title of ['16 个页面路由', 'React Storybook', 'Vue Storybook', '生成项目源码', 'Java 企业后端', '质量检查']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  }
  await expect(page.getByText(/npm packages 发布前请 Clone/)).toBeVisible()
})

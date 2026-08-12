import { expect, test } from '@playwright/test'

const routes = ['workbench', 'data-list', 'card-list', 'detail', 'form', 'analytics', 'settings', 'approval', 'kanban', 'calendar', 'files', 'ai-chat', 'agent-task', 'ai-review', 'ai-governance', 'ai-knowledge']

test.describe('16 个独立页面路由', () => {
  for (const route of routes) {
    test(`${route} 可以独立打开`, async ({ page }) => {
      await page.goto(`/#/${route}`)
      await expect(page.locator('main h1')).toBeVisible()
      await expect(page.locator('.page-main')).not.toBeEmpty()
      const layout = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }))
      expect(layout.scrollWidth, `${route} 不应让页面根节点产生横向溢出`).toBeLessThanOrEqual(layout.clientWidth + 1)
    })
  }
})

test('AI 审计治理版本标签在桌面和移动端保持单行', async ({ page }) => {
  await page.goto('/#/ai-governance')
  const version = page.getByText('策略版本 v2.8')
  await expect(version).toBeVisible()
  await expect(version).toHaveCSS('white-space', 'nowrap')
  const box = await version.boundingBox()
  expect(box?.width ?? 0).toBeGreaterThan(70)
  expect(box?.height ?? 0).toBeLessThan(32)
})

test('数据列表支持筛选、选择和详情抽屉', async ({ page }) => {
  await page.goto('/#/data-list')
  await page.getByLabel('搜索任务').fill('知识索引')
  await expect(page.getByRole('row', { name: /知识索引更新/ })).toBeVisible()
  await page.getByRole('button', { name: '知识索引更新' }).click()
  await expect(page.getByRole('dialog', { name: '任务详情' })).toBeVisible()
})

test('分步表单完成确认提交', async ({ page }) => {
  await page.goto('/#/form')
  await page.getByRole('button', { name: '下一步' }).click()
  await page.getByRole('button', { name: '下一步' }).click()
  await page.getByLabel('我已确认数据范围和执行边界').check()
  await page.getByRole('button', { name: '确认提交' }).click()
  await expect(page.getByText('草稿已保存')).toBeVisible()
})

test('AI 对话提交问题并返回带来源的回答', async ({ page }) => {
  await page.goto('/#/ai-chat')
  const composer = page.getByPlaceholder('描述目标、输出形式和约束条件...')
  await composer.fill('检查本月回款风险')
  await page.getByRole('button', { name: '发送' }).click()
  await expect(page.getByText(/建议优先复核高贡献客户/)).toBeVisible()
  await expect(page.getByText('引用来源').last()).toBeVisible()
})

test('Agent 高风险写入需要人工批准', async ({ page }) => {
  await page.goto('/#/agent-task')
  await page.getByRole('button', { name: '批准' }).click()
  await expect(page.getByText('已由王六批准并写入审计日志')).toBeVisible()
})

test('AI 知识工作台支持知识源、MCP 与可信引用闭环', async ({ page }) => {
  await page.goto('/#/ai-knowledge')
  await expect(page.getByRole('heading', { name: 'AI 知识工作台', level: 1 })).toBeVisible()
  await expect(page.getByText('Atlas 产品文档', { exact: true })).toBeVisible()
  await expect(page.getByText('Atlas Page Tools')).toBeVisible()
  const composer = page.getByPlaceholder('向授权知识源提问...')
  await composer.fill('跨租户访问如何处理')
  await page.getByRole('button', { name: '发送' }).click()
  await expect(page.getByText(/跨租户写入必须在执行前拒绝/)).toBeVisible()
  await expect(page.getByText('多租户数据边界')).toBeVisible()
})

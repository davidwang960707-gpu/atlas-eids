import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const frameworks = [
  { name: 'React', port: Number(process.env.ATLAS_EIDS_TEST_STORYBOOK_REACT_PORT ?? 6216), prefix: 'react-组件状态矩阵' },
  { name: 'Vue', port: Number(process.env.ATLAS_EIDS_TEST_STORYBOOK_VUE_PORT ?? 6217), prefix: 'vue-组件状态矩阵' }
]

const componentStories = [
  'button', 'input', 'select', 'textarea', 'checkbox', 'radio-group', 'switch', 'date-input',
  'search-input', 'segmented-control', 'card', 'tabs', 'breadcrumb', 'pagination', 'steps',
  'dropdown', 'table', 'tag', 'badge', 'avatar', 'statistic', 'progress', 'alert', 'tooltip',
  'object-cell', 'status-tag', 'row-actions', 'table-toolbar', 'data-table', 'page-header', 'panel-story',
  'empty', 'skeleton', 'dialog', 'drawer', 'orb', 'ai-composer', 'execution-plan',
  'ai-conversation', 'ai-message-bubble', 'ai-streaming-text', 'ai-prompts', 'ai-attachment-list',
  'ai-conversation-history', 'ai-feedback', 'mcp-server-picker', 'citation-list',
  'knowledge-source-picker', 'retrieval-trace', 'tool-call-card'
]

function storyURL(port: number, id: string) {
  return `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`
}

function docsURL(port: number, id: string) {
  return `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(id)}&viewMode=docs`
}

async function expectDocsStoriesWithinViewport(page: Page, url: string) {
  await page.setViewportSize({ width: 2048, height: 1220 })
  await page.goto(url)
  const wrappers = page.locator('.storybook-atlas')
  await expect(wrappers.first()).toBeVisible()
  const geometry = await wrappers.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect()
    return {
      left: rect.left,
      right: rect.right,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      viewportWidth: document.documentElement.clientWidth
    }
  }))
  for (const item of geometry) {
    expect(item.left).toBeGreaterThanOrEqual(0)
    expect(item.right).toBeLessThanOrEqual(item.viewportWidth)
    expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
  }
}

async function analyzeAccessibility(page: Page) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('Axe is already running') || attempt === 7) throw error
      await page.waitForTimeout(250)
    }
  }
  throw new Error('Axe accessibility analysis did not complete')
}

for (const framework of frameworks) {
  test(`${framework.name} Docs stories remain fully visible on wide screens`, async ({ page }) => {
    await expectDocsStoriesWithinViewport(page, docsURL(framework.port, `${framework.name.toLowerCase()}-ai-原生组件--docs`))
    await expectDocsStoriesWithinViewport(page, docsURL(framework.port, `${framework.prefix}--docs`))
  })

  test(`${framework.name} input supports labels, validation and keyboard focus`, async ({ page }) => {
    await page.goto(storyURL(framework.port, `${framework.prefix}--input`))
    const input = page.getByLabel('任务名称')
    await input.fill('知识库同步')
    await expect(input).toHaveValue('知识库同步')
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('负责人')).toBeFocused()
    await expect(page.getByLabel('负责人')).toHaveAttribute('aria-invalid', 'true')
  })

  test(`${framework.name} controlled switch exposes state`, async ({ page }) => {
    await page.goto(storyURL(framework.port, `${framework.prefix}--switch`))
    const toggle = page.getByRole('switch', { name: '启用审批' })
    await expect(toggle).toHaveAttribute('aria-checked', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  test(`${framework.name} dialog restores an explicit close path`, async ({ page }) => {
    await page.goto(storyURL(framework.port, `${framework.prefix}--dialog`))
    await page.getByRole('button', { name: '打开对话框' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test(`${framework.name} Orb uses the full living visual contract`, async ({ page }) => {
    await page.goto(storyURL(framework.port, `${framework.prefix}--orb`))
    const orb = page.locator('.atlas-living-orb').first()
    await expect(orb.locator('.atlas-living-orb-ring')).toHaveCount(2)
    await expect(orb.locator('.caustic')).toHaveCount(1)
    await expect(orb.locator('.liquid')).toHaveCount(1)
    const motion = await orb.evaluate((element) => ({
      ring: getComputedStyle(element.querySelector('.atlas-living-orb-ring.primary')!).animationName,
      core: getComputedStyle(element.querySelector('.atlas-living-orb-core')!).animationName,
      caustic: getComputedStyle(element.querySelector('.caustic')!).animationName
    }))
    expect(motion.ring).toContain('atlas-orb-ring-spin')
    expect(motion.core).toContain('atlas-orb-breathe')
    expect(motion.caustic).toContain('atlas-orb-collision')
  })

  test(`${framework.name} table keeps the enterprise geometry baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto(storyURL(framework.port, `${framework.prefix}--table`))
    const geometry = await page.locator('.story-stage').evaluate((stage) => ({
      width: stage.getBoundingClientRect().width,
      radius: getComputedStyle(stage.querySelector('.atlas-table-wrap')!).borderRadius,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rows: [...stage.querySelectorAll('tbody tr')].map((row) => row.getBoundingClientRect().height),
      orbCount: stage.querySelectorAll('.atlas-living-orb').length
    }))
    expect(geometry.width).toBe(1120)
    expect(geometry.radius).toBe('8px')
    expect(geometry.overflow).toBe(0)
    expect(geometry.rows).toHaveLength(4)
    for (const row of geometry.rows) expect(row).toBeGreaterThanOrEqual(42)
    expect(geometry.orbCount).toBe(0)
  })

  test(`${framework.name} AI Composer opens empty without stealing focus`, async ({ page }) => {
    await page.goto(storyURL(framework.port, `${framework.prefix}--ai-composer`))
    const input = page.getByRole('textbox')
    await expect(input).toHaveValue('')
    await expect(input).not.toBeFocused()
    await page.getByRole('button', { name: '分析风险' }).click()
    await expect(input).toHaveValue('分析风险')
  })

  test(`${framework.name} knowledge components expose sources, citations and approval`, async ({ page }) => {
    await page.goto(storyURL(framework.port, `${framework.prefix}--knowledge-source-picker`))
    await expect(page.getByText('产品文档')).toBeVisible()
    await expect(page.getByText('客户数据仓库')).toBeVisible()

    await page.goto(storyURL(framework.port, `${framework.prefix}--citation-list`))
    await expect(page.getByText('企业权限策略 v2.8')).toBeVisible()

    await page.goto(storyURL(framework.port, `${framework.prefix}--tool-call-card`))
    await expect(page.getByText('records.publish')).toBeVisible()
    await expect(page.getByText('high-risk')).toBeVisible()
  })

  for (const story of componentStories) {
    test(`${framework.name}/${story} has no serious accessibility violations`, async ({ page }) => {
      await page.goto(storyURL(framework.port, `${framework.prefix}--${story}`))
      const results = await analyzeAccessibility(page)
      const blocking = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      expect(blocking, `${framework.name}/${story}: ${blocking.map((violation) => violation.id).join(', ')}`).toEqual([])
    })
  }
}

test('React Ant Design adapter Docs remains fully visible on wide screens', async ({ page }) => {
  await expectDocsStoriesWithinViewport(page, docsURL(frameworks[0].port, 'adapters-ant-design-运行时--docs'))
})

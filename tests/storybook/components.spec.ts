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
  'empty', 'skeleton', 'dialog', 'drawer', 'orb', 'ai-composer', 'execution-plan'
]

function storyURL(port: number, id: string) {
  return `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`
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

  test(`${framework.name} AI Composer opens empty without stealing focus`, async ({ page }) => {
    await page.goto(storyURL(framework.port, `${framework.prefix}--ai-composer`))
    const input = page.getByRole('textbox')
    await expect(input).toHaveValue('')
    await expect(input).not.toBeFocused()
    await page.getByRole('button', { name: '分析风险' }).click()
    await expect(input).toHaveValue('分析风险')
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

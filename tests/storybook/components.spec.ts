import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const frameworks = [
  { name: 'React', port: 6016, prefix: 'react-组件状态矩阵' },
  { name: 'Vue', port: 6017, prefix: 'vue-组件状态矩阵' }
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

  test(`${framework.name} component matrices have no serious accessibility violations`, async ({ page }) => {
    for (const story of ['button', 'input', 'checkbox', 'switch', 'tabs', 'table', 'alert', 'dialog', 'orb', 'ai-composer', 'execution-plan']) {
      await page.goto(storyURL(framework.port, `${framework.prefix}--${story}`))
      const results = await analyzeAccessibility(page)
      const blocking = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      expect(blocking, `${framework.name}/${story}: ${blocking.map((violation) => violation.id).join(', ')}`).toEqual([])
    }
  })
}

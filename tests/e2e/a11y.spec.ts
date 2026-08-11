import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = ['workbench', 'data-list', 'form', 'analytics', 'approval', 'ai-chat', 'agent-task', 'ai-review', 'ai-governance']

for (const route of routes) {
  test(`${route} 无严重或致命 A11y 问题`, async ({ page }) => {
    await page.goto(`/#/${route}`)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    const blocking = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    expect(blocking, blocking.map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length})`).join('\n')).toEqual([])
  })
}

for (const pagePath of ['docs-site.html#/components/api', 'launcher.html']) {
  test(`${pagePath} 无严重或致命 A11y 问题`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:4173/${pagePath}`)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    const blocking = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    expect(blocking, blocking.map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length})`).join('\n')).toEqual([])
  })
}

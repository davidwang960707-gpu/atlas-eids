import { expect, test, type Page } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const reactPort = Number(process.env.ATLAS_EIDS_TEST_STORYBOOK_REACT_PORT ?? 6216)
const vuePort = Number(process.env.ATLAS_EIDS_TEST_STORYBOOK_VUE_PORT ?? 6217)

function storyURL(port: number, framework: 'react' | 'vue', story: string, globals = '') {
  const suffix = globals ? `&globals=${encodeURIComponent(globals)}` : ''
  return `http://127.0.0.1:${port}/iframe.html?id=${framework}-组件状态矩阵--${story}&viewMode=story${suffix}`
}

async function stableScreenshot(page: Page, url: string, selector: string) {
  await page.setViewportSize({ width: 1280, height: 820 })
  await page.goto(url)
  await expect(page.locator(selector)).toBeVisible()
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' })
  return page.locator(selector).screenshot()
}

for (const story of ['table', 'data-table', 'page-header', 'ai-composer', 'orb']) {
  test(`React/Vue ${story} visual parity`, async ({ page }, testInfo) => {
    const selector = story === 'table' ? '.atlas-table-wrap' : story === 'data-table' ? '.atlas-data-table' : story === 'page-header' ? '.atlas-page-header' : story === 'ai-composer' ? '.atlas-ai-composer' : '.story-control'
    const react = PNG.sync.read(await stableScreenshot(page, storyURL(reactPort, 'react', story), selector))
    const vue = PNG.sync.read(await stableScreenshot(page, storyURL(vuePort, 'vue', story), selector))
    expect({ width: vue.width, height: vue.height }).toEqual({ width: react.width, height: react.height })
    const diff = new PNG({ width: react.width, height: react.height })
    const pixels = pixelmatch(react.data, vue.data, diff.data, react.width, react.height, { threshold: .16, includeAA: false })
    await testInfo.attach(`${story}-react-vue-diff`, { body: PNG.sync.write(diff), contentType: 'image/png' })
    expect(pixels / (react.width * react.height), `${story} 跨框架像素差过大`).toBeLessThan(.035)
  })
}

test('React/Vue data table semantic and geometry contracts match', async ({ page }) => {
  const inspect = async (framework: 'react' | 'vue', port: number) => {
    await page.goto(storyURL(port, framework, 'data-table'))
    await expect(page.locator('.atlas-data-table')).toBeVisible()
    return page.locator('.atlas-data-table').evaluate((table) => {
      const semanticClasses = (selector: string) => [...table.querySelectorAll(selector)].map((element) => [...element.classList].filter((name) => name.startsWith('is-')).sort())
      const selection = table.querySelector('thead input[type="checkbox"]') as HTMLInputElement
      return {
        objectTones: semanticClasses('.atlas-object-cell'),
        statusTones: semanticClasses('.atlas-status-tag'),
        columnWidths: [...table.querySelectorAll('thead th')].map((element) => Math.round(element.getBoundingClientRect().width * 10) / 10),
        selection: { indeterminate: selection.indeterminate, ariaChecked: selection.getAttribute('aria-checked') }
      }
    })
  }

  const react = await inspect('react', reactPort)
  const vue = await inspect('vue', vuePort)
  expect(vue.objectTones).toEqual(react.objectTones)
  expect(vue.statusTones).toEqual(react.statusTones)
  expect(vue.selection).toEqual({ indeterminate: true, ariaChecked: 'mixed' })
  expect(react.selection).toEqual(vue.selection)
  expect(vue.columnWidths).toHaveLength(react.columnWidths.length)
  vue.columnWidths.forEach((width, index) => expect(Math.abs(width - react.columnWidths[index])).toBeLessThanOrEqual(1))
})

for (const framework of [{ id: 'react' as const, port: reactPort }, { id: 'vue' as const, port: vuePort }]) {
  for (const [density, expected] of [['compact', 36], ['standard', 42], ['comfortable', 50]] as const) {
    test(`${framework.id} ${density} density table geometry`, async ({ page }) => {
      await page.goto(storyURL(framework.port, framework.id, 'table', `density:${density};locale:en-US;theme:light`))
      await expect(page.locator('.atlas-table tbody tr').first()).toBeVisible()
      await expect(page.locator('.atlas-root')).toHaveAttribute('data-atlas-density', density)
      await expect(page.getByRole('checkbox', { name: 'Select all' })).toBeVisible()
      const height = await page.locator('.atlas-table tbody tr').first().evaluate((row) => row.getBoundingClientRect().height)
      expect(height).toBe(expected)
    })
  }

  test(`${framework.id} dark theme semantic surface`, async ({ page }) => {
    await page.goto(storyURL(framework.port, framework.id, 'data-table', 'density:standard;locale:zh-CN;theme:dark'))
    const colors = await page.locator('.atlas-data-table').evaluate((element) => ({ surface: getComputedStyle(element).backgroundColor, root: getComputedStyle(element.closest('.atlas-root')!).backgroundColor }))
    expect(colors.surface).not.toBe(colors.root)
    await expect(page.locator('.atlas-root')).toHaveAttribute('data-atlas-theme', 'dark')
  })

  test(`${framework.id} headless interaction contracts`, async ({ page }) => {
    await page.goto(storyURL(framework.port, framework.id, 'combobox'))
    const combobox = page.getByRole('combobox', { name: '知识库' })
    await combobox.fill('安全')
    await expect(page.getByRole('option', { name: '安全策略' })).toBeVisible()
    await combobox.press('ArrowDown')
    await combobox.press('Enter')
    await expect(combobox).toHaveValue('安全策略')
    await expect(combobox).toHaveAttribute('aria-expanded', 'false')

    await page.goto(storyURL(framework.port, framework.id, 'menu'))
    const overview = page.getByRole('menuitem', { name: '概览' })
    await overview.focus()
    await overview.press('ArrowDown')
    await expect(page.getByRole('menuitem', { name: '成员' })).toBeFocused()
    await page.getByRole('menuitem', { name: '成员' }).press('ArrowDown')
    await expect(page.getByRole('menuitem', { name: '删除' })).toBeFocused()

    await page.goto(storyURL(framework.port, framework.id, 'tree'))
    const child = page.getByRole('button', { name: '产品规范' })
    await child.focus()
    await child.press('ArrowUp')
    await expect(page.getByRole('button', { name: '企业知识', exact: true })).toBeFocused()

    await page.goto(storyURL(framework.port, framework.id, 'dialog'))
    const opener = page.getByRole('button', { name: '打开对话框' })
    await opener.click()
    await expect(page.getByRole('dialog', { name: '确认发布' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: '确认发布' })).not.toBeVisible()
    await expect(opener).toBeFocused()
  })
}

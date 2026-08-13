import { expect, test } from '@playwright/test'
import { testUrls } from './support/urls.js'

const frameworkUrls = [
  ['React', `${testUrls.react}/knowledge.html`],
  ['Vue', `${testUrls.vue}/knowledge.html`]
] as const

test('知识库样本遵守跨端组合、字体和响应式契约', async ({ page }) => {
  const snapshots = []

  for (const [framework, url] of frameworkUrls) {
    await page.goto(url)
    await expect(page.getByRole('heading', { name: '知识库管理', level: 1 })).toBeVisible()

    const snapshot = await page.evaluate(() => {
      const box = (selector: string) => {
        const rect = document.querySelector(selector)?.getBoundingClientRect()
        return rect ? [rect.x, rect.y, rect.width, rect.height].map((value) => Math.round(value)) : null
      }
      const font = (selector: string) => getComputedStyle(document.querySelector(selector)!).fontSize
      const undersizedReadableText = [...document.querySelectorAll('body *')]
        .filter((element) => element.childElementCount === 0 && element.textContent?.trim())
        .filter((element) => ['10px', '11px'].includes(getComputedStyle(element).fontSize))
        .filter((element) => !/^\d+$/.test(element.textContent!.trim()))
        .map((element) => element.textContent!.trim())

      return {
        boxes: {
          page: box('.knowledge-page'),
          metrics: box('.knowledge-metrics'),
          content: box('.knowledge-content'),
          rail: box('.knowledge-rail')
        },
        fonts: {
          page: font('.atlas-page-header h1'),
          section: font('.atlas-data-table > header h3'),
          body: font('body'),
          caption: font('.knowledge-view-note')
        },
        undersizedReadableText,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      }
    })

    expect(snapshot.fonts, `${framework} 字体层级`).toEqual({ page: '20px', section: '16px', body: '14px', caption: '12px' })
    expect(snapshot.undersizedReadableText, `${framework} 可阅读文字`).toEqual([])
    expect(snapshot.horizontalOverflow, `${framework} 横向溢出`).toBe(false)
    snapshots.push(snapshot)
  }

  expect(snapshots[0].boxes).toEqual(snapshots[1].boxes)
})

test('筛选空态同步清理详情、AI 引用和分页', async ({ page }) => {
  for (const [, url] of frameworkUrls) {
    await page.goto(url)
    await page.getByLabel('搜索知识文档').fill('完全不存在的知识')
    await expect(page.getByText('没有可查看的文档')).toBeVisible()
    await expect(page.getByText('暂无检索上下文')).toBeVisible()
    await expect(page.getByText('0 / 0')).toBeVisible()
    await expect(page.getByText('Agent 工具审批规范')).toHaveCount(0)
  }
})

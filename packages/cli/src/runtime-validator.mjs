import { mkdir, readFile } from 'node:fs/promises'
import { basename, dirname, extname, resolve } from 'node:path'

const pageSnapshot = async (page) => page.evaluate(() => {
  const visible = (element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
  }
  const selector = (element) => element.id ? `#${element.id}` : `${element.tagName.toLowerCase()}${element.classList.length ? `.${[...element.classList].slice(0, 2).join('.')}` : ''}`
  const controls = [...document.querySelectorAll('button,input,select,textarea,a[href],[role="button"],[role="menuitem"],[role="tab"]')].filter(visible)
  const nameOf = (element) => element.getAttribute('aria-label') || (element.getAttribute('aria-labelledby') ? document.getElementById(element.getAttribute('aria-labelledby'))?.textContent : '') || element.getAttribute('title') || element.textContent || (element instanceof HTMLInputElement ? element.placeholder : '')
  const ids = [...document.querySelectorAll('[id]')].map((element) => element.id)
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
  const doc = document.documentElement
  const horizontalOverflow = doc.scrollWidth > doc.clientWidth + 1 ? [`document:${doc.scrollWidth}/${doc.clientWidth}`] : []
  const clippedContent = [...document.querySelectorAll('[data-atlas-critical],.atlas-page-header,.atlas-table-toolbar,.atlas-row-actions')].filter(visible).filter((element) => {
    const rect = element.getBoundingClientRect()
    return rect.right > innerWidth + 1 || rect.left < -1
  }).map(selector)
  const undersizedTargets = controls.filter((element) => {
    const rect = element.getBoundingClientRect()
    return rect.width < 32 || rect.height < 32
  }).map(selector).slice(0, 20)
  const regions = [...document.querySelectorAll('[data-atlas-region],[role="dialog"],main')].filter(visible)
  return {
    headingCount: document.querySelectorAll('h1,[role="heading"][aria-level="1"],.atlas-page-header h1').length,
    duplicateIds: duplicates,
    unlabeledControls: controls.filter((element) => !String(nameOf(element) ?? '').trim()).map(selector).slice(0, 20),
    horizontalOverflow,
    clippedContent,
    undersizedTargets,
    primaryActionsByRegion: regions.map((region) => region.querySelectorAll('.is-primary,[data-atlas-intent="primary"],button.atlas-button.intent-primary').length)
  }
})

const mergeDom = (snapshots) => ({
  headingCount: Math.min(...snapshots.map((snapshot) => snapshot.headingCount)),
  duplicateIds: [...new Set(snapshots.flatMap((snapshot) => snapshot.duplicateIds))],
  unlabeledControls: [...new Set(snapshots.flatMap((snapshot) => snapshot.unlabeledControls))],
  horizontalOverflow: [...new Set(snapshots.flatMap((snapshot) => snapshot.horizontalOverflow))],
  clippedContent: [...new Set(snapshots.flatMap((snapshot) => snapshot.clippedContent))],
  undersizedTargets: [...new Set(snapshots.flatMap((snapshot) => snapshot.undersizedTargets))],
  primaryActionsByRegion: snapshots.flatMap((snapshot) => snapshot.primaryActionsByRegion)
})

async function compareScreenshot(actualPath, baselinePath) {
  const [{ PNG }, pixelmatchModule] = await Promise.all([import('pngjs'), import('pixelmatch')])
  const pixelmatch = pixelmatchModule.default
  const [actual, baseline] = await Promise.all([readFile(actualPath), readFile(baselinePath)])
  const actualPng = PNG.sync.read(actual)
  const baselinePng = PNG.sync.read(baseline)
  if (actualPng.width !== baselinePng.width || actualPng.height !== baselinePng.height) return 1
  const changed = pixelmatch(actualPng.data, baselinePng.data, null, actualPng.width, actualPng.height, { threshold: 0.2 })
  return changed / (actualPng.width * actualPng.height)
}

export async function validateRenderedPage(url, options = {}) {
  let chromium
  try {
    ;({ chromium } = await import('@playwright/test'))
  } catch {
    throw new Error('运行 DOM/视觉验证需要安装 @playwright/test，并执行 npx playwright install chromium')
  }
  const reportDirectory = resolve(options.reportDirectory ?? `.atlas-validation/${basename(options.sourcePath ?? 'page', extname(options.sourcePath ?? ''))}`)
  await mkdir(reportDirectory, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const captures = []
  try {
    for (const viewport of [{ id: 'desktop', width: 1440, height: 900 }, { id: 'mobile', width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 })
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      const screenshot = resolve(reportDirectory, `${viewport.id}.png`)
      await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' })
      captures.push({ ...viewport, screenshot, dom: await pageSnapshot(page) })
      await page.close()
    }
  } finally {
    await browser.close()
  }
  const visual = { desktopScreenshot: captures[0].screenshot, mobileScreenshot: captures[1].screenshot, maxDiffPixelRatio: options.maxDiffPixelRatio ?? 0.04 }
  if (options.baseline) {
    visual.baseline = resolve(options.baseline)
    visual.diffPixelRatio = await compareScreenshot(visual.desktopScreenshot, visual.baseline)
  }
  return { dom: mergeDom(captures.map((capture) => capture.dom)), visual, captures }
}

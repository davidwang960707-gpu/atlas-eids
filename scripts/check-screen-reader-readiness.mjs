import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const react = await readFile(resolve(root, 'packages/react/src/index.tsx'), 'utf8')
const vue = await readFile(resolve(root, 'packages/vue/src/index.ts'), 'utf8')
const protocol = await readFile(resolve(root, 'docs/SCREEN_READER_TEST_MATRIX.md'), 'utf8')

const contracts = [
  ['Dialog focus trap', ['focusableSelector', 'aria-labelledby', 'previousFocus']],
  ['Combobox pattern', ['role="combobox"', 'aria-activedescendant', 'role="listbox"']],
  ['Tree keyboard model', ['role="tree"', 'role="treeitem"', 'aria-level']],
  ['Data status announcement', ['role="status"', 'aria-busy']],
  ['Notification live region', ['atlas-notification-center', 'aria-live']],
  ['AI conversation live output', ['atlas-ai-message-stream', 'aria-live']],
  ['Generated chart alternative', ['atlas-ai-artifact-chart', 'aria-label']]
]

for (const [name, markers] of contracts) {
  for (const marker of markers) {
    assert.ok(react.includes(marker), `React is missing ${name}: ${marker}`)
    const vueMarker = marker.replaceAll('="', ": '").replaceAll('"', "'")
    assert.ok(vue.includes(marker) || vue.includes(vueMarker), `Vue is missing ${name}: ${marker}`)
  }
}
for (const marker of ['VoiceOver', 'NVDA', '人工状态', '不得由自动化标记为通过']) assert.ok(protocol.includes(marker), `Screen-reader protocol is missing ${marker}`)

const report = {
  automatedReadiness: 'passed',
  verifiedContracts: contracts.map(([name]) => name),
  manualStatus: 'pending-human-verification',
  manualMatrix: 'docs/SCREEN_READER_TEST_MATRIX.md',
  note: 'Automated semantic readiness is not a substitute for human VoiceOver and NVDA sign-off.'
}
await mkdir(resolve(root, 'reports'), { recursive: true })
await writeFile(resolve(root, 'reports/screen-reader-readiness.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(`Screen-reader readiness verified: ${contracts.length} semantic contracts; manual VoiceOver/NVDA sign-off remains explicit.`)

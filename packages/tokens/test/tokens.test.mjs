import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('generated themes expose semantic tokens', async () => {
  const tokens = JSON.parse(await readFile(new URL('../dist/tokens.json', import.meta.url), 'utf8'))
  assert.equal(tokens.global['color.brand.primary'], '#7B61FF')
  assert.equal(tokens.themes.light['color.action.primary'], '#4F46E5')
  assert.ok(tokens.themes.dark['color.bg.surface'])
  assert.equal(tokens.global['table.rowHeight.default'], '42px')
  assert.equal(tokens.themes.light['color.status.successSoft'], '#E8F7F0')
})

test('legacy aliases point at generated semantic variables', async () => {
  const compatibility = await readFile(new URL('../dist/compatibility.css', import.meta.url), 'utf8')
  assert.match(compatibility, /--atlas-violet: var\(--atlas-color-brand-primary\)/)
  assert.match(compatibility, /--radius-md: var\(--atlas-radius-panel\)/)
  assert.doesNotMatch(compatibility, /#[0-9A-F]{3,8}/i)
})

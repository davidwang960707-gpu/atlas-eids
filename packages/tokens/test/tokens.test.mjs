import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('generated themes expose semantic tokens', async () => {
  const tokens = JSON.parse(await readFile(new URL('../dist/tokens.json', import.meta.url), 'utf8'))
  assert.equal(tokens.global['color.brand.primary'], '#7B61FF')
  assert.equal(tokens.themes.light['color.action.primary'], '#4F46E5')
  assert.ok(tokens.themes.dark['color.bg.surface'])
})

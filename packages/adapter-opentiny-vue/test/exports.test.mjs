import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('OpenTiny runtime adapter exports Atlas wrappers', () => {
  return readFile(new URL('../dist/index.js', import.meta.url), 'utf8').then((source) => {
    for (const name of ['AtlasTinyButton', 'AtlasTinyInput', 'AtlasTinySelect', 'AtlasTinyGrid', 'AtlasTinyDialog', 'AtlasTinyDrawer', 'AtlasTinyTabs', 'AtlasTinyForm']) assert.match(source, new RegExp(`\\b${name}\\b`))
  })
})

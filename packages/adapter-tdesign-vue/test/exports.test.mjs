import test from 'node:test'
import assert from 'node:assert/strict'
import * as adapter from '../dist/index.js'

test('TDesign runtime adapter exports Atlas wrappers', () => {
  for (const name of ['AtlasTButton', 'AtlasTInput', 'AtlasTSelect', 'AtlasTTable', 'AtlasTDialog', 'AtlasTDrawer', 'AtlasTTabs', 'AtlasTForm']) assert.equal(typeof adapter[name], 'object')
})

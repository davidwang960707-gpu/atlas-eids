import test from 'node:test'
import assert from 'node:assert/strict'
import * as adapter from '../dist/index.js'

test('Ant Design runtime adapter exports Atlas wrappers', () => {
  for (const name of ['AtlasAntdProvider', 'AtlasAntdButton', 'AtlasAntdInput', 'AtlasAntdSelect', 'AtlasAntdTable', 'AtlasAntdModal', 'AtlasAntdDrawer', 'AtlasAntdTabs', 'AtlasAntdForm']) assert.equal(typeof adapter[name], 'function')
})

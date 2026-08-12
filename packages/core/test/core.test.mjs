import assert from 'node:assert/strict'
import test from 'node:test'
import { atlasComponentContracts, atlasVisualRules, createEventBus, createThemeController, resolveTheme } from '../dist/index.js'

test('theme controller notifies subscribers once per change', () => {
  const controller = createThemeController('light')
  const values = []
  controller.subscribe((theme) => values.push(theme))
  controller.setTheme('dark')
  controller.setTheme('dark')
  assert.deepEqual(values, ['dark'])
  assert.equal(resolveTheme('auto', true), 'dark')
})

test('event bus keeps event payloads isolated', () => {
  const bus = createEventBus()
  let received
  bus.on('selection', (payload) => { received = payload })
  bus.emit('selection', { id: 'AT-1048' })
  assert.deepEqual(received, { id: 'AT-1048' })
})

test('visual contracts cover all cross-framework exports without duplicates', () => {
  assert.equal(atlasComponentContracts.length, 51)
  assert.equal(new Set(atlasComponentContracts.map((contract) => contract.name)).size, 51)
  assert.deepEqual(atlasVisualRules.tableRowHeight, { compact: 36, standard: 42, comfortable: 50 })
  assert.ok(atlasComponentContracts.find((contract) => contract.name === 'AtlasOrb').semantics.includes('AI'))
  assert.ok(atlasComponentContracts.find((contract) => contract.name === 'AtlasDataTable').tokens.includes('table.rowHeight.*'))
})

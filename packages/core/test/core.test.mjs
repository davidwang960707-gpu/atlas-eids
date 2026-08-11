import assert from 'node:assert/strict'
import test from 'node:test'
import { createEventBus, createThemeController, resolveTheme } from '../dist/index.js'

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

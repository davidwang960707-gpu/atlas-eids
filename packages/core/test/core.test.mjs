import assert from 'node:assert/strict'
import test from 'node:test'
import { atlasComponentContracts, atlasVisualRules, createAtlasDataGridModel, createAtlasNotificationStore, createEventBus, createThemeController, filterAtlasMCPTools, filterAtlasOptions, flattenAtlasTree, moveAtlasActiveIndex, resolveTheme, validateAtlasDateRange, validateAtlasForm, validateAtlasGenUISchema, validateAtlasStructuredInput } from '../dist/index.js'

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

test('headless primitives keep React and Vue behavior deterministic', () => {
  assert.equal(moveAtlasActiveIndex(0, 1, 3, new Set([1])), 2)
  assert.deepEqual(filterAtlasOptions([{ label: 'Atlas', value: 'atlas' }, { label: 'Other', value: 'other' }], 'atl').map((item) => item.value), ['atlas'])
  assert.deepEqual(flattenAtlasTree([{ id: 'root', label: 'Root', children: [{ id: 'child', label: 'Child' }] }], ['root']).map((item) => [item.id, item.depth]), [['root', 0], ['child', 1]])
  assert.equal(validateAtlasDateRange({ start: '2026-08-14', end: '2026-08-13' }), '结束日期不能早于开始日期')
  assert.deepEqual(validateAtlasForm({ name: '' }, { name: [{ required: true, message: '必填' }] }), { name: '必填' })
  const model = createAtlasDataGridModel({ rows: [{ id: 2, name: 'B' }, { id: 1, name: 'A' }], columns: [{ key: 'name', title: 'Name' }], sortKey: 'name', sortDirection: 'ascending' })
  assert.deepEqual(model.visibleRows.map((row) => row.id), [1, 2])
  const store = createAtlasNotificationStore()
  let count = 0
  store.subscribe((items) => { count = items.length })
  store.push({ id: '1', title: 'Ready' })
  assert.equal(count, 1)
})

test('visual contracts cover all cross-framework exports without duplicates', () => {
  assert.equal(atlasComponentContracts.length, 67)
  assert.equal(new Set(atlasComponentContracts.map((contract) => contract.name)).size, 67)
  assert.deepEqual(atlasVisualRules.tableRowHeight, { compact: 36, standard: 42, comfortable: 50 })
  assert.equal(atlasVisualRules.typography.headingLg, 20)
  assert.equal(atlasVisualRules.typography.minimumReadable, 12)
  assert.equal(atlasVisualRules.pageComposition.maxPrimaryActionsPerRegion, 1)
  assert.equal(atlasVisualRules.pageComposition.preserveFunctionsAcrossBreakpoints, true)
  assert.ok(atlasComponentContracts.find((contract) => contract.name === 'AtlasOrb').semantics.includes('AI'))
  assert.ok(atlasComponentContracts.find((contract) => contract.name === 'AtlasDataTable').tokens.includes('table.rowHeight.*'))
})

test('AI native contracts reject unsafe or incomplete generated UI', () => {
  assert.deepEqual(validateAtlasStructuredInput([{ name: 'goal', label: '目标', type: 'text', rules: [{ required: true, message: '请输入目标' }] }], { goal: '' }), { goal: '请输入目标' })
  const schema = validateAtlasGenUISchema({ id: 'root', type: 'stack', children: [{ id: 'run', type: 'action', actionId: 'run', actionLabel: '执行' }] })
  assert.equal(schema.valid, true)
  assert.equal(validateAtlasGenUISchema({ id: 'root', type: 'action' }).valid, false)
  assert.deepEqual(filterAtlasMCPTools([{ id: 'read', serverId: 'crm', name: '读取客户', permission: 'read' }, { id: 'write', serverId: 'crm', name: '更新客户', permission: 'write' }], '更新').map((tool) => tool.id), ['write'])
})

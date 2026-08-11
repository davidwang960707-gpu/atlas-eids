import assert from 'node:assert/strict'
import test from 'node:test'
import { AtlasCrossPageAgent, AtlasHttpExecutionAuditStore, AtlasPageToolRegistry, exposeAtlasAgent, installModelContextBridge, installWebMCPBridge, validateWebMCPToolset } from '../dist/index.js'

test('registry exposes tools and protects high-risk page actions', async () => {
  const events = []
  const registry = new AtlasPageToolRegistry({ createExecutionId: () => 'execution-1', onExecution: (event) => events.push(event) })
  registry.register({
    name: 'page.publish',
    description: 'Publish the current page',
    permission: 'high-risk',
    inputSchema: { type: 'object' },
    execute: () => ({ published: true })
  })
  const pending = await registry.invoke('page.publish', { secret: 'not-in-audit' })
  assert.equal(pending.status, 'approval-required')
  assert.equal(pending.executionId, 'execution-1')
  assert.deepEqual((await registry.approve(pending.executionId)).result, { published: true })
  assert.equal(registry.replay(pending.executionId).status, 'completed')
  assert.equal('input' in registry.replay(pending.executionId), false)
  assert.equal(events.length, 2)
})

test('agent API and model context bridge expose registered tools', () => {
  const registry = new AtlasPageToolRegistry()
  registry.register({ name: 'page.read', description: 'Read', permission: 'read', inputSchema: {}, execute: () => 'ok' })
  const target = {}
  const cleanup = exposeAtlasAgent(registry, target)
  assert.equal(target.atlasAgent.tools().length, 1)
  assert.deepEqual(target.atlasAgent.history(), [])
  cleanup()
  assert.equal(target.atlasAgent, undefined)

  const registered = []
  assert.equal(installModelContextBridge(registry, { registerTool: (tool) => registered.push(tool) }), true)
  assert.equal(registered[0].name, 'page.read')
})

test('WebMCP bridge follows document.modelContext tool contracts', async () => {
  const registry = new AtlasPageToolRegistry({ createExecutionId: () => 'webmcp-1' })
  registry.register({ name: 'page.read', description: 'Read current page', permission: 'read', inputSchema: { type: 'object' }, execute: () => ({ title: 'Atlas' }) })
  const registered = []
  const controller = new AbortController()
  assert.equal(await installWebMCPBridge(registry, { registerTool: (tool, options) => registered.push({ tool, options }) }, { signal: controller.signal, exposedTo: ['https://agent.example'] }), true)
  assert.equal(registered[0].options.signal, controller.signal)
  const response = await registered[0].tool.execute({})
  assert.match(response.content[0].text, /Atlas/)
  assert.equal(validateWebMCPToolset(registry.list()).valid, true)
})

test('cross-page agent executes an ordered plan and pauses for approval', async () => {
  const navigation = []
  const first = new AtlasPageToolRegistry({ createExecutionId: () => 'cross-1' })
  const second = new AtlasPageToolRegistry({ createExecutionId: () => 'cross-2' })
  first.register({ name: 'customer.read', description: 'Read customer', permission: 'read', inputSchema: { type: 'object' }, execute: () => ({ id: 'AC-1048' }) })
  second.register({ name: 'customer.publish', description: 'Publish customer update', permission: 'high-risk', inputSchema: { type: 'object' }, execute: () => ({ published: true }) })
  const agent = new AtlasCrossPageAgent({ onNavigate: (pageId) => navigation.push(pageId) })
  agent.registerPage('customers', first)
  agent.registerPage('approval', second)
  const results = await agent.executePlan([{ pageId: 'customers', tool: 'customer.read', input: {} }, { pageId: 'approval', tool: 'customer.publish', input: {} }, { pageId: 'customers', tool: 'customer.read', input: {} }])
  assert.equal(results.length, 2)
  assert.equal(results[1].result.status, 'approval-required')
  assert.deepEqual(navigation, ['customers', 'approval'])
})

test('server audit replay maps enterprise backend records', async () => {
  const store = new AtlasHttpExecutionAuditStore({
    baseURL: 'https://atlas.example',
    headers: () => ({ authorization: 'Bearer test', 'X-Atlas-Tenant': 'atlas-cn' }),
    fetch: async () => new Response(JSON.stringify({ id: 'server-1', tool: 'records.publish', status: 'completed', createdAt: '2026-08-11T00:00:00Z', updatedAt: '2026-08-11T00:00:01Z', result: { published: true } }), { status: 200 })
  })
  const registry = new AtlasPageToolRegistry({ auditStore: store })
  const replay = await registry.replayFromAudit('server-1')
  assert.equal(replay.executionId, 'server-1')
  assert.deepEqual(replay.result, { published: true })
})

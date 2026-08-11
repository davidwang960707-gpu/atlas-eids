import assert from 'node:assert/strict'
import test from 'node:test'
import { AtlasMemoryConversationStore, AtlasMemoryRunTraceStore, AtlasPersistentConversationStore, AtlasToolRegistry, createAtlasAIRuntime, createAtlasProviderRouter } from '../dist/index.js'

test('runtime collects streaming text and tool calls', async () => {
  const provider = {
    id: 'fake',
    async *stream() {
      yield { type: 'start', requestId: 'request-1' }
      yield { type: 'text-delta', delta: 'Atlas ' }
      yield { type: 'text-delta', delta: 'ready' }
      yield { type: 'tool-call', call: { id: 'call-1', name: 'records.read', arguments: {} } }
      yield { type: 'finish', reason: 'stop' }
    }
  }
  const result = await createAtlasAIRuntime(provider).run({ messages: [{ role: 'user', content: 'status' }] })
  assert.equal(result.text, 'Atlas ready')
  assert.equal(result.toolCalls[0].name, 'records.read')
})

test('high-risk tools require explicit approval', async () => {
  const tools = new AtlasToolRegistry()
  tools.register({
    name: 'records.delete',
    description: 'Delete records',
    permission: 'high-risk',
    inputSchema: { type: 'object' },
    execute: () => 'deleted'
  })
  const call = { id: 'call-2', name: 'records.delete', arguments: {} }
  assert.equal((await tools.execute(call)).status, 'approval-required')
  assert.equal((await tools.execute(call, { approved: true })).status, 'completed')
})

test('runtime persists conversations, retries failures and records usage telemetry', async () => {
  let calls = 0
  const provider = {
    id: 'retry-provider',
    async *stream(request) {
      calls += 1
      if (calls === 1) {
        yield { type: 'error', error: new Error('temporary') }
        return
      }
      yield { type: 'text-delta', delta: `messages:${request.messages.length}` }
      yield { type: 'usage', inputTokens: 12, outputTokens: 4 }
      yield { type: 'finish', reason: 'stop' }
    }
  }
  const store = new AtlasMemoryConversationStore()
  const telemetry = []
  const runtime = createAtlasAIRuntime(provider, new AtlasToolRegistry(), {
    conversationStore: store,
    retry: { maxAttempts: 2 },
    onTelemetry: (event) => telemetry.push(event)
  })
  const first = await runtime.run({ conversationId: 'conversation-1', messages: [{ role: 'user', content: 'one' }] })
  const second = await runtime.run({ conversationId: 'conversation-1', messages: [{ role: 'user', content: 'two' }] })
  assert.equal(first.text, 'messages:1')
  assert.equal(first.usage.outputTokens, 4)
  assert.equal(second.text, 'messages:3')
  assert.equal(telemetry[0].attempts, 2)
  assert.equal((await store.load('conversation-1')).messages.length, 4)
})

test('provider router selects a model-specific provider and falls back safely', async () => {
  const provider = (id) => ({ id, async *stream() { yield { type: 'text-delta', delta: id } } })
  const router = createAtlasProviderRouter({
    providers: [provider('fast'), provider('reasoner')],
    fallback: 'fast',
    route: (request) => request.model === 'reasoner' ? 'reasoner' : undefined
  })
  assert.equal((await createAtlasAIRuntime(router).run({ model: 'reasoner', messages: [] })).text, 'reasoner')
  assert.equal((await createAtlasAIRuntime(router).run({ messages: [] })).text, 'fast')
})

test('persistent store preserves attachment and citation metadata', async () => {
  const values = new Map()
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }
  const store = new AtlasPersistentConversationStore(storage)
  await store.save({ id: 'conversation-persistent', updatedAt: '2026-08-11T00:00:00.000Z', messages: [{ role: 'user', content: '分析附件', attachments: [{ id: 'a1', name: 'report.pdf', mediaType: 'application/pdf' }], citations: [{ id: 'c1', title: '经营报告', url: 'https://example.test/report' }] }] })
  const loaded = await store.load('conversation-persistent')
  assert.equal(loaded.messages[0].attachments[0].name, 'report.pdf')
  assert.equal((await store.list()).length, 1)
  await store.remove('conversation-persistent')
  assert.equal(await store.load('conversation-persistent'), undefined)
})

test('high-risk approvals record the human decision', async () => {
  const tools = new AtlasToolRegistry()
  tools.register({ name: 'records.publish', description: 'Publish', permission: 'high-risk', inputSchema: {}, execute: () => 'published' })
  const pending = await tools.execute({ id: 'approval-1', name: 'records.publish', arguments: {} })
  assert.equal(pending.approvalId, 'approval-1')
  assert.equal((await tools.approve('approval-1', 'admin')).result, 'published')
  assert.equal(tools.approvals()[0].decidedBy, 'admin')
})

test('runtime enforces budgets, emits warnings and recovers failed traces', async () => {
  let calls = 0
  const provider = { id: 'metered', async *stream() { calls += 1; if (calls === 1) { yield { type: 'error', error: new Error('temporary outage') }; return } yield { type: 'text-delta', delta: 'recovered' }; yield { type: 'usage', inputTokens: 80, outputTokens: 10 } } }
  const traces = new AtlasMemoryRunTraceStore()
  const warnings = []
  const runtime = createAtlasAIRuntime(provider, new AtlasToolRegistry(), { traceStore: traces, createTraceId: () => `trace-${calls + 1}`, pricing: { inputPerMillion: 1, outputPerMillion: 2 }, budget: { maxInputTokens: 100, maxCostMicros: 200, warningRatio: 0.75 }, onBudgetWarning: (warning) => warnings.push(warning) })
  const failed = await runtime.run({ messages: [{ role: 'user', content: 'run' }] })
  assert.equal(failed.error.message, 'temporary outage')
  const recovered = await runtime.resume(failed.traceId)
  assert.equal(recovered.text, 'recovered')
  assert.equal(recovered.estimatedCostMicros, 100)
  assert.equal(warnings.length, 1)
  assert.equal((await runtime.trace(recovered.traceId)).recoveredFromTraceId, failed.traceId)
})

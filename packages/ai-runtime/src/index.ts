export type AtlasMessageRole = 'system' | 'user' | 'assistant' | 'tool'

export interface AtlasAIMessage {
  id?: string
  role: AtlasMessageRole
  content: string
  name?: string
  toolCallId?: string
  metadata?: Record<string, unknown>
  attachments?: AtlasAIAttachment[]
  citations?: AtlasAICitation[]
}

export interface AtlasAIAttachment {
  id: string
  name: string
  mediaType: string
  url?: string
  size?: number
}

export interface AtlasAICitation {
  id: string
  title: string
  url?: string
  excerpt?: string
}

export interface AtlasToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

export type AtlasAIStreamEvent =
  | { type: 'start'; requestId: string }
  | { type: 'text-delta'; delta: string }
  | { type: 'tool-call'; call: AtlasToolCall }
  | { type: 'usage'; inputTokens?: number; outputTokens?: number }
  | { type: 'finish'; reason?: string }
  | { type: 'error'; error: Error }

export interface AtlasAIRequest {
  messages: AtlasAIMessage[]
  model?: string
  temperature?: number
  signal?: AbortSignal
  tools?: Array<{ name: string; description: string; inputSchema: Record<string, unknown> }>
}

export interface AtlasAIProvider {
  id: string
  stream(request: AtlasAIRequest): AsyncIterable<AtlasAIStreamEvent>
}

export interface AtlasConversation {
  id: string
  messages: AtlasAIMessage[]
  updatedAt: string
}

export interface AtlasConversationStore {
  load(id: string): Promise<AtlasConversation | undefined>
  save(conversation: AtlasConversation): Promise<void>
  list?(): Promise<AtlasConversation[]>
  remove?(id: string): Promise<void>
}

export class AtlasMemoryConversationStore implements AtlasConversationStore {
  #conversations = new Map<string, AtlasConversation>()

  async load(id: string) {
    const conversation = this.#conversations.get(id)
    return conversation ? structuredClone(conversation) : undefined
  }

  async save(conversation: AtlasConversation) {
    this.#conversations.set(conversation.id, structuredClone(conversation))
  }

  async list() {
    return [...this.#conversations.values()].map((conversation) => structuredClone(conversation))
  }

  async remove(id: string) {
    this.#conversations.delete(id)
  }
}

export interface AtlasKeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export class AtlasPersistentConversationStore implements AtlasConversationStore {
  #storage: AtlasKeyValueStorage
  #prefix: string
  #indexKey: string

  constructor(storage: AtlasKeyValueStorage, prefix = 'atlas-eids:conversation:') {
    this.#storage = storage
    this.#prefix = prefix
    this.#indexKey = `${prefix}index`
  }

  async load(id: string) {
    const value = this.#storage.getItem(`${this.#prefix}${id}`)
    return value ? JSON.parse(value) as AtlasConversation : undefined
  }

  async save(conversation: AtlasConversation) {
    this.#storage.setItem(`${this.#prefix}${conversation.id}`, JSON.stringify(conversation))
    const ids = new Set(this.#ids())
    ids.add(conversation.id)
    this.#storage.setItem(this.#indexKey, JSON.stringify([...ids]))
  }

  async list() {
    const conversations = await Promise.all(this.#ids().map((id) => this.load(id)))
    return conversations.filter((conversation): conversation is AtlasConversation => Boolean(conversation))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  }

  async remove(id: string) {
    this.#storage.removeItem(`${this.#prefix}${id}`)
    this.#storage.setItem(this.#indexKey, JSON.stringify(this.#ids().filter((candidate) => candidate !== id)))
  }

  #ids(): string[] {
    try {
      return JSON.parse(this.#storage.getItem(this.#indexKey) ?? '[]') as string[]
    } catch {
      return []
    }
  }
}

export interface AtlasAIRuntimeTelemetry {
  traceId: string
  conversationId?: string
  provider: string
  model?: string
  attempts: number
  durationMs: number
  inputTokens: number
  outputTokens: number
  estimatedCostMicros: number
  recoveredFromTraceId?: string
  outcome: 'completed' | 'failed'
}

export interface AtlasAIRunTrace {
  id: string
  conversationId?: string
  provider: string
  model?: string
  status: 'running' | 'completed' | 'failed'
  attempts: number
  startedAt: string
  finishedAt?: string
  error?: string
  request: Omit<AtlasAIRequest, 'signal' | 'tools'>
  recoveredFromTraceId?: string
}

export interface AtlasRunTraceStore {
  load(id: string): Promise<AtlasAIRunTrace | undefined>
  save(trace: AtlasAIRunTrace): Promise<void>
}

export class AtlasMemoryRunTraceStore implements AtlasRunTraceStore {
  #traces = new Map<string, AtlasAIRunTrace>()
  async load(id: string) { const trace = this.#traces.get(id); return trace ? structuredClone(trace) : undefined }
  async save(trace: AtlasAIRunTrace) { this.#traces.set(trace.id, structuredClone(trace)) }
}

export interface AtlasAIRuntimeOptions {
  conversationStore?: AtlasConversationStore
  retry?: { maxAttempts?: number; delayMs?: number }
  onTelemetry?: (telemetry: AtlasAIRuntimeTelemetry) => void
  traceStore?: AtlasRunTraceStore
  createTraceId?: () => string
  pricing?: { inputPerMillion: number; outputPerMillion: number }
  budget?: { maxInputTokens?: number; maxOutputTokens?: number; maxCostMicros?: number; warningRatio?: number }
  onBudgetWarning?: (warning: { traceId: string; ratio: number; estimatedCostMicros: number }) => void
}

export interface AtlasToolDefinition {
  name: string
  description: string
  permission: 'read' | 'write' | 'high-risk'
  inputSchema: Record<string, unknown>
  execute(input: Record<string, unknown>, signal?: AbortSignal): unknown | Promise<unknown>
}

export interface AtlasApprovalRecord {
  id: string
  call: AtlasToolCall
  permission: 'high-risk'
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  decidedAt?: string
  decidedBy?: string
}

export class AtlasToolRegistry {
  #tools = new Map<string, AtlasToolDefinition>()
  #approvals = new Map<string, AtlasApprovalRecord>()

  register(tool: AtlasToolDefinition) {
    if (this.#tools.has(tool.name)) throw new Error(`Atlas AI tool already registered: ${tool.name}`)
    this.#tools.set(tool.name, tool)
    return () => this.#tools.delete(tool.name)
  }

  list() {
    return [...this.#tools.values()]
  }

  async execute(call: AtlasToolCall, options: { approved?: boolean; signal?: AbortSignal } = {}) {
    const tool = this.#tools.get(call.name)
    if (!tool) throw new Error(`Unknown Atlas AI tool: ${call.name}`)
    if (tool.permission === 'high-risk' && !options.approved) {
      const approval: AtlasApprovalRecord = { id: call.id, call: structuredClone(call), permission: 'high-risk', status: 'pending', requestedAt: new Date().toISOString() }
      this.#approvals.set(approval.id, approval)
      return { status: 'approval-required' as const, approvalId: approval.id, call, permission: tool.permission }
    }
    return { status: 'completed' as const, call, result: await tool.execute(call.arguments, options.signal) }
  }

  async approve(id: string, actor: string, signal?: AbortSignal) {
    const approval = this.#approvals.get(id)
    if (!approval || approval.status !== 'pending') throw new Error(`Atlas AI approval is not pending: ${id}`)
    approval.status = 'approved'
    approval.decidedBy = actor
    approval.decidedAt = new Date().toISOString()
    return this.execute(approval.call, { approved: true, signal })
  }

  reject(id: string, actor: string) {
    const approval = this.#approvals.get(id)
    if (!approval || approval.status !== 'pending') throw new Error(`Atlas AI approval is not pending: ${id}`)
    approval.status = 'rejected'
    approval.decidedBy = actor
    approval.decidedAt = new Date().toISOString()
    return structuredClone(approval)
  }

  approvals() {
    return [...this.#approvals.values()].map((approval) => structuredClone(approval))
  }
}

export function createAtlasAIRuntime(
  provider: AtlasAIProvider,
  tools = new AtlasToolRegistry(),
  options: AtlasAIRuntimeOptions = {}
) {
  const traceStore = options.traceStore ?? new AtlasMemoryRunTraceStore()

  const run = async (
    request: Omit<AtlasAIRequest, 'tools'> & { conversationId?: string },
    onEvent?: (event: AtlasAIStreamEvent) => void,
    recoveredFromTraceId?: string
  ) => {
    const startedAt = Date.now()
    const traceId = options.createTraceId?.() ?? globalThis.crypto?.randomUUID?.() ?? `atlas-trace-${startedAt}`
    const maxAttempts = Math.max(1, options.retry?.maxAttempts ?? 1)
    const stored = request.conversationId && options.conversationStore
      ? await options.conversationStore.load(request.conversationId)
      : undefined
    const messages = [...(stored?.messages ?? []), ...request.messages]
    const { signal, conversationId: _conversationId, ...traceRequest } = request
    const trace: AtlasAIRunTrace = {
      id: traceId,
      conversationId: request.conversationId,
      provider: provider.id,
      model: request.model,
      status: 'running',
      attempts: 0,
      startedAt: new Date(startedAt).toISOString(),
      request: structuredClone(traceRequest),
      recoveredFromTraceId
    }
    await traceStore.save(trace)
    let text = ''
    const toolCalls: AtlasToolCall[] = []
    const usage = { inputTokens: 0, outputTokens: 0 }
    let finalError: Error | undefined
    let attempts = 0
    const declaredTools = tools.list().map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
    for (attempts = 1; attempts <= maxAttempts; attempts += 1) {
      text = ''
      toolCalls.length = 0
      usage.inputTokens = 0
      usage.outputTokens = 0
      finalError = undefined
      try {
        for await (const event of provider.stream({ ...request, messages, tools: declaredTools })) {
          if (event.type === 'text-delta') text += event.delta
          if (event.type === 'tool-call') toolCalls.push(event.call)
          if (event.type === 'usage') {
            usage.inputTokens += event.inputTokens ?? 0
            usage.outputTokens += event.outputTokens ?? 0
          }
          if (event.type === 'error') finalError = event.error
          onEvent?.(event)
        }
      } catch (error) {
        finalError = error instanceof Error ? error : new Error(String(error))
        onEvent?.({ type: 'error', error: finalError })
      }
      if (!finalError || attempts >= maxAttempts) break
      const retryDelay = options.retry?.delayMs
      if (retryDelay) await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
    const estimatedCostMicros = Math.round(
      usage.inputTokens * (options.pricing?.inputPerMillion ?? 0)
      + usage.outputTokens * (options.pricing?.outputPerMillion ?? 0)
    )
    const budgetRatios = [
      options.budget?.maxInputTokens ? usage.inputTokens / options.budget.maxInputTokens : 0,
      options.budget?.maxOutputTokens ? usage.outputTokens / options.budget.maxOutputTokens : 0,
      options.budget?.maxCostMicros ? estimatedCostMicros / options.budget.maxCostMicros : 0
    ]
    const budgetRatio = Math.max(...budgetRatios)
    if (!finalError && budgetRatio > 1) {
      finalError = new Error('Atlas AI budget exceeded')
      onEvent?.({ type: 'error', error: finalError })
    } else if (budgetRatio >= (options.budget?.warningRatio ?? 0.8)) {
      options.onBudgetWarning?.({ traceId, ratio: budgetRatio, estimatedCostMicros })
    }
    if (!finalError && request.conversationId && options.conversationStore) {
      await options.conversationStore.save({
        id: request.conversationId,
        messages: [...messages, { role: 'assistant', content: text }],
        updatedAt: new Date().toISOString()
      })
    }
    trace.status = finalError ? 'failed' : 'completed'
    trace.attempts = attempts
    trace.finishedAt = new Date().toISOString()
    trace.error = finalError?.message
    await traceStore.save(trace)
    options.onTelemetry?.({
      traceId,
      conversationId: request.conversationId,
      provider: provider.id,
      model: request.model,
      attempts,
      durationMs: Date.now() - startedAt,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      estimatedCostMicros,
      recoveredFromTraceId,
      outcome: finalError ? 'failed' : 'completed'
    })
    return { traceId, text, toolCalls, usage, estimatedCostMicros, error: finalError }
  }

  return {
    provider,
    tools,
    run: (request: Omit<AtlasAIRequest, 'tools'> & { conversationId?: string }, onEvent?: (event: AtlasAIStreamEvent) => void) => run(request, onEvent),
    async resume(traceId: string, onEvent?: (event: AtlasAIStreamEvent) => void) {
      const trace = await traceStore.load(traceId)
      if (!trace || trace.status !== 'failed') throw new Error(`Atlas AI trace is not recoverable: ${traceId}`)
      return run({ ...trace.request, conversationId: trace.conversationId }, onEvent, traceId)
    },
    trace: (traceId: string) => traceStore.load(traceId)
  }
}

export function createAtlasProviderRouter(options: {
  providers: AtlasAIProvider[]
  route: (request: AtlasAIRequest) => string | undefined
  fallback: string
}): AtlasAIProvider {
  const providers = new Map(options.providers.map((provider) => [provider.id, provider]))
  if (!providers.has(options.fallback)) throw new Error(`Unknown fallback AI provider: ${options.fallback}`)
  return {
    id: 'atlas-provider-router',
    stream(request) {
      const providerId = options.route(request) ?? options.fallback
      const provider = providers.get(providerId)
      if (!provider) throw new Error(`Unknown routed AI provider: ${providerId}`)
      return provider.stream(request)
    }
  }
}

export function createOpenAICompatibleProvider(options: {
  baseURL: string
  apiKey?: string
  model: string
  fetch?: typeof fetch
  timeoutMs?: number
}): AtlasAIProvider {
  const fetcher = options.fetch ?? globalThis.fetch
  return {
    id: 'openai-compatible',
    async *stream(request) {
      const requestId = globalThis.crypto?.randomUUID?.() ?? `atlas-${Date.now()}`
      const controller = new AbortController()
      const abort = () => controller.abort(request.signal?.reason)
      request.signal?.addEventListener('abort', abort, { once: true })
      const timeout = setTimeout(() => controller.abort(new Error('AI provider request timed out')), options.timeoutMs ?? 20_000)
      yield { type: 'start', requestId }
      try {
        const response = await fetcher(`${options.baseURL.replace(/\/$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(options.apiKey ? { authorization: `Bearer ${options.apiKey}` } : {})
          },
          body: JSON.stringify({
            model: request.model ?? options.model,
            messages: request.messages,
            temperature: request.temperature,
            stream: true,
            tools: request.tools?.map((tool) => ({ type: 'function', function: { name: tool.name, description: tool.description, parameters: tool.inputSchema } }))
          }),
          signal: controller.signal
        })
        if (!response.ok || !response.body) throw new Error(`AI provider request failed: ${response.status}`)

        const decoder = new TextDecoder()
        let buffer = ''
        const reader = response.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (!data || data === '[DONE]') continue
            const payload = JSON.parse(data)
            const delta = payload.choices?.[0]?.delta?.content
            if (delta) yield { type: 'text-delta', delta }
            if (payload.usage) yield { type: 'usage', inputTokens: payload.usage.prompt_tokens, outputTokens: payload.usage.completion_tokens }
          }
        }
        yield { type: 'finish', reason: 'stop' }
      } catch (error) {
        yield { type: 'error', error: error instanceof Error ? error : new Error(String(error)) }
      } finally {
        clearTimeout(timeout)
        request.signal?.removeEventListener('abort', abort)
      }
    }
  }
}

export interface AtlasKnowledgeSource {
  id: string
  name: string
  type: 'document' | 'database' | 'website' | 'api'
  status: 'ready' | 'syncing' | 'error'
  description?: string
  tenantIds?: string[]
  roles?: string[]
  updatedAt?: string
}

export interface AtlasKnowledgeDocument {
  id: string
  sourceId: string
  title: string
  content: string
  url?: string
  metadata?: Record<string, unknown>
  tenantIds?: string[]
  roles?: string[]
}

export interface AtlasKnowledgeQuery {
  text: string
  tenantId: string
  roles?: string[]
  sourceIds?: string[]
  topK?: number
  filters?: Record<string, unknown>
  signal?: AbortSignal
}

export interface AtlasKnowledgeHit {
  id: string
  sourceId: string
  documentId: string
  title: string
  excerpt: string
  score: number
  url?: string
  metadata?: Record<string, unknown>
  tenantIds?: string[]
  roles?: string[]
}

export interface AtlasKnowledgeTraceStep {
  id: string
  title: string
  status: 'completed' | 'failed'
  durationMs: number
  detail?: string
}

export interface AtlasKnowledgeSearchResult {
  hits: AtlasKnowledgeHit[]
  trace: AtlasKnowledgeTraceStep[]
  sourceIds: string[]
}

export interface AtlasKnowledgeProvider {
  id: string
  sources(): AtlasKnowledgeSource[] | Promise<AtlasKnowledgeSource[]>
  search(query: AtlasKnowledgeQuery): Promise<AtlasKnowledgeHit[]>
}

function canAccessKnowledge(value: { tenantIds?: string[]; roles?: string[] }, tenantId: string, roles: string[]) {
  if (value.tenantIds?.length && !value.tenantIds.includes(tenantId)) return false
  if (value.roles?.length && !value.roles.some((role) => roles.includes(role))) return false
  return true
}

export class AtlasKnowledgeRegistry {
  #providers = new Map<string, AtlasKnowledgeProvider>()

  register(provider: AtlasKnowledgeProvider) {
    if (this.#providers.has(provider.id)) throw new Error(`Atlas knowledge provider already registered: ${provider.id}`)
    this.#providers.set(provider.id, provider)
    return () => this.#providers.delete(provider.id)
  }

  async sources(context: { tenantId: string; roles?: string[] }) {
    const sources = (await Promise.all([...this.#providers.values()].map((provider) => provider.sources()))).flat()
    return sources.filter((source) => canAccessKnowledge(source, context.tenantId, context.roles ?? []))
  }

  async search(query: AtlasKnowledgeQuery): Promise<AtlasKnowledgeSearchResult> {
    if (!query.text.trim()) throw new Error('Atlas knowledge query cannot be empty')
    const startedAt = Date.now()
    const roles = query.roles ?? []
    const permittedSources = await this.sources({ tenantId: query.tenantId, roles })
    const requested = query.sourceIds?.length ? new Set(query.sourceIds) : undefined
    const sourceIds = permittedSources.filter((source) => !requested || requested.has(source.id)).map((source) => source.id)
    const sourceSet = new Set(sourceIds)
    const sourceStepAt = Date.now()
    const results = await Promise.all([...this.#providers.values()].map((provider) => provider.search({ ...query, sourceIds })))
    const hits = results.flat()
      .filter((hit) => sourceSet.has(hit.sourceId) && canAccessKnowledge(hit, query.tenantId, roles))
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, query.topK ?? 8))
    return {
      hits,
      sourceIds,
      trace: [
        { id: 'scope', title: '解析租户、角色与知识范围', status: 'completed', durationMs: sourceStepAt - startedAt, detail: `${sourceIds.length} 个知识源可访问` },
        { id: 'retrieve', title: '检索并合并 Provider 结果', status: 'completed', durationMs: Date.now() - sourceStepAt, detail: `${results.flat().length} 个候选结果` },
        { id: 'rerank', title: '权限过滤、相关度排序与截断', status: 'completed', durationMs: Math.max(0, Date.now() - startedAt), detail: `返回 ${hits.length} 个可信引用` }
      ]
    }
  }
}

export class AtlasMemoryKnowledgeProvider implements AtlasKnowledgeProvider {
  id: string
  #sources: AtlasKnowledgeSource[]
  #documents: AtlasKnowledgeDocument[]

  constructor(options: { id?: string; sources: AtlasKnowledgeSource[]; documents: AtlasKnowledgeDocument[] }) {
    this.id = options.id ?? 'atlas-memory-knowledge'
    this.#sources = structuredClone(options.sources)
    this.#documents = structuredClone(options.documents)
  }

  sources() { return structuredClone(this.#sources) }

  async search(query: AtlasKnowledgeQuery) {
    const terms = query.text.toLowerCase().split(/\s+/).filter(Boolean)
    const sourceIds = query.sourceIds ? new Set(query.sourceIds) : undefined
    return this.#documents.filter((document) => !sourceIds || sourceIds.has(document.sourceId)).map((document) => {
      const searchable = `${document.title} ${document.content}`.toLowerCase()
      const matches = terms.filter((term) => searchable.includes(term)).length
      return {
        id: `${this.id}:${document.id}`,
        sourceId: document.sourceId,
        documentId: document.id,
        title: document.title,
        excerpt: document.content.slice(0, 240),
        score: terms.length ? matches / terms.length : 0,
        url: document.url,
        metadata: document.metadata,
        tenantIds: document.tenantIds,
        roles: document.roles
      }
    }).filter((hit) => hit.score > 0)
  }
}

export function createKnowledgeSearchTool(registry: AtlasKnowledgeRegistry): AtlasToolDefinition {
  return {
    name: 'knowledge.search',
    description: 'Search permission-aware Atlas knowledge sources and return citations with retrieval trace',
    permission: 'read',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        tenantId: { type: 'string' },
        roles: { type: 'array', items: { type: 'string' } },
        sourceIds: { type: 'array', items: { type: 'string' } },
        topK: { type: 'number', minimum: 1, maximum: 50 }
      },
      required: ['text', 'tenantId']
    },
    execute: (input, signal) => registry.search({
      text: String(input.text ?? ''),
      tenantId: String(input.tenantId ?? ''),
      roles: Array.isArray(input.roles) ? input.roles.map(String) : [],
      sourceIds: Array.isArray(input.sourceIds) ? input.sourceIds.map(String) : undefined,
      topK: typeof input.topK === 'number' ? input.topK : undefined,
      signal
    })
  }
}

export interface AtlasPageTool {
  name: string
  description: string
  permission: 'read' | 'write' | 'high-risk'
  inputSchema: Record<string, unknown>
  execute(input: Record<string, unknown>): unknown | Promise<unknown>
}

export interface AtlasPageExecution {
  executionId: string
  name: string
  permission: AtlasPageTool['permission']
  status: 'approval-required' | 'completed' | 'failed'
  startedAt: string
  finishedAt?: string
  result?: unknown
  error?: string
}

export interface AtlasPageToolRegistryOptions {
  onExecution?: (execution: AtlasPageExecution) => void
  createExecutionId?: () => string
  now?: () => Date
  auditStore?: AtlasExecutionAuditStore
}

export interface AtlasExecutionAuditStore {
  save?(execution: AtlasPageExecution): void | Promise<void>
  load(executionId: string): AtlasPageExecution | undefined | Promise<AtlasPageExecution | undefined>
}

export class AtlasPageToolRegistry {
  #tools = new Map<string, AtlasPageTool>()
  #executions = new Map<string, AtlasPageExecution & { input: Record<string, unknown> }>()
  #options: AtlasPageToolRegistryOptions

  constructor(options: AtlasPageToolRegistryOptions = {}) {
    this.#options = options
  }

  register(tool: AtlasPageTool) {
    if (this.#tools.has(tool.name)) throw new Error(`Atlas page tool already registered: ${tool.name}`)
    this.#tools.set(tool.name, tool)
    return () => this.#tools.delete(tool.name)
  }

  list() {
    return [...this.#tools.values()].map(({ execute: _execute, ...tool }) => tool)
  }

  async invoke(name: string, input: Record<string, unknown>, options: { approved?: boolean } = {}) {
    const tool = this.#tools.get(name)
    if (!tool) throw new Error(`Unknown Atlas page tool: ${name}`)
    const executionId = this.#options.createExecutionId?.() ?? globalThis.crypto?.randomUUID?.() ?? `atlas-${Date.now()}`
    const execution: AtlasPageExecution & { input: Record<string, unknown> } = {
      executionId,
      name,
      permission: tool.permission,
      status: 'approval-required',
      startedAt: (this.#options.now?.() ?? new Date()).toISOString(),
      input: structuredClone(input)
    }
    if (tool.permission === 'high-risk' && !options.approved) {
      this.#executions.set(executionId, execution)
      this.#emit(execution)
      return { status: 'approval-required' as const, executionId, name, permission: tool.permission }
    }
    this.#executions.set(executionId, execution)
    return this.#execute(execution, tool)
  }

  async approve(executionId: string) {
    const execution = this.#executions.get(executionId)
    if (!execution) throw new Error(`Unknown Atlas page execution: ${executionId}`)
    if (execution.status !== 'approval-required') throw new Error(`Atlas page execution is not waiting for approval: ${executionId}`)
    const tool = this.#tools.get(execution.name)
    if (!tool) throw new Error(`Atlas page tool is no longer registered: ${execution.name}`)
    return this.#execute(execution, tool)
  }

  replay(executionId: string) {
    const execution = this.#executions.get(executionId)
    if (!execution) throw new Error(`Unknown Atlas page execution: ${executionId}`)
    return this.#publicExecution(execution)
  }

  history() {
    return [...this.#executions.values()].map((execution) => this.#publicExecution(execution))
  }

  async replayFromAudit(executionId: string) {
    const local = this.#executions.get(executionId)
    if (local) return this.#publicExecution(local)
    const execution = await this.#options.auditStore?.load(executionId)
    if (!execution) throw new Error(`Unknown Atlas page execution: ${executionId}`)
    return structuredClone(execution)
  }

  async #execute(execution: AtlasPageExecution & { input: Record<string, unknown> }, tool: AtlasPageTool) {
    try {
      const result = await tool.execute(execution.input)
      execution.status = 'completed'
      execution.result = result
      execution.finishedAt = (this.#options.now?.() ?? new Date()).toISOString()
      this.#emit(execution)
      return { status: 'completed' as const, executionId: execution.executionId, name: execution.name, result }
    } catch (error) {
      execution.status = 'failed'
      execution.error = error instanceof Error ? error.message : String(error)
      execution.finishedAt = (this.#options.now?.() ?? new Date()).toISOString()
      this.#emit(execution)
      throw error
    }
  }

  #publicExecution(execution: AtlasPageExecution & { input: Record<string, unknown> }): AtlasPageExecution {
    const { input: _input, ...publicExecution } = execution
    return structuredClone(publicExecution)
  }

  #emit(execution: AtlasPageExecution & { input: Record<string, unknown> }) {
    const publicExecution = this.#publicExecution(execution)
    this.#options.onExecution?.(publicExecution)
    void this.#options.auditStore?.save?.(publicExecution)
  }
}

export class AtlasHttpExecutionAuditStore implements AtlasExecutionAuditStore {
  #baseURL: string
  #headers: () => Record<string, string> | Promise<Record<string, string>>
  #fetch: typeof fetch

  constructor(options: { baseURL?: string; headers: () => Record<string, string> | Promise<Record<string, string>>; fetch?: typeof fetch }) {
    this.#baseURL = (options.baseURL ?? '').replace(/\/$/, '')
    this.#headers = options.headers
    this.#fetch = options.fetch ?? fetch
  }

  async load(executionId: string) {
    const response = await this.#fetch(`${this.#baseURL}/api/v1/agent/executions/${encodeURIComponent(executionId)}/replay`, {
      headers: await this.#headers()
    })
    if (response.status === 404) return undefined
    if (!response.ok) throw new Error(`Atlas server replay failed: ${response.status}`)
    const payload = await response.json() as Record<string, unknown>
    return {
      executionId: String(payload.executionId ?? payload.id),
      name: String(payload.name ?? payload.tool),
      permission: (payload.permission as AtlasPageTool['permission']) ?? 'high-risk',
      status: payload.status as AtlasPageExecution['status'],
      startedAt: String(payload.startedAt ?? payload.createdAt),
      finishedAt: payload.finishedAt ? String(payload.finishedAt) : payload.updatedAt ? String(payload.updatedAt) : undefined,
      result: payload.result,
      error: payload.error ? String(payload.error) : undefined
    }
  }
}

export function createDOMToolset(root: ParentNode = document): AtlasPageTool[] {
  const find = (selector: unknown) => {
    if (typeof selector !== 'string' || !selector.trim()) throw new Error('A non-empty selector is required')
    const element = root.querySelector(selector)
    if (!element) throw new Error(`Element not found: ${selector}`)
    return element
  }

  return [
    {
      name: 'page.read',
      description: 'Read accessible text and selected attributes from an element',
      permission: 'read',
      inputSchema: { type: 'object', properties: { selector: { type: 'string' } }, required: ['selector'] },
      execute: ({ selector }) => {
        const element = find(selector)
        return {
          text: element.textContent?.trim() ?? '',
          ariaLabel: element.getAttribute('aria-label'),
          role: element.getAttribute('role')
        }
      }
    },
    {
      name: 'page.click',
      description: 'Click an interactive element',
      permission: 'write',
      inputSchema: { type: 'object', properties: { selector: { type: 'string' } }, required: ['selector'] },
      execute: ({ selector }) => {
        const element = find(selector)
        if (!(element instanceof HTMLElement)) throw new Error('Target is not interactive')
        element.click()
        return { clicked: true }
      }
    },
    {
      name: 'page.fill',
      description: 'Fill an input or textarea and dispatch an input event',
      permission: 'write',
      inputSchema: { type: 'object', properties: { selector: { type: 'string' }, value: { type: 'string' } }, required: ['selector', 'value'] },
      execute: ({ selector, value }) => {
        const element = find(selector)
        if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) throw new Error('Target does not accept text')
        element.value = String(value ?? '')
        element.dispatchEvent(new Event('input', { bubbles: true }))
        return { filled: true }
      }
    }
  ]
}

export function exposeAtlasAgent(registry: AtlasPageToolRegistry, target: Record<string, unknown> = globalThis as Record<string, unknown>) {
  const api = {
    tools: () => registry.list(),
    invoke: (name: string, input: Record<string, unknown>, options?: { approved?: boolean }) => registry.invoke(name, input, options),
    approve: (executionId: string) => registry.approve(executionId),
    replay: (executionId: string) => registry.replayFromAudit(executionId),
    history: () => registry.history()
  }
  target.atlasAgent = api
  return () => { delete target.atlasAgent }
}

export function installModelContextBridge(registry: AtlasPageToolRegistry, modelContext: { registerTool?: (tool: unknown) => void } | undefined) {
  if (!modelContext?.registerTool) return false
  registry.list().forEach((tool) => modelContext.registerTool?.({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
    execute: (input: Record<string, unknown>) => registry.invoke(tool.name, input)
  }))
  return true
}

export interface AtlasWebMCPContext {
  registerTool(tool: {
    name: string
    description: string
    inputSchema: Record<string, unknown>
    execute(input: Record<string, unknown>): Promise<{ content: Array<{ type: 'text'; text: string }> }>
  }, options?: { signal?: AbortSignal; exposedTo?: string[] }): void | Promise<void>
}

export async function installWebMCPBridge(
  registry: AtlasPageToolRegistry,
  modelContext: AtlasWebMCPContext | undefined,
  options: { signal?: AbortSignal; exposedTo?: string[] } = {}
) {
  if (!modelContext?.registerTool) return false
  for (const tool of registry.list()) {
    await modelContext.registerTool({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      async execute(input) {
        const result = await registry.invoke(tool.name, input)
        return { content: [{ type: 'text', text: JSON.stringify(result) }] }
      }
    }, options)
  }
  return true
}

export function installDocumentWebMCPBridge(
  registry: AtlasPageToolRegistry,
  targetDocument: Document = document,
  options: { signal?: AbortSignal; exposedTo?: string[] } = {}
) {
  const context = (targetDocument as Document & { modelContext?: AtlasWebMCPContext }).modelContext
  return installWebMCPBridge(registry, context, options)
}

export function validateWebMCPToolset(tools: Array<{ name: string; description: string; inputSchema: Record<string, unknown> }>) {
  const errors: string[] = []
  const names = new Set<string>()
  tools.forEach((tool, index) => {
    if (!/^[a-z][a-z0-9._-]+$/i.test(tool.name)) errors.push(`tool[${index}] has an invalid name`)
    if (names.has(tool.name)) errors.push(`duplicate tool name: ${tool.name}`)
    names.add(tool.name)
    if (!tool.description.trim()) errors.push(`${tool.name} requires a description`)
    if (tool.inputSchema.type !== 'object') errors.push(`${tool.name} inputSchema.type must be object`)
  })
  return { valid: errors.length === 0, errors }
}

export class AtlasCrossPageAgent {
  #pages = new Map<string, AtlasPageToolRegistry>()
  #onNavigate?: (pageId: string) => void | Promise<void>

  constructor(options: { onNavigate?: (pageId: string) => void | Promise<void> } = {}) {
    this.#onNavigate = options.onNavigate
  }

  registerPage(pageId: string, registry: AtlasPageToolRegistry) {
    if (this.#pages.has(pageId)) throw new Error(`Atlas agent page already registered: ${pageId}`)
    this.#pages.set(pageId, registry)
    return () => this.#pages.delete(pageId)
  }

  pages() {
    return [...this.#pages.entries()].map(([id, registry]) => ({ id, tools: registry.list() }))
  }

  async invoke(pageId: string, tool: string, input: Record<string, unknown>, options: { approved?: boolean } = {}) {
    const registry = this.#pages.get(pageId)
    if (!registry) throw new Error(`Unknown Atlas agent page: ${pageId}`)
    await this.#onNavigate?.(pageId)
    return registry.invoke(tool, input, options)
  }

  async executePlan(steps: Array<{ pageId: string; tool: string; input: Record<string, unknown>; approved?: boolean }>) {
    const results = []
    for (const step of steps) {
      const result = await this.invoke(step.pageId, step.tool, step.input, { approved: step.approved })
      results.push({ ...step, result })
      if (result.status === 'approval-required') break
    }
    return results
  }
}

export interface AtlasWebSkill {
  id: string
  title: string
  description: string
  routes?: string[]
  tags?: string[]
  content?: string
  load?: () => string | Promise<string>
  references?: Array<{ title: string; uri: string }>
}

export class AtlasWebSkillRegistry {
  #skills = new Map<string, AtlasWebSkill>()

  register(skill: AtlasWebSkill) {
    if (this.#skills.has(skill.id)) throw new Error(`Atlas WebSkill already registered: ${skill.id}`)
    if (!skill.content && !skill.load) throw new Error(`Atlas WebSkill requires content or load(): ${skill.id}`)
    this.#skills.set(skill.id, skill)
    return () => this.#skills.delete(skill.id)
  }

  list(route?: string) {
    return [...this.#skills.values()].filter((skill) => !route || !skill.routes?.length || skill.routes.some((pattern) => route === pattern || route.startsWith(pattern)))
      .map(({ content: _content, load: _load, ...skill }) => structuredClone(skill))
  }

  search(query: string, route?: string) {
    const normalized = query.trim().toLowerCase()
    return this.list(route).filter((skill) => !normalized || [skill.id, skill.title, skill.description, ...(skill.tags ?? [])].some((value) => value.toLowerCase().includes(normalized)))
  }

  async read(id: string, route?: string) {
    const skill = this.#skills.get(id)
    if (!skill || (route && skill.routes?.length && !skill.routes.some((pattern) => route === pattern || route.startsWith(pattern)))) throw new Error(`Atlas WebSkill is not available in this route: ${id}`)
    const content = skill.content ?? await skill.load?.()
    return { ...this.list().find((item) => item.id === id), content: content ?? '' }
  }
}

export function createWebSkillToolset(skills: AtlasWebSkillRegistry, getRoute: () => string): AtlasPageTool[] {
  return [
    {
      name: 'skills.list',
      description: 'List business and design skills available on the current route',
      permission: 'read',
      inputSchema: { type: 'object', properties: {} },
      execute: () => ({ route: getRoute(), skills: skills.list(getRoute()) })
    },
    {
      name: 'skills.search',
      description: 'Search progressive business knowledge without loading every skill',
      permission: 'read',
      inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
      execute: ({ query }) => ({ route: getRoute(), skills: skills.search(String(query ?? ''), getRoute()) })
    },
    {
      name: 'skills.read',
      description: 'Load the full content of one route-authorized skill',
      permission: 'read',
      inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      execute: ({ id }) => skills.read(String(id ?? ''), getRoute())
    }
  ]
}

export class AtlasRouteAwareAgent {
  #route: string
  #registry: AtlasPageToolRegistry
  #skills: AtlasWebSkillRegistry
  #cleanup: Array<() => void> = []

  constructor(options: { route: string; registry?: AtlasPageToolRegistry; skills?: AtlasWebSkillRegistry }) {
    this.#route = options.route
    this.#registry = options.registry ?? new AtlasPageToolRegistry()
    this.#skills = options.skills ?? new AtlasWebSkillRegistry()
    this.#cleanup = createWebSkillToolset(this.#skills, () => this.#route).map((tool) => this.#registry.register(tool))
  }

  navigate(route: string) { this.#route = route }
  route() { return this.#route }
  registry() { return this.#registry }
  skills() { return this.#skills.list(this.#route) }
  dispose() { this.#cleanup.forEach((cleanup) => cleanup()); this.#cleanup = [] }
}

export class AtlasRemoteAgentClient {
  #baseURL: string
  #headers: () => Record<string, string> | Promise<Record<string, string>>
  #fetch: typeof fetch

  constructor(options: { baseURL?: string; headers: () => Record<string, string> | Promise<Record<string, string>>; fetch?: typeof fetch }) {
    this.#baseURL = (options.baseURL ?? '').replace(/\/$/, '')
    this.#headers = options.headers
    this.#fetch = options.fetch ?? fetch
  }

  async #request(path: string, init: RequestInit = {}) {
    const response = await this.#fetch(`${this.#baseURL}${path}`, { ...init, headers: { 'content-type': 'application/json', ...(await this.#headers()), ...(init.headers ?? {}) } })
    if (!response.ok && response.status !== 202) throw new Error(`Atlas remote agent request failed: ${response.status}`)
    return response.json() as Promise<Record<string, unknown>>
  }

  listTools() { return this.#request('/api/v1/agent/tools') }
  history() { return this.#request('/api/v1/agent/executions') }
  execute(name: string, input: Record<string, unknown>) { return this.#request('/api/v1/agent/tools/execute', { method: 'POST', body: JSON.stringify({ name, input, approved: false }) }) }
  approve(executionId: string) { return this.#request(`/api/v1/agent/executions/${encodeURIComponent(executionId)}/approve`, { method: 'POST' }) }
  replay(executionId: string) { return this.#request(`/api/v1/agent/executions/${encodeURIComponent(executionId)}/replay`) }
}

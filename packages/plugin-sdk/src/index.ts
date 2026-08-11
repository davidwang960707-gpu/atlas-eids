export interface AtlasComponentDescriptor {
  id: string
  name: string
  framework: 'react' | 'vue' | 'web-component' | 'framework-neutral'
  source: string
  exportName?: string
  category: 'foundation' | 'data' | 'navigation' | 'feedback' | 'ai'
  props?: Record<string, unknown>
}

export interface AtlasPageDescriptor {
  id: string
  name: string
  category: string
  source?: string
  capabilities: string[]
}

export interface AtlasToolDescriptor {
  id: string
  name: string
  permission: 'read' | 'write' | 'high-risk'
  inputSchema?: Record<string, unknown>
}

export interface AtlasRegistryAccess<Item extends { id: string }> {
  register(item: Item, options?: { replace?: boolean }): () => boolean
  unregister(id: string): boolean
  get(id: string): Item | undefined
  list(): Item[]
}

export class AtlasRegistry<Item extends { id: string }> implements AtlasRegistryAccess<Item> {
  #items = new Map<string, Item>()

  register(item: Item, options: { replace?: boolean } = {}) {
    if (this.#items.has(item.id) && !options.replace) {
      throw new Error(`Atlas registry item already exists: ${item.id}`)
    }
    this.#items.set(item.id, item)
    return () => this.unregister(item.id)
  }

  unregister(id: string) {
    return this.#items.delete(id)
  }

  get(id: string) {
    return this.#items.get(id)
  }

  list() {
    return [...this.#items.values()]
  }
}

export interface AtlasPluginContext {
  components: AtlasRegistryAccess<AtlasComponentDescriptor>
  pages: AtlasRegistryAccess<AtlasPageDescriptor>
  tools: AtlasRegistryAccess<AtlasToolDescriptor>
  tokens: Map<string, string>
}

export type AtlasPluginPermission = 'components:write' | 'pages:write' | 'tools:write' | 'tokens:write'

export interface AtlasPluginDependency {
  id: string
  version?: string
}

export interface AtlasPlugin {
  id: string
  name: string
  version: string
  apiVersion?: string
  permissions?: AtlasPluginPermission[]
  dependencies?: AtlasPluginDependency[]
  setup(context: AtlasPluginContext): void | (() => void) | Promise<void | (() => void)>
}

export const defineAtlasPlugin = <Plugin extends AtlasPlugin>(plugin: Plugin) => plugin

export interface AtlasPluginHostOptions {
  apiVersion?: string
  grantedPermissions?: AtlasPluginPermission[]
}

const allPermissions: AtlasPluginPermission[] = ['components:write', 'pages:write', 'tools:write', 'tokens:write']

function major(version: string) {
  const match = version.match(/\d+/)
  return match ? Number(match[0]) : 0
}

function compatible(version: string, range?: string) {
  if (!range || range === '*') return true
  if (range.startsWith('^')) return major(version) === major(range)
  return version === range
}

export function createPluginHost(initialTokens: Record<string, string> = {}, options: AtlasPluginHostOptions = {}) {
  const context: AtlasPluginContext = {
    components: new AtlasRegistry(),
    pages: new AtlasRegistry(),
    tools: new AtlasRegistry(),
    tokens: new Map(Object.entries(initialTokens))
  }
  const installed = new Map<string, { plugin: AtlasPlugin; dispose?: () => void }>()
  const apiVersion = options.apiVersion ?? '1.0.0'
  const granted = new Set(options.grantedPermissions ?? allPermissions)

  const scopedRegistry = <Item extends { id: string }>(
    registry: AtlasRegistryAccess<Item>,
    permission: AtlasPluginPermission,
    requested: Set<AtlasPluginPermission>,
    disposers: Array<() => boolean>
  ): AtlasRegistryAccess<Item> => ({
    register(item, registerOptions) {
      if (!requested.has(permission)) throw new Error(`Atlas plugin permission required: ${permission}`)
      const dispose = registry.register(item, registerOptions)
      const cleanup = () => dispose()
      Object.defineProperty(cleanup, 'atlasItemId', { value: item.id })
      disposers.push(cleanup)
      return cleanup
    },
    unregister(id) {
      const owned = disposers.some((dispose) => (dispose as { atlasItemId?: string }).atlasItemId === id)
      if (!owned) throw new Error(`Atlas plugin cannot unregister an item it does not own: ${id}`)
      return registry.unregister(id)
    },
    get: (id) => registry.get(id),
    list: () => registry.list()
  })

  return {
    context,
    async install(plugin: AtlasPlugin) {
      if (installed.has(plugin.id)) throw new Error(`Atlas plugin already installed: ${plugin.id}`)
      if (plugin.apiVersion && major(plugin.apiVersion) !== major(apiVersion)) {
        throw new Error(`Atlas plugin API is incompatible: ${plugin.apiVersion} requires host ${apiVersion}`)
      }
      for (const dependency of plugin.dependencies ?? []) {
        const installedDependency = installed.get(dependency.id)?.plugin
        if (!installedDependency || !compatible(installedDependency.version, dependency.version)) {
          throw new Error(`Atlas plugin dependency is missing or incompatible: ${dependency.id}@${dependency.version ?? '*'}`)
        }
      }
      const requested = new Set(plugin.permissions ?? allPermissions)
      for (const permission of requested) {
        if (!granted.has(permission)) throw new Error(`Atlas plugin permission denied: ${permission}`)
      }
      const registrationDisposers: Array<() => boolean> = []
      const tokenSnapshot = new Map(context.tokens)
      const scopedContext: AtlasPluginContext = {
        components: scopedRegistry(context.components, 'components:write', requested, registrationDisposers),
        pages: scopedRegistry(context.pages, 'pages:write', requested, registrationDisposers),
        tools: scopedRegistry(context.tools, 'tools:write', requested, registrationDisposers),
        tokens: requested.has('tokens:write') ? context.tokens : new Map(context.tokens)
      }
      try {
        const setupDispose = await plugin.setup(scopedContext)
        const tokenChanges = new Map<string, { before?: string; after?: string }>()
        if (requested.has('tokens:write')) {
          const keys = new Set([...tokenSnapshot.keys(), ...context.tokens.keys()])
          keys.forEach((key) => {
            const before = tokenSnapshot.get(key)
            const after = context.tokens.get(key)
            if (before !== after) tokenChanges.set(key, { before, after })
          })
        }
        installed.set(plugin.id, {
          plugin,
          dispose: () => {
            setupDispose?.()
            registrationDisposers.reverse().forEach((dispose) => dispose())
            tokenChanges.forEach(({ before, after }, key) => {
              if (context.tokens.get(key) !== after) return
              if (before === undefined) context.tokens.delete(key)
              else context.tokens.set(key, before)
            })
          }
        })
      } catch (error) {
        registrationDisposers.reverse().forEach((dispose) => dispose())
        throw error
      }
    },
    uninstall(id: string) {
      const entry = installed.get(id)
      entry?.dispose?.()
      return installed.delete(id)
    },
    listPlugins() {
      return [...installed.values()].map(({ plugin }) => ({
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        permissions: plugin.permissions ?? allPermissions
      }))
    }
  }
}

export interface AtlasPluginManifest {
  id: string
  name: string
  version: string
  apiVersion: string
  entry: string
  sandbox: 'worker' | 'iframe'
  permissions: AtlasPluginPermission[]
  exposes: string[]
  integrity?: string
}

export interface AtlasSignedPluginManifest {
  manifest: AtlasPluginManifest
  signature: string
  keyId: string
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

export async function signAtlasPluginManifest(manifest: AtlasPluginManifest, keyId: string, privateKey: CryptoKey): Promise<AtlasSignedPluginManifest> {
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, new TextEncoder().encode(canonical(manifest)))
  return { manifest: structuredClone(manifest), signature: toBase64Url(new Uint8Array(signature)), keyId }
}

export async function verifyAtlasPluginManifest(signed: AtlasSignedPluginManifest, publicKey: CryptoKey) {
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    fromBase64Url(signed.signature),
    new TextEncoder().encode(canonical(signed.manifest))
  )
}

export interface AtlasPluginIndexEntry {
  id: string
  manifestUrl: string
  title?: string
  summary?: string
}

export class AtlasPluginIndex {
  #entries = new Map<string, AtlasPluginIndexEntry>()

  constructor(entries: AtlasPluginIndexEntry[] = []) {
    entries.forEach((entry) => this.add(entry))
  }

  add(entry: AtlasPluginIndexEntry) {
    if (!entry.id || !/^https:\/\//.test(entry.manifestUrl)) throw new Error('Atlas plugin index requires an HTTPS manifest URL')
    this.#entries.set(entry.id, structuredClone(entry))
  }

  get(id: string) { const entry = this.#entries.get(id); return entry ? structuredClone(entry) : undefined }
  list() { return [...this.#entries.values()].map((entry) => structuredClone(entry)) }

  static async load(url: string, fetcher: typeof fetch = fetch) {
    if (!/^https:\/\//.test(url)) throw new Error('Atlas plugin index must use HTTPS')
    const response = await fetcher(url)
    if (!response.ok) throw new Error(`Atlas plugin index request failed: ${response.status}`)
    const payload = await response.json() as { plugins?: AtlasPluginIndexEntry[] }
    return new AtlasPluginIndex(payload.plugins ?? [])
  }
}

export interface AtlasSandboxMessage {
  atlasPlugin: true
  requestId: string
  type: 'request' | 'response' | 'error'
  method?: string
  payload?: unknown
  error?: string
}

export interface AtlasSandboxTransport {
  post(message: AtlasSandboxMessage): void
  subscribe(listener: (message: AtlasSandboxMessage) => void): () => void
  dispose(): void
}

export class AtlasPluginSandbox {
  #manifest: AtlasPluginManifest
  #transport: AtlasSandboxTransport
  #timeoutMs: number
  #pending = new Map<string, { resolve: (value: unknown) => void; reject: (error: Error) => void; timeout: ReturnType<typeof setTimeout> }>()
  #unsubscribe: () => void

  constructor(manifest: AtlasPluginManifest, transport: AtlasSandboxTransport, timeoutMs = 10_000) {
    this.#manifest = structuredClone(manifest)
    this.#transport = transport
    this.#timeoutMs = timeoutMs
    this.#unsubscribe = transport.subscribe((message) => this.#receive(message))
  }

  invoke(method: string, payload?: unknown) {
    if (!this.#manifest.exposes.includes(method)) throw new Error(`Atlas plugin method is not exposed: ${method}`)
    const requestId = crypto.randomUUID()
    return new Promise<unknown>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.#pending.delete(requestId)
        reject(new Error(`Atlas plugin sandbox timed out: ${method}`))
      }, this.#timeoutMs)
      this.#pending.set(requestId, { resolve, reject, timeout })
      this.#transport.post({ atlasPlugin: true, requestId, type: 'request', method, payload: structuredClone(payload) })
    })
  }

  dispose() {
    this.#unsubscribe()
    this.#pending.forEach(({ reject, timeout }) => { clearTimeout(timeout); reject(new Error('Atlas plugin sandbox disposed')) })
    this.#pending.clear()
    this.#transport.dispose()
  }

  #receive(message: AtlasSandboxMessage) {
    if (!message?.atlasPlugin || !['response', 'error'].includes(message.type)) return
    const pending = this.#pending.get(message.requestId)
    if (!pending) return
    clearTimeout(pending.timeout)
    this.#pending.delete(message.requestId)
    if (message.type === 'error') pending.reject(new Error(message.error ?? 'Atlas plugin sandbox failed'))
    else pending.resolve(structuredClone(message.payload))
  }
}

export function createAtlasWorkerSandbox(manifest: AtlasPluginManifest, worker: Pick<Worker, 'postMessage' | 'addEventListener' | 'removeEventListener' | 'terminate'>, timeoutMs?: number) {
  const transport: AtlasSandboxTransport = {
    post: (message) => worker.postMessage(message),
    subscribe(listener) {
      const handler = (event: MessageEvent<AtlasSandboxMessage>) => listener(event.data)
      worker.addEventListener('message', handler as EventListener)
      return () => worker.removeEventListener('message', handler as EventListener)
    },
    dispose: () => worker.terminate()
  }
  return new AtlasPluginSandbox(manifest, transport, timeoutMs)
}

export function createAtlasIframeSandbox(manifest: AtlasPluginManifest, frame: HTMLIFrameElement, hostWindow: Window = window, targetOrigin: string, timeoutMs?: number) {
  if (!frame.hasAttribute('sandbox')) frame.setAttribute('sandbox', 'allow-scripts')
  const transport: AtlasSandboxTransport = {
    post(message) { frame.contentWindow?.postMessage(message, targetOrigin) },
    subscribe(listener) {
      const handler = (event: MessageEvent<AtlasSandboxMessage>) => {
        if (event.source === frame.contentWindow && event.origin === targetOrigin) listener(event.data)
      }
      hostWindow.addEventListener('message', handler as EventListener)
      return () => hostWindow.removeEventListener('message', handler as EventListener)
    },
    dispose() { frame.remove() }
  }
  return new AtlasPluginSandbox(manifest, transport, timeoutMs)
}

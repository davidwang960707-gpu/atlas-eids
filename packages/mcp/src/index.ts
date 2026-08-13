import { createServer, type Server as HttpServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import * as z from 'zod/v4'
import { createAtlasMCPService, type AtlasMCPService, type AtlasMCPServiceOptions } from './service.js'

export { createAtlasMCPService, type AtlasMCPService, type AtlasMCPServiceOptions } from './service.js'

const response = (value: unknown) => ({
  content: [{ type: 'text' as const, text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }]
})

export function createAtlasMcpServer(options: AtlasMCPServiceOptions & { service?: AtlasMCPService } = {}) {
  const service = options.service ?? createAtlasMCPService(options)
  const server = new McpServer(
    { name: 'atlas-eids', version: '0.2.0-beta.3' },
    { instructions: '先用 atlas_get_skill 按需读取规则，再查询页面模式和组件 API，然后生成或修改页面。Orb 只能用于 AI 身份和运行状态。所有生成结果必须调用 atlas_validate_page。' }
  )

  const resources: Array<[string, string, string, unknown]> = [
    ['atlas-design-manifest', 'atlas://design/manifest', 'Atlas EIDS 设计原则、组件与页面模式清单', service.resources.manifest],
    ['atlas-components', 'atlas://design/components', 'React/Vue 组件知识与使用语义', service.resources.components],
    ['atlas-page-patterns', 'atlas://design/page-patterns', '企业与 AI 原生页面模式', service.resources.patterns],
    ['atlas-skills', 'atlas://design/skills', '可渐进读取的 Atlas Skills 清单', service.resources.skills]
  ]
  resources.forEach(([name, uri, description, value]) => server.registerResource(name, uri, { title: name, description, mimeType: 'application/json' }, async () => ({ contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(value, null, 2) }] })))

  server.registerResource('atlas-tokens', 'atlas://design/tokens', { title: 'Atlas Design Tokens', description: '当前工作区 Token 源文件', mimeType: 'application/json' }, async () => ({
    contents: [{ uri: 'atlas://design/tokens', mimeType: 'application/json', text: await service.readWorkspaceResource('packages/tokens/src/tokens.json', {}) }]
  }))

  const machineManifests = [
    ['component-contracts', 'component-manifest.json', '完整组件视觉、语义与 API 契约'],
    ['page-recipes', 'page-recipes.json', '企业与 AI 页面组合配方'],
    ['token-contract', 'token-contract.json', '版本化语义 Token 契约'],
    ['visual-rules', 'visual-rules.json', '跨框架视觉与语义约束']
  ] as const
  machineManifests.forEach(([id, file, description]) => server.registerResource(`atlas-${id}`, `atlas://contracts/${id}`, { title: `Atlas ${id}`, description, mimeType: 'application/json' }, async () => ({
    contents: [{ uri: `atlas://contracts/${id}`, mimeType: 'application/json', text: await service.readDesignManifest(file) }]
  })))

  server.registerTool('atlas_list_components', {
    title: '查询 Atlas 组件',
    description: '按名称、用途或分类查询 React/Vue 标准组件。',
    inputSchema: z.object({ query: z.string().default(''), category: z.enum(['foundation', 'input', 'navigation', 'display', 'feedback', 'composition', 'ai']).optional() }),
    annotations: { readOnlyHint: true }
  }, ({ query, category }) => response(service.listComponents(query, category)))

  server.registerTool('atlas_get_component_api', {
    title: '读取组件 API',
    description: '读取组件用途、禁用场景、框架支持和当前 TypeScript API 文档。',
    inputSchema: z.object({ name: z.string().min(1) }),
    annotations: { readOnlyHint: true }
  }, async ({ name }) => {
    const knowledge = service.getComponent(name)
    const apiText = await service.readWorkspaceResource('docs/component-api.generated.json', [])
    const api = JSON.parse(apiText) as Array<{ name: string }>
    return response({ knowledge, api: api.find((entry) => entry.name === knowledge.name) })
  })

  server.registerTool('atlas_get_visual_contract', {
    title: '读取组件视觉契约',
    description: '读取组件的 Anatomy、States、Density、语义边界和必需 Tokens。',
    inputSchema: z.object({ name: z.string().min(1) }),
    annotations: { readOnlyHint: true }
  }, ({ name }) => response({ component: service.getComponent(name), globalRules: service.resources.visualRules }))

  server.registerTool('atlas_list_page_patterns', {
    title: '查询页面模式',
    description: '查询企业通用、业务场景和 AI 原生页面模式。',
    inputSchema: z.object({ query: z.string().default('') }),
    annotations: { readOnlyHint: true }
  }, ({ query }) => response(service.listPatterns(query)))

  server.registerTool('atlas_get_skill', {
    title: '读取 Atlas Skill',
    description: '按需读取一个 Atlas Skill；先查看 References 清单，再用 reference 参数读取所需细节，避免一次加载全部设计知识。',
    inputSchema: z.object({ id: z.string().min(1), reference: z.string().optional() }),
    annotations: { readOnlyHint: true }
  }, async ({ id, reference }) => response(await service.getSkill(id, reference)))

  server.registerTool('atlas_plan_page', {
    title: '规划 Atlas 页面',
    description: '根据自然语言意图选择页面模式、组件和验证要求。',
    inputSchema: z.object({
      intent: z.string().min(2),
      pattern: z.string().optional(),
      framework: z.enum(['react', 'vue']).default('react'),
      density: z.enum(['compact', 'standard', 'comfortable']).default('standard'),
      locale: z.enum(['zh-CN', 'en-US']).default('zh-CN')
    }),
    annotations: { readOnlyHint: true }
  }, (input) => response(service.planPage(input)))

  server.registerTool('atlas_validate_page', {
    title: '校验 Atlas 页面',
    description: '检查 Token、圆角、表格/表面组合、Orb 语义、AI 证据链和高风险人工控制。',
    inputSchema: z.object({ source: z.string().optional(), path: z.string().optional(), framework: z.enum(['react', 'vue']).optional(), aiPage: z.boolean().default(false) }),
    annotations: { readOnlyHint: true }
  }, async (input) => response(await service.validateSource(input)))

  server.registerTool('atlas_create_app', {
    title: '创建 Atlas 企业应用',
    description: '使用 CLI 创建含路由、菜单、权限、主题、多租户和可选 Java Client 的应用。目标必须位于工作区内且不能已存在。',
    inputSchema: z.object({
      name: z.string().min(1), framework: z.enum(['react', 'vue']).default('react'), template: z.string().default('workbench'),
      layout: z.enum(['sidebar', 'top', 'hybrid', 'workbench', 'tabs', 'fullscreen', 'tenant']).default('sidebar'),
      density: z.enum(['compact', 'standard', 'comfortable']).default('standard'), locale: z.enum(['zh-CN', 'en-US']).default('zh-CN'),
      adapter: z.enum(['native', 'antd', 'tdesign', 'opentiny']).default('native'), backend: z.enum(['none', 'java']).default('none')
    }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false }
  }, async (input) => response(await service.createApp(input)))

  server.registerTool('atlas_generate_page', {
    title: '生成 Atlas 页面',
    description: '从标准页面模式生成可运行 React 或 Vue 页面源码。默认拒绝覆盖已有文件。',
    inputSchema: z.object({ pattern: z.string().min(1), framework: z.enum(['react', 'vue']).default('react'), output: z.string().min(1), overwrite: z.boolean().default(false) }),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false }
  }, async (input) => response(await service.generatePage(input)))

  server.registerTool('atlas_preview_upgrade', {
    title: '预览 Atlas 模板升级',
    description: '只读预览已有项目的框架、密度、语言和 Adapter 升级差异。',
    inputSchema: z.object({ target: z.string().default('.'), layout: z.string().optional(), density: z.string().optional(), locale: z.string().optional(), adapter: z.string().optional() }),
    annotations: { readOnlyHint: true }
  }, async (input) => response(await service.previewUpgrade(input)))

  server.registerPrompt('atlas-build-enterprise-page', {
    title: '构建 Atlas 企业页面',
    description: '生成遵守 Atlas EIDS 组件、Token、AI 证据链和视觉规则的页面。',
    argsSchema: { intent: z.string(), framework: z.enum(['react', 'vue']).default('react') }
  }, ({ intent, framework }) => ({ messages: [{ role: 'user', content: { type: 'text', text: `为以下需求构建 ${framework} 页面：${intent}\n先调用 atlas_get_skill、atlas_plan_page 和 atlas_get_component_api，生成后必须调用 atlas_validate_page，并修复所有 error。` } }] }))

  return { server, service }
}

export async function serveAtlasMcpHttp(options: AtlasMCPServiceOptions & { port?: number; host?: string; allowedHosts?: string[] } = {}): Promise<{ server: HttpServer; url: string; close(): Promise<void> }> {
  const host = options.host ?? '127.0.0.1'
  const port = options.port ?? 7331
  const allowedHosts = new Set(options.allowedHosts ?? [`${host}:${port}`, `localhost:${port}`, `127.0.0.1:${port}`])
  const { server: mcp } = createAtlasMcpServer(options)
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => randomUUID() })
  await mcp.connect(transport)
  const httpServer = createServer(async (request, responseStream) => {
    if (request.url !== '/mcp') { responseStream.writeHead(404).end(); return }
    if (!allowedHosts.has(request.headers.host ?? '')) { responseStream.writeHead(403).end('Forbidden host'); return }
    await transport.handleRequest(request, responseStream)
  })
  await new Promise<void>((resolve, reject) => { httpServer.once('error', reject); httpServer.listen(port, host, resolve) })
  return {
    server: httpServer,
    url: `http://${host}:${port}/mcp`,
    async close() { await mcp.close(); await new Promise<void>((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve())) }
  }
}

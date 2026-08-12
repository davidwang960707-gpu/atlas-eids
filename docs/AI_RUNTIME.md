# AI Runtime 与网页 Agent

## AI Runtime

`@atlas-eids/ai-runtime` 将模型接入、流式输出、知识检索和 Tool Call 与 UI 组件解耦。

```ts
import { AtlasPersistentConversationStore, AtlasToolRegistry, createAtlasAIRuntime, createAtlasProviderRouter, createOpenAICompatibleProvider } from '@atlas-eids/ai-runtime'

const provider = createOpenAICompatibleProvider({
  baseURL: '/api/v1',
  model: 'atlas-reasoner'
})
const tools = new AtlasToolRegistry()
tools.register({
  name: 'records.publish',
  description: '发布已确认记录',
  permission: 'high-risk',
  inputSchema: { type: 'object' },
  execute: async (input) => input
})

const store = new AtlasPersistentConversationStore(localStorage)
const runtime = createAtlasAIRuntime(provider, tools, {
  conversationStore: store,
  retry: { maxAttempts: 2, delayMs: 200 },
  pricing: { inputPerMillion: 0.25, outputPerMillion: 2 },
  budget: { maxCostMicros: 5000, warningRatio: 0.8 },
  onBudgetWarning(warning) {
    console.warn('本次运行接近预算上限', warning.ratio)
  },
  onTelemetry(event) {
    console.log(event.traceId, event.provider, event.estimatedCostMicros, event.durationMs)
  }
})

const result = await runtime.run({
  conversationId: 'conversation-2048',
  messages: [{
    role: 'user',
    content: '分析当前风险',
    attachments: [{ id: 'report', name: 'report.pdf', mediaType: 'application/pdf' }]
  }]
})

if (result.error) await runtime.resume(result.traceId)
```

Runtime 支持附件、引用、会话列表与删除、失败重试、超时、预算阈值、Token Usage、成本估算和运行 Trace。`createAtlasProviderRouter` 可以根据模型、租户策略或任务类型选择 Provider，并保留安全 Fallback。`AtlasPersistentConversationStore` 可接收 `localStorage` 或同接口存储；浏览器本地持久化仍只适合 Demo，生产环境应实现数据库 Store，并设置消息保留、脱敏和删除策略。

高风险工具先生成 `AtlasApprovalRecord`，再由 `approve(id, actor)` 或 `reject(id, actor)` 决策。生产环境仍需在服务端再次验证用户、租户、资源权限和审批记录，不能只依赖前端。

## 知识 AI

知识层通过 Provider 协议接入文档库、数据库、网站或业务 API，并在 Registry 中统一执行租户、角色、知识源过滤、相关度排序和检索 Trace：

```ts
import {
  AtlasKnowledgeRegistry,
  AtlasMemoryKnowledgeProvider,
  AtlasToolRegistry,
  createKnowledgeSearchTool
} from '@atlas-eids/ai-runtime'

const knowledge = new AtlasKnowledgeRegistry()
knowledge.register(new AtlasMemoryKnowledgeProvider({
  sources: [{ id: 'product-docs', name: '产品文档', type: 'document', status: 'ready', tenantIds: ['atlas-cn'] }],
  documents: [{ id: 'approval', sourceId: 'product-docs', title: '审批策略', content: '高风险写入必须经过人工审批。', tenantIds: ['atlas-cn'] }]
}))

const result = await knowledge.search({
  text: '高风险写入规则',
  tenantId: 'atlas-cn',
  roles: ['operator']
})

const tools = new AtlasToolRegistry()
tools.register(createKnowledgeSearchTool(knowledge))
```

`AtlasMemoryKnowledgeProvider` 只用于 Demo 与单元测试。生产环境应实现 `AtlasKnowledgeProvider`，在服务端完成向量检索、全文检索、字段级权限、数据保留和引用签名；前端传入的 `tenantId` 与 `roles` 不能作为最终授权依据。

## 网页 Agent

`@atlas-eids/web-agent` 提供 `page.read`、`page.click`、`page.fill` 等页面工具创建能力，以及独立工具注册表：

```ts
import { AtlasCrossPageAgent, AtlasHttpExecutionAuditStore, AtlasPageToolRegistry, createDOMToolset, exposeAtlasAgent, installDocumentWebMCPBridge, validateWebMCPToolset } from '@atlas-eids/web-agent'

const registry = new AtlasPageToolRegistry({
  auditStore: new AtlasHttpExecutionAuditStore({
    baseURL: '',
    headers: () => ({ Authorization: 'Bearer <token>', 'X-Atlas-Tenant': 'atlas-cn' })
  })
})
createDOMToolset(document.querySelector('#app')).forEach((tool) => registry.register(tool))
const cleanup = exposeAtlasAgent(registry)
const contract = validateWebMCPToolset(registry.list())
if (contract.valid) await installDocumentWebMCPBridge(registry)
```

高风险调用会得到持久化到当前 Registry 生命周期内的 `executionId`，再通过 `approve` 执行。`replay` 与 `history` 返回只读执行记录，默认不暴露原始输入：

```ts
const pending = await registry.invoke('page.publish', { recordId: 'AC-1048' })
if (pending.status === 'approval-required') {
  await registry.approve(pending.executionId)
  console.log(registry.replay(pending.executionId))
}
```

`AtlasCrossPageAgent` 可以注册多个页面 Registry，按计划导航并串行执行；遇到 `approval-required` 会立即暂停。`AtlasHttpExecutionAuditStore` 从 Java 审计接口恢复只读 Replay，让刷新后的前端仍可查询可信执行记录。

## 路由感知 Skills 与远程控制

`AtlasWebSkillRegistry` 让页面按当前路由渐进暴露产品手册、SOP、字段说明和设计规则，而不是一次性把所有知识塞入上下文。`AtlasRouteAwareAgent` 自动注册 `skills.list`、`skills.search`、`skills.read` 三个页面工具；`AtlasRemoteAgentClient` 连接 Java 的工具列表、执行、审批、历史和审计回放接口。

```ts
import { AtlasRouteAwareAgent, AtlasRemoteAgentClient } from '@atlas-eids/web-agent'

const agent = new AtlasRouteAwareAgent({ route: '/orders/detail' })
agent.skills().length

const remote = new AtlasRemoteAgentClient({
  baseURL: '',
  headers: () => ({ Authorization: 'Bearer <token>', 'X-Atlas-Tenant': 'atlas-cn' })
})
await remote.execute('records.publish', { recordId: 'AC-1048' })
```

工具必须限定在明确根节点，涉及发布、删除、外发和权限修改的动作必须标记 `high-risk`。WebMCP Bridge 使用当前 Draft 的 `document.modelContext.registerTool` 形态，并保留能力检测；标准与浏览器实现仍可能变化。无论客户端是否支持 WebMCP，真实业务都必须使用 Java 或其他可信后端完成授权、租户隔离与审计持久化。

## Agent 开发与标准 MCP

`@atlas-eids/agent-kit` 负责组件知识、15 种 AI 页面模式、页面规划、设计约束校验和生成后修复循环；`@atlas-eids/mcp` 将这些能力通过标准 MCP stdio 与 Streamable HTTP 暴露给 Codex、Claude、Cursor、VS Code 等 Host。浏览器 WebMCP 与标准 MCP 是两层不同能力：前者面向页面内工具，后者面向开发期设计、生成和校验。

完整的 MCP Resources、Prompts、Tools、CLI Fallback 与安全边界见 [Agent 页面开发与 MCP](AGENT_DEVELOPMENT.md)。

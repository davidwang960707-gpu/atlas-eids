# AI Runtime 与网页 Agent

## AI Runtime

`@atlas-eids/ai-runtime` 将模型接入、流式输出和 Tool Call 与 UI 组件解耦。

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

工具必须限定在明确根节点，涉及发布、删除、外发和权限修改的动作必须标记 `high-risk`。WebMCP Bridge 使用当前 Draft 的 `document.modelContext.registerTool` 形态，并保留能力检测；标准与浏览器实现仍可能变化。无论客户端是否支持 WebMCP，真实业务都必须使用 Java 或其他可信后端完成授权、租户隔离与审计持久化。

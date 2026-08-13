---
name: atlas-ai
description: 设计、实现或审查 Atlas AI 对话、Agent 执行、知识检索、MCP 工具、生成审阅、监控和治理页面，并正确使用 Living Orb；涉及可信 AI、工具审批、引用、Skills 或 Web Agent 时使用。
---

# Atlas AI Native

## AI 组件族

| 任务 | 组件 |
| --- | --- |
| 完整会话 | `AtlasAIConversation` |
| 用户、助手、系统、工具消息 | `AtlasAIMessageBubble` |
| 流式输出 | `AtlasAIStreamingText` |
| 输入和上下文 | `AtlasAIComposer` |
| 推荐问题 | `AtlasAIPrompts` |
| 附件 | `AtlasAIAttachmentList` |
| 会话历史 | `AtlasAIConversationHistory` |
| 引用来源 | `AtlasCitationList` |
| 反馈 | `AtlasAIFeedback` |
| 执行计划 | `AtlasExecutionPlan` |
| 工具与审批 | `AtlasToolCallCard` |
| MCP 授权 | `AtlasMCPServerPicker` |
| 知识源与检索解释 | `AtlasKnowledgeSourcePicker`、`AtlasRetrievalTrace` |
| 多模态结果 | `AtlasAIArtifactRenderer` |
| 结构化采集 | `AtlasAIStructuredInput` |
| 模型与生成依据 | `AtlasAIProvenance` |
| 生成式界面 | `AtlasGenUIRenderer` |
| MCP 工具发现与权限 | `AtlasMCPToolPanel` |
| 跨页面任务 | `AtlasCrossPageAgent` |

先用 `atlas_get_visual_contract` 和 `atlas_get_component_api` 查询组件语义与正式 API；没有 MCP 时运行 `npm run atlas -- knowledge contract <组件名>` 和 `npm run atlas -- knowledge components <名称>`。React 与 Vue 的组件意图相同，事件和受控值分别遵循回调与 `v-model` / emits 约定。

## Living Orb

Orb 是受外层轨道约束的液态金属智能生命体。Core 具有呼吸、阻尼、流动、碰撞高光和柔性随机形变，但不突破轨道。实现必须使用正式 `AtlasOrb`；原生 HTML 才复用共享 Living Orb 结构，不用单层渐变圆球近似。

允许：AI 助手身份、Agent 实体、Thinking、Running、Error。禁止：普通任务行、普通产品卡片、用户头像、静态装饰、非 AI 状态点和图表数据标记。

小尺寸 Orb 用于 AI 身份；Hero 或专门 AI 舞台才能使用大型 Orb。大量 AI 记录使用文字和状态点，避免持续动效干扰扫描。完整材质和跨端基线见 `../atlas-eids-design-system/references/visual-quality.md`。

## 可信 AI 链路

AI 页面至少覆盖与风险相符的内容：

1. 当前上下文和知识范围。
2. 流式生成状态和停止/重试。
3. 引用来源或推荐依据。
4. 工具调用、权限和执行状态。
5. 高风险人工审批。
6. 反馈、审计、成本或质量指标。

Artifact 与 GenUI 不直接执行模型返回的 HTML、脚本或任意组件名。Artifact 使用 `AtlasAIArtifactContract` 的 text、markdown、code、table、chart、file、json 白名单；GenUI 先通过 `validateAtlasGenUISchema` 检查组件白名单、深度、节点数、重复 ID、Action 和 Artifact，再交给 `AtlasGenUIRenderer`。结构化输入先执行 `validateAtlasStructuredInput`，高风险 Action 仍进入人工审批。

知识检索使用 `@atlas-eids/ai-runtime` 的 `AtlasKnowledgeRegistry`，所有查询必须携带 `tenantId`，并在 Provider 结果返回后再次执行角色和租户过滤。引用必须可打开或可定位，不能只显示虚构的“来源 1”。

## MCP 与 Web Agent

- 设计知识和页面生成：`@atlas-eids/mcp`。
- 页面内工具与 WebMCP：`@atlas-eids/web-agent`。
- 路由业务知识：`AtlasWebSkillRegistry` 和 `AtlasRouteAwareAgent`。
- Java 服务审批与回放：`AtlasRemoteAgentClient`。

## 状态和人工控制

- 会话实现流式生成、停止、重试、失败恢复和附件状态，不能只展示静态气泡。
- 工具调用明确显示 `read`、`write`、`high-risk` 权限；高风险状态进入 Approval，不允许自动继续。
- 生成审阅保留原文、结果、差异、局部接受、拒绝和撤销。
- 监控和治理至少提供 Trace、耗时、成功率、成本或审计标识中的适用项。
- 所有图标、操作和状态具备可访问名称；状态不只依赖颜色表达。

生成后调用 `atlas_validate_page`，修复所有 error，再执行构建、Storybook、A11y、E2E 和桌面/移动视觉检查。

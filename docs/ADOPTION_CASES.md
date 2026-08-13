# 仓库内采用案例

Atlas EIDS 在进入外部团队试点前，先用可运行的真实工作流验证组件、Tokens、Skills 和页面 Recipe。以下不是静态效果图，而是随 CI 构建、E2E 与视觉检查一起维护的参考采用案例。

## 知识库管理工作台

同一份业务模型分别由 React 和 Vue 实现，用于检查双端契约是否能组合成专业企业页面，而不仅是 Storybook 中的孤立组件。

| 项目 | React | Vue |
| --- | --- | --- |
| 页面入口 | `examples/react/knowledge.html` | `examples/vue3/knowledge.html` |
| 页面实现 | `KnowledgeBaseApp.tsx` | `KnowledgeBaseApp.vue` |
| 共享资产 | `examples/shared/knowledge-model.ts`、`knowledge-workspace.css` | 同左 |
| 核心任务 | 搜索知识库、切换来源、查看同步状态、发起 AI 问答 | 同左 |
| 验证 | `tests/e2e/knowledge-workspace.spec.ts` | 同左 |

该案例重点验证 App Layout、DataGrid/Table、Search、Status、Drawer、AI Composer、Living Orb 的信息层级、响应式与跨框架一致性。Orb 只出现在 AI 助手和 AI 运行状态，不作为普通数据行装饰。

## CLI 企业应用

`@atlas-eids/cli` 可生成 7 种应用框架，并同时生成路由、菜单、权限、主题、多租户上下文和 Java API Client。模板由 `examples/templates` 与 CLI 测试共同验证，适合继续接入真实 Java Spring Boot 服务。

## 采用门槛

- 页面必须绑定 26 个 Recipe 之一，声明主任务、主操作、状态、响应式和信息优先级。
- React/Vue 使用同一 Headless 行为内核和语义 Tokens。
- AI 输出必须经过 Artifact/GenUI Schema 校验；高风险 MCP 工具必须进入人工审批。
- 合并前通过 AST、Type、DOM、Playwright、视觉、A11y、API 兼容与包体积检查。

外部采用案例将在获得团队授权后补充项目名称、版本、规模、性能数据与负责人确认；仓库不会用未经授权的品牌或虚构数据充当案例。

# Atlas EIDS 工程架构

Atlas EIDS 采用 Monorepo 管理 Design Tokens、框架无关内核、插件、第三方适配器、AI Runtime、网页 Agent、Agent 设计知识、标准 MCP、源码生成器以及 React / Vue 组件包。

## 浏览器文档站

`docs-site.html` 采用任务型文档工作台的信息架构：左侧文档树、中间正文、右侧页内目录，并提供全文搜索、组件 API 搜索、主题记忆、代码复制和移动端目录。

Markdown 仍是唯一内容源。`scripts/build-docs-site.mjs` 在构建时读取 `docs/*.md`、根目录维护文档与 `docs/component-api.json`，使用结构化 Markdown 解析生成 `js/docs-content.js`。维护者只需要更新 Markdown 或组件 API 数据，不需要手工同步第二套 HTML。

GitHub Pages 的 `.github/workflows/pages.yml` 会同时发布：

- 根目录品牌页、Launcher、Pattern Lab 和文档站。
- `examples/templates/dist` 到 `/templates/`。
- React / Vue Storybook 到 `/storybook/react/` 与 `/storybook/vue/`。

## 分层

```text
Design Tokens ── Machine Manifests
    ↓
Core Contracts ── Plugin SDK ── Third-party Adapters
    ↓                         ↓
React / Vue UI          AI Runtime ── Knowledge Providers
    ↓                         ↓
Page Patterns          Web Agent ── Approval / Audit / Remote
    ↓                         ↑
Agent Kit ── Skills ── Standard MCP Server / Client
    └──────────── CLI / Source Generator ───────┐
                                                ↓
                                     React / Vue + Java App
```

## Workspace

| Package | 职责 | 当前状态 |
| --- | --- | --- |
| `@atlas-eids/tokens` | 统一 Token 数据源，生成 CSS、JSON、TypeScript | Beta |
| `@atlas-eids/core` | 组件契约、主题控制器、事件总线 | Beta |
| `@atlas-eids/plugin-sdk` | 插件生命周期与组件、页面、工具注册表 | Beta |
| `@atlas-eids/adapters` | Ant Design、TDesign、OpenTiny Token 和组件元数据映射 | Experimental |
| `@atlas-eids/adapter-antd-react` | Ant Design React 运行时 Wrapper | Experimental |
| `@atlas-eids/adapter-tdesign-vue` | TDesign Vue Next 运行时 Wrapper | Experimental |
| `@atlas-eids/adapter-opentiny-vue` | OpenTiny Vue 按需运行时 Wrapper | Experimental |
| `@atlas-eids/ai-runtime` | 模型 Provider、流式输出、Tool Call、人工审批 | Beta |
| `@atlas-eids/web-agent` | 权限化页面工具、Agent API、Model Context Bridge | Experimental |
| `@atlas-eids/agent-kit` | 组件与页面知识、页面规划、源码校验、生成修复循环 | Beta |
| `@atlas-eids/mcp` | stdio / Streamable HTTP MCP Server、Client、Resources、Prompts、Tools | Beta |
| `@atlas-eids/cli` | React / Vue 项目、页面契约和 Java 后端源码生成 | Beta |
| `@atlas-eids/react` | React 基础组件和 AI 组件 | Beta |
| `@atlas-eids/vue` | Vue 3 基础组件和 AI 组件 | Beta |

## 设计约束

1. Token 必须从 `packages/tokens/src/tokens.json` 生成，不再手工维护多份相互独立的主题值。
2. 66 个 UI 组件与 `AtlasProvider` 的视觉契约只在 `@atlas-eids/core` 维护，Headless 行为与 AI Schema 同样由 Core 共享，`manifests/`、Agent Kit、MCP 与 CLI 由构建同步。
3. React 与 Vue 组件保持相同的状态语义、可访问名称和视觉类名，框架 API 可以符合各自习惯。
4. 高风险 Tool Call 默认返回 `approval-required`，不得静默执行。
5. 第三方适配器不得复制第三方组件源码，只维护语义 Token、组件映射和组合层。
6. 源码生成器输出可独立维护的项目，不要求应用运行时依赖生成器。
7. Living Orb 仅表示 AI 身份或运行状态，不能装饰普通业务对象。
8. Agent 生成页面必须经过 Agent Kit 校验、框架构建、A11y 与视觉验收；MCP 写入工具必须限制在配置的 Workspace 根目录。

## 当前边界

- Pattern Lab 的 126 个条目是页面模式与交互参考，并非 126 个独立可发布组件。
- 第三方运行时 Wrapper 已覆盖核心表单、数据与浮层控件；复杂事件归一化和高级组件兼容仍在建设。
- 标准 MCP Server/Client 已覆盖本地 stdio 和 Streamable HTTP；公网 HTTP 部署尚未内置 OIDC、限流与会话持久化。
- Web Agent 已有权限化工具注册、路由感知 WebSkills、跨页面执行、远程 Java Client 和 Model Context Bridge；浏览器 WebMCP 仍跟随 Draft 演进。
- Knowledge Provider 已定义租户与角色过滤、引用和检索轨迹契约；内存 Provider 只用于 Demo，生产 RAG 需要接入受控数据库或向量检索 Adapter。
- Java 21 模板已提供 JWT、RBAC、Header + Claim 双重租户校验、JPA 审计、SSE 和高风险审批，并已纳入 Maven 测试；生产环境仍需替换本地 Token 签发与 H2。

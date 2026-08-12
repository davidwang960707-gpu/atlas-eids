# OpenTiny AI 能力对标与验收

Atlas EIDS 对标 OpenTiny 的能力完整性和工程质量，但不复制其源码、视觉外观或产品边界。Atlas 保留 React/Vue 对称、Living Orb、可信执行和 Java 企业治理方向。

## 当前结论

本轮已经补齐 OpenTiny AI 体系对应的能力基线：完整 AI 组件族、Agent 页面规划、渐进式 Skills、标准 MCP Server/Client、路由感知 WebSkills、远程网页 Agent、知识检索协议和生成后验证闭环。

“能力基线对齐”不等于社区规模和生产历史相等。OpenTiny 在真实用户量、物料规模、低代码编辑器深度和长期兼容性上仍然更成熟；Atlas 后续以跨浏览器、真实 Provider、公开 npm 包和生产案例继续验收。

| AI 能力 | OpenTiny 参照 | Atlas EIDS 当前实现 | 状态 |
| --- | --- | --- | --- |
| AI 交互组件 | TinyRobot 对话、Sender、Prompts、附件、历史、反馈与 MCP | React/Vue 50 个 UI 组件，其中 15 个 AI 组件覆盖会话、消息、流式输出、Prompt、附件、历史、反馈、MCP、引用、知识源、检索轨迹和工具审批 | 能力对齐 |
| AI 页面开发 | TinyEngine Agent 修改页面 Schema、组件和样式 | Agent Kit 页面规划、CLI 生成、MCP 生成工具、源码校验和最多三轮生成/验证/修复循环 | 能力对齐，编辑器深度待增强 |
| Skills | TinyVue、TinyRobot、TinyEngine DSL Skill | 7 个渐进式 Skills，按 React、Vue、AI、页面模式、Tokens 和 CLI 分层 | 能力对齐 |
| MCP | Server、Client、浏览器、远程传输、组件 MCP | `@atlas-eids/mcp` 提供 stdio Server、Streamable HTTP Server/Client、9 类 Resources、Prompts 和 10 个设计/生成工具；Web Agent 提供浏览器 WebMCP Bridge | 能力对齐 |
| Agent 操作网页 | 页面工具、路由感知、TinyRemoter | DOM 工具、跨页面计划、路由感知 WebSkills、Java Remote Client、审批和审计回放 | 能力对齐 |
| AI Runtime | 对话、工具和生成式 UI | Provider 路由、流式输出、附件、引用、预算、成本、Trace、恢复、工具审批和知识检索 | Atlas 差异化完整 |
| 企业治理 | 分布在 TinyEngine 与 NEXT-SDK | OIDC、RBAC、多租户、Java、Flyway、PostgreSQL、审批和审计 | Atlas 占优 |
| 多框架 | TinyRobot 以 Vue 3 为主 | React/Vue 50 个 UI 组件保持状态、主题、密度和样式对称 | Atlas 占优 |
| AI 视觉语言 | OpenTiny Design 体系 | Living Orb 表达 AI 身份、呼吸和运行状态，并有自动语义误用检查 | Atlas 差异化 |
| 知识 AI | WebSkills 注入产品与业务知识 | WebSkill Registry、知识 Provider、租户/角色过滤、引用和检索轨迹、AI 知识工作台 | 能力对齐，生产 RAG Adapter 待扩展 |

## 可验证入口

```bash
npm run build -w @atlas-eids/agent-kit
npm run build -w @atlas-eids/mcp
npm run atlas -- knowledge components MCP
npm run atlas -- agent plan "知识库检索与引用页面" --framework react --json
npm run atlas -- validate examples/templates/src/pages/AIKnowledgePage.tsx --framework react --ai
npm run build:storybook
npm run test:storybook
```

浏览器入口：

- `/templates/#/ai-knowledge`：权限感知知识工作台。
- `/storybook/react/`、`/storybook/vue/`：50 个 UI 组件状态矩阵。
- `/docs-site.html#/agent-development`：Agent 页面开发与 MCP 接入。
- `/docs-site.html#/components/api`：React/Vue API 搜索。

## 下一验收门槛

- 在真实 OpenAI-compatible Provider、PostgreSQL 向量检索和企业 IdP 上执行端到端测试。
- 建立组件与页面 Prompt 测试集，比较生成源码、截图、A11y 和 Token 合规率。
- 增加截图输入到页面蓝图的多模态 Adapter；Agent Kit 只定义接口，不绑定单一模型。
- 将 MCP Streamable HTTP 加入 OIDC、限流、会话持久化和部署模板。
- 发布 npm Beta packages，并在全新目录完成 MCP Host、React、Vue 和 Java Client 验证。
- 扩大跨浏览器、国际化、密度和复杂键盘交互矩阵。

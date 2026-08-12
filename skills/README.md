# Skills

这个目录用于维护 Atlas EIDS 的 AI Assistant Skills 和设计系统知识。

## 当前 Skills

- [atlas-eids-design-system](atlas-eids-design-system/SKILL.md)：总入口和任务路由
- [atlas-react](atlas-react/SKILL.md)：React 组件与页面
- [atlas-vue](atlas-vue/SKILL.md)：Vue 3 组件与页面
- [atlas-ai](atlas-ai/SKILL.md)：Orb、AI 交互、知识、Agent 与 MCP
- [atlas-page-patterns](atlas-page-patterns/SKILL.md)：应用框架和页面模式
- [atlas-tokens](atlas-tokens/SKILL.md)：Design Tokens、主题与密度
- [atlas-cli](atlas-cli/SKILL.md)：创建、生成、规划、校验和升级

## 维护说明

- Skill 文档需要和根目录 README、`docs/` 文档保持一致。
- 新增示例时优先使用 Design Tokens 和当前组件命名。
- 当 Orb、图表、AI 输入等视觉系统发生变化时，需要同步更新 Skill 指南。
- 组件新增、改名或调整 Props 时，同步更新 Core Contract、生成 API、React/Vue Story 和对应 Skill；Agent Kit 与 Machine Manifest 必须由构建生成，Skill 不复制整份 Props 表。
- React/Vue 共享组件必须核对 Anatomy、States、默认值、受控行为、DOM/ARIA、键盘、焦点和密度几何，并通过 `tests/storybook/parity.spec.ts`；不能只看截图或导出名称一致。
- 示例应用统一消费 `examples/shared/tokens.css`，禁止恢复 React/Vue 私有 Token 副本或手改生成产物。
- 页面能力要区分 126 项知识目录、独立运行 Demo 和 CLI 可生成 Blueprint，不能把规划能力写成已实现能力。
- 所有默认提示必须显式使用 `$skill-name`，新增 Skill 后执行 `npm run test:skills`。
- 不要写入私有项目细节、凭证、内部 URL 或客户数据。

## 目录结构

每个 Skill 都可以渐进读取。总入口只负责路由，详细视觉和图表知识放在 `references/` 中按需加载；组件 API、视觉契约和页面模式由 `manifests/`、Agent Kit、CLI 与 MCP 提供结构化查询。

## 主流 Agent 兼容性

7 个 Skills 均遵循开放 Agent Skills 目录约定：每个 Skill 使用独立目录，并以包含 `name`、`description` frontmatter 的 `SKILL.md` 作为入口。每个目录还提供 `agents/openai.yaml`，用于 Codex / ChatGPT 的技能名称、简介和默认调用提示。

- **Codex / ChatGPT**：仓库的 `.agents/skills` 指向本目录。以仓库为工作目录启动 Codex 后可自动发现，也可以通过 `$atlas-eids-design-system` 等名称显式调用。
- **Tencent WorkBuddy**：在 Skills 页面导入需要使用的单个 Skill 目录或本地技能包。建议先导入总入口，再按技术栈导入 `atlas-react` 或 `atlas-vue`；AI 页面同时导入 `atlas-ai`。
- **其他 Agent Skills 兼容产品**：导入单个 Skill 目录即可。宿主如果不支持 Agent Skills，可将对应 `SKILL.md` 作为项目规则或上下文文档使用。
- **MCP Host**：连接 `@atlas-eids/mcp` 后，Agent 可以用 `atlas_get_skill` 渐进读取规则，查询组件 API、Tokens 和页面模式，并实际调用规划、生成、校验与升级预览工具。

Skill 负责工作方法和设计约束；CLI、MCP 与项目源码负责可执行能力。使用 Atlas CLI 的宿主需要 Node.js 20+ 并把工作目录指向本仓库；使用 MCP 的宿主需要按 [Agent 页面开发与 MCP](../docs/AGENT_DEVELOPMENT.md) 配置 stdio 或 Streamable HTTP。

## 对齐基线

- 品牌材质与 Living Orb：`index.html#orb-components`
- 企业页面组合：`examples/templates`
- React 组件行为：`apps/storybook/stories`
- Vue 组件行为：`apps/storybook-vue/stories`
- 真实 API：`packages/react/src/index.tsx`、`packages/vue/src/index.ts`、`docs/component-api.generated.json`
- 视觉质量契约：`atlas-eids-design-system/references/visual-quality.md`
- 机器契约：`../manifests/component-manifest.json`、`../manifests/page-recipes.json`、`../manifests/token-contract.json`、`../manifests/visual-rules.json`

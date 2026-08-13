# Agent 页面开发与 MCP

Atlas Agent Development Kit 让 Coding Agent 不只“参考风格”，而是读取结构化组件知识、选择页面模式、生成源码并执行自动校验。

## 组成

| 能力 | 实现 |
| --- | --- |
| 设计知识与规划 | `@atlas-eids/agent-kit` |
| 标准 MCP Server / Client | `@atlas-eids/mcp` |
| 项目与页面生成 | `@atlas-eids/cli` |
| 页面内 Agent / WebMCP | `@atlas-eids/web-agent` |
| 渐进式知识 | `skills/` 下 7 个 Skills |

## Agent Skills 兼容性

Atlas Skills 使用开放 Agent Skills 的 `SKILL.md` 结构，并通过 `agents/openai.yaml` 提供 Codex / ChatGPT 展示元数据。仓库保留根目录 `skills/` 作为唯一维护源，`.agents/skills` 使用符号链接提供 Codex 仓库级自动发现，因此不会维护两份规则。

| 宿主 | 接入方式 | 可用范围 |
| --- | --- | --- |
| Codex / ChatGPT | 在仓库中自动发现，或使用 `$atlas-eids-design-system` 显式调用 | 规则、组件知识、页面规划；连接 MCP 后可执行生成与校验 |
| Tencent WorkBuddy | 从 Skills 页面导入单个 Skill 目录或本地技能包 | 可读取 `SKILL.md` 规则；CLI/MCP 能力需单独配置运行环境 |
| 其他 Agent Skills 宿主 | 导入对应 Skill 目录 | 取决于宿主对开放 Agent Skills、脚本和 MCP 的支持范围 |
| 仅支持 MCP 的 Agent | 连接 `@atlas-eids/mcp` | 组件/API 查询、规划、生成、校验和升级预览 |

推荐先加载 `atlas-eids-design-system`，再由总入口按任务读取 React、Vue、AI、页面模式、Tokens 或 CLI 专项 Skill，避免一次性占用过多上下文。

总入口中的详细规则已经拆到 `references/` 渐进加载：企业布局、控件密度、`42px` 表格行、低圆角和 Living Orb 跨端契约位于 `skills/atlas-eids-design-system/references/visual-quality.md`，图表规则位于同目录的 `charts.md`。Agent 不能把官网 Hero 直接复制进企业页面，但必须保持 Token、组件语义和 Orb 材质一致。

## 推荐工作流

1. `atlas_plan_page` 根据意图选择页面模式、组件、区域和验证要求。
2. `atlas_get_visual_contract` 查询 Anatomy、States、Density、语义边界与 Token 依赖。
3. `atlas_get_component_api` 查询将使用组件的当前 TypeScript API。
4. `atlas_generate_page` 或 `atlas_create_app` 生成可运行源码。
5. Agent 完成业务字段、数据契约和交互状态。
6. `atlas_validate_page` 检查 Token、圆角、表格/表面组合、Orb 语义、AI 引用和高风险人工控制。
7. 执行构建、Story、A11y、E2E 和视觉检查；失败时修复后重复验证。

组件实现以源码与生成 API 为准，React/Vue Storybook 是交互基线，`examples/templates` 是页面组合基线，`index.html#orb-components` 是 Living Orb 品牌材质基线。旧截图只用于识别问题，不能作为 Props 或当前尺寸的事实来源。

## MCP 配置

先构建：

```bash
npm run build -w @atlas-eids/agent-kit
npm run build -w @atlas-eids/mcp
```

本仓库 stdio 配置：

```json
{
  "mcpServers": {
    "atlas-eids": {
      "command": "node",
      "args": ["/absolute/path/to/atlas-eids/packages/mcp/dist/stdio.js"],
      "env": {
        "ATLAS_EIDS_WORKSPACE": "/absolute/path/to/atlas-eids"
      }
    }
  }
}
```

公开包发布后可将命令换成 `npx -y @atlas-eids/mcp`。

## MCP Resources

- `atlas://design/manifest`
- `atlas://design/components`
- `atlas://design/page-patterns`
- `atlas://design/tokens`
- `atlas://design/skills`
- `atlas://contracts/component-contracts`
- `atlas://contracts/page-recipes`
- `atlas://contracts/token-contract`
- `atlas://contracts/visual-rules`

## MCP Tools

- `atlas_list_components`
- `atlas_get_component_api`
- `atlas_get_visual_contract`
- `atlas_list_page_patterns`
- `atlas_get_skill`
- `atlas_plan_page`
- `atlas_validate_page`
- `atlas_create_app`
- `atlas_generate_page`
- `atlas_preview_upgrade`

`atlas_get_skill` 先返回目标 Skill 与可选 References 清单；只有任务确实涉及视觉或图表时，再传入 `reference: "visual-quality.md"` 或 `reference: "charts.md"` 读取细节。

写入工具只允许访问配置的 Workspace 根目录。创建项目拒绝已存在目标，页面生成默认拒绝覆盖文件。

## Streamable HTTP

```ts
import { serveAtlasMcpHttp } from '@atlas-eids/mcp'

const endpoint = await serveAtlasMcpHttp({
  host: '127.0.0.1',
  port: 7331,
  workspaceRoot: process.cwd()
})
console.log(endpoint.url)
```

当前 HTTP Server 适合受信任本地网络。公网部署前必须增加 OIDC、TLS、Host/Origin 策略、限流和审计。

## CLI Fallback

没有 MCP Host 时使用：

```bash
npm run atlas -- knowledge components Citation
npm run atlas -- knowledge patterns Agent
npm run atlas -- agent plan "多租户 AI 知识管理页面" --framework vue --json
npm run atlas -- validate src/pages/Knowledge.vue --framework vue --ai
```

## 自动验证范围

Agent Kit 当前检查硬编码颜色与阴影、过大圆角、原生表格绕过、表面嵌套、Orb 行内及语义误用、AI 证据缺失、高风险操作缺少人工控制、页面标题、框架组件导入、10/11px 阅读文字、脱离 4px 尺度的布局间距和同区多个 Primary 操作。它是快速反馈层，不能替代 TypeScript、Vue Compiler、Axe、Playwright 和人工视觉验收。

Skills 自身运行：

```bash
npm run test:skills
```

该检查验证 7 个 Skill 的 frontmatter、Agent Kit 注册、`agents/openai.yaml` 默认提示、相对链接和敏感信息规则，防止设计规范与 Agent 接口悄悄漂移。

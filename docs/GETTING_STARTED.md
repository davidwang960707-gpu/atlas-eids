# 快速开始

## 当前分发方式

Atlas EIDS 的 npm packages 尚未正式发布。请先 Clone 仓库，并在 CLI 中使用 `--local`：

```bash
git clone https://github.com/davidwang960707-gpu/atlas-eids.git
cd atlas-eids
npm install
```

不要在仓库外直接安装 `@atlas-eids/react` 或 `@atlas-eids/vue`。当前发布候选为 [v0.2.0-beta.3](https://github.com/davidwang960707-gpu/atlas-eids/releases/tag/v0.2.0-beta.3)；npm Registry 状态和后续迁移方式见 [Packages 发布状态](PACKAGE_STATUS.md)。

## Workspace 开发

```bash
npm install
npm run check
```

根目录使用 npm workspaces 管理 14 个公开 packages、React / Vue 示例、16 个页面路由与双框架 Storybook。`npm run check` 会构建全部 packages、示例和 Storybook，并执行包级测试与 Java 测试。

## 生成应用源码

在当前仓库内开发时使用 `--local`，生成项目会通过 `file:` 依赖连接本地 Atlas packages：

```bash
npm run atlas -- create atlas-react-app --framework react --template agent-task --backend java --local
npm run atlas -- create atlas-vue-app --framework vue --template data-list --backend none --local
npm run atlas -- create atlas-tenant-app --framework react --template workbench --framework-layout tenant --density compact --locale zh-CN --adapter antd --local
npm run atlas -- list layouts
npm run atlas -- list pages
npm run atlas -- upgrade atlas-tenant-app --dry-run
npm run atlas -- generate page agent-task --framework react --out generated/AgentTaskPage.tsx
npm run atlas -- generate page analytics --framework vue --out generated/AnalyticsPage.vue
npm run atlas -- knowledge components Citation --category ai
npm run atlas -- knowledge patterns Agent
npm run atlas -- agent plan "权限感知的知识检索页面" --framework react --json
npm run atlas -- validate examples/templates/src/pages/AIKnowledgePage.tsx --framework react --ai
```

`create --template` 和 `generate page` 都支持全部 15 个模板。`create` 还支持 7 种 `--framework-layout`、3 种 `--density`、中英文 `--locale` 和 Native / Ant Design / TDesign / OpenTiny Adapter。生成结果包含 App Shell、可运行 Hash 路由、权限化菜单、主题切换、租户会话、类型化 Java API Client、系统子页面、业务页面和响应式布局。

七种框架不是同一个外壳换名称：`hybrid` 会拆分顶部产品导航和左侧业务导航，`fullscreen` 提供紧凑工具栏，`workbench` 提供应用启动区，`tenant` 提供可用租户切换并与 Java `X-Atlas-Tenant` 校验闭环。其余框架也共享路由守卫、角色权限、主题状态与当前租户上下文。

生成项目中的 `.atlas-eids.json` 记录 CLI 管理文件。升级前先执行 `upgrade --dry-run`；用户已改动的文件会标记为 `conflict` 并停止覆盖，只有审核差异后才应使用 `--force`。

正式 npm packages 发布后，移除 `--local` 即可生成使用 Registry 版本的独立项目。

## 连接 Agent 与 MCP

构建并启动 stdio MCP Server：

```bash
npm run build -w @atlas-eids/mcp
npm run atlas:mcp
```

MCP Host 可以查询组件 API、Tokens、页面模式和 Skills，也可以规划页面、生成应用、生成页面、预览升级并校验源码。完整配置与工具清单见 [Agent 页面开发与 MCP](AGENT_DEVELOPMENT.md)。没有 MCP Host 时，使用上面的 `knowledge`、`agent plan` 和 `validate` CLI 命令完成同一条开发链路。

这份文档用于帮助你预览 Atlas EIDS，并运行 React / Vue 3 示例。

## 环境要求

- 现代浏览器
- Node.js 20 或更高版本
- Java 21 与 Maven 3.9+（生成或验证 Java 后端时）
- npm、pnpm 或 yarn

静态展示页可以直接打开，不需要安装依赖。

## 预览静态展示页

在项目根目录执行：

```bash
open index.html
```

也可以启动本地服务：

```bash
npx --yes http-server -p 37772 -c-1
```

访问：

```text
http://localhost:37772
```

页面入口：

- `index.html`：品牌理念、Tokens、Orb、组件与图表
- `patterns.html`：126 个应用框架、页面和 AI 交互索引，点击可进入真实 Demo
- `docs-site.html`：统一浏览 Markdown 文档，并搜索 React / Vue 组件 API
- `launcher.html`：模板、Storybook、CLI、Java 后端和质量检查入口

## 运行 React 示例

```bash
cd examples/react
npm install
npm run dev
```

构建：

```bash
npm run build
```

开发服务启动后，访问 `/knowledge.html` 可查看使用 Atlas Skills 和正式 React 组件包组装的知识库管理工作台。

## 运行 Vue 3 示例

```bash
cd examples/vue3
npm install
npm run dev
```

构建：

```bash
npm run build
```

开发服务启动后，访问 `/knowledge.html` 可查看与 React 版本共享设计契约的 Vue 知识库管理工作台。

## 运行页面模板与 Storybook

```bash
npm run dev:templates
npm run dev:storybook:react
npm run dev:storybook:vue
```

默认端口分别为 `5176`（Vite 自动选择可用端口）、`6006` 和 `6007`。16 个页面通过 `/#/<template-id>` 独立访问；CLI 可生成的核心模板类型仍为 15 类，新增的 `ai-knowledge` 是验证知识 AI 与 MCP 组合的完整示例页。

公开 GitHub Pages 路径：

- `/templates/#/workbench`：页面模板入口
- `/templates/#/ai-knowledge`：AI 知识工作台
- `/storybook/react/`：React Storybook
- `/storybook/vue/`：Vue Storybook
- `/docs-site.html#/components/api`：组件 API 搜索
- `/docs-site.html#/design-contracts`：React/Vue 视觉契约与 Machine Manifest
- `/docs-site.html#/agent-development`：Agent、Skills 与 MCP

## 质量检查

```bash
npx playwright install chromium
npm run test:e2e
npm run test:a11y
npm run test:visual
npm run test:java
npm run test:api-contract
npm run test:release
npm run test:storybook
```

真实企业联调环境：

```bash
docker compose up --build
```

## 常用文件

- `index.html`：主展示页和设计系统说明入口
- `patterns.html`：应用框架、布局、页面与 AI 交互模板中心
- `docs-site.html`：三栏文档阅读、全文检索与组件 API 搜索
- `css/tokens.css`：基础 Design Tokens
- `css/dark-theme.css`：Dark Theme 变量
- `css/light-theme.css`：Light Theme 变量
- `css/main.css`：组件、布局和页面样式
- `js/theme-switcher.js`：主题切换和偏好保存
- `js/main.js`：Tabs、导航和通用交互
- `js/patterns.js`：模板目录、搜索、筛选、真实 Demo 渲染与交互反馈
- `scripts/build-docs-site.mjs`：从 Markdown 与组件 API 数据生成浏览器文档索引
- `docs/APP_FRAMEWORK_LIBRARY.md`：应用框架与页面模板体系
- `examples/react`：React 组件示例
- `examples/vue3`：Vue 3 组件示例
- `examples/templates`：16 个独立运行的企业与 AI 页面路由
- `apps/storybook`、`apps/storybook-vue`：React / Vue 组件工作台
- `tests/e2e`：页面流程、A11y 和视觉回归

## 验证

公开发布前建议运行根目录完整检查：

```bash
npm ci
npm run check
npm run test:browser
```

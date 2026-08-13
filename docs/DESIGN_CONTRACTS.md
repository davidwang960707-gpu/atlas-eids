# 设计契约与 Machine Manifest

Atlas EIDS 把视觉规范从文档约定提升为可以被 React、Vue、CLI、Skills、MCP 和 Coding Agent 共同读取的机器契约。目标不是让所有页面机械相同，而是统一决定产品质量的底层规则，再允许业务页面保留合理的内容与交互差异。

## 唯一事实源

| 层级 | 唯一事实源 | 生成结果 |
| --- | --- | --- |
| Design Tokens | `packages/tokens/src/tokens.json` | CSS、JSON、TypeScript、Token Manifest |
| 组件视觉契约 | `packages/core/src/component-contracts.ts` | 组件 Manifest、Agent Knowledge、MCP Resource |
| React / Vue API | `packages/react/src/index.tsx`、`packages/vue/src/index.ts` | API JSON、API Markdown、组件 Manifest |
| 页面模式 | `packages/agent-kit/src/index.ts` | Page Recipes、CLI Plan、MCP Plan |
| 工作方法 | `skills/` | Codex、WorkBuddy 与兼容 Agent 的渐进知识 |

禁止在页面模板、Storybook、Skills 或 MCP 中手工复制第二份颜色、行高、圆角、组件状态和 Props 表。

## 四份 Manifest

执行 `npm run build:manifests` 会生成：

- `manifests/component-manifest.json`：66 个 UI 组件与 `AtlasProvider` 的 Category、Anatomy、States、Density、Semantics、Tokens、React/Vue 支持和 Props。
- `manifests/page-recipes.json`：26 个生产 Recipe 的主任务、主操作、次级区域、必备状态、响应式、信息优先级与完成标准。
- `manifests/token-contract.json`：DTCG 2025.10 Global、Semantic、Component、State 四层 Tokens。
- `manifests/visual-rules.json`：圆角、三档表格行高、字体层级、4px 间距尺度、页面组合、Orb 允许场景、主题、语言和密度要求。

四份文件随 GitHub Pages 发布，也会被 `@atlas-eids/mcp` 打包，外部 Agent 不需要读取整个仓库即可获得相同规则。

## React / Vue 契约

- 组件语义、状态、视觉类名、主题、密度、语言与 A11y 行为保持一致。
- React 使用 Props 和 Callback，Vue 使用 Props、Slots、Emits 与 `v-model`，不强求框架 API 语法完全相同。
- `AtlasProvider` 统一 `light/dark`、`compact/standard/comfortable`、`zh-CN/en-US`。
- 表格数据行基线为 `36/42/50px`；企业列表优先使用 `AtlasDataTable` 组合，而不是页面自建表格外壳。
- 页面与区块标题分别使用 `headingLg/headingSm`，正文和辅助信息使用 `body/caption`；最小阅读字号为 `12px`。
- 同一区域最多一个 Primary 操作；响应式重排不得删除核心筛选、状态和命令。
- Empty、Filtered Empty 和 Error 必须同步更新依赖的详情、AI 回答、引用和恢复路径。
- Living Orb 只表达 AI 身份和生命状态，不进入普通任务、文件、客户和数据行。

## Agent 使用顺序

1. 读取 `atlas://contracts/visual-rules`。
2. 调用 `atlas_plan_page` 选择页面配方。
3. 对使用组件调用 `atlas_get_visual_contract` 和 `atlas_get_component_api`。
4. 生成或修改页面。
5. 调用 `atlas_validate_page`，修复全部 Error。
6. 执行框架构建、Storybook、A11y、E2E 和视觉回归。

没有 MCP 时使用：

```bash
npm run atlas -- knowledge contract AtlasDataTable
npm run atlas -- agent plan "企业任务列表" --framework react --json
npm run atlas -- validate src/pages/TaskPage.tsx --framework react
```

## CI 漂移保护

`npm run test:design-contract` 会检查：

- Token 版本、必需语义和表格几何。
- React/Vue 组件导出对称性。
- 67 项 Core Contract 覆盖全部组件导出且名称唯一。
- Machine Manifest 与当前版本、API 数量和组件数量一致。
- 表格选择标签、排序、Loading 和密度契约未被绕过。
- 组件 CSS 不引用未定义的 `--atlas-*` Token，Typography 和页面组合机器规则保持最新。

新增或修改组件时，至少同步 Core Contract、React、Vue、API 文档和双端 Story。构建脚本负责更新 Manifest，CI 负责拒绝任何缺项。

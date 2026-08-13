---
name: atlas-react
description: 使用 @atlas-eids/react 实现、修复或审查 React 企业页面、基础组件、AI 对话、知识工作台和 Agent 界面；涉及 TSX、React Storybook、组件 Props、状态矩阵或跨端对齐时使用。
---

# Atlas React

## 准备

```tsx
import { AtlasProvider } from '@atlas-eids/react'
import '@atlas-eids/react/styles.css'
```

应用根节点使用 `AtlasProvider`，通过 `theme`、`density`、`locale` 控制设计上下文。页面优先复用组件，不复制组件内部 CSS。

## API 查询

先读取 `manifests/component-manifest.json` 中目标组件的视觉契约，再调用 MCP `atlas_get_component_api`。本地也可以运行：

```bash
npm run atlas -- knowledge components Table
npm run atlas -- knowledge contract AtlasDataTable
```

公开 API 以 `packages/react/src/index.tsx` 和构建后的 `packages/react/dist/index.d.ts` 为准，使用语义见 `docs/component-api.generated.json`。交互状态以 `apps/storybook/stories` 为准，不根据旧截图、HTML 演示或 Vue 事件名猜测 Props。

## 页面骨架

```tsx
import { AtlasButton, AtlasDataTable, AtlasPageHeader, AtlasTableToolbar } from '@atlas-eids/react'

export function CustomerPage() {
  return <main>
    <AtlasPageHeader title="客户列表" breadcrumbs={[{ label: '工作台', href: '/' }, { label: '客户' }]} actions={<AtlasButton intent="primary">新建客户</AtlasButton>} />
    <AtlasDataTable title="客户数据" caption="客户列表" columns={columns} rows={rows} toolbar={<AtlasTableToolbar />} />
  </main>
}
```

示例只表达区域关系。真实页面还要实现 Loading、Empty、Error、Disabled、权限不足、长文本和响应式状态。

## React 约束

- 受控组件的状态由页面持有；加载、空、错误和禁用状态都要实现。
- 页面先声明唯一主任务和主操作；`AtlasPageHeader` 不重复 App Shell 导航，同一区域只放一个 `intent="primary"`。
- 字体使用 Page/Section/Body/Caption `20/16/14/12px` Token 层级，布局间距只消费 `--atlas-space-*`；禁止引用未定义的 CSS 变量。
- 筛选结果为空时同步清理详情、AI 回答、引用和分页；窄屏通过重排或 Drawer 保留功能，不隐藏核心命令。
- Dialog、Drawer、Tabs、Switch、选择组件必须有明确可访问名称。
- 图标使用项目现有 `lucide-react`，图标按钮提供 Tooltip 或 `aria-label`。
- 企业列表页优先使用 `AtlasDataTable`、`AtlasTableToolbar`、`AtlasObjectCell`、`AtlasStatusTag` 和 `AtlasRowActions`；底层 `AtlasTable` 仍需有意义的 `caption`。
- 深交互优先使用 `AtlasForm`、`AtlasDataGrid`、`AtlasCombobox`、`AtlasTree`、`AtlasUpload`、`AtlasDateRange`、`AtlasMenu` 和 `AtlasAppLayout`，不要在页面内重写键盘模型。
- 普通对象行使用业务图标、`AtlasAvatar` 或状态点，不放 Orb；表格行高由 Provider 密度统一控制为 `36/42/50px`。
- `AtlasCard` 只承载独立对象或工具，不把页头、筛选、表格和分页拆成多层卡片。
- AI 页面使用 `AtlasAIConversation`、`AtlasAIMessageBubble` 和 `AtlasAIComposer` 组成真实消息流。
- AI 结果使用 `AtlasAIArtifactRenderer`，结构化采集使用 `AtlasAIStructuredInput`，生成依据使用 `AtlasAIProvenance`；GenUI、MCP 工具和跨页面任务分别使用正式 Renderer、Tool Panel 与 Agent 组件。
- 高风险工具使用 `AtlasToolCallCard` 或 `AtlasDialog` 提供审批，不用普通按钮直接执行。
- Living Orb 只使用 `AtlasOrb`，不复制一份局部渐变球 CSS。

## 与 Vue 的契约

- 先以 `packages/core/src/component-contracts.ts` 确定 Anatomy、States、Density、Semantics 和 Tokens；Form、Grid、Combobox、Tree、Upload、DateRange、通知与选择行为复用 `packages/core/src/headless.ts`，AI Schema 复用 `packages/core/src/ai-native.ts`，再设计 Props。
- 组合组件的标题、间距、空态和响应式结果也是契约；不能只对齐单个控件高度和颜色。
- React 可以使用受控 Props 与 Callback，但其默认值、状态结果和 Vue 的 Props/Slots/Emits 必须等价。
- 状态根类、ARIA、键盘路径、焦点管理、Loading/Empty/Error/Disabled 行为以及 `36/42/50px` 密度几何必须对齐。
- 改动共享组件时同步修改 Vue 实现与双端 Story；使用 `tests/storybook/parity.spec.ts` 检查关键 DOM 语义、状态类和几何，不接受只改 React。

## Story 与视觉

- 新增或修改组件时在 `apps/storybook/stories` 补齐 Args、Controls、Default、Focus、Disabled、Loading、Error 和长内容状态。
- 同一能力在 Vue Storybook 中保持语义、尺寸和状态矩阵一致；React 回调与 Vue emits 可以不同。
- 组件布局不固定 `100vw`，在 Storybook Docs 和 Canvas 中都不得横向裁切。
- 视觉检查读取 `../atlas-eids-design-system/references/visual-quality.md`，并对照品牌页 `index.html#orb-components`、React Storybook 和 `examples/templates`。

## 验证

```bash
npm run atlas -- validate src/pages/Page.tsx --framework react --ai
npm run build -w @atlas-eids/react
npm run test:api-contract
npm run test:storybook
npx playwright test -c playwright.storybook.config.ts tests/storybook/parity.spec.ts
```

---
name: atlas-vue
description: 使用 @atlas-eids/vue 实现、修复或审查 Vue 3 企业页面和 AI 原生交互；涉及 SFC、v-model、Vue Storybook、组件事件、状态矩阵或 React/Vue 一致性时使用。
---

# Atlas Vue 3

## 准备

```ts
import { createApp } from 'vue'
import { AtlasEIDS } from '@atlas-eids/vue'
import '@atlas-eids/vue/styles.css'

createApp(App).use(AtlasEIDS).mount('#app')
```

根组件仍需建立 Provider 边界：

```vue
<script setup lang="ts">
import { AtlasProvider } from '@atlas-eids/vue'
</script>

<template>
  <AtlasProvider theme="light" density="standard" locale="zh-CN">
    <RouterView />
  </AtlasProvider>
</template>
```

也可以按需导入组件。输入、选择和反馈组件使用 Vue 的 `v-model` / `update:modelValue` 约定。

## API 查询

优先调用 MCP `atlas_get_visual_contract` 与 `atlas_get_component_api`，或运行 `npm run atlas -- knowledge contract <组件名>` 和 `npm run atlas -- knowledge components <名称>`。公开 API 以 `packages/vue/src/index.ts` 和 `packages/vue/dist/index.d.ts` 为准，交互状态以 `apps/storybook-vue/stories` 为准；不要把 React 回调 Props 原样复制为 Vue Props。

## 页面示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AtlasAIComposer, AtlasAIConversation, AtlasAIMessageBubble } from '@atlas-eids/vue'
const prompt = ref('')
</script>

<template>
  <main><h1>知识助手</h1>
    <AtlasAIConversation title="Atlas Reasoner" subtitle="当前租户知识">
      <AtlasAIMessageBubble role="assistant" content="请选择知识来源后提问。" />
      <template #composer><AtlasAIComposer v-model="prompt" /></template>
    </AtlasAIConversation>
  </main>
</template>
```

示例只表达组合方式。真实页面必须补齐 Loading、Empty、Error、Disabled、权限不足、长文本和响应式状态。

## Vue 约束

- React 与 Vue 的组件意图一致，但事件名遵循 Vue 约定，不直接照抄 React Props。
- 页面先声明唯一主任务和主操作；`AtlasPageHeader` 不重复 App Shell 导航，同一区域只放一个 Primary 操作。
- 字体使用 Page/Section/Body/Caption `20/16/14/12px` Token 层级，布局间距只消费 `--atlas-space-*`；禁止引用未定义的 CSS 变量。
- 筛选结果为空时同步清理详情、AI 回答、引用和分页；窄屏通过重排或 Drawer 保留功能，不隐藏核心命令。
- 受控值使用 `v-model` 或对应的具名模型，例如 `v-model:selected-ids`；审批、停止、重试等动作使用组件 emits。
- 页面需要 Loading、Empty、Error 和 Disabled 状态。
- 企业列表页优先使用 `AtlasDataTable`、`AtlasTableToolbar`、`AtlasObjectCell`、`AtlasStatusTag` 和 `AtlasRowActions`；底层 `AtlasTable` 仍需有意义的 `caption`。
- 深交互优先使用 `AtlasForm`、`AtlasDataGrid`、`AtlasCombobox`、`AtlasTree`、`AtlasUpload`、`AtlasDateRange`、`AtlasMenu` 和 `AtlasAppLayout`，不要在 SFC 中重写键盘模型。
- 普通对象行使用业务图标、`AtlasAvatar` 或状态点，不放 Orb；表格行高由 Provider 密度统一控制为 `36/42/50px`。
- `AtlasCard` 只承载独立对象或工具，不把页头、筛选、表格和分页做成卡片套卡片。
- 高风险 Agent 操作必须由 `AtlasToolCallCard` 的审批事件或对话框确认控制。
- AI 结果使用 `AtlasAIArtifactRenderer`，结构化采集使用 `AtlasAIStructuredInput`，生成依据使用 `AtlasAIProvenance`；GenUI、MCP 工具和跨页面任务分别使用正式 Renderer、Tool Panel 与 Agent 组件。
- Living Orb 只使用 `AtlasOrb`，不在普通业务列表使用，也不复制局部渐变球 CSS。

## 与 React 的契约

- 先以 `packages/core/src/component-contracts.ts` 确定 Anatomy、States、Density、Semantics 和 Tokens；Form、Grid、Combobox、Tree、Upload、DateRange、通知与选择行为复用 `packages/core/src/headless.ts`，AI Schema 复用 `packages/core/src/ai-native.ts`，再设计 Props、Slots 与 Emits。
- 组合组件的标题、间距、空态和响应式结果也是契约；不能只对齐单个控件高度和颜色。
- 保留 Vue 的 `v-model` / emits 习惯，但默认值、状态结果和 React 的受控 Props/Callback 必须等价。
- 状态根类、ARIA、键盘路径、焦点管理、Loading/Empty/Error/Disabled 行为以及 `36/42/50px` 密度几何必须对齐。
- 改动共享组件时同步修改 React 实现与双端 Story；使用 `tests/storybook/parity.spec.ts` 检查关键 DOM 语义、状态类和几何，不接受只改 Vue。

## Story 与视觉

- 新增或修改组件时在 `apps/storybook-vue/stories` 补齐 Args、Controls、Default、Focus、Disabled、Loading、Error 和长内容状态。
- 与 React Storybook 对齐语义、尺寸和状态矩阵；保留 Vue 的 `v-model` / emits 习惯。
- 组件布局不固定 `100vw`，在 Storybook Docs 和 Canvas 中都不得横向裁切。
- 视觉检查读取 `../atlas-eids-design-system/references/visual-quality.md`，并对照品牌页、Vue Storybook 和 `examples/templates`。

## 验证

```bash
npm run atlas -- validate src/pages/Page.vue --framework vue --ai
npm run build -w @atlas-eids/vue
npm run test:api-contract
npm run test:storybook
npx playwright test -c playwright.storybook.config.ts tests/storybook/parity.spec.ts
```

# 组件说明

Atlas EIDS 包含静态 HTML/CSS 组件，以及 React 和 Vue 3 的组件示例。

## 正式 packages

`@atlas-eids/react` 与 `@atlas-eids/vue` 当前同步提供 31 个 UI 组件，另含 `AtlasProvider`：

| 类别 | 组件 |
| --- | --- |
| 操作与输入 | `AtlasButton`、`AtlasInput`、`AtlasTextarea`、`AtlasSelect`、`AtlasCheckbox`、`AtlasRadioGroup`、`AtlasSwitch`、`AtlasDateInput`、`AtlasSearchInput`、`AtlasSegmentedControl` |
| 导航 | `AtlasTabs`、`AtlasBreadcrumb`、`AtlasPagination`、`AtlasSteps`、`AtlasDropdown` |
| 数据展示 | `AtlasCard`、`AtlasTable`、`AtlasTag`、`AtlasBadge`、`AtlasAvatar`、`AtlasStatistic`、`AtlasProgress` |
| 反馈与浮层 | `AtlasAlert`、`AtlasTooltip`、`AtlasEmpty`、`AtlasSkeleton`、`AtlasDialog`、`AtlasDrawer` |
| AI 原生 | `AtlasOrb`、`AtlasAIComposer`、`AtlasExecutionPlan` |

```ts
import { AtlasButton, AtlasOrb } from '@atlas-eids/react'
import '@atlas-eids/react/styles.css'
```

这些组件处于 Beta，已经具备类型、包构建、导出测试、31 × 2 Story 状态矩阵、逐组件 Axe 检查与 Playwright 视觉回归。Button、Orb、AI Composer 提供可调 Controls；其余组件以完整状态矩阵呈现。后续仍需继续扩大复杂键盘交互与跨浏览器覆盖。

## Storybook

```bash
npm run dev:storybook:react
npm run dev:storybook:vue
```

React 与 Vue 工作台分别运行在 `6006` 和 `6007` 端口；静态构建使用 `npm run build:storybook`。

两套 Storybook 使用统一的 Atlas 管理器主题、信息密度和 Canvas 结构，并关闭默认 onboarding 与版本提示。Vue 额外提供与 React 对齐的“AI 原生组件”分组。

公开入口：

- [React Storybook](https://davidwang960707-gpu.github.io/atlas-eids/storybook/react/)
- [Vue Storybook](https://davidwang960707-gpu.github.io/atlas-eids/storybook/vue/)
- [统一组件 API 搜索](https://davidwang960707-gpu.github.io/atlas-eids/docs-site.html#/components/api)

## AgentOrb

Orb 是 Atlas EIDS 中最核心的 AI 存在感组件。

### 状态

- `idle`：缓慢呼吸和柔和能量场
- `thinking`：更强辉光和更快的内部流动
- `running`：绿色/青绿色的执行状态能量
- `error`：红色/粉色紧张感和轻微震动

### 视觉原则

- Core 需要靠近外层 orbit，不要像小球一样离轨道很远。
- 内部运动要有液态、金属、阻尼和随机感。
- Core 可以轻微变形，但不能视觉上突破外层轨道。
- Orb 应该像一个有生命感的 AI 入口，而不是普通装饰 icon。

### 语义边界

- 只在 AI Assistant、Agent 实体、AI 生成/执行状态和可信治理入口中使用 Orb。
- 普通任务、文件、客户、审批和数据行使用业务图标、头像或状态点。
- `running`、`error` 等颜色表达的是 AI 运行状态，不用于给普通对象做随机分类色。
- 小尺寸 Orb 仍保留材质层，但在高密度列表中优先使用状态点，避免持续动效干扰扫描。

### React

```tsx
import AgentOrb from './components/AgentOrb';

<AgentOrb state="thinking" size={120} showRing />
```

### Vue 3

```vue
<AgentOrb state="thinking" :size="120" />
```

## AgentCard

AgentCard 用于呈现数字员工、AI Agent 或能力模块。

适合用于：

- AI Assistant 列表
- Agent 状态 Dashboard
- 能力卡片
- 企业级自动化流程入口

## NeuralInput

NeuralInput 是带微型 Orb 和 AI 辅助按钮的智能输入框。

React：

```tsx
<NeuralInput
  mention="LegalAgent"
  placeholder="Review this contract..."
  value={inputValue}
  onChange={setInputValue}
/>
```

Vue 3：

```vue
<NeuralInput
  v-model="inputValue"
  mention="LegalAgent"
  placeholder="Review this contract..."
/>
```

## StreamBlock

StreamBlock 用于展示 AI 推理、生成过程或流式输出内容。

适合用于：

- AI Assistant 回复
- 推理过程展示
- 自动生成摘要
- Tool execution log

## FrameworkGallery

FrameworkGallery 以真实工作区呈现 7 种通用应用框架：左侧导航、顶部导航、混合导航、工作台、多标签页、全屏工作区和多租户框架。示例支持框架切换、导航切换、任务搜索与选中、租户切换、画布操作和即时状态反馈；数据保持通用，不绑定具体行业。

## AITrustPanel

AITrustPanel 把执行计划、步骤状态、工具调用、风险提示和人工接受／拒绝动作集中到一个可信执行视图。它用于演示 AI 治理结构，不预设行业或业务流程。

## AI 交互组件

用于建立 AI 原生页面的“入口-输入-输出-执行”闭环。

- **AI 入口**
  - 全局 AI 助手入口
  - 页面 AI 助手入口
  - 魔法棒按钮
  - AI 操作菜单
  - 字段级 AI 按钮
- **输入组件**
  - AI 消息输入框
  - 推荐问题
  - 快捷指令
  - 引导式生成表单
  - 文件附件
  - 上下文标签
  - 数据源和工具选择
- **输出组件**
  - 对话气泡
  - 流式输出
  - 表格、图表、代码和文件卡片
  - 引用来源
  - AI 生成标识
  - 风险与不确定性提示
- **执行组件**
  - 执行计划
  - 步骤状态
  - 工具调用记录
  - 处理中/等待审批状态
  - 停止、重试、重新生成
- **人工控制**
  - 生成结果预览
  - 修改前后对比
  - 接受、拒绝、局部应用
  - 撤销
  - 高风险操作确认
- **反馈与治理**
  - 权限提示
  - 敏感数据提醒
  - Prompt 和操作审计
  - 点赞、点踩
  - 内容纠错
  - 问题反馈

## Data Visualization

图表应优先使用 Atlas 图表 tokens：

- `--chart-primary`
- `--chart-secondary`
- `--chart-teal`
- `--chart-mint`
- `--chart-amber`
- `--chart-rose`

除非数据本身确实需要大量分类色，否则不要使用装饰性彩虹配色。

## Markdown 与 Code Block

Markdown 预览面板用于文档和设计系统示例。注意保留足够内边距，避免标题、列表、分割线贴到圆角面板边缘。

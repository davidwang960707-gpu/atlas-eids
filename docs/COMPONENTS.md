# 组件说明

Atlas EIDS 包含静态 HTML/CSS 组件，以及 React 和 Vue 3 的组件示例。

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


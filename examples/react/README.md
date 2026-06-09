# Atlas EIDS - React Components

Atlas Enterprise Intelligence Design System 的 React 组件实现。

## 技术栈

- React 18
- TypeScript
- Vite

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

访问 http://localhost:5173 查看组件演示。

## 构建

```bash
npm run build
```

## 组件列表

### AgentOrb

AI 代理的核心视觉元素，使用液态金属 Core、近距轨道和外部辉光表达“有呼吸感的智能生命体”，支持四种状态：

```tsx
import AgentOrb from './components/AgentOrb';

<AgentOrb state="idle" size={80} />
<AgentOrb state="thinking" size={120} />
<AgentOrb state="running" size={60} />
<AgentOrb state="error" size={100} />
```

**Props:**
- `state`: 'idle' | 'thinking' | 'running' | 'error' (默认: 'idle')
- `size`: number (默认: 80)
- `showRing`: boolean (默认: true)

**视觉原则：**
- Core 尺寸接近外层轨道，不使用远离轨道的小球
- 内部流动是随机、阻尼、柔性的液态金属质感
- 形态允许轻微变形，但不突破外层轨道

### AgentCard

数字员工卡片组件：

```tsx
import AgentCard from './components/AgentCard';

<AgentCard
  title="法务审查助手"
  subtitle="Legal AI Agent"
  description="基于 GB/T 9704 规范与 RAG 混合检索..."
  tags={['Contract', 'Risk Analysis', 'OCR']}
  status="online"
/>
```

**Props:**
- `title`: string
- `subtitle`?: string
- `description`: string
- `tags`?: string[]
- `status`?: 'online' | 'offline' | 'busy'

### NeuralInput

神经输入框组件，内置微型液态 Orb 与 AI 辅助按钮：

```tsx
import NeuralInput from './components/NeuralInput';

<NeuralInput
  mention="法务Agent"
  placeholder="审查这份采购合同..."
  value={inputValue}
  onChange={setValue}
/>
```

**Props:**
- `value`?: string
- `placeholder`?: string
- `mention`?: string
- `onChange`?: (value: string) => void

### StreamBlock

流式输出区块组件：

```tsx
import StreamBlock from './components/StreamBlock';

<StreamBlock
  header="Atlas · 正在生成推理过程"
  content={<p>分析结果...</p>}
  isStreaming={true}
/>
```

**Props:**
- `header`?: string
- `content`: React.ReactNode
- `isStreaming`?: boolean

## 设计令牌

设计令牌定义在 `src/styles/tokens.css` 中，包含：

- 品牌颜色（Atlas Violet, Deep Neural, Cognitive Glow）
- 功能颜色（Success, Warning, Danger, Info）
- 表面颜色（背景、卡片）
- 文本颜色
- 圆角、模糊效果等

## 自定义主题

可以通过覆盖 CSS 变量来自定义主题：

```css
:root {
  --atlas-violet: #YourColor;
  --bg-primary: #YourBackground;
  /* ... 其他变量 */
}
```

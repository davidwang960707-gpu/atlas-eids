# Atlas EIDS - Vue 3 Components

Atlas Enterprise Intelligence Design System 的 Vue 3 组件实现。

## 技术栈

- Vue 3 (Composition API)
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

```vue
<template>
  <AgentOrb state="idle" :size="80" />
  <AgentOrb state="thinking" :size="120" />
  <AgentOrb state="running" :size="60" />
  <AgentOrb state="error" :size="100" />
</template>

<script setup lang="ts">
import AgentOrb from './components/AgentOrb.vue';
</script>
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

```vue
<template>
  <AgentCard
    title="法务审查助手"
    subtitle="Legal AI Agent"
    description="基于 GB/T 9704 规范与 RAG 混合检索..."
    :tags="['Contract', 'Risk Analysis', 'OCR']"
    status="online"
  />
</template>
```

**Props:**
- `title`: string
- `subtitle`?: string
- `description`: string
- `tags`?: string[]
- `status`?: 'online' | 'offline' | 'busy'

### NeuralInput

神经输入框组件（支持 v-model），内置微型液态 Orb 与 AI 辅助按钮：

```vue
<template>
  <NeuralInput
    v-model="inputValue"
    mention="法务Agent"
    placeholder="审查这份采购合同..."
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NeuralInput from './components/NeuralInput.vue';

const inputValue = ref('');
</script>
```

**Props:**
- `modelValue`?: string (v-model)
- `placeholder`?: string
- `mention`?: string

**Emits:**
- `update:modelValue`: string

### StreamBlock

流式输出区块组件：

```vue
<template>
  <StreamBlock
    header="Atlas · 正在生成推理过程"
    :is-streaming="true"
  >
    <p>分析结果...</p>
  </StreamBlock>
</template>

<script setup lang="ts">
import StreamBlock from './components/StreamBlock.vue';
</script>
```

**Props:**
- `header`?: string
- `isStreaming`?: boolean

**Slots:**
- `default`: 流式内容内容

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

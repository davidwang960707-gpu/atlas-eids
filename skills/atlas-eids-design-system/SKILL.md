---
name: atlas-eids-design-system
description: Enterprise Intelligence Design System with AI-native components, data visualization charts, custom form controls, and dark/light theme support. Use when building enterprise web applications, dashboards, admin panels, or when the user mentions design systems, UI components, data charts, or enterprise interfaces.
---

# Atlas EIDS Design System

企业智能设计系统 - AI Native 的企业级 UI 组件库

## 核心特性

- 🎨 **深浅色双主题** - CSS 变量系统，自动适配
- 🤖 **AI 原生交互** - 液态金属 Orb 生命体、对话浮窗、魔法棒辅助输入
- 📊 **数据可视化** - 品牌化紫/蓝/青绿色数据色板，支持面积图、组合图、环形图、雷达图等
- ✨ **毛玻璃效果** - backdrop-filter 现代视觉风格
- 🎯 **自定义控件** - 下拉框、单选框、多选标签等完全可控样式
- 📱 **响应式设计** - 断点：1024px, 768px, 480px

## 技术栈

```
核心技术：
- HTML5 + CSS3（CSS Variables, Grid, Flexbox）
- Vanilla JavaScript（无框架依赖）
- SVG 图表渲染
- Intersection Observer API

开发工具：
- http-server 本地预览（端口 37772，禁用缓存 -c-1）
```

## 组件库总览

### 1. 基础组件

**按钮系统**
- Primary / Secondary / Danger 变体
- Compact 紧凑模式
- Icon Button 图标按钮
- Loading / Disabled 状态

**表单控件**
- Custom Select（自定义下拉框，替代原生 select）
- Multi-select Tags（多选标签框）
- Radio Cards（卡片式单选）
- Radio Button Group（按钮式单选）
- Search Box（搜索框，带清除/筛选按钮）

**反馈组件**
- Toast Notification（消息提示）
- Progress Bar（进度条）
- Loading Spinner（加载动画）
- Pagination（分页）

### 2. AI 交互组件（Orb 系统）

**Orb 视觉原则**
- Core 是接近外层轨道的液态金属生命体，不是远离轨道的普通渐变球
- 内部高光与流体形态具有随机感、阻尼感、碰撞感和轻微变形
- 外层轨道用于约束能量场，Core 可以呼吸和柔性变形，但不能突破轨道
- 状态包括 idle / thinking / running / error，通过呼吸速度、辉光强度、色相和轨道速度区分

**小横条对话浮窗**
```html
<!-- 悬浮在右下角的聊天窗口 -->
<div class="chat-popup">
  <div class="chat-popup-header">Orb 头像 + 在线状态</div>
  <div class="chat-messages">消息区域</div>
  <div class="chat-input-area">输入框 + 发送按钮</div>
</div>
```

**侧边栏嵌入式对话窗**
```html
<div class="sidebar-chat-panel">
  <div class="sidebar-header">标题 + 设置按钮</div>
  <div class="context-indicator">上下文感知提示</div>
  <div class="sidebar-messages">消息列表</div>
  <div class="sidebar-input-area">
    <div class="magic-suggestions">快捷操作芯片</div>
    <textarea>输入框</textarea>
  </div>
</div>
```

**魔法棒 AI 辅助**
- 输入框内嵌魔法棒按钮
- 弹出式 AI 建议菜单
- 富文本域浮动魔法棒
- 行内智能提示高亮
- 输入框内可使用微型液态 Orb 作为智能入口，不使用平面图标替代核心智能感

### 3. 数据可视化图表

**柱状图（Bar Chart）**
```html
<div class="bar-chart" style="display: flex; align-items: flex-end;">
  <div style="background: linear-gradient(180deg, var(--chart-primary), var(--chart-teal)); height: 60%;"></div>
  <div style="background: linear-gradient(180deg, var(--chart-secondary), var(--chart-mint)); height: 40%;"></div>
</div>
```

**关键要点：**
- 使用品牌化图表色：`--chart-primary`、`--chart-secondary`、`--chart-teal`、`--chart-mint`
- 柱体保持克制的圆角和柔和阴影，避免卡通化彩虹配色
- 悬停时轻微上浮和增强辉光，不破坏数据对齐

**折线图（Line Chart）**
```html
<svg viewBox="0 0 800 250">
  <defs>
    <linearGradient id="areaGradient">...</linearGradient>
    <linearGradient id="lineGradient">...</linearGradient>
  </defs>
  <!-- 面积填充 -->
  <path d="M 0,200 L ..." fill="url(#areaGradient)"/>
  <!-- 线条 -->
  <path d="M 0,180 C ..." stroke="url(#lineGradient)" stroke-width="3.5"/>
  <!-- 数据点 -->
  <circle cx="0" cy="180" r="7" fill="white" stroke="var(--chart-primary)"/>
</svg>
```

**关键要点：**
- 线条优先使用紫色到青绿色的品牌渐变
- 数据点保持正圆，不因容器缩放变成椭圆
- 面积图底部需要保留足够呼吸空间，避免贴近卡片底边
- 使用平滑贝塞尔曲线和轻量 drop-shadow

**环形图（Donut Chart）**
```html
<svg width="200" height="200" viewBox="0 0 200 200">
  <!-- 背景圆环 -->
  <circle cx="100" cy="100" r="80" stroke="var(--border-subtle)" stroke-width="24"/>
  
  <!-- 数据扇区（周长 = 2*π*80 ≈ 503） -->
  <circle cx="100" cy="100" r="80" 
          stroke="url(#gradient1)" 
          stroke-width="24"
          stroke-dasharray="176 327"  <!-- 35% = 176 -->
          stroke-dashoffset="0"
          stroke-linecap="round"/>
</svg>
```

**关键要点：**
- 精确计算周长：2 × π × r
- 使用 linearGradient 渐变填充
- stroke-linecap="round" 圆角端点
- 中心显示总数和标签

**横向柱状图（Horizontal Bar Chart）**
```html
<div style="height: 32px; background: var(--bg-secondary);">
  <div style="width: 85%; background: linear-gradient(to right, var(--chart-primary), rgba...);">
    85%
  </div>
</div>
```

**面积图（Area Chart）**
- 双数据线对比
- 渐变面积填充
- 时间轴标签

**雷达图（Radar Chart）**
- 6维度分析
- 多层网格背景
- 数据点多边形

**组合图表（Combination Chart）**
- 柱状图 + 折线图混合
- 双指标对比

### 4. 色彩体系

**品牌色彩**
```css
--atlas-violet: #7B61FF   /* 主色调 */
--atlas-blue: #3B82F6     /* 辅助蓝 */
--atlas-green: #10B981    /* 成功绿 */
--atlas-orange: #F97316   /* 警告橙 */
--atlas-pink: var(--chart-teal)     /* 强调粉 */
--atlas-cyan: #06B6D4     /* 信息青 */
--atlas-yellow: #EAB308   /* 注意黄 */
--atlas-red: #EF4444      /* 危险红 */
--atlas-purple: var(--chart-secondary)   /* 装饰紫 */
```

**渐变方案**
```css
/* 柱状图渐变 */
linear-gradient(180deg, var(--chart-primary), var(--cognitive-glow))
linear-gradient(180deg, #3B82F6, #93C5FD)

/* 折线图渐变 */
linear-gradient(id="lineGradient", x1="0%", x2="100%")
  stop 0%: var(--chart-primary) → stop 50%: var(--chart-secondary) → stop 100%: var(--chart-teal)

/* 环形图渐变 */
linear-gradient(id="gradient1")
  stop 0%: var(--chart-primary) → stop 100%: #A78BFA
```

## 快速开始

### 项目结构

```
AUI-UX/
├── index.html              # 主页面
├── css/
│   ├── tokens.css          # 设计令牌（CSS 变量）
│   ├── dark-theme.css      # 深色主题
│   ├── light-theme.css     # 浅色主题
│   └── main.css            # 组件样式（~2900 行）
├── js/
│   ├── theme-switcher.js   # 主题切换
│   ├── orb-demo.js         # Orb 演示
│   ├── code-highlight.js   # 代码高亮
│   └── main.js             # 主逻辑（含所有交互）
└── examples/               # React/Vue 示例
```

### 启动服务

```bash
npx --yes http-server -p 37772 -c-1
```

**参数说明：**
- `-p 37772`：指定端口 37772
- `-c-1`：禁用缓存（开发模式）

### 添加新组件

**1. 在 index.html 中添加 HTML 结构**

```html
<section id="new-component">
  <div class="container">
    <h2 class="section-title">新组件</h2>
    <!-- 组件内容 -->
  </div>
</section>
```

**2. 在 main.css 中添加样式**

```css
/* ═══════════════════════════════════════════
   NEW COMPONENT
   ═══════════════════════════════════════════ */

.new-component {
  /* 样式定义 */
}
```

**3. 在 main.js 中添加交互逻辑**

```javascript
window.newComponentFunction = function() {
  // 交互逻辑
};
```

## 设计规范

### 间距系统

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### 圆角规范

```css
--radius-sm: 8px    /* 小按钮、标签 */
--radius-md: 12px   /* 卡片、输入框 */
--radius-lg: 16px   /* 大容器、弹窗 */
```

### 过渡动画

```css
--transition-fast: 0.15s ease
--transition-base: 0.3s ease
--transition-slow: 0.5s ease
```

### 毛玻璃效果

```css
backdrop-filter: blur(20px);
background: var(--card-bg);
border: 1px solid var(--border-subtle);
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

## 图表最佳实践

### 柱状图

✅ **推荐：**
- 使用渐变增强视觉层次
- 添加 box-shadow 发光
- 柱体宽度 28px，间距 4px
- 悬停时缩放 1.05 倍

❌ **避免：**
- 单一纯色填充
- 柱体过细（< 20px）或过宽（> 40px）
- 缺少悬停交互

### 折线图

✅ **推荐：**
- 线条宽度 ≥ 3px
- 数据点添加发光效果
- 使用平滑贝塞尔曲线
- 面积图添加渐变填充

❌ **避免：**
- 直角折线（应使用 curve）
- 数据点过小或过大
- 缺少网格线参考

### 环形图

✅ **推荐：**
- 精确计算周长（2πr）
- 使用 stroke-linecap="round"
- 渐变填充增强质感
- 中心显示总数

❌ **避免：**
- 圆心坐标错误
- 半径与 viewBox 不匹配
- stroke-dasharray 计算错误

## 响应式断点

```css
/* 桌面端 */
@media (min-width: 1025px) {
  /* 默认样式 */
}

/* 平板 */
@media (max-width: 1024px) {
  /* 调整布局 */
}

/* 手机 */
@media (max-width: 768px) {
  /* 移动端优化 */
}

/* 小屏手机 */
@media (max-width: 480px) {
  /* 超小屏适配 */
}
```

## 主题切换机制

**CSS 变量系统**
```css
:root {
  --bg-primary: #0f172a;      /* 深色主题 */
  --text-primary: #f8fafc;
  --card-bg: rgba(30, 41, 59, 0.8);
}

[data-theme="light"] {
  --bg-primary: #ffffff;      /* 浅色主题 */
  --text-primary: #0f172a;
  --card-bg: rgba(255, 255, 255, 0.8);
}
```

**切换方式**
```javascript
// 通过 data-theme 属性切换
document.documentElement.setAttribute('data-theme', 'light');
document.documentElement.setAttribute('data-theme', 'dark');
```

## 性能优化

### CSS 优化

- 使用 CSS 变量减少重复代码
- GPU 加速（transform, opacity）
- 避免过度使用 backdrop-filter

### SVG 优化

- 使用 preserveAspectRatio="none"
- 简化 path 路径
- 复用 gradient 定义

### JavaScript 优化

- 事件委托减少监听器
- Intersection Observer 懒加载
- 防抖/节流处理滚动事件

## 常见问题

### Q: 环形图不圆怎么办？

A: 检查以下几点：
1. viewBox 尺寸是否正确（如 200×200）
2. 圆心坐标是否为 (r, r)（如 100, 100）
3. stroke-dasharray 是否精确计算（周长 = 2πr）
4. 是否添加了 stroke-linecap="round"

### Q: 如何添加新的图表类型？

A: 
1. 在 index.html 添加 SVG 结构
2. 使用 defs 定义渐变
3. 在 main.css 添加样式和动画
4. 确保响应式适配

### Q: 主题切换后图表颜色不变？

A: 确保使用 CSS 变量而非硬编码颜色：
```css
/* ✅ 正确 */
stroke="var(--atlas-violet)"

/* ❌ 错误 */
stroke="var(--chart-primary)"
```

## 扩展资源

- **完整示例**: 查看 `examples/` 目录中的 React/Vue 实现
- **设计规范**: 参考 `css/tokens.css` 中的设计令牌
- **组件演示**: 访问 http://localhost:37772 查看所有组件

## 版本信息

- **当前版本**: 1.0.0
- **最后更新**: 2026-06-05
- **兼容性**: 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

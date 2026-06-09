# Atlas EIDS 快速参考卡片

## 🚀 快速启动

```bash
npx --yes http-server -p 37772 -c-1
# 访问: http://localhost:37772
```

## 📦 文件结构

```
AUI-UX/
├── index.html              # 主页面（所有组件）
├── css/
│   ├── tokens.css          # 设计令牌
│   ├── main.css            # 组件样式（2900+ 行）
│   └── [theme].css         # 主题文件
├── js/
│   └── main.js             # 交互逻辑（含所有功能）
└── skills/                 # Skill 文档与 AI 设计系统知识
```

## 🎨 品牌色彩

| 颜色 | 变量 | Hex | 用途 |
|------|------|-----|------|
| Violet | `--atlas-violet` | #7B61FF | 主色调、Orb、按钮 |
| Blue | `--atlas-blue` | #3B82F6 | 辅助、链接 |
| Green | `--atlas-green` | #00C48C | 成功、完成 |
| Orange | `--atlas-orange` | #F97316 | 警告、注意 |
| Pink | `--atlas-pink` | #EC4899 | 强调、装饰 |
| Cyan | `--atlas-cyan` | #06B6D4 | 信息、提示 |
| Chart Primary | `--chart-primary` | #6D5DF8 | 图表主色 |
| Chart Teal | `--chart-teal` | #00B8A9 | 图表辅助色 |

## 📐 间距系统

```
xs: 4px    sm: 8px    md: 16px
lg: 24px   xl: 32px   2xl: 48px
```

## 🔘 圆角规范

```
sm: 8px     → 小按钮、标签
md: 12px    → 卡片、输入框
lg: 16px    → 大容器、弹窗
```

## ✨ 常用 CSS 类

### 按钮
```html
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-danger">危险按钮</button>
<button class="btn btn-compact">紧凑按钮</button>
<button class="icon-btn" title="图标按钮">
  <svg>...</svg>
</button>
```

### 表单控件
```html
<!-- 自定义下拉框 -->
<div class="custom-select" data-value="">
  <div class="select-trigger" onclick="toggleSelect(this)">
    <span class="select-text">选项</span>
    <svg class="select-arrow">...</svg>
  </div>
  <div class="select-dropdown">
    <div class="select-option" onclick="selectOption(this)">选项1</div>
  </div>
</div>

<!-- 多选标签 -->
<div class="multi-select-tags">
  <div class="tag-list">
    <span class="tag-item">
      标签
      <button class="tag-remove" onclick="removeTag(this)">×</button>
    </span>
  </div>
</div>
```

### 卡片
```html
<div class="demo-card">
  <div class="demo-card-header">
    <div class="demo-card-orb"></div>
    <span class="demo-card-badge">New</span>
  </div>
  <h4 class="demo-card-title">卡片标题</h4>
  <p class="demo-card-desc">卡片描述</p>
  <div class="demo-card-footer">
    <span class="demo-card-meta">元信息</span>
  </div>
</div>
```

## 📊 图表速查

### 柱状图
```html
<div class="bar-chart" style="display: flex; align-items: flex-end; height: 250px;">
  <div style="width: 32px; background: linear-gradient(180deg, var(--chart-primary), var(--chart-teal)); 
              height: 60%; border-radius: 10px 10px 4px 4px;"></div>
</div>
```

### 折线图
```html
<svg viewBox="0 0 800 250">
  <defs>
    <linearGradient id="lineGradient">...</linearGradient>
  </defs>
  <path d="M 0,180 C ..." stroke="url(#lineGradient)" stroke-width="3.5"/>
  <circle cx="0" cy="180" r="7" fill="white" stroke="var(--chart-primary)"/>
</svg>
```

### 环形图
```html
<svg width="200" height="200" viewBox="0 0 200 200">
  <!-- 周长 = 2*π*80 ≈ 503 -->
  <!-- 35% = 176, 30% = 151, 25% = 126, 10% = 50 -->
  <circle cx="100" cy="100" r="80" 
          stroke="url(#gradient)" 
          stroke-dasharray="176 327"
          stroke-dashoffset="0"/>
</svg>
```

## 🤖 AI 组件

### 对话浮窗
```html
<div class="chat-popup">
  <div class="chat-popup-header">标题</div>
  <div class="chat-messages">消息</div>
  <div class="chat-input-area">
    <textarea class="chat-input"></textarea>
    <button onclick="sendChatMessage()">发送</button>
  </div>
</div>
```

### 魔法棒
```html
<button class="magic-wand-btn" onclick="toggleMagicSuggestions(this)">
  <span class="input-orb"></span>
</button>
<div class="magic-dropdown">
  <button class="magic-option">优化表达</button>
</div>
```

### Orb 生命体
```html
<div class="orb-wrapper state-thinking" style="--orb-size: 120px;">
  <div class="orb-atmosphere"></div>
  <div class="orb-ring orb-ring-primary"></div>
  <div class="orb-ring orb-ring-secondary"></div>
  <div class="orb"><div class="orb-liquid"></div></div>
</div>
```

## 🎭 动画效果

```css
/* 旋转 */
animation: spin 2s linear infinite;

/* 脉冲 */
animation: orb-pulse 2s infinite;

/* 浮动 */
animation: float 3s ease-in-out infinite;

/* 打字指示器 */
animation: typing 1.4s infinite;
```

## 🌓 主题切换

```javascript
// 切换到浅色主题
document.documentElement.setAttribute('data-theme', 'light');

// 切换到深色主题
document.documentElement.setAttribute('data-theme', 'dark');
```

## 📱 响应式断点

```css
@media (max-width: 1024px) { /* 平板 */ }
@media (max-width: 768px) { /* 手机 */ }
@media (max-width: 480px) { /* 小屏手机 */ }
```

## 🛠️ 常用工具函数

```javascript
// 显示 Toast 通知
showToast('操作成功');

// 复制代码
copyCode('code-block-id');

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

## ⚡ 性能提示

✅ **推荐：**
- 使用 CSS 变量
- GPU 加速（transform, opacity）
- 事件委托
- Intersection Observer

❌ **避免：**
- 硬编码颜色
- 触发布局重排
- 过多监听器
- 过度 backdrop-filter

## 🔍 调试技巧

```javascript
// 查看 CSS 变量值
getComputedStyle(document.documentElement)
  .getPropertyValue('--atlas-violet');

// 检查元素计算样式
getComputedStyle(element);

// 查看 SVG 坐标
svg.createSVGPoint();
```

## 📖 更多资源

- **详细文档**: `SKILL.md`
- **图表实现**: `CHARTS.md`
- **在线演示**: http://localhost:37772

---

**版本**: 1.0.0 | **更新**: 2026-06-05

# 数据可视化图表详细实现

本文档提供 Atlas EIDS 中所有图表类型的完整实现代码和数学计算说明。

## 数学基础

### 圆的周长计算

```
周长 = 2 × π × r
     = 2 × 3.14159 × 80
     ≈ 503
```

### stroke-dasharray 计算

对于百分比 p，弧长计算公式：
```
弧长 = 周长 × p
剩余 = 周长 - 弧长
stroke-dasharray = "弧长 剩余"
```

**示例（r=80）：**
- 35% → `176 327` （503 × 0.35 = 176.05，503 - 176 = 327）
- 30% → `151 352` （503 × 0.30 = 150.9）
- 25% → `126 377` （503 × 0.25 = 125.75）
- 10% → `50 453` （503 × 0.10 = 50.3）

### stroke-dashoffset 累加

每个扇区的起始位置是前所有扇区弧长的累加：
```
扇区1: offset = 0
扇区2: offset = -弧长1
扇区3: offset = -(弧长1 + 弧长2)
扇区4: offset = -(弧长1 + 弧长2 + 弧长3)
```

## 完整图表实现

### 1. 柱状图（完整代码）

```html
<div class="bar-chart" style="
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  padding: 20px 0;
  border-bottom: 2px solid var(--border-subtle);
">
  <!-- 1月 -->
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1;">
    <div style="display: flex; gap: 4px; align-items: flex-end; height: 100%;">
      <div style="
        width: 28px;
        background: linear-gradient(180deg, var(--chart-primary), var(--chart-teal));
        border-radius: 10px 10px 4px 4px;
        height: 60%;
        transition: all 0.3s ease;
        box-shadow: 0 -10px 24px rgba(109, 93, 248, 0.18);
      " title="¥45,000"></div>
      <div style="
        width: 28px;
        background: linear-gradient(180deg, var(--chart-secondary), var(--chart-mint));
        border-radius: 10px 10px 4px 4px;
        height: 40%;
        transition: all 0.3s ease;
        box-shadow: 0 -10px 24px rgba(0, 184, 169, 0.14);
      " title="¥30,000"></div>
    </div>
    <span style="font-size: 12px; color: var(--text-tertiary);">1月</span>
  </div>
  
  <!-- 更多月份... -->
</div>
```

**CSS 样式：**
```css
.bar-chart > div:hover div[style*="background"] {
  opacity: 0.92;
  transform: translateY(-4px) scaleY(1.02);
  transform-origin: bottom;
}
```

### 2. 折线图（完整代码）

```html
<div class="line-chart" style="position: relative; height: 250px; padding: 20px 0;">
  <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none">
    <!-- 网格线 -->
    <line x1="0" y1="50" x2="800" y2="50" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="4,4"/>
    <line x1="0" y1="100" x2="800" y2="100" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="4,4"/>
    <line x1="0" y1="150" x2="800" y2="150" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="4,4"/>
    <line x1="0" y1="200" x2="800" y2="200" stroke="var(--border-subtle)" stroke-width="1" stroke-dasharray="4,4"/>
    
    <!-- 渐变定义 -->
    <defs>
      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--chart-primary)" stop-opacity="0.36"/>
        <stop offset="52%" stop-color="var(--chart-teal)" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="var(--chart-teal)" stop-opacity="0.04"/>
      </linearGradient>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="var(--chart-primary)"/>
        <stop offset="55%" stop-color="var(--chart-secondary)"/>
        <stop offset="100%" stop-color="var(--chart-teal)"/>
      </linearGradient>
    </defs>
    
    <!-- 面积填充 -->
    <path d="M 0,200 L 0,180 C 57,160 114,140 171,120 C 228,100 285,90 342,80 C 399,70 456,85 513,95 C 570,105 627,70 684,50 C 741,30 770,25 800,20 L 800,200 Z" fill="url(#areaGradient)"/>
    
    <!-- 线条 -->
    <path d="M 0,180 C 57,160 114,140 171,120 C 228,100 285,90 342,80 C 399,70 456,85 513,95 C 570,105 627,70 684,50 C 741,30 770,25 800,20" 
          fill="none" 
          stroke="url(#lineGradient)"
          stroke-width="3.5" 
          stroke-linecap="round"
          stroke-linejoin="round"
          style="filter: drop-shadow(0 0 8px rgba(109, 93, 248, 0.38));"/>
    
    <!-- 数据点保持正圆，使用品牌图表色 -->
    <circle cx="0" cy="180" r="7" fill="white" stroke="var(--chart-primary)" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(109, 93, 248, 0.45));"/>
    <circle cx="114" cy="140" r="7" fill="white" stroke="var(--chart-secondary)" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(47, 128, 237, 0.38));"/>
    <circle cx="228" cy="100" r="7" fill="white" stroke="var(--chart-teal)" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(0, 184, 169, 0.4));"/>
    <circle cx="342" cy="80" r="7" fill="white" stroke="var(--chart-mint)" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(24, 199, 167, 0.36));"/>
    <circle cx="456" cy="85" r="7" fill="white" stroke="#EAB308" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(234, 179, 8, 0.6));"/>
    <circle cx="570" cy="105" r="7" fill="white" stroke="#10B981" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.6));"/>
    <circle cx="684" cy="50" r="7" fill="white" stroke="#06B6D4" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.6));"/>
    <circle cx="800" cy="20" r="7" fill="white" stroke="#3B82F6" stroke-width="3" style="filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.6));"/>
  </svg>
  
  <!-- X轴标签 -->
  <div style="display: flex; justify-content: space-between; margin-top: 12px; padding: 0 10px;">
    <span style="font-size: 12px; color: var(--text-tertiary);">周一</span>
    <span style="font-size: 12px; color: var(--text-tertiary);">周二</span>
    <span style="font-size: 12px; color: var(--text-tertiary);">周三</span>
    <span style="font-size: 12px; color: var(--text-tertiary);">周四</span>
    <span style="font-size: 12px; color: var(--text-tertiary);">周五</span>
    <span style="font-size: 12px; color: var(--text-tertiary);">周六</span>
    <span style="font-size: 12px; color: var(--text-tertiary);">周日</span>
  </div>
</div>
```

### 3. 环形图（完整代码）

```html
<div style="position: relative; width: 200px; height: 200px;">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <!-- 背景圆环 -->
    <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border-subtle)" stroke-width="24" opacity="0.3"/>
    
    <!-- 渐变定义 -->
    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="var(--chart-primary)"/>
        <stop offset="100%" stop-color="#A78BFA"/>
      </linearGradient>
      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="100%" stop-color="#60A5FA"/>
      </linearGradient>
      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10B981"/>
        <stop offset="100%" stop-color="#34D399"/>
      </linearGradient>
      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F97316"/>
        <stop offset="100%" stop-color="#FB923C"/>
      </linearGradient>
    </defs>
    
    <!-- 35% 扇区 -->
    <circle cx="100" cy="100" r="80" 
            fill="none" 
            stroke="url(#gradient1)" 
            stroke-width="24"
            stroke-dasharray="176 327"
            stroke-dashoffset="0"
            stroke-linecap="round"
            transform="rotate(-90 100 100)"/>
    
    <!-- 30% 扇区 -->
    <circle cx="100" cy="100" r="80" 
            fill="none" 
            stroke="url(#gradient2)" 
            stroke-width="24"
            stroke-dasharray="151 352"
            stroke-dashoffset="-176"
            stroke-linecap="round"
            transform="rotate(-90 100 100)"/>
    
    <!-- 25% 扇区 -->
    <circle cx="100" cy="100" r="80" 
            fill="none" 
            stroke="url(#gradient3)" 
            stroke-width="24"
            stroke-dasharray="126 377"
            stroke-dashoffset="-327"
            stroke-linecap="round"
            transform="rotate(-90 100 100)"/>
    
    <!-- 10% 扇区 -->
    <circle cx="100" cy="100" r="80" 
            fill="none" 
            stroke="url(#gradient4)" 
            stroke-width="24"
            stroke-dasharray="50 453"
            stroke-dashoffset="-453"
            stroke-linecap="round"
            transform="rotate(-90 100 100)"/>
    
    <!-- 中心文字 -->
    <text x="100" y="95" text-anchor="middle" fill="var(--text-primary)" font-size="28" font-weight="700">12.5K</text>
    <text x="100" y="115" text-anchor="middle" fill="var(--text-tertiary)" font-size="13">总访问量</text>
  </svg>
</div>
```

### 4. 雷达图（完整代码）

```html
<div style="position: relative; width: 300px; height: 300px;">
  <svg width="300" height="300" viewBox="0 0 300 300">
    <!-- 背景网格（六边形） -->
    <polygon points="150,30 270,105 270,195 150,270 30,195 30,105" 
             fill="none" stroke="var(--border-subtle)" stroke-width="1"/>
    <polygon points="150,60 240,112.5 240,187.5 150,240 60,187.5 60,112.5" 
             fill="none" stroke="var(--border-subtle)" stroke-width="1"/>
    <polygon points="150,90 210,120 210,180 150,210 90,180 90,120" 
             fill="none" stroke="var(--border-subtle)" stroke-width="1"/>
    <polygon points="150,120 180,127.5 180,172.5 150,180 120,172.5 120,127.5" 
             fill="none" stroke="var(--border-subtle)" stroke-width="1"/>
    
    <!-- 轴线 -->
    <line x1="150" y1="150" x2="150" y2="30" stroke="var(--border-subtle)" stroke-width="1"/>
    <line x1="150" y1="150" x2="270" y2="105" stroke="var(--border-subtle)" stroke-width="1"/>
    <line x1="150" y1="150" x2="270" y2="195" stroke="var(--border-subtle)" stroke-width="1"/>
    <line x1="150" y1="150" x2="150" y2="270" stroke="var(--border-subtle)" stroke-width="1"/>
    <line x1="150" y1="150" x2="30" y2="195" stroke="var(--border-subtle)" stroke-width="1"/>
    <line x1="150" y1="150" x2="30" y2="105" stroke="var(--border-subtle)" stroke-width="1"/>
    
    <!-- 数据多边形 -->
    <polygon points="150,45 240,112.5 225,180 150,225 75,165 90,105" 
             fill="rgba(139, 92, 246, 0.2)" 
             stroke="var(--chart-primary)" 
             stroke-width="2.5"
             stroke-linejoin="round"/>
    
    <!-- 数据点 -->
    <circle cx="150" cy="45" r="5" fill="var(--chart-primary)"/>
    <circle cx="240" cy="112.5" r="5" fill="var(--chart-primary)"/>
    <circle cx="225" cy="180" r="5" fill="var(--chart-primary)"/>
    <circle cx="150" cy="225" r="5" fill="var(--chart-primary)"/>
    <circle cx="75" cy="165" r="5" fill="var(--chart-primary)"/>
    <circle cx="90" cy="105" r="5" fill="var(--chart-primary)"/>
    
    <!-- 标签 -->
    <text x="150" y="20" text-anchor="middle" fill="var(--text-secondary)" font-size="12">性能</text>
    <text x="285" y="100" text-anchor="start" fill="var(--text-secondary)" font-size="12">可用性</text>
    <text x="285" y="205" text-anchor="start" fill="var(--text-secondary)" font-size="12">安全性</text>
    <text x="150" y="290" text-anchor="middle" fill="var(--text-secondary)" font-size="12">扩展性</text>
    <text x="15" y="205" text-anchor="end" fill="var(--text-secondary)" font-size="12">稳定性</text>
    <text x="15" y="100" text-anchor="end" fill="var(--text-secondary)" font-size="12">可维护性</text>
  </svg>
</div>
```

## JavaScript 交互

### 自定义下拉框交互

```javascript
// 切换下拉框展开/收起
window.toggleSelect = function(trigger) {
  const select = trigger.closest('.custom-select');
  const isOpen = select.classList.contains('open');
  
  // 关闭其他下拉框
  document.querySelectorAll('.custom-select.open').forEach(s => {
    if (s !== select) s.classList.remove('open');
  });
  
  // 切换当前下拉框
  select.classList.toggle('open');
};

// 选择选项
window.selectOption = function(option) {
  const select = option.closest('.custom-select');
  const dropdown = select.querySelector('.select-dropdown');
  const trigger = select.querySelector('.select-trigger');
  const textSpan = trigger.querySelector('.select-text');
  
  // 更新选中状态
  dropdown.querySelectorAll('.select-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  option.classList.add('selected');
  
  // 更新触发器文本
  const value = option.getAttribute('data-value');
  const label = option.textContent;
  
  select.setAttribute('data-value', value);
  if (textSpan) {
    textSpan.textContent = label;
  }
  
  // 关闭下拉框
  select.classList.remove('open');
};
```

### 聊天窗口交互

```javascript
// 发送消息
window.sendChatMessage = function() {
  const textarea = document.querySelector('.chat-input');
  if (!textarea || !textarea.value.trim()) return;
  
  const messagesContainer = document.querySelector('.chat-messages');
  const message = textarea.value.trim();
  
  // 添加用户消息
  const userMsg = document.createElement('div');
  userMsg.className = 'message-user';
  userMsg.innerHTML = `
    <div class="message-bubble">${escapeHtml(message)}</div>
    <div class="message-avatar">👤</div>
  `;
  messagesContainer.appendChild(userMsg);
  
  // 清空输入框
  textarea.value = '';
  
  // 滚动到底部
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // 模拟 AI 回复
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message-ai';
    aiMsg.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-bubble">收到！这是演示回复。</div>
    `;
    messagesContainer.appendChild(aiMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1000);
};

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

## 动画效果

### CSS 动画定义

```css
/* 旋转动画（加载图标） */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 脉冲动画（Orb） */
@keyframes orb-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

/* 打字指示器 */
@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-4px); }
}

/* 浮动动画（魔法棒） */
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.05); }
}

/* 数据点脉冲 */
@keyframes dataPointPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### 应用动画

```html
<!-- 加载图标 -->
<svg style="animation: spin 2s linear infinite;">...</svg>

<!-- Orb 脉冲 -->
<div class="orb-ring" style="animation: orb-pulse 2s infinite;"></div>

<!-- 打字指示器 -->
<span style="animation: typing 1.4s infinite;"></span>

<!-- 魔法棒浮动 -->
<button class="magic-wand-floating" style="animation: float 3s ease-in-out infinite;">...</button>
```

## 响应式适配

### 断点定义

```css
/* 桌面端（默认） */
.chart-container {
  height: 250px;
}

/* 平板 */
@media (max-width: 1024px) {
  .chart-container {
    height: 200px;
  }
}

/* 手机 */
@media (max-width: 768px) {
  .chart-container {
    overflow-x: auto;
    min-width: 600px;
  }
  
  .bar-chart > div span {
    font-size: 10px;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .section-title {
    font-size: 24px;
  }
  
  .section-desc {
    font-size: 14px;
  }
}
```

## 性能优化技巧

### 1. SVG 优化

```html
<!-- ✅ 推荐：使用 preserveAspectRatio -->
<svg viewBox="0 0 800 250" preserveAspectRatio="none">

<!-- ✅ 推荐：复用 gradient 定义 -->
<defs>
  <linearGradient id="gradient1">...</linearGradient>
</defs>
<circle stroke="url(#gradient1)"/>
<circle stroke="url(#gradient1)"/>

<!-- ❌ 避免：重复定义 -->
<circle>
  <defs><linearGradient>...</linearGradient></defs>
</circle>
```

### 2. CSS 优化

```css
/* ✅ 推荐：使用 CSS 变量 */
.bar {
  background: var(--atlas-violet);
}

/* ❌ 避免：硬编码颜色 */
.bar {
  background: var(--chart-primary);
}

/* ✅ 推荐：GPU 加速 */
.bar:hover {
  transform: scaleY(1.05);
}

/* ❌ 避免：触发布局重排 */
.bar:hover {
  height: 70%;
}
```

### 3. JavaScript 优化

```javascript
// ✅ 推荐：事件委托
document.addEventListener('click', (e) => {
  if (e.target.matches('.select-option')) {
    selectOption(e.target);
  }
});

// ❌ 避免：为每个选项添加监听器
options.forEach(opt => {
  opt.addEventListener('click', () => selectOption(opt));
});
```

## 调试技巧

### 检查 SVG 坐标

```javascript
// 在浏览器控制台中检查
const svg = document.querySelector('svg');
const point = svg.createSVGPoint();
point.x = 100;
point.y = 100;
console.log(point.matrixTransform(svg.getScreenCTM()));
```

### 验证 stroke-dasharray

```javascript
// 计算预期值
const r = 80;
const circumference = 2 * Math.PI * r; // ≈ 503
const percentage = 0.35;
const dashLength = circumference * percentage; // ≈ 176
const gapLength = circumference - dashLength; // ≈ 327

console.log(`stroke-dasharray="${dashLength} ${gapLength}"`);
```

### 检查主题变量

```javascript
// 查看当前主题的所有 CSS 变量
getComputedStyle(document.documentElement).getPropertyValue('--atlas-violet');
```

## 常见问题排查

### 问题 1：环形图显示不完整

**症状：** 扇区之间有缺口或重叠

**解决：**
1. 检查周长计算是否正确（2πr）
2. 确认 stroke-dasharray 总和等于周长
3. 验证 stroke-dashoffset 累加是否正确

### 问题 2：折线图数据点不对齐

**症状：** 数据点偏离曲线路径

**解决：**
1. 确保 viewBox 尺寸与实际尺寸匹配
2. 检查 preserveAspectRatio 设置
3. 验证数据点坐标与路径控制点一致

### 问题 3：主题切换后颜色不变

**症状：** 图表仍使用旧主题颜色

**解决：**
1. 确保使用 CSS 变量而非硬编码颜色
2. 检查 data-theme 属性是否正确设置
3. 验证 CSS 变量在 :root 和 [data-theme="light"] 中都有定义

## 进阶技巧

### 动态生成图表

```javascript
function createBarChart(data) {
  const container = document.querySelector('.bar-chart');
  
  data.forEach((item, index) => {
    const bar = document.createElement('div');
    bar.style.height = `${item.value}%`;
    bar.style.background = `linear-gradient(180deg, ${item.color}, ${item.lightColor})`;
    bar.title = item.label;
    
    container.appendChild(bar);
  });
}

// 使用示例
createBarChart([
  { value: 60, color: 'var(--chart-primary)', lightColor: 'var(--cognitive-glow)', label: '¥45,000' },
  { value: 40, color: '#3B82F6', lightColor: '#93C5FD', label: '¥30,000' }
]);
```

### 添加交互动画

```javascript
// 柱状图入场动画
const bars = document.querySelectorAll('.bar-chart > div div[style*="height"]');
bars.forEach((bar, index) => {
  const finalHeight = bar.style.height;
  bar.style.height = '0%';
  
  setTimeout(() => {
    bar.style.transition = 'height 0.6s ease';
    bar.style.height = finalHeight;
  }, index * 100);
});
```

### 导出图表为图片

```javascript
function exportChartAsPNG(svgElement, filename) {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = filename;
    downloadLink.click();
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
}
```

---

**最后更新**: 2026-06-05
**版本**: 1.0.0

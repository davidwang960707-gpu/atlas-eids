# Design Tokens

Atlas EIDS 使用 CSS Variables 作为 Design Tokens 层。主要文件包括：

- `css/tokens.css`
- `css/dark-theme.css`
- `css/light-theme.css`
- `examples/react/src/styles/tokens.css`
- `examples/vue3/src/styles/tokens.css`

## 品牌色

| Token | Value | 用途 |
| --- | --- | --- |
| `--atlas-violet` | `#7B61FF` | 品牌主色、Orb、激活态 |
| `--deep-neural` | `#4F46E5` | 深层 AI 表面、Orb 阴影 |
| `--cognitive-glow` | `#B7A7FF` | Glow、高光、AI 辅助强调 |
| `--atlas-cyan` | `#06B6D4` | 信息提示和冷色辅助 |
| `--atlas-green` | `#00C48C` | 成功态和 running 状态 |

## 图表色板

| Token | Value | 用途 |
| --- | --- | --- |
| `--chart-primary` | `#6D5DF8` | 图表主线条/主填充 |
| `--chart-secondary` | `#2F80ED` | 第二数据序列 |
| `--chart-teal` | `#00B8A9` | AI / 数据辅助强调 |
| `--chart-mint` | `#18C7A7` | 正向趋势强调 |
| `--chart-amber` | `#F59E0B` | 警告或注意 |
| `--chart-rose` | `#EF5DA8` | 少量强调 |
| `--chart-grid` | `rgba(109, 93, 248, 0.09)` | 网格线和坐标轴 |

## Typography

| Token | 用途 |
| --- | --- |
| `--font-en` | 英文 UI 文本 |
| `--font-cn` | 中文 UI 文本 |
| `--font-mono` | Code、数字和技术标签 |

## Spacing

优先使用已有间距 scale，再新增自定义值：

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
--space-4xl: 96px;
```

## Radius

```css
--radius-sm: 12px;
--radius-md: 20px;
--radius-lg: 28px;
--radius-xl: 40px;
--radius-full: 9999px;
```

普通卡片建议控制在 `24px` 以内，除非是大尺寸展示容器。小型控制项如果是胶囊形态，优先使用 `--radius-full`。

## Motion

```css
--transition-fast: 150ms cubic-bezier(0.22, 1, 0.36, 1);
--transition-base: 300ms cubic-bezier(0.22, 1, 0.36, 1);
--transition-smooth: 400ms cubic-bezier(0.22, 1, 0.36, 1);
--transition-slow: 600ms cubic-bezier(0.22, 1, 0.36, 1);
```

Orb 代表 AI 生命体，可以使用更长、更柔和的循环动效。企业级操作控件应使用更短、更克制的过渡。


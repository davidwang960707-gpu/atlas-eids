# Design Tokens

Atlas EIDS 以 `packages/tokens/src/tokens.json` 作为唯一事实源，并生成 CSS、JSON、TypeScript 和 Machine Manifest。组件、模板、Storybook、Skills 与 Agent 不维护第二份视觉常量。

源文件遵循 DTCG 2025.10 Format，并固定为四层：

| 层级 | 责任 | 页面是否直接使用 |
| --- | --- | --- |
| Global | 原始色板、字号、间距、几何和动效尺度 | 通常不直接使用 |
| Semantic | Light/Dark 下的背景、文字、操作、状态与阴影意图 | 是 |
| Component | Button、Input、Table、App Shell、Orb 等组件决策 | 由组件使用 |
| State | Focus、Selected、Disabled 等交互状态 | 由组件和 Headless 行为使用 |

```bash
npm run build -w @atlas-eids/tokens
npm run build:manifests
npm run build:figma
npm run test:design-contract
npm run test:figma
```

## 颜色语义

| Token | 值 | 用途 |
| --- | --- | --- |
| `color.brand.primary` | `#7B61FF` | 品牌识别与 Living Orb |
| `color.brand.strong` | `#4F46E5` | 深层品牌材质 |
| `color.brand.soft` | `#B7A7FF` | 低强度智能能量层 |
| `color.action.primary` | 按主题变化 | 主操作、焦点和选中态 |
| `color.status.*` | 按主题变化 | Success、Warning、Error、Info 语义 |
| `color.bg.*` / `color.text.*` | 按主题变化 | Canvas、Surface、文字层级 |

品牌色不等于页面主题色。普通企业页面依靠中性 Canvas、Surface、Border 和 Text 建立层级，紫色只出现在品牌、主操作、选中态和明确的 AI 语义中。

## Typography

| Token | 值 | 使用范围 |
| --- | --- | --- |
| `font.size.micro` | `10px` | 纯数字 Badge、非阅读型指示 |
| `font.size.caption` | `12px` | 辅助信息、时间、元数据 |
| `font.size.body` | `14px` | 正文、控件、表格内容 |
| `font.size.headingSm` | `16px` | Panel、DataTable、区块标题 |
| `font.size.headingMd` | `18px` | 中型工作区标题 |
| `font.size.headingLg` | `20px` | 企业页面标题 |
| `font.size.metric` | `26px` | KPI 与关键指标 |

- 阅读内容最小字号为 `12px`。正文、标签、AI 回答、引用和错误信息不得使用 `10/11px`。
- `micro` 不能用于压缩布局，只允许无需连续阅读的短数字指示。
- Heading 使用 `line.height.heading`，正文使用 `line.height.body`，指标使用 `line.height.tight`。
- 字号不随 viewport 连续缩放；窄屏通过重排信息解决空间问题。

## Spacing

| Token | 值 | 常见用途 |
| --- | --- | --- |
| `space.1` | `4px` | 图标与文字、标题与辅助信息 |
| `space.2` | `8px` | 控件内部、紧密元素 |
| `space.3` | `12px` | 工具栏、紧凑容器 |
| `space.4` | `16px` | 标准区块、Panel Body |
| `space.5` | `20px` | 页面内边距、较大内容组 |
| `space.6` | `24px` | 页面边界、区块分隔 |
| `space.8` | `32px` | 大区块间距 |
| `space.12` | `48px` | 独立章节分隔 |

布局间距只使用以上尺度。`1px` 边框、图标尺寸、表格行高和 Orb 几何属于组件几何，不受布局间距尺度限制。

## Geometry

- Control：`6px` 圆角，Compact/Standard/Comfortable 高度 `28/32/40px`。
- Panel：`8px` 圆角；普通内容容器不得超过 `8px`。
- Overlay：`10px` 圆角，只用于 Dialog、浮层等 Overlay。
- Data Table：Compact/Standard/Comfortable 行高 `36/42/50px`。
- Shadow：普通表面使用 `shadow.surface`，悬浮和 Overlay 使用对应语义 Shadow，不在页面自定义材质。

## 主题与兼容层

React/Vue 由 `AtlasProvider` 设置 `theme`、`density` 和 `locale`。新代码直接使用 `--atlas-*` 变量；`css/atlas-token-compatibility.generated.css` 只服务旧静态展示，不能成为新页面的 Token 源。

新增 Token 后必须运行构建和契约检查。`test:design-contract` 会拒绝组件 CSS 中未定义的 `--atlas-*` 变量，避免浏览器静默回退破坏字体、间距或颜色层级。

## Figma Variables

Token 构建会同步生成 `figma/atlas-eids.variables.json`，保留四个 Collection、Light/Dark Mode、Alias、解析值和 CSS Code Syntax。它是可审计交接资产，不代表 Figma Team Library 已在线发布；正式节点与 Code Connect 的权限边界见 [Figma 交付资产](../figma/README.md)。

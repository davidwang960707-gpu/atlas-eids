# Atlas 视觉质量契约

在实现新页面、修复视觉问题、审查 Pattern Lab、独立模板或 Storybook 时读取本文件。完整 Token 值以 `packages/tokens/src/tokens.json` 为准。

## 基线

| 项目 | 当前契约 |
| --- | --- |
| 品牌主色 | `#7B61FF` 只用于品牌识别和少量智能能量层 |
| 主操作 | `#4F46E5` 对应关键按钮、焦点和选中态 |
| 柔和辅助 | `#B7A7FF` 对应低强度状态，不铺满页面 |
| 控件高度 | Compact `28px`、Standard `32px`、Comfortable `40px` |
| 圆角 | Control `6px`、Panel `8px`、Overlay `10px`；普通页面容器不得超过 `8px` |
| 表格 | 表头和数据行标准高度 `42px`，文字垂直居中，列标题与数据共享起始线 |
| 字体 | Body `14px`、Caption `12px`、页面标题约 `20-24px`；紧凑面板中不用 Hero 字号 |
| 间距 | 4px 基线，常用 `8 / 12 / 16 / 24 / 32px` |
| 阴影 | 普通页面靠中性背景、边框和留白分层；阴影只用于 Overlay 或必要悬浮反馈 |

## 企业页面

- App Shell、页头、筛选栏、表格和分页必须共享内容边界；不要出现左边缘、列线或操作区随机错位。
- 页头只承载面包屑、标题、简短说明和关键操作，不做营销 Hero，不堆叠多层标签。
- 页面背景使用 Canvas，主要内容使用 Surface。筛选、表格和分页优先组成一个连续任务区域。
- 卡片只承载独立对象或完整工具。不要把表格行、页面分区、页头再次包成大圆角卡片。
- 普通任务、文件、客户和数据行使用 Lucide 业务图标、头像或状态点，不使用 Orb。
- 桌面端至少检查 `1280x720` 和 MacBook 常用视口；移动端至少检查 `390x844`。不得出现横向裁切、文本遮挡、按钮挤压或固定区覆盖内容。

## Living Orb

- Orb 代表 AI 身份与生命状态。允许出现在 AI 助手、Agent 实体、Thinking、Running、Error；禁止作为普通 Logo 替身、产品卡片装饰或任务行图标。
- Core 接近外层轨道，并保留 atmosphere、双轨道、depth、caustic、liquid、specular 层。Core 有液态金属呼吸、阻尼和柔性随机形变，但不突破轨道。
- 小尺寸 Orb 必须仍可识别内核和状态；大量重复列表优先改用静态状态点，避免持续动效干扰扫描。
- Hero 可以放大生命感和氛围；组件、页面模板和 Storybook 需要降低外部辉光，但不得退化成单层径向渐变圆球。
- 组件实现使用 `AtlasOrb`。官网或原生 HTML 只有在无法使用框架组件时才复用 `examples/shared/agent-orb.css` 的完整共享结构。

## 跨端对齐

- React 与 Vue 对齐组件意图、尺寸、状态矩阵、键盘行为和 A11y；事件命名遵循各框架习惯。
- Storybook 是组件交互基线，`index.html#orb-components` 是品牌材质与氛围基线，`examples/templates` 是企业页面组合基线。
- 调整任一基础组件后，同时检查 React Story、Vue Story、独立模板和文档 API；不要只更新一个展示面。
- 视觉相似不等于像素复制。第三方 Adapter 保留宿主运行时能力，但颜色、密度、圆角、状态和 AI 语义必须回到 Atlas Tokens。

## 验收

1. 对照当前组件 API 和对应 Story，不引用过时截图。
2. 覆盖 Default、Hover、Focus、Disabled、Loading、Empty、Error 和长文本状态。
3. 使用键盘完成主要流程，焦点清晰且顺序合理。
4. 运行 `npm run test:storybook`、`npm run test:a11y`、`npm run test:e2e` 和 `npm run test:visual`。
5. 视觉变更必须实际看桌面与移动截图；通过测试不代表审美验收完成。

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
| 字体 | Page `20px`、Section `16px`、Body `14px`、Caption `12px`、Metric `26px`；Micro `10px` 只用于数字 Badge |
| 行高 | Heading `1.35`、Body `1.5`、Metric `1.2` |
| 间距 | 4px 基线，只使用 `4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px` Token 尺度 |
| 阴影 | 普通页面靠中性背景、边框和留白分层；阴影只用于 Overlay 或必要悬浮反馈 |

## 企业页面

- App Shell、页头、筛选栏、表格和分页必须共享内容边界；不要出现左边缘、列线或操作区随机错位。
- 页头只承载面包屑、标题、简短说明和关键操作，不做营销 Hero，不堆叠多层标签。
- 一个页面先确定一个主任务；一个任务区域最多一个 Primary 操作。重复导航、重复导入/新建入口和同权重面板会稀释产品层级。
- 页面背景使用 Canvas，主要内容使用 Surface。筛选、表格和分页优先组成一个连续任务区域。
- 卡片只承载独立对象或完整工具。不要把表格行、页面分区、页头再次包成大圆角卡片。
- 页面标题、区块标题、正文和辅助信息必须形成 `20/16/14/12px` 的稳定梯度；不得用 `10/11px` 压缩可阅读内容，也不得让所有标题回退成 Body。
- 同类元素使用同一 Space Token；跨区关系至少比区内关系高一个间距档位，体现“同类相聚、异类相离”。
- 普通任务、文件、客户和数据行使用 Lucide 业务图标、头像或状态点，不使用 Orb。
- 桌面端至少检查 `1280x720` 和 MacBook 常用视口；移动端至少检查 `390x844`。不得出现横向裁切、文本遮挡、按钮挤压或固定区覆盖内容。

## 状态与响应式

- 状态矩阵至少包括 Default、Loading、Empty、Filtered Empty、Error with Retry、Permission Denied、Disabled、Long Content 和 Mobile。
- 筛选为空时，详情、AI 回答、引用、计数和分页必须同步刷新；不得保留与当前结果无关的旧上下文。
- Loading 由组件统一呈现，不要同时叠加组件 Spinner 和自定义旋转图标。Error 必须提供恢复路径，不能只换颜色。
- 响应式的目标是重排功能，不是删除功能。空间不足时使用纵向区块、Drawer、Overflow Menu 或可滚动数据区，保留筛选、主操作、状态和行级命令。
- 次级详情或 AI 面板并排宽度小于 `320px` 时，应转为纵向布局或 Drawer；长文本不能靠缩成 10px 解决。

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
6. 运行 `npm run atlas -- validate <page> --framework react|vue`，修复 Error，并审阅 Typography、Spacing 和 Primary Action Warning。

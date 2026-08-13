# 企业页面组合与 UI 质量规范

本规范解决“单个组件合格，组合成页面却不专业”的问题。它约束信息架构、视觉层级、状态一致性和响应式行为；具体 Token 值以 [Design Tokens](DESIGN_TOKENS.md) 为准，组件 API 以 Manifest 与 Storybook 为准。

## 一、先定义任务，再摆组件

每个页面在编码前先写清四项：

1. **唯一主任务**：用户来到页面最重要的工作是什么。
2. **唯一主操作**：完成或启动该任务的关键命令是什么。
3. **次级区域**：哪些信息用于解释、预览、历史或 AI 辅助。
4. **状态矩阵**：Loading、Empty、Filtered Empty、Error、Permission、Disabled、Long Content、Mobile 如何表现。

同一任务区域最多一个 Primary 操作。重复的导航、导入、新建或 AI 入口应合并或降级，否则页面会失去视觉焦点。

## 二、统一内容基线

- App Shell、Page Header、筛选、表格、分页和详情面板共享内容左边界。
- 表头与单元格使用相同列起点，行级操作保持稳定宽度。
- 筛选、表格、分页优先形成连续数据表面，不拆成多张同权重卡片。
- Panel 是次级信息容器，不再嵌套同级 Card/Panel，也不与主任务争夺面积和标题权重。

## 三、字体与间距

| 层级 | Token | 用途 |
| --- | --- | --- |
| Page | `headingLg / 20px` | 页面唯一标题 |
| Section | `headingSm / 16px` | DataTable、Panel、工作区标题 |
| Body | `body / 14px` | 正文、表格、控件 |
| Caption | `caption / 12px` | 元数据、时间、辅助说明 |
| Metric | `metric / 26px` | KPI |

正文阅读字号不得低于 `12px`。页面间距使用 `4/8/12/16/20/24/32/48px` Token 尺度；同类元素的间距小于跨区间距，形成“同类相聚、异类相离”的稳定节奏。

## 四、表面、色彩与 Orb

- Canvas 承载应用背景，Surface 承载任务，Subtle 承载表头、筛选和低强度选中区。
- 品牌紫不铺满普通页面；Status 色只表达状态，不做装饰主题。
- 普通页面容器圆角不超过 `8px`，普通内容依靠边框和留白分层。
- Living Orb 只表达 AI 身份、思考、执行和异常。业务对象使用 Lucide 图标、头像或状态点。
- AI 面板仍服从企业页面层级；科技感不能替代来源、权限、工具状态、审批和恢复路径。

## 五、状态一致性

| 状态 | 必须表现 |
| --- | --- |
| Loading | 保持最终布局稳定，只出现一套加载反馈 |
| Empty | 解释无数据原因，并给出合理下一步 |
| Filtered Empty | 清理详情、AI 回答、引用、分页和与结果相关的计数 |
| Error | 展示原因、影响和 Retry/修复入口 |
| Permission | 明确不可见或不可操作范围，不伪装成 Empty |
| Disabled | 保留可识别标签和原因，不只降低透明度 |
| Long Content | 截断与展开策略明确，不破坏列和容器 |

## 六、响应式

- 响应式优先级是重排、折叠、Drawer 和 Overflow Menu，不是隐藏核心功能。
- 次级详情或 AI 面板并排宽度小于 `320px` 时转为纵向区块或 Drawer。
- 表格窄屏至少保留对象、状态和行级操作；低优先级列可进入详情或列设置。
- 在 `1280x720`、MacBook 常用视口和 `390x844` 检查文本、焦点、固定区和滚动路径。

## 七、React/Vue 契约

- 两端共享组件语义、状态结果、视觉类名、Token、密度、A11y 和响应式结果。
- React 使用受控 Props/Callback，Vue 使用 Props/Slots/Emits 与 `v-model`，API 语法可以不同，行为结果必须等价。
- 修改组合组件时同步检查双端 Story、独立模板、Skills、Machine Manifest 和视觉回归。

## 八、验收命令

```bash
npm run atlas -- validate <page> --framework react
npm run atlas -- validate <page> --framework vue
npm run test:design-contract
npm run test:api-contract
npm run test:skills
npm run build:storybook
```

自动检查负责发现未知 Token、过小阅读字号、脱离间距尺度、多个 Primary、组件绕过和 Orb 误用；最终仍需查看桌面与移动截图，确认视觉动线和信息主次。

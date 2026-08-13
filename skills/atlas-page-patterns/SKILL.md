---
name: atlas-page-patterns
description: 为 Atlas 企业应用选择、生成或审查 7 种应用框架、13 种基础布局、通用页面、业务场景和 15 种 AI 原生页面模式；涉及 App Shell、页面模板、路由或 Pattern Lab 时使用。
---

# Atlas Page Patterns

## 应用框架

`sidebar`、`top`、`hybrid`、`workbench`、`tabs`、`fullscreen`、`tenant`。

框架负责全局路由、菜单、权限、主题、多租户和工作方式；页面模板只负责当前任务区域。不要在页面内重复实现全局导航。

13 种基础布局包括：单栏、上下、左右分栏、左树右内容、左列表右详情、主从三栏、卡片网格、对比、多标签页、画布工作区、地图复合、主页面加抽屉、沉浸式。按任务关系选择布局，不按视觉新奇度选择。

## 选择方法

```bash
npm run atlas -- list layouts
npm run atlas -- knowledge patterns "知识库"
npm run atlas -- agent plan "多租户 Agent 管理页面" --json
```

CLI 当前可直接生成 15 个核心 Blueprint：`workbench`、`data-list`、`card-list`、`detail`、`form`、`analytics`、`settings`、`approval`、`kanban`、`calendar`、`files`、`ai-chat`、`agent-task`、`ai-review`、`ai-governance`。`examples/templates` 还提供 `ai-knowledge` 的完整运行示例。完整 126 项目录和组合结构以 `docs/APP_FRAMEWORK_LIBRARY.md` 为准，不宣称每一项都已成为独立 CLI Blueprint。

机器可读组合配方位于 `manifests/page-recipes.json`，MCP Resource 为 `atlas://contracts/page-recipes`。新增 Blueprint 时必须同步该清单和 CLI 目录测试。

AI 原生模式包括：AI 对话、AI 侧边助手、搜索问答、智能填表、数据分析、生成审阅、文档工作台、Agent 任务、推荐决策、AI 批处理、Agent 管理、知识库管理、运行监控、质量评测和审计治理。

## 页面布局

- 先写出页面的唯一主任务、唯一主操作、次级区域和状态矩阵，再选择组件；不要从卡片数量开始布局。
- 页头只保留层级、标题、说明和关键操作，不做营销 Hero。
- 内容宽度、表格列、筛选和工具条必须共享基线；标准表格行高为 `42px`。
- 页面区块使用全宽带或边框分组，避免卡片套卡片。
- Page/Section/Body/Caption 使用 `20/16/14/12px` 层级，布局间距使用 `4/8/12/16/20/24/32/48px` Token 尺度。
- Desktop、MacBook 常见尺寸和 Mobile 都要检查文本、表格和固定工具区；响应式必须重排而不是隐藏核心功能。
- Filtered Empty 必须清理详情、AI 回答和引用；Loading 不叠加两套 Spinner；Error 提供 Retry 或明确恢复动作。
- AI 页面仍然是企业任务页面，科技感来自 Orb、状态、材料和运动，不来自大面积渐变。

## 真实 Demo 门槛

- Pattern Lab 的预览必须能进入可操作 Demo，不以缩略示意图替代完整页面。
- 独立模板至少有一条可完成的主要流程，并实现筛选、选择、分页、抽屉、审批或生成中的适用交互。
- 普通页面使用业务图标；只有明确的 AI 助手和 Agent 状态使用 Orb。
- 组合层视觉以 `examples/templates` 为基线，基础组件以 React/Vue Storybook 为基线，详细规则读取 `../atlas-eids-design-system/references/visual-quality.md`。
- `manifests/page-recipes.json` 中的 `primaryTask`、`primaryAction`、`requiredStates` 和 `responsiveContract` 是 Agent 生成与验收的机器契约，不得只看区域列表。

# 应用框架与页面模板库

> 目标：每一类页面都能直接套一套可落地布局。

Atlas EIDS 从“视觉样式”升级到“页面方法库”。你可以先选应用框架，再定基础布局，再套业务模板，并通过真实 Demo 验证字段、状态与操作路径。

## 可视示例

打开 [`patterns.html`](../patterns.html) 可进入 Atlas Pattern Lab。当前 7 种应用框架、13 种基础布局、39 种通用页面、18 种业务场景、15 种 AI 原生页面和 34 项 AI 交互组件均已覆盖。目录卡片保留微缩结构，点击后会进入按类型生成的真实工作区，包含表格、表单、图表、画布、AI 会话、治理状态与操作反馈，并支持分类和搜索。

| 层级 | 目标 | 可交互 Demo | 状态 |
| --- | ---: | ---: | --- |
| 应用框架 | 7 | 7 | 已覆盖 |
| 基础布局 | 13 | 13 | 已覆盖 |
| 通用页面模板 | 39 | 39 | 已覆盖 |
| 业务场景模板 | 18 | 18 | 已覆盖 |
| AI 原生页面 | 15 | 15 | 已覆盖 |
| AI 交互组件 | 34 | 34 | 已覆盖 |

## 独立运行模板

`examples/templates` 将其中 15 个高价值 Pattern 实现为独立 React 路由。它们不是缩略示意图，而是使用 Atlas 正式组件、真实字段、状态和交互反馈组成的完整页面。

| 分组 | 页面 |
| --- | --- |
| 通用页面 | 角色工作台、数据列表、卡片列表、对象详情、分步表单、经营分析、系统设置 |
| 业务场景 | 审批详情、任务看板、团队日历、文件管理 |
| AI 原生 | AI 对话、Agent 任务、AI 生成审阅、AI 审计治理 |

```bash
npm run dev:templates
```

页面通过 `/#/workbench`、`/#/data-list`、`/#/ai-chat` 等地址直接访问，并纳入 E2E、A11y 和首屏视觉回归。

> Demo 使用通用示例数据表达交互和信息层级，不绑定具体行业。React 与 Vue 示例中的 7 种应用框架同步采用相同交互语义，同时保留各自技术栈的组件写法。

## 企业界面视觉基线

Pattern Lab 吸收 Ant Design、TDesign 等成熟企业级设计体系在信息秩序、控件密度和状态语义上的通用规律，但不复刻任何一套组件库的默认皮肤。Atlas 的差异主要保留在品牌紫、Living Orb、AI 执行状态、人工确认和治理反馈上。

| 维度 | Atlas Pattern Lab 基线 |
| --- | --- |
| Color Token | 中性色承担页面结构；`#7B61FF` 仅用于主操作、当前态和 AI 识别；成功、警告、错误使用稳定语义色 |
| Typography | 正文基准 `14px`，辅助文字 `12px`，页面标题 `20px`；正文常规字重，标题和关键数据使用中等字重 |
| Button | 默认控件高度 `32px`，圆角 `6px`；一个操作组最多一个主按钮；主按钮使用纯色，不使用装饰性渐变和外发光 |
| Layout | 顶栏 `48px`；页面头由面包屑、标题、简短说明和操作区组成；以 `4 / 8 / 12 / 16 / 24px` 建立间距节奏 |
| Container | 普通卡片和面板圆角 `6px`，弹窗 `8px`；数据层级优先依靠边框、留白和分区，阴影只用于浮层 |
| AI Identity | Living Orb 必须复用共享结构和动画，不允许使用单层径向渐变替代；AI 结果需同时呈现状态、依据和人工控制 |

### 设计边界

- 企业操作区强调扫描效率，避免将页面标题做成展示型 Hero。
- 卡片只用于真实对象或独立工具，表格行、筛选区和页面分区不额外套大圆角容器。
- 品牌色不承担成功、警告、错误等功能语义，避免所有状态都变成紫色。
- Living Orb 只用于 AI 助手入口、Agent 实体和 AI 运行状态；普通数据列表、普通对象卡片与非 AI 状态不得使用 Orb 装饰。
- Living Orb 可以随 AI 状态改变材质和色彩，但外层轨道、内部液态结构和呼吸节奏必须保持同一组件契约。

## 一、应用框架

先定系统的导航语义与操作模式。

| 名称 | CLI ID | 结构 | 生成后的真实能力 |
| --- | --- | --- | --- |
| 左侧导航框架 | `sidebar` | 左侧菜单 + 顶部工具栏 + 内容区 | 权限菜单、路由守卫、主题切换 |
| 顶部导航框架 | `top` | 顶部一级导航 + 内容区 | 一级路由、通栏内容、主题切换 |
| 混合导航框架 | `hybrid` | 顶部产品导航 + 左侧业务菜单 | 产品 / 业务分层导航、权限过滤 |
| 工作台框架 | `workbench` | 应用入口 + 待办 + 消息 + 数据卡片 | 应用启动区、角色工作台、业务路由 |
| 多标签页框架 | `tabs` | 导航 + 页面标签栏 + 内容区 | 页面标签路由、权限菜单、多任务结构 |
| 全屏工作区框架 | `fullscreen` | 精简导航 + 工具栏 + 全屏画布 | 紧凑工具栏、全屏内容、路由切换 |
| 多租户框架 | `tenant` | 租户切换 + 系统导航 + 租户内容 | 租户会话、Java Tenant Header、RBAC |

CLI 生成的每种框架都包含 `navigation`、`router`、`auth`、`theme` 与 `atlas-api` 模块，并提供概览、任务、智能分析和系统设置路由。前端通过 `X-Atlas-Tenant` 与 Java Client 传递当前租户，401 时刷新本地 Demo Token；多租户框架默认使用具备多个租户权限的本地 `admin` 账号。

## 二、基础页面布局

每种基础布局都配一段最小示例片段。

| 名称 | 典型结构 | 示例片段 |
| --- | --- | --- |
| 单栏布局 | 页头 + 单一内容区 | `<page><header/><main/></page>` |
| 上下布局 | 上方摘要/筛选 + 下方主体内容 | `<page><header/><section class="summary"/><section class="content"/></page>` |
| 左右分栏布局 | 左侧辅助区 + 右侧主内容 | `<page><aside/><main/></page>` |
| 左树右内容布局 | 左侧组织/分类树 + 右侧业务内容 | `<page><tree-view/><content/></page>` |
| 左列表右详情布局 | 左侧对象列表 + 右侧详情 | `<page><list/><detail/></page>` |
| 主从三栏布局 | 列表 + 详情 + 次级详情 | `<page><list/><detail/><meta/></page>` |
| 卡片网格布局 | 筛选 + 响应式卡片网格 | `<page><filters/><card-grid/></page>` |
| 对比布局 | 多个对象并排展示 | `<compare><panel/><panel/></compare>` |
| 多标签页布局 | 多个对象或页面以 Tab 打开 | `<tabs><tab/><tab/><tab/><content/></tabs>` |
| 画布工作区布局 | 左侧资源 + 中央画布 + 右侧属性 | `<page><library/><canvas/><property/></page>` |
| 地图复合布局 | 地图 + 列表 + 浮动详情 | `<page><map/><list/><floating-detail/></page>` |
| 主页面 + 抽屉布局 | 主内容 + 右侧详情/编辑抽屉 | `<page><main/><drawer/></page>` |
| 沉浸式布局 | 隐藏常规导航，聚焦单一任务 | `<page class="immersive"><primary-workspace/><floating-toolbar/></page>` |

## 三、通用页面模板（每个模板都附示例）

### 1. 首页与概览

| 页面名称 | 标准结构 | 示例片段 |
| --- | --- | --- |
| 门户首页 | 应用入口 + 公告 + 快捷功能 | `<portal-home><hero/><announce/><quick-actions/><news/></portal-home>` |
| 角色工作台 | 待办 + 消息 + 指标 + 业务动态 | `<workbench><todo/><messages/><kpi-cards/><feed/></workbench>` |
| 数据概览页 | KPI + 图表 + 排行 + 预警 | `<overview><kpi/><charts/><ranking/><alerts/></overview>` |
| 经营驾驶舱 | 核心指标 + 趋势 + 风险 + 预测 | `<cockpit><core-metrics/><trend/><risk-matrix/><forecast/></cockpit>` |
| 全局搜索页 | 搜索框 + 分类筛选 + 搜索结果 | `<search><searchbox/><filters/><results/></search>` |

### 2. 列表与数据管理

| 页面名称 | 标准结构 | 示例片段 |
| --- | --- | --- |
| 数据列表页 | 查询条件 + 操作栏 + 表格 + 分页 | `<data-list><filters/><toolbar/><table/><pagination/></data-list>` |
| 卡片列表页 | 查询条件 + 卡片网格 + 分页 | `<card-list><filters/><card-grid/><pagination/></card-list>` |
| 待办列表页 | 状态分类 + 任务列表 + 快捷处理 | `<todo-list><tabs/><list/><quick-actions/></todo-list>` |
| 树形列表页 | 层级数据 + 展开收起 + 行操作 | `<tree-page><tree/><rows/><row-actions/></tree-page>` |
| 左树右表页 | 组织 / 分类树 + 数据表格 | `<split><tree/><table/></split>` |
| 左树右卡页 | 分类树 + 卡片列表 | `<split><tree/><card-grid/></split>` |
| 列表详情页 | 左侧列表 + 右侧对象详情 | `<split><list/><detail-card/></split>` |
| 主子表页 | 主对象信息 + 子项明细表 | `<master-detail><master/><children-table/></master-detail>` |
| 批量处理页 | 对象选择 + 批量配置 + 处理结果 | `<batch><selectors/><config/><result-log/></batch>` |
| 导入导出页 | 文件上传 + 字段映射 + 校验结果 | `<import-export><upload/><field-map/><validation/><history/></import-export>` |

### 3. 详情与表单

| 页面名称 | 标准结构 | 示例片段 |
| --- | --- | --- |
| 详情页 | 摘要头 + 状态 + 分组信息 + 关联数据 | `<detail-page><summary/><status/><sections/><related/></detail-page>` |
| 新增页 | 分组表单 + 保存 + 取消 | `<create-form><grouped-fields/><actions/></create-form>` |
| 编辑页 | 当前数据 + 修改表单 + 保存 | `<edit><entity-header/><edit-form/><actions/></edit>` |
| 快速创建页 | 精简字段 + 快速提交 | `<quick-create><compact-form/><submit/></quick-create>` |
| 分步表单页 | 步骤条 + 分步填写 + 最终确认 | `<step-form><steps/><step-pane/><confirm/></step-form>` |
| 审批详情页 | 业务详情 + 审批记录 + 审批操作 | `<approval><business-detail/><record/><approval-actions/></approval>` |
| 档案页 | 基础资料 + 附件 + 关联记录 | `<profile><basic-info/><attachments/><related/></profile>` |
| 版本对比页 | 修改前 + 修改后 + 差异标记 | `<diff><before/><after/><change-mark/></diff>` |

### 4. 分析与报表

| 页面名称 | 标准结构 | 示例片段 |
| --- | --- | --- |
| 数据分析页 | 指标 + 筛选 + 图表 + 明细表 | `<analytics><metric-bar/><filters/><charts/><detail-table/></analytics>` |
| 综合报表页 | 查询条件 + 报表 + 导出 | `<report><filters/><report-view/><export/></report>` |
| 多维分析页 | 维度选择 + 指标选择 + 透视表 | `<multidim><dimensions/><metrics/><pivot-table/></multidim>` |
| 数据钻取页 | 汇总数据 + 逐层下钻 + 明细 | `<drill><summary/><drill-path/><detail-table/></drill>` |
| 对象对比页 | 对象选择 + 指标矩阵 + 差异 | `<compare-objects><object-switch/><matrix/><variance/></compare-objects>` |
| 实时监控页 | 实时指标 + 趋势 + 告警 | `<monitor><realtime-kpi/><trend/><alerts/></monitor>` |

### 5. 配置与管理

| 页面名称 | 标准结构 | 示例片段 |
| --- | --- | --- |
| 系统设置页 | 设置导航 + 分组配置 + 保存 | `<settings><settings-nav/><sections/><save/></settings>` |
| 组织架构页 | 组织树 + 部门 / 人员信息 | `<org><org-tree/><member-table/></org>` |
| 用户管理页 | 查询 + 用户列表 + 用户详情 | `<users><filters/><user-table/><detail-slide/></users>` |
| 角色权限页 | 角色列表 + 菜单 / 操作 / 数据权限 | `<roles><role-list/><permission-grid/><resource-rules/></roles>` |
| 权限矩阵页 | 角色 × 资源 × 操作 | `<matrix><roles/><resources/><permissions/></matrix>` |
| 数据字典页 | 字典分类 + 字典项 | `<dict><categories/><items/><edit/></dict>` |
| 参数配置页 | 参数分类 + 参数值 + 版本 | `<params><category/><values/><version-line/></params>` |
| 操作日志页 | 筛选 + 日志列表 + 日志详情 | `<audit><filters/><log-table/><log-detail/></audit>` |
| 审计追踪页 | 操作人 + 变更前后 + 时间 | `<trace><actor/><before-after/><timeline/></trace>` |
| 集成管理页 | 系统连接 + 凭证 + 同步状态 | `<integration><connectors/><credentials/><sync-status/></integration>` |

## 四、业务场景模板

| 页面名称 | 典型场景 | 示例片段 |
| --- | --- | --- |
| 待办中心 | 审批、任务、工单统一处理 | `<hub><filters/><channels/><queue/></hub>` |
| 流程中心 | 发起流程、查看流程状态 | `<flow-center><start-button/><list/><status-board/></flow-center>` |
| 流程设计器 | 节点拖拽、条件和审批人配置 | `<flow-designer><palette/><canvas/><properties/></flow-designer>` |
| 规则配置页 | 条件组合、执行动作、规则测试 | `<rule-config><condition-builder/><action-binding/><test-run/></rule-config>` |
| 看板页 | 任务、商机、工单状态流转 | `<kanban><lane/><card/><timeline/></kanban>` |
| 日历页 | 日程、会议、预约 | `<calendar><month-view/><slots/><detail-drawer/></calendar>` |
| 排班排期页 | 人员、设备和资源调度 | `<scheduling><roster/><resource-matrix/><allocation/></scheduling>` |
| 甘特图页 | 项目计划、进度和依赖 | `<gantt><timeline/><tasks/><dependencies/></gantt>` |
| 时间轴页 | 审批记录、物流轨迹、操作历史 | `<timeline-view><filter/><events/><attachments/></timeline-view>` |
| 地图调度页 | 门店、车辆、人员、设备 | `<dispatch><fleet-map/><task-list/><alerts/></dispatch>` |
| 客服工作台 | 客户信息 + 会话 + 工单 + 知识库 | `<support><customer/><conversation/><tickets/><knowledge/></support>` |
| 客户 360 页 | 客户资料 + 交易 + 活动 + 关系 | `<customer-360><profile/><orders/><activity/><relation/></customer-360>` |
| 项目控制台 | 任务 + 成员 + 成本 + 风险 | `<project-console><tasks/><team/><cost/><risk/></project-console>` |
| 设备监控页 | 设备树 + 实时状态 + 告警 | `<device-monitor><device-tree/><live-states/><alarms/></device-monitor>` |
| 文件管理页 | 目录树 + 文件列表 + 在线预览 | `<file-manager><folder-tree/><file-table/><preview/></file-manager>` |
| 知识库页 | 分类 + 文章列表 + 正文 | `<knowledge><categories/><article-list/><article-view/></knowledge>` |
| 低代码设计器 | 组件库 + 画布 + 属性 + 数据源 | `<low-code><components/><canvas/><props-panel/><data-source/></low-code>` |
| 运维控制台 | 服务树 + 监控 + 日志 + 终端 | `<ops-console><service-tree/><monitor/><logs/><terminal/></ops-console>` |

## 五、AI 原生页面模板

| 页面名称 | 标准结构 | 示例片段 |
| --- | --- | --- |
| AI 对话页 | 会话历史 + 消息流 + 输入框 + 工具 | `<ai-chat><session/><message-flow/><input/><tool-panel/></ai-chat>` |
| AI 侧边助手 | 当前业务页面 + 右侧 AI 面板 | `<with-ai-assistant><business-page/><ai-panel/></with-ai-assistant>` |
| AI 搜索问答页 | 问题 + 答案 + 引用来源 + 关联对象 | `<ask-page><question/><answer/><references/><context-links/></ask-page>` |
| AI 智能填表页 | 业务表单 + 推荐值 + 生成依据 + 确认 | `<smart-form><form/><suggestions/><rationale/><confirm/></smart-form>` |
| AI 数据分析页 | 自然语言提问 + 图表 + 结论 + 明细 | `<ai-analytics><nl-query/><visuals/><insight/><detail-list/></ai-analytics>` |
| AI 生成审阅页 | 原内容 + 生成内容 + 差异 + 接受/拒绝 | `<review><original/><generated/><diff/><actions/></review>` |
| AI 文档工作台 | 文档编辑 + 生成 + 改写 + 引用 | `<doc-studio><editor/><generate/><rewrite/><citations/></doc-studio>` |
| Agent 任务工作台 | 任务目标 + 执行计划 + 步骤 + 结果 | `<agent-studio><goal/><plan/><steps/><outputs/></agent-studio>` |
| AI 推荐决策页 | 推荐结果 + 依据 + 风险 + 人工确认 | `<decision><recommendation/><reason/><risk-panel/><confirm/></decision>` |
| AI 批处理页 | 数据范围 + 指令 + 预览 + 批量执行 | `<batch-ai><scope/><prompt/><preview/><run/></batch-ai>` |
| Agent 管理页 | 智能体 + 模型 + 技能 + 工具 + 权限 | `<agent-admin><agent-cards/><model-settings/><skills/><tooling/><governance/></agent-admin>` |
| AI 知识库管理页 | 数据源 + 解析状态 + 知识权限 | `<kb-admin><sources/><parse-status/><access-rules/></kb-admin>` |
| AI 运行监控页 | 调用量 + 成功率 + 耗时 + 成本 | `<ai-ops><qps/><success-rate/><latency/><cost/></ai-ops>` |
| AI 质量评测页 | 测试集 + 模型对比 + 评分 | `<quality-lab><dataset/><compare/><scoreboard/><review/></quality-lab>` |
| AI 审计治理页 | 输入 + 输出 + 工具调用 + 审批记录 | `<governance><input-log/><output-log/><tool-calls/><approval-log/></governance>` |

## 六、AI 交互组件

> 标注：此处组件仍保持“低干扰 + 可追责”原则。

- **AI 入口**
  - 全局 AI 助手入口：`<global-ai-trigger/>`
  - 页面 AI 助手入口：`<page-ai-trigger/>`
  - 魔法棒按钮：`<magic-trigger/>`
  - AI 操作菜单：`<ai-action-menu/>`
  - 字段级 AI 按钮：`<field-ai-action/>`

- **输入组件**
  - AI 消息输入框：`<ai-input-box/>`
  - 推荐问题：`<suggested-queries/>`
  - 快捷指令：`<quick-command/>`
  - 引导式生成表单：`<guided-form/>`
  - 文件附件：`<ai-file-uploader/>`
  - 上下文标签：`<context-tag/>`
  - 数据源和工具选择：`<source-tool-picker/>`

- **输出组件**
  - 对话气泡：`<chat-bubble/>`
  - 流式输出：`<streaming-output/>`
  - 表格、图表、代码和文件卡片：`<result-cards/>`
  - 引用来源：`<source-citation/>`
  - AI 生成标识：`<gen-tag/>`
  - 风险与不确定性提示：`<risk-warning/>`

- **执行组件**
  - 执行计划：`<execution-plan/>`
  - 步骤状态：`<step-status/>`
  - 工具调用记录：`<tool-log/>`
  - 处理中/等待审批状态：`<run-state/>`
  - 停止、重试、重新生成：`<control-actions/>`

- **人工控制**
  - 生成结果预览：`<result-preview/>`
  - 修改前后对比：`<diff-view/>`
  - 接受、拒绝、局部应用：`<review-actions/>`
  - 撤销：`<undo/>`
  - 高风险操作确认：`<risk-confirm/>`

- **反馈与治理**
  - 点赞、点踩：`<feedback-buttons/>`
  - 内容纠错：`<content-correction/>`
  - 问题反馈：`<issue-feedback/>`
  - 权限提示：`<permission-tip/>`
  - 敏感数据提醒：`<sensitive-mask/>`
  - Prompt 和操作审计：`<audit-trail/>`

const categories = [
  { id: 'framework', label: '应用框架', target: 7 },
  { id: 'layout', label: '基础布局', target: 13 },
  { id: 'common', label: '通用页面', target: 39 },
  { id: 'business', label: '业务场景', target: 18 },
  { id: 'ai-page', label: 'AI 原生页面', target: 15 },
  { id: 'ai-component', label: 'AI 交互组件', target: 34 }
];

const source = {
  framework: [
    ['左侧导航框架', '左侧菜单、顶部工具栏与稳定内容区，适合高频企业作业。', 'sidebar', '左侧菜单|顶部工具栏|内容区'],
    ['顶部导航框架', '一级产品导航保持横向展开，适合模块数量较少的平台。', 'top', '一级导航|页面标题|内容区'],
    ['混合导航框架', '顶部产品域与左侧业务菜单并存，容纳大型平台的信息深度。', 'mixed', '产品导航|业务菜单|工作区'],
    ['工作台框架', '把应用入口、待办、消息与关键指标集中到角色首页。', 'dashboard', '应用入口|待办消息|指标卡片'],
    ['多标签页框架', '全局导航与页面标签栏组合，支持并行处理多个对象。', 'tabs', '系统导航|页面标签|内容区'],
    ['全屏工作区框架', '精简导航，把画布、工具栏与属性操作放在第一优先级。', 'canvas', '资源栏|全屏画布|属性栏'],
    ['多租户框架', '在全局导航上提供明确租户上下文与隔离后的业务内容。', 'tenant', '租户切换|系统导航|租户内容']
  ],
  layout: [
    ['单栏布局', '页头与单一内容区，强调顺序阅读和聚焦操作。', 'single', '页头|主内容'],
    ['上下布局', '上方承载摘要或筛选，下方保留完整主体空间。', 'vertical', '摘要筛选|主体内容'],
    ['左右分栏布局', '辅助信息与主任务左右并置，形成稳定阅读关系。', 'split', '辅助区|主内容'],
    ['左树右内容布局', '层级树负责定位，右侧呈现当前节点的业务内容。', 'split', '分类树|内容区'],
    ['左列表右详情布局', '对象列表保持上下文，详情区用于查看和处理。', 'split', '对象列表|对象详情'],
    ['主从三栏布局', '列表、详情和次级详情连续展开，减少页面往返。', 'triple', '对象列表|主详情|次级详情'],
    ['卡片网格布局', '筛选器与响应式卡片网格组合，适合对象浏览。', 'grid', '筛选器|卡片网格'],
    ['对比布局', '多个对象并排展示，在统一维度下识别差异。', 'compare', '对象 A|对象 B|差异提示'],
    ['多标签页布局', '用 Tab 承载多个对象或页面，同时保持当前任务焦点。', 'tabs', '标签栏|当前页面'],
    ['画布工作区布局', '资源、画布与属性三段式结构，支持搭建与编排。', 'canvas', '资源库|中央画布|属性面板'],
    ['地图复合布局', '地图、对象列表与浮动详情协同呈现空间任务。', 'map', '对象列表|地图|浮动详情'],
    ['主页面＋抽屉布局', '在主页面上打开详情或编辑抽屉，不中断当前上下文。', 'drawer', '主内容|右侧抽屉'],
    ['沉浸式布局', '隐藏常规导航，让用户专注于单一高价值任务。', 'canvas', '核心工作区|浮动工具栏']
  ],
  common: [
    ['门户首页', '应用入口、公告与快捷功能构成组织级信息门户。', 'dashboard', '应用入口|公告|快捷功能'],
    ['角色工作台', '按角色聚合待办、消息、指标和业务动态。', 'dashboard', '待办|消息|指标|动态'],
    ['数据概览页', '用 KPI、趋势、排行与预警解释整体状态。', 'chart', 'KPI|趋势图|排行|预警'],
    ['经营驾驶舱', '围绕核心指标、趋势、风险与预测组织决策信息。', 'dashboard', '核心指标|趋势|风险|预测'],
    ['全局搜索页', '搜索、分类筛选与结果列表构成全局信息入口。', 'single', '搜索框|分类筛选|结果列表'],
    ['数据列表页', '查询条件、操作栏、表格与分页组成标准数据管理页。', 'table', '查询条件|操作栏|数据表格|分页'],
    ['卡片列表页', '通过筛选与卡片网格浏览具有视觉识别度的对象。', 'grid', '查询条件|卡片网格|分页'],
    ['待办列表页', '按状态分类任务，并提供不离开列表的快捷处理。', 'table', '状态分类|任务列表|快捷处理'],
    ['树形列表页', '层级数据支持展开、收起和行级操作。', 'table', '层级行|展开收起|行操作'],
    ['左树右表页', '组织或分类树与数据表格构成高频管理结构。', 'split', '组织树|数据表格'],
    ['左树右卡页', '分类树固定上下文，右侧使用卡片呈现对象。', 'split', '分类树|卡片列表'],
    ['列表详情页', '左侧连续浏览对象，右侧即时呈现完整详情。', 'split', '对象列表|详情面板'],
    ['主子表页', '主对象摘要与子项明细表保持清晰从属关系。', 'vertical', '主对象信息|子项明细'],
    ['批量处理页', '选择数据范围、统一配置并反馈批量执行结果。', 'vertical', '对象选择|批量配置|结果日志'],
    ['导入导出页', '文件上传、字段映射、校验与历史形成完整数据通道。', 'vertical', '文件上传|字段映射|校验结果'],
    ['详情页', '摘要头、状态、分组信息和关联数据建立对象全貌。', 'single', '摘要头|状态|分组信息|关联数据'],
    ['新增页', '分组字段与明确的保存、取消动作组成标准创建流程。', 'form', '分组表单|保存|取消'],
    ['编辑页', '保留对象上下文，在结构化表单中完成修改。', 'form', '对象摘要|编辑表单|保存'],
    ['快速创建页', '精简必要字段，用最短路径提交新对象。', 'form', '精简字段|快速提交'],
    ['分步表单页', '步骤条拆解复杂录入，并在最后统一确认。', 'form', '步骤条|分步填写|最终确认'],
    ['审批详情页', '业务信息、审批记录与操作决策在同一上下文闭环。', 'timeline', '业务详情|审批记录|审批操作'],
    ['档案页', '基础资料、附件和关联记录构成长周期对象档案。', 'single', '基础资料|附件|关联记录'],
    ['版本对比页', '修改前后并排，并用差异标记提示关键变化。', 'compare', '修改前|修改后|差异标记'],
    ['数据分析页', '指标筛选、图表与明细表支持从结论回到数据。', 'chart', '指标|筛选|图表|明细'],
    ['综合报表页', '查询条件、标准报表和导出动作形成固定分析流程。', 'chart', '查询条件|报表|导出'],
    ['多维分析页', '自由组合维度与指标，并通过透视表验证结果。', 'table', '维度选择|指标选择|透视表'],
    ['数据钻取页', '从汇总数据逐层下钻到可核验明细。', 'chart', '汇总|钻取路径|明细'],
    ['对象对比页', '选择对象、建立指标矩阵并突出差异。', 'compare', '对象选择|指标矩阵|差异'],
    ['实时监控页', '实时指标、趋势与告警共同表达系统健康状态。', 'chart', '实时指标|趋势|告警'],
    ['系统设置页', '设置导航与分组配置为系统参数提供稳定入口。', 'sidebar', '设置导航|分组配置|保存'],
    ['组织架构页', '组织树与部门、人员信息联动管理。', 'split', '组织树|部门人员'],
    ['用户管理页', '查询、用户列表与详情抽屉支持完整管理动作。', 'drawer', '用户查询|用户列表|详情抽屉'],
    ['角色权限页', '围绕角色配置菜单、操作和数据范围权限。', 'split', '角色列表|菜单权限|数据权限'],
    ['权限矩阵页', '以角色、资源、操作三维矩阵检查授权。', 'table', '角色|资源|操作权限'],
    ['数据字典页', '字典分类与字典项分栏维护基础数据。', 'split', '字典分类|字典项|编辑'],
    ['参数配置页', '按分类维护参数值并保留版本信息。', 'table', '参数分类|参数值|版本'],
    ['操作日志页', '筛选、日志列表与详情用于定位操作行为。', 'drawer', '日志筛选|日志列表|日志详情'],
    ['审计追踪页', '围绕操作人、变更前后与时间构建证据链。', 'timeline', '操作人|变更前后|时间线'],
    ['集成管理页', '连接器、凭证和同步状态集中管理外部系统。', 'grid', '系统连接|凭证|同步状态']
  ],
  business: [
    ['待办中心', '统一承接审批、任务和工单的处理队列。', 'table', '状态筛选|任务队列|快捷处理'],
    ['流程中心', '集中发起流程、跟踪状态并查找历史实例。', 'dashboard', '流程入口|实例列表|状态面板'],
    ['流程设计器', '通过节点拖拽、条件与审批人配置搭建流程。', 'canvas', '节点面板|流程画布|属性设置'],
    ['规则配置页', '组合条件与动作，并通过测试运行验证规则。', 'canvas', '条件构建|执行动作|规则测试'],
    ['看板页', '按状态泳道推动任务、商机或工单流转。', 'grid', '状态泳道|任务卡片|流转操作'],
    ['日历页', '在日历网格中安排日程、会议与预约。', 'grid', '日期导航|日历网格|日程详情'],
    ['排班排期页', '协调人员、设备和资源在时间轴上的占用。', 'table', '资源列表|时间矩阵|分配操作'],
    ['甘特图页', '表达项目任务的计划、进度、依赖与里程碑。', 'timeline', '任务树|时间轴|依赖关系'],
    ['时间轴页', '按时间呈现审批、物流或操作历史。', 'timeline', '事件筛选|时间事件|附件'],
    ['地图调度页', '在地图上下发和跟踪门店、车辆、人员与设备任务。', 'map', '调度列表|地图态势|任务详情'],
    ['客服工作台', '客户信息、会话、工单和知识库同时在线。', 'triple', '客户信息|实时会话|工单知识'],
    ['客户 360 页', '整合客户资料、交易、活动与关系网络。', 'dashboard', '客户画像|交易|活动|关系'],
    ['项目控制台', '统一查看任务、成员、成本和风险。', 'dashboard', '任务进度|项目成员|成本风险'],
    ['设备监控页', '设备树、实时状态与告警形成运维闭环。', 'split', '设备树|实时状态|告警'],
    ['文件管理页', '目录树、文件列表与在线预览协同工作。', 'triple', '目录树|文件列表|在线预览'],
    ['知识库页', '分类、文章列表和正文构成连续阅读路径。', 'triple', '知识分类|文章列表|正文'],
    ['低代码设计器', '组件库、画布、属性和数据源共同构成搭建环境。', 'canvas', '组件库|设计画布|属性数据源'],
    ['运维控制台', '服务树、监控、日志与终端组合成故障处理工作区。', 'triple', '服务树|监控日志|操作终端']
  ],
  'ai-page': [
    ['AI 对话页', '会话历史、消息流、输入与工具保持可见上下文。', 'ai', '会话历史|消息流|输入框|工具'],
    ['AI 侧边助手', '业务页面与右侧 AI 面板协作，不遮蔽当前任务。', 'agent', '业务页面|AI 面板|上下文'],
    ['AI 搜索问答页', '问题、回答、引用与关联对象共同保证答案可追溯。', 'ai', '问题|答案|引用来源|关联对象'],
    ['AI 智能填表页', '推荐值与生成依据靠近字段，并由用户最终确认。', 'form', '业务表单|推荐值|生成依据|确认'],
    ['AI 数据分析页', '自然语言问题驱动图表、结论和明细联动。', 'chart', '自然语言提问|图表|结论|明细'],
    ['AI 生成审阅页', '原内容、生成内容、差异与接受动作构成审阅闭环。', 'compare', '原内容|生成内容|差异|接受拒绝'],
    ['AI 文档工作台', '文档编辑、生成、改写与引用在连续画布中协作。', 'agent', '文档编辑|生成改写|引用'],
    ['Agent 任务工作台', '目标、执行计划、步骤与结果全程可观察。', 'agent', '任务目标|执行计划|步骤|结果'],
    ['AI 推荐决策页', '推荐结果同时呈现依据、风险和人工确认。', 'dashboard', '推荐结果|决策依据|风险|人工确认'],
    ['AI 批处理页', '先界定数据范围和指令，再预览并执行批量操作。', 'vertical', '数据范围|指令|预览|批量执行'],
    ['Agent 管理页', '集中维护智能体、模型、技能、工具与权限。', 'grid', '智能体|模型|技能工具|权限'],
    ['AI 知识库管理页', '跟踪数据源、解析状态与知识访问权限。', 'table', '数据源|解析状态|知识权限'],
    ['AI 运行监控页', '持续观测调用量、成功率、耗时和成本。', 'chart', '调用量|成功率|耗时|成本'],
    ['AI 质量评测页', '测试集、模型对比和评分构成质量实验台。', 'compare', '测试集|模型对比|评分'],
    ['AI 审计治理页', '记录输入输出、工具调用和审批，形成完整审计证据。', 'timeline', '输入输出|工具调用|审批记录']
  ],
  'ai-component': [
    ['全局 AI 助手入口', '在应用全局层提供稳定、可感知的 AI 唤起入口。', 'component', '全局层级|状态感知'],
    ['页面 AI 助手入口', '只针对当前页面上下文唤起协作助手。', 'component', '页面上下文|就近入口'],
    ['魔法棒按钮', '在明确内容对象旁触发生成、改写或分析。', 'component', '触发按钮|操作反馈'],
    ['AI 操作菜单', '将多个 AI 动作组织成可扫描的命令菜单。', 'component', '动作列表|快捷说明'],
    ['字段级 AI 按钮', '靠近字段提供推荐、补全或解释，同时保留人工输入。', 'component', '字段上下文|生成动作'],
    ['AI 消息输入框', '承载自然语言、附件、工具与发送状态。', 'component', '文本输入|附件工具|发送'],
    ['推荐问题', '用少量高价值建议降低首次提问成本。', 'component', '问题建议|一键填入'],
    ['快捷指令', '把高频提示词抽象为可组合的短命令。', 'component', '指令标签|参数'],
    ['引导式生成表单', '通过结构化字段帮助用户表达复杂生成目标。', 'component', '目标字段|约束选项|生成'],
    ['文件附件', '上传并标注进入 AI 上下文的文件范围。', 'component', '文件选择|解析状态'],
    ['上下文标签', '明确当前会话引用的人、对象、页面或时间范围。', 'component', '上下文对象|移除操作'],
    ['数据源和工具选择', '在执行前显式选择允许访问的数据源和工具。', 'component', '数据源|工具权限'],
    ['对话气泡', '区分用户、AI、系统与工具消息角色。', 'component', '消息角色|内容状态'],
    ['流式输出', '逐步呈现生成内容并保持停止能力。', 'component', '流式内容|停止操作'],
    ['表格、图表、代码和文件卡片', '根据结果类型使用可操作的专用输出容器。', 'component', '结果类型|预览操作'],
    ['引用来源', '把结论与原始信息建立可跳转的证据关系。', 'component', '来源标题|引用定位'],
    ['AI 生成标识', '清晰标注内容由 AI 生成或修改。', 'component', '生成身份|时间状态'],
    ['风险与不确定性提示', '说明不确定范围、缺失上下文与潜在风险。', 'component', '风险等级|原因建议'],
    ['执行计划', '在运行前后呈现 Agent 的步骤与预期结果。', 'component', '计划步骤|执行边界'],
    ['步骤状态', '区分待处理、运行中、完成、失败与等待。', 'component', '状态节点|耗时'],
    ['工具调用记录', '显示工具、输入范围、结果与错误信息。', 'component', '工具名称|输入输出'],
    ['处理中／等待审批状态', '让用户区分系统执行与人工阻塞。', 'component', '运行状态|审批等待'],
    ['停止、重试、重新生成', '为不可预期的生成过程提供即时控制。', 'component', '停止|重试|重新生成'],
    ['生成结果预览', '在正式应用前查看影响范围和最终结果。', 'component', '结果内容|影响范围'],
    ['修改前后对比', '并排或逐行突出 AI 建议造成的变化。', 'component', '修改前|修改后|差异'],
    ['接受、拒绝、局部应用', '允许用户对完整结果或局部建议做决定。', 'component', '接受|拒绝|局部应用'],
    ['撤销', '让已经应用的 AI 修改可以低成本回退。', 'component', '回退动作|影响提示'],
    ['高风险操作确认', '对删除、发布和外部执行提供二次确认。', 'component', '风险说明|明确确认'],
    ['点赞、点踩', '用低干扰反馈捕捉结果是否有帮助。', 'component', '正向反馈|负向反馈'],
    ['内容纠错', '允许用户指出具体错误并提交正确内容。', 'component', '错误定位|修正内容'],
    ['问题反馈', '收集问题类型、上下文和复现信息。', 'component', '问题类型|上下文提交'],
    ['权限提示', '解释当前 AI 无法访问或执行的权限边界。', 'component', '权限范围|申请入口'],
    ['敏感数据提醒', '在发送与输出阶段识别并提醒敏感信息。', 'component', '敏感标识|脱敏动作'],
    ['Prompt 和操作审计', '记录提示词、模型、工具与人工决策链路。', 'component', 'Prompt|模型工具|操作记录']
  ]
};

const templateCatalog = {
  workbench: { label: '角色工作台', source: 'WorkbenchPage.tsx' },
  'data-list': { label: '数据列表页', source: 'DataListPage.tsx' },
  'card-list': { label: '卡片列表页', source: 'CardListPage.tsx' },
  detail: { label: '详情页', source: 'DetailPage.tsx' },
  form: { label: '分步表单页', source: 'FormPage.tsx' },
  analytics: { label: '数据分析页', source: 'AnalyticsPage.tsx' },
  settings: { label: '系统设置页', source: 'SettingsPage.tsx' },
  approval: { label: '审批详情页', source: 'ApprovalPage.tsx' },
  kanban: { label: '看板页', source: 'KanbanPage.tsx' },
  calendar: { label: '日历页', source: 'CalendarPage.tsx' },
  files: { label: '文件管理页', source: 'FileManagerPage.tsx' },
  'ai-chat': { label: 'AI 对话页', source: 'AIChatPage.tsx' },
  'agent-task': { label: 'Agent 任务工作台', source: 'AgentTaskPage.tsx' },
  'ai-review': { label: 'AI 生成审阅页', source: 'AIReviewPage.tsx' },
  'ai-governance': { label: 'AI 审计治理页', source: 'AIGovernancePage.tsx' }
};

function templateIdFor(category, name, kind) {
  if (/日历/.test(name)) return 'calendar';
  if (/看板/.test(name)) return 'kanban';
  if (/文件|知识库|文档工作台/.test(name)) return 'files';
  if (/审批详情|审批记录/.test(name) || (category === 'business' && /待办中心/.test(name))) return 'approval';
  if (/设置|组织架构|用户管理|角色权限|权限矩阵|数据字典|参数配置|集成管理/.test(name)) return 'settings';
  if (/审计|质量评测|运行监控|知识库管理|Agent 管理|权限提示|敏感数据|问题反馈|内容纠错|点赞|点踩/.test(name)) return 'ai-governance';
  if (/AI 对话|搜索问答|消息输入|推荐问题|快捷指令|文件附件|上下文标签|数据源和工具|对话气泡|流式输出|引用来源|AI 生成标识|助手入口|魔法棒|AI 操作菜单|字段级 AI/.test(name)) return 'ai-chat';
  if (/生成审阅|智能填表|推荐决策|结果预览|修改前后|接受、拒绝|局部应用|撤销/.test(name)) return 'ai-review';
  if (/Agent 任务|批处理|执行计划|步骤状态|工具调用|处理中|等待审批|停止、重试|高风险操作|流程设计器|规则配置|低代码设计器|全屏工作区|画布工作区|沉浸式/.test(name)) return 'agent-task';
  if (/数据分析|报表|多维分析|数据钻取|对象对比|监控|驾驶舱|数据概览|地图调度|甘特图/.test(name) || kind === 'chart' || kind === 'map') return 'analytics';
  if (/新增|编辑|创建|表单|导入导出/.test(name) || kind === 'form') return 'form';
  if (/详情|档案|客户 360|时间轴/.test(name) || kind === 'single' || kind === 'timeline') return 'detail';
  if (/卡片|左树右卡/.test(name) || kind === 'grid') return 'card-list';
  if (/列表|左树右表|主子表|排班排期|数据表格/.test(name) || kind === 'table' || kind === 'drawer') return 'data-list';
  return 'workbench';
}

const patterns = categories.flatMap((category) => source[category.id].map((item, index) => ({
  id: `${category.id}-${index + 1}`,
  category: category.id,
  categoryLabel: category.label,
  name: item[0],
  description: item[1],
  kind: item[2],
  anatomy: item[3].split('|'),
  templateId: templateIdFor(category.id, item[0], item[2])
})));

const state = { category: 'all', query: '' };
const grid = document.getElementById('libraryGrid');
const filterRow = document.getElementById('filterRow');
const search = document.getElementById('patternSearch');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const dialog = document.getElementById('patternDialog');
const dialogTitle = document.getElementById('dialogTitle');
const dialogCategory = document.getElementById('dialogCategory');
const dialogDescription = document.getElementById('dialogDescription');
const dialogAnatomy = document.getElementById('dialogAnatomy');
const dialogPreview = document.getElementById('dialogPreview');
const dialogTemplateName = document.getElementById('dialogTemplateName');
const dialogDemoLink = document.getElementById('dialogDemoLink');
const dialogSourceLink = document.getElementById('dialogSourceLink');
const dialogCliButton = document.getElementById('dialogCliButton');

function localTemplateOrigin() {
  if (location.protocol === 'file:') return 'http://127.0.0.1:4176';
  const port = Number(location.port || (location.protocol === 'https:' ? 443 : 80));
  return `${location.protocol}//${location.hostname}:${port + 3}`;
}

function fullDemoUrl(templateId) {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  return local ? `${localTemplateOrigin()}/#/${templateId}` : `templates/#/${templateId}`;
}

function embeddedDemoUrl(templateId) {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname) || location.protocol === 'file:';
  return local ? `${localTemplateOrigin()}/?embed=1#/${templateId}` : `templates/?embed=1#/${templateId}`;
}

function cliCommand(templateId) {
  return `npm run atlas -- create atlas-${templateId} --framework react --template ${templateId} --backend java --local`;
}

function orbMarkup(state = 'idle', size = 'sm', showRing = true) {
  return `<span class="orb-wrapper atlas-orb atlas-orb--${size} state-${state}" aria-hidden="true">
    <span class="orb-atmosphere"></span>
    ${showRing ? '<span class="orb-ring orb-ring-primary"></span><span class="orb-ring orb-ring-secondary"></span>' : ''}
    <span class="orb"><span class="orb-depth"></span><span class="orb-caustic"></span><span class="orb-liquid"></span><span class="orb-specular"></span></span>
  </span>`;
}

function previewMarkup(item) {
  const rows = item.kind === 'table' ? '<div class="m-row"></div><div class="m-row"></div><div class="m-row"></div><div class="m-row"></div><div class="m-row"></div>' : '';
  const nodes = item.kind === 'canvas' ? '<div class="m-node"></div><div class="m-node"></div><div class="m-node"></div>' : '';
  const orb = item.kind === 'ai' || item.kind === 'agent' || (item.kind === 'component' && /入口|助手|状态/.test(item.name)) ? '<div class="m-orb"></div>' : '';
  const panelCount = item.kind === 'grid' || item.kind === 'dashboard' ? 6 : item.kind === 'single' || item.kind === 'form' || item.kind === 'component' || item.kind === 'ai' ? 1 : 3;
  const panels = Array.from({ length: panelCount }, () => '<div class="m-panel"></div>').join('');
  return `<div class="mini-app" data-kind="${item.kind}" aria-label="${item.name}结构示意">
    <div class="m-top"></div>
    <div class="m-side"></div>
    <div class="m-main">
      <div class="m-toolbar"></div>
      <div class="m-content">${orb}${nodes}${rows}${panels}</div>
    </div>
    <div class="m-aside"></div>
  </div>`;
}

function demoMetrics() {
  return `<div class="demo-metrics">
    <article class="is-primary"><span>运行任务</span><strong>1,284</strong><small>较昨日 <b>+12.4%</b></small></article>
    <article><span>待确认</span><strong>18</strong><small>其中高优先级 <b class="is-warning">4 项</b></small></article>
    <article><span>平均耗时</span><strong>2m 16s</strong><small>较昨日 <b class="is-positive">-18 秒</b></small></article>
    <article><span>成功率</span><strong>98.6%</strong><small>目标值 <b class="is-positive">97%</b></small></article>
  </div>`;
}

function demoChart(title = '智能任务运行趋势') {
  return `<section class="demo-panel demo-chart-panel">
    <header><div><h4>${title}</h4><span>最近 7 天</span></div><div class="demo-chart-actions"><label>2026-08-04&nbsp;&nbsp;至&nbsp;&nbsp;2026-08-10</label><button type="button" data-demo-action="已导出当前图表">导出</button></div></header>
    <div class="demo-chart-legend"><span><i></i>已完成</span><span><i></i>人工接管</span></div>
    <div class="demo-real-chart" aria-label="${title}">
      <div class="demo-y-axis"><span>1.5k</span><span>1.0k</span><span>500</span><span>0</span></div>
      <div class="demo-chart-grid"></div>
      <svg viewBox="0 0 600 210" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="demoArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7B61FF" stop-opacity=".34"/><stop offset="1" stop-color="#7B61FF" stop-opacity="0"/></linearGradient></defs>
        <path class="demo-area" d="M0 178 C65 164 84 118 142 132 C202 146 220 78 286 94 C344 108 366 48 430 67 C492 86 536 34 600 22 L600 210 L0 210Z"/>
        <path class="demo-line-primary" d="M0 178 C65 164 84 118 142 132 C202 146 220 78 286 94 C344 108 366 48 430 67 C492 86 536 34 600 22"/>
        <path class="demo-line-secondary" d="M0 192 C70 184 104 172 154 178 C214 186 248 148 302 158 C368 170 402 128 458 142 C516 155 556 116 600 124"/>
      </svg>
      <div class="demo-x-axis"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div>
    </div>
  </section>`;
}

function demoDonut() {
  return `<section class="demo-panel demo-donut-panel">
    <header><div><h4>执行来源</h4><span>最近 7 天</span></div><button type="button" data-demo-action="已切换来源维度">•••</button></header>
    <div class="demo-donut"><i></i><div><strong>78.1%</strong><span>自动执行</span></div></div>
    <div class="demo-donut-legend"><span><i></i>自动执行 <b>78.1%</b></span><span><i></i>人工发起 <b>21.9%</b></span></div>
  </section>`;
}

function demoTable(title = '任务队列') {
  const rows = [
    ['AT-1048', '内容质量检查', 'Atlas Review', '运行中', '刚刚'],
    ['AT-1047', '知识索引更新', 'Knowledge Agent', '待确认', '4 分钟前'],
    ['AT-1046', '数据异常识别', 'Insight Agent', '已完成', '12 分钟前'],
    ['AT-1045', '周报摘要生成', 'Writing Agent', '已完成', '28 分钟前'],
    ['AT-1044', '权限边界审计', 'Governance Agent', '运行中', '36 分钟前'],
    ['AT-1043', '知识文档发布', 'Workflow Agent', '已完成', '1 小时前']
  ];
  return `<section class="demo-panel demo-table-panel">
    <header><div><span>实时数据</span><h4>${title}</h4></div><div class="demo-table-actions"><label><span>⌕</span><input aria-label="筛选列表" placeholder="筛选任务"></label><button type="button" data-demo-action="已创建一条示例记录">新建</button></div></header>
    <div class="demo-table" role="table">
      <div class="demo-tr demo-th" role="row"><span>任务</span><span>负责人</span><span>状态</span><span>更新时间</span><span>操作</span></div>
      ${rows.map((row, index) => `<button class="demo-tr${index === 0 ? ' selected' : ''}" type="button" role="row" data-demo-row><span class="demo-task-cell"><span><strong>${row[1]}</strong><small>${row[0]}</small></span></span><span>${row[2]}</span><span class="demo-status status-${row[3]}">${row[3]}</span><span>${row[4]}</span><span class="demo-row-action" aria-hidden="true">•••</span></button>`).join('')}
    </div>
    <footer><span>已选择 <b data-demo-selection>1</b> 项</span><span>1-6 / 128</span></footer>
  </section>`;
}

function demoWorkbench(item) {
  return `<div class="demo-page-body">
    ${demoMetrics()}
    <div class="demo-grid-main">${demoChart(item.name.includes('监控') ? '实时服务健康度' : '智能任务运行趋势')}${demoDonut()}</div>
    <div class="demo-ranking-grid">${demoTable('任务执行排名')}${demoTable('Agent 调用排名')}</div>
  </div>`;
}

function demoCards(item) {
  const isAgentCollection = /Agent|智能体/.test(item.name);
  const isIntegration = item.name.includes('集成');
  const names = isAgentCollection
    ? ['Atlas Review', 'Knowledge Agent', 'Insight Agent', 'Workflow Agent']
    : isIntegration
      ? ['Open API', 'Event Stream', 'Data Warehouse', 'Identity Provider']
      : ['示例对象 A', '示例对象 B', '示例对象 C', '示例对象 D'];
  return `<div class="demo-page-body"><div class="demo-filterbar"><div class="demo-segments"><button class="active" type="button" data-demo-tab>全部</button><button type="button" data-demo-tab>运行中</button><button type="button" data-demo-tab>已暂停</button></div><label><span>⌕</span><input placeholder="搜索名称或标签"></label></div><div class="demo-card-grid">${names.map((name, index) => `<article class="demo-object-card"><header class="demo-object-head"><div class="demo-object-identity${isAgentCollection ? '' : ' without-orb'}">${isAgentCollection ? orbMarkup(['thinking', 'running', 'error', 'idle'][index], 'md') : ''}<span><small>${isAgentCollection ? (index % 2 ? 'Automation Agent' : 'Intelligence Agent') : isIntegration ? 'Integration' : 'Standard Object'}</small><h4>${name}</h4></span></div><b class="${index === 2 ? 'is-pending' : ''}">${index === 2 ? '待确认' : 'Active'}</b></header><p>${isAgentCollection ? '已配置模型、技能与访问边界，可组合到当前工作流。' : '展示对象的摘要、当前状态与可执行操作。'}</p><footer><span>更新于 ${index + 1} 小时前</span><button type="button" data-demo-action="已打开配置面板">配置</button></footer></article>`).join('')}</div></div>`;
}

function demoForm(item) {
  const isSmart = item.name.includes('AI');
  return `<div class="demo-page-body"><form class="demo-panel demo-form" data-demo-form>
    <div class="demo-form-steps"><span class="done">1</span><i></i><span class="active">2</span><i></i><span>3</span><b>基础信息</b><b>规则配置</b><b>确认提交</b></div>
    <div class="demo-form-grid"><label><span>名称 <em>*</em></span><input value="智能协作流程"></label><label><span>负责人</span><select><option>王六 · Product Owner</option><option>Atlas Agent</option></select></label><label class="wide"><span>目标描述</span><textarea>汇总当前上下文，生成可复核结论，并在发布前等待人工确认。</textarea>${isSmart ? '<button class="demo-magic" type="button" data-demo-action="AI 已优化目标描述">✦ AI 优化</button>' : ''}</label><label><span>执行频率</span><select><option>事件触发</option><option>每天</option></select></label><label><span>风险级别</span><select><option>中等 · 需要确认</option><option>低风险</option></select></label></div>
    <aside class="demo-ai-suggestion">${orbMarkup('thinking', 'xs', false)}<div><strong>Atlas 建议</strong><p>检测到发布动作，建议保留人工确认节点并记录执行版本。</p></div><button type="button" data-demo-action="已应用 Atlas 建议">应用</button></aside>
    <footer><button type="button">取消</button><button class="primary" type="submit">保存并继续</button></footer>
  </form></div>`;
}

function demoSplit(item) {
  return `<div class="demo-page-body demo-split-view"><aside class="demo-tree"><header><strong>${item.name.includes('组织') ? '组织架构' : '对象分类'}</strong><button type="button" data-demo-action="已新增分类">+</button></header><label><span>⌕</span><input placeholder="搜索节点"></label><nav><button class="active" type="button" data-demo-select>总部</button><button type="button" data-demo-select>产品中心</button><button type="button" data-demo-select>技术中心</button><button type="button" data-demo-select>客户体验</button><button type="button" data-demo-select>数据与智能</button></nav></aside><div class="demo-split-content">${demoTable(item.name.replace('页', ''))}</div></div>`;
}

function demoTriple(item) {
  return `<div class="demo-page-body demo-triple-view"><aside class="demo-object-list"><header><strong>最近对象</strong><button type="button" data-demo-action="列表已刷新">↻</button></header>${['智能搜索优化', '组件规范更新', '数据看板复核', '版本发布计划'].map((name, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-demo-select><i></i><span><strong>${name}</strong><small>${index + 2} 条关联记录 · ${index + 1} 小时前</small></span></button>`).join('')}</aside><section class="demo-detail-document"><span>Workspace / AT-1048</span><h3>${item.name}</h3><p>该工作区保留列表上下文，并将主对象信息与次级信息连续展开，适合高频阅读和处理。</p><h4>当前进度</h4><div class="demo-progress"><i style="width:72%"></i></div><div class="demo-detail-facts"><div><span>负责人</span><strong>Atlas Team</strong></div><div><span>状态</span><strong>进行中</strong></div><div><span>优先级</span><strong>P1</strong></div><div><span>更新时间</span><strong>10:24</strong></div></div></section><aside class="demo-context-panel"><header><strong>关联上下文</strong></header><article><span>引用文档</span><strong>交互规范 v2.4</strong><small>已同步最新版本</small></article><article><span>协作者</span><div class="demo-avatars"><i>王</i><i>AI</i><i>陈</i></div></article><button type="button" data-demo-action="已打开完整详情">查看完整详情</button></aside></div>`;
}

function demoTimeline(item) {
  return `<div class="demo-page-body demo-timeline-layout"><section class="demo-panel demo-summary"><span>实例编号 AT-2026-0810</span><h3>${item.name}</h3><p>所有关键操作按时间保留输入、输出、人员和状态，可用于审批与审计追踪。</p><div><b>进行中</b><b>风险可控</b></div></section><section class="demo-panel demo-timeline"><header><div><span>今天</span><h4>执行记录</h4></div><button type="button" data-demo-action="记录已导出">导出记录</button></header><ol><li class="done"><i>✓</i><div><strong>上下文校验完成</strong><p>读取 4 个授权数据源，共解析 128 条记录。</p><small>09:32 · Atlas Parser</small></div></li><li class="active"><i></i><div><strong>等待人工确认</strong><p>检测到 3 项修改会影响已发布内容。</p><small>09:36 · 王六</small><div class="demo-inline-actions"><button type="button" data-demo-action="已拒绝当前修改">拒绝</button><button class="primary" type="button" data-demo-action="已批准，流程继续执行">批准继续</button></div></div></li><li><i>3</i><div><strong>发布并记录版本</strong><p>审批通过后自动生成可回滚版本。</p><small>等待中</small></div></li></ol></section></div>`;
}

function demoCompare(item) {
  return `<div class="demo-page-body demo-compare-layout"><div class="demo-compare-toolbar"><div class="demo-segments"><button class="active" type="button" data-demo-tab>并排对比</button><button type="button" data-demo-tab>内联差异</button></div><span>共识别 6 处变化</span></div><div class="demo-diff-grid"><section><header><span>当前版本</span><b>v2.3</b></header><p>任务执行后将自动发布结果，并通知全部成员。</p><p>系统默认保留最近 5 个版本。</p><p class="removed">高风险操作不需要额外确认。</p></section><section><header><span>AI 建议版本</span><b>v2.4 Draft</b></header><p>任务执行后先生成结果预览，由负责人确认后发布。</p><p class="added">系统保留最近 20 个版本，并支持按操作人回滚。</p><p class="added">高风险操作必须经过二次确认并记录审批依据。</p></section></div><footer class="demo-review-actions"><span><i></i>Atlas 置信度 92%</span><button type="button" data-demo-action="已拒绝 AI 建议">拒绝</button><button class="primary" type="button" data-demo-action="已接受并应用建议版本">接受全部</button></footer></div>`;
}

function demoCanvas(item) {
  return `<div class="demo-page-body demo-canvas-layout"><aside class="demo-node-library"><header><strong>节点</strong><button type="button" data-demo-action="节点库已刷新">↻</button></header><label><span>⌕</span><input placeholder="搜索节点"></label><div><button type="button"><i>IN</i><span>输入</span></button><button type="button"><i>AI</i><span>Agent</span></button><button type="button"><i>IF</i><span>条件</span></button><button type="button"><i>OK</i><span>审批</span></button></div></aside><section class="demo-flow-canvas"><div class="demo-canvas-toolbar"><button type="button" data-demo-action="已撤销上一步">↶</button><button type="button" data-demo-action="已重做">↷</button><span>72%</span><button type="button" data-demo-action="画布已自动居中">⌖</button></div><div class="flow-node node-input"><span>Input</span><strong>接收业务数据</strong><small>Schema validated</small></div><i class="flow-link link-one"></i><div class="flow-node node-agent">${orbMarkup('thinking', 'xs', false)}<span>Agent</span><strong>分析并生成结论</strong><small>Atlas Reasoner</small></div><i class="flow-link link-two"></i><div class="flow-node node-review"><span>Human</span><strong>人工确认</strong><small>Required</small></div></section><aside class="demo-properties"><header><strong>Agent 配置</strong></header><label><span>模型</span><select><option>Atlas Reasoner</option></select></label><label><span>最大步骤</span><input value="8"></label><label><span>需要审批</span><button class="demo-toggle active" type="button" data-demo-toggle><i></i></button></label><button class="primary" type="button" data-demo-action="配置已保存">保存配置</button></aside></div>`;
}

function demoMap(item) {
  return `<div class="demo-page-body demo-map-layout"><aside class="demo-map-list"><header><strong>在线资源</strong><span>12 / 14</span></header>${['华东节点 A-17', '中心节点 C-08', '华南节点 S-12', '西部节点 W-03'].map((name, index) => `<button class="${index === 0 ? 'active' : ''}" type="button" data-demo-select><i class="${index === 3 ? 'warning' : ''}"></i><span><strong>${name}</strong><small>${index === 3 ? '需要检查' : '运行正常'} · ${index + 2} 个任务</small></span></button>`).join('')}</aside><section class="demo-map"><div class="map-road road-a"></div><div class="map-road road-b"></div><div class="map-road road-c"></div><button class="map-pin pin-a active" type="button" data-demo-action="已定位华东节点"><i></i><span>12</span></button><button class="map-pin pin-b" type="button" data-demo-action="已定位中心节点"><i></i><span>8</span></button><button class="map-pin pin-c" type="button" data-demo-action="已定位华南节点"><i></i><span>5</span></button><aside><span>华东节点 A-17</span><strong>在线 · 负载 68%</strong><small>最近同步 32 秒前</small><button type="button" data-demo-action="已创建调度任务">创建调度</button></aside></section></div>`;
}

function demoAI(item) {
  if (/Agent 管理|智能体/.test(item.name)) return demoCards(item);
  const governance = /审计|监控|质量|管理/.test(item.name);
  if (governance) return `<div class="demo-page-body">${demoMetrics()}${demoTable(item.name.replace('页', ''))}</div>`;
  return `<div class="demo-page-body demo-ai-layout"><aside class="demo-conversations"><header><strong>会话</strong><button type="button" data-demo-action="已创建新会话">+</button></header><label><span>⌕</span><input placeholder="搜索会话"></label><button class="active" type="button" data-demo-select><span>页面模板分析</span><small>刚刚</small></button><button type="button" data-demo-select><span>组件规范整理</span><small>昨天</small></button><button type="button" data-demo-select><span>数据洞察</span><small>周一</small></button></aside><section class="demo-chat"><header>${orbMarkup('thinking', 'xs', false)}<div><strong>Atlas Assistant</strong><span>已连接当前页面与 3 个数据源</span></div><button type="button" data-demo-action="已打开上下文管理">上下文</button></header><div class="demo-message-flow" data-demo-messages><article class="user"><span>你</span><p>请分析当前页面结构，并给出可直接执行的优化建议。</p></article><article class="assistant">${orbMarkup('thinking', 'xs', false)}<div><p>已完成结构分析。当前信息层级清晰，但审批动作与风险依据距离较远，建议合并到同一确认区。</p><div class="demo-answer-card"><strong>建议执行计划</strong><ol><li><i>1</i>合并风险与审批上下文</li><li><i>2</i>增加修改前后对比</li><li><i>3</i>保留可撤销版本</li></ol></div><div class="demo-citations"><button type="button">[1] 交互规范</button><button type="button">[2] 审计策略</button></div></div></article></div><form class="demo-chat-input" data-demo-form><div class="demo-context-tags"><span>当前页面 ×</span><span>设计规范 ×</span></div><textarea aria-label="AI 消息" placeholder="继续追问，或输入需要执行的目标..."></textarea><footer><div><button type="button" aria-label="添加附件">＋</button><button type="button" aria-label="选择工具">⌘</button></div><button class="primary" type="submit">发送</button></footer></form></section></div>`;
}

function demoComponent(item) {
  if (/输入框|推荐问题|快捷指令|引导式|附件|上下文|数据源/.test(item.name)) return `<div class="demo-component-stage"><div class="demo-component-copy"><span>Input Pattern</span><h3>${item.name}</h3><p>${item.description}</p></div><section class="demo-component-surface demo-input-playground"><div class="demo-context-tags"><span>当前页面 ×</span><span>Design Tokens ×</span></div><textarea placeholder="描述要完成的目标、输出形式和约束条件..."></textarea><div class="demo-prompt-suggestions"><button type="button" data-demo-fill="总结当前内容">总结当前内容</button><button type="button" data-demo-fill="生成执行计划">生成执行计划</button><button type="button" data-demo-fill="检查潜在风险">检查潜在风险</button></div><footer><div><button type="button" aria-label="添加附件">＋</button><button type="button" aria-label="选择工具">⌘</button><span>Atlas Reasoner</span></div><button class="primary" type="button" data-demo-action="指令已发送，正在生成结果">发送</button></footer></section></div>`;
  if (/修改前后|接受|预览|撤销|高风险/.test(item.name)) return `<div class="demo-component-stage"><div class="demo-component-copy"><span>Human Control</span><h3>${item.name}</h3><p>${item.description}</p></div><section class="demo-component-surface">${demoCompare(item)}</section></div>`;
  if (/执行计划|步骤状态|工具调用|处理中|停止/.test(item.name)) return `<div class="demo-component-stage"><div class="demo-component-copy"><span>Execution</span><h3>${item.name}</h3><p>${item.description}</p></div><section class="demo-component-surface demo-execution"><header>${orbMarkup('thinking', 'xs', false)}<div><strong>正在执行任务</strong><span>2 / 4 步 · 已用时 18 秒</span></div><button type="button" data-demo-action="任务已安全停止">停止</button></header><div class="demo-progress"><i style="width:52%"></i></div><ol><li class="done"><i>✓</i><div><strong>读取授权上下文</strong><span>3 个数据源 · 126 条记录</span></div><time>4.2s</time></li><li class="active"><i></i><div><strong>调用分析工具</strong><span>atlas.analytics.query</span></div><time>运行中</time></li><li><i>3</i><div><strong>生成可复核结论</strong><span>等待上一步完成</span></div></li></ol></section></div>`;
  if (/点赞|纠错|问题反馈|权限|敏感|审计/.test(item.name)) return `<div class="demo-component-stage"><div class="demo-component-copy"><span>Governance</span><h3>${item.name}</h3><p>${item.description}</p></div><section class="demo-component-surface demo-governance-card"><header><span>AI Generated</span><strong>输出质量与操作记录</strong></header><p>该结论引用 3 个来源，置信度为 88%。其中一项数据可能包含敏感字段，应用前需要确认脱敏范围。</p><div class="demo-risk-note"><b>!</b><div><strong>发现潜在敏感信息</strong><span>已隐藏联系人手机号与邮箱地址。</span></div><button type="button" data-demo-action="已查看脱敏详情">查看详情</button></div><footer><span>这个结果有帮助吗？</span><button type="button" data-demo-action="感谢反馈，我们会继续优化">赞</button><button type="button" data-demo-action="已打开问题纠错表单">踩</button></footer></section></div>`;
  return `<div class="demo-component-stage"><div class="demo-component-copy"><span>AI Entry & Output</span><h3>${item.name}</h3><p>${item.description}</p></div><section class="demo-component-surface demo-entry-card">${orbMarkup('thinking', 'xl')}<div><span>Atlas Intelligence</span><h4>${item.name}</h4><p>当前页面上下文已就绪，可以开始分析、生成或执行。</p><button class="primary" type="button" data-demo-action="AI 助手已唤起">立即体验</button></div></section></div>`;
}

function demoPageContent(item) {
  if (item.category === 'ai-component') return demoComponent(item);
  if (item.category === 'ai-page' || item.kind === 'ai' || item.kind === 'agent') return demoAI(item);
  if (item.kind === 'canvas') return demoCanvas(item);
  if (item.kind === 'map') return demoMap(item);
  if (item.kind === 'form' || /新增|编辑|创建|配置/.test(item.name)) return demoForm(item);
  if (item.kind === 'timeline') return demoTimeline(item);
  if (item.kind === 'compare') return demoCompare(item);
  if (item.kind === 'split') return demoSplit(item);
  if (item.kind === 'triple') return demoTriple(item);
  if (item.kind === 'table' || item.kind === 'drawer') return `<div class="demo-page-body">${demoTable(item.name.replace('页', ''))}</div>`;
  if (item.kind === 'grid') return demoCards(item);
  if (item.kind === 'chart' || item.kind === 'dashboard') return demoWorkbench(item);
  if (item.kind === 'vertical') return demoForm(item);
  return `<div class="demo-page-body">${demoMetrics()}${demoTable(item.name.replace('页', ''))}</div>`;
}

function realDemoMarkup(item) {
  const noSidebar = item.kind === 'top' || item.kind === 'component' || item.category === 'ai-component' || (item.kind === 'canvas' && /全屏|沉浸/.test(item.name));
  const hasTopNavigation = item.kind === 'top' || item.kind === 'mixed';
  const dashboardLike = item.kind === 'dashboard' || item.kind === 'chart';
  const isCanvas = item.kind === 'canvas';
  return `<div class="live-demo shell-${item.kind} ${noSidebar ? 'without-sidebar' : ''} ${dashboardLike ? 'is-dashboard-demo' : ''} ${isCanvas ? 'is-canvas-demo' : ''}" data-pattern="${item.id}">
    <header class="demo-appbar">
      <div class="demo-app-brand">${orbMarkup('idle', 'brand')}<div><strong>Atlas Workspace</strong><small>企业智能工作台</small></div><button class="demo-collapse" type="button" data-demo-action="导航栏已折叠" aria-label="折叠导航">☰</button></div>
      ${hasTopNavigation ? '<nav class="demo-product-nav" aria-label="产品导航"><button class="active" type="button" data-demo-select>工作台</button><button type="button" data-demo-select>智能运营</button><button type="button" data-demo-select>数据中心</button></nav>' : '<label class="demo-global-search"><span>⌕</span><input aria-label="全局搜索" placeholder="搜索任务、文档与应用"></label>'}
      <div class="demo-app-actions">${item.kind === 'tenant' ? '<button class="demo-tenant" type="button" data-demo-action="已打开租户切换">Atlas 华东区⌄</button>' : ''}<button class="demo-icon-button" type="button" data-demo-action="通知中心已打开" aria-label="通知中心">◌</button><button class="demo-ai-button" type="button" data-demo-action="Atlas AI 助手已唤起">${orbMarkup('thinking', 'xxs', false)}<span>AI 助手</span></button><span title="王六">WL</span></div>
    </header>
    <aside class="demo-sidebar"><span class="demo-sidebar-label">工作台</span><nav><button class="active" type="button" data-demo-select><i>⌂</i>概览仪表盘</button><button type="button" data-demo-select><i>□</i>任务中心</button><button type="button" data-demo-select><i>⌁</i>智能分析</button><button type="button" data-demo-select><i>◷</i>运行记录</button></nav><span class="demo-sidebar-label secondary">管理</span><nav><button type="button" data-demo-select><i>◇</i>数据资产</button><button type="button" data-demo-select><i>⚙</i>系统设置</button></nav><button class="demo-sidebar-agent" type="button" data-demo-action="Atlas AI 助手已唤起">${orbMarkup('thinking', 'xs', false)}<div><strong>Atlas AI 助手</strong><span>在线 · 3 个任务</span></div><b>›</b></button></aside>
    <main class="demo-workspace"><header class="demo-page-header"><div class="demo-page-heading"><nav class="demo-breadcrumb" aria-label="页面路径"><span>工作台</span><i>/</i><b>${item.categoryLabel}</b></nav><h3>${item.name}</h3><p>${item.description}</p></div><div class="demo-page-actions"><button type="button" data-demo-action="视图已刷新">刷新</button><button class="primary" type="button" data-demo-action="已创建新的示例任务">＋ 新建任务</button></div></header>${item.kind === 'tabs' ? '<div class="demo-page-tabs"><button type="button" data-demo-tab>工作台</button><button class="active" type="button" data-demo-tab>当前任务</button><button type="button" data-demo-tab>分析报告</button></div>' : ''}${demoPageContent(item)}</main>
    <div class="demo-toast" role="status" aria-live="polite"></div>
  </div>`;
}

function initDemoInteractions() {
  dialogPreview.querySelectorAll('[data-demo-select]').forEach((button) => button.addEventListener('click', () => {
    const container = button.closest('nav, .demo-object-list, .demo-map-list, .demo-conversations');
    container?.querySelectorAll('[data-demo-select]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  }));

  dialogPreview.querySelectorAll('[data-demo-tab]').forEach((button) => button.addEventListener('click', () => {
    const container = button.parentElement;
    container?.querySelectorAll('[data-demo-tab]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  }));

  dialogPreview.querySelectorAll('[data-demo-row]').forEach((row) => row.addEventListener('click', () => {
    row.classList.toggle('selected');
    const count = dialogPreview.querySelectorAll('[data-demo-row].selected').length;
    const selection = dialogPreview.querySelector('[data-demo-selection]');
    if (selection) selection.textContent = String(count);
  }));

  dialogPreview.querySelectorAll('[data-demo-toggle]').forEach((toggle) => toggle.addEventListener('click', () => toggle.classList.toggle('active')));

  dialogPreview.querySelectorAll('[data-demo-fill]').forEach((button) => button.addEventListener('click', () => {
    const textarea = button.closest('.demo-input-playground')?.querySelector('textarea');
    if (textarea) textarea.value = button.dataset.demoFill;
  }));

  dialogPreview.querySelectorAll('[data-demo-action]').forEach((button) => button.addEventListener('click', () => showDemoToast(button.dataset.demoAction)));

  dialogPreview.querySelectorAll('[data-demo-form]').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageFlow = form.closest('.demo-chat')?.querySelector('[data-demo-messages]');
    const textarea = form.querySelector('textarea');
    if (messageFlow && textarea && textarea.value.trim()) {
      messageFlow.insertAdjacentHTML('beforeend', `<article class="user"><span>你</span><p>${escapeHtml(textarea.value.trim())}</p></article><article class="assistant new-message">${orbMarkup('thinking', 'xs', false)}<div><p>已收到，我正在结合当前页面与授权工具生成可执行结果。</p></div></article>`);
      textarea.value = '';
      messageFlow.scrollTop = messageFlow.scrollHeight;
    }
    showDemoToast('示例操作已提交');
  }));
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function showDemoToast(message) {
  const toast = dialogPreview.querySelector('.demo-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showDemoToast.timer);
  showDemoToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function buildFilters() {
  const items = [{ id: 'all', label: '全部模板', target: patterns.length }, ...categories];
  filterRow.innerHTML = items.map((item) => `<button class="filter-chip${item.id === state.category ? ' active' : ''}" type="button" data-category="${item.id}">${item.label}<b>${item.target}</b></button>`).join('');
  filterRow.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    state.category = button.dataset.category;
    buildFilters();
    render();
  }));
}

function cardMarkup(item) {
  const template = templateCatalog[item.templateId];
  return `<article class="pattern-card" data-id="${item.id}">
    <div class="pattern-preview">${previewMarkup(item)}</div>
    <div class="pattern-info">
      <div><span class="pattern-category">${item.categoryLabel}</span><h3>${item.name}</h3><p>${item.anatomy.join(' · ')}</p><small class="demo-ready">完整模板 · ${template.label}</small></div>
      <button class="preview-button" type="button" aria-label="展开 ${item.name}">↗</button>
    </div>
  </article>`;
}

function filteredPatterns() {
  const query = state.query.trim().toLowerCase();
  return patterns.filter((item) => {
    const matchesCategory = state.category === 'all' || item.category === state.category;
    const haystack = `${item.name} ${item.description} ${item.anatomy.join(' ')}`.toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
}

function render() {
  const visible = filteredPatterns();
  grid.innerHTML = visible.map(cardMarkup).join('');
  resultCount.textContent = `${visible.length} / ${patterns.length}`;
  emptyState.hidden = visible.length > 0;
  grid.querySelectorAll('.pattern-card').forEach((card) => card.addEventListener('click', () => openPattern(card.dataset.id)));
}

function openPattern(id) {
  const item = patterns.find((pattern) => pattern.id === id);
  if (!item) return;
  const template = templateCatalog[item.templateId];
  dialogCategory.textContent = item.categoryLabel;
  dialogTitle.textContent = item.name;
  dialogDescription.textContent = item.description;
  dialogAnatomy.innerHTML = item.anatomy.map((part) => `<b>${part}</b>`).join('');
  dialogTemplateName.textContent = `${template.label} / ${item.templateId}`;
  dialogDemoLink.href = fullDemoUrl(item.templateId);
  dialogSourceLink.href = `https://github.com/davidwang960707-gpu/atlas-eids/blob/main/examples/templates/src/pages/${template.source}`;
  dialogCliButton.dataset.copy = cliCommand(item.templateId);
  dialogPreview.innerHTML = `<iframe class="dialog-runtime-frame" title="${escapeHtml(item.name)} 真实运行模板" src="${embeddedDemoUrl(item.templateId)}"></iframe>`;
  dialog.showModal();
}

search.addEventListener('input', (event) => {
  state.query = event.target.value;
  render();
});

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== search && !dialog.open) {
    event.preventDefault();
    search.focus();
  }
});

document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
dialogCliButton.addEventListener('click', async () => {
  const command = dialogCliButton.dataset.copy;
  try {
    await navigator.clipboard.writeText(command);
  } catch (error) {
    const area = document.createElement('textarea');
    area.value = command;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  showDemoToast('CLI 命令已复制；当前 packages 未发布，请保留 --local');
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const themeControl = document.getElementById('themeControl');
const themeKey = 'atlas-eids-theme';

function applyPatternTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  themeControl.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  themeControl.setAttribute('aria-label', nextTheme === 'dark' ? '切换到浅色主题' : '切换到深色主题');
  themeControl.querySelector('b').textContent = nextTheme === 'dark' ? '浅色' : '深色';
}

const savedTheme = localStorage.getItem(themeKey);
applyPatternTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

themeControl.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(themeKey, next);
  applyPatternTheme(next);
});

window.addEventListener('storage', (event) => {
  if (event.key === themeKey && event.newValue) applyPatternTheme(event.newValue);
});

document.getElementById('coverageTotal').textContent = String(patterns.length);
buildFilters();
render();

if (patterns.length !== 126) {
  console.warn(`Atlas Pattern Lab: expected 126 examples, received ${patterns.length}.`);
}

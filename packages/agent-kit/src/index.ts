import { atlasComponentContracts, atlasVisualRules, type AtlasComponentCategory, type AtlasComponentVisualContract } from '@atlas-eids/core'
import ts from 'typescript'

export type AtlasAgentFramework = 'react' | 'vue'
export type AtlasAgentDensity = 'compact' | 'standard' | 'comfortable'
export type AtlasAgentLocale = 'zh-CN' | 'en-US'

export interface AtlasComponentKnowledge extends AtlasComponentVisualContract {
  summary: string
  useWhen: string[]
  avoidWhen?: string[]
  frameworks: AtlasAgentFramework[]
}

export interface AtlasPagePatternKnowledge {
  id: string
  title: string
  group: 'general' | 'business' | 'ai'
  intent: string[]
  regions: string[]
  recommendedComponents: string[]
  primaryTask: string
  primaryAction: string
  secondaryRegions: string[]
  requiredStates: string[]
  responsiveContract: string[]
  informationPriority: string[]
  completionCriteria: string[]
}

export interface AtlasSkillKnowledge {
  id: string
  title: string
  path: string
  activatesFor: string[]
}

const both: AtlasAgentFramework[] = ['react', 'vue']

const componentGroups: Array<[AtlasComponentCategory, string[], string]> = [
  ['foundation', ['AtlasProvider'], '主题、密度、语言和设计系统边界'],
  ['input', ['AtlasButton', 'AtlasInput', 'AtlasForm', 'AtlasTextarea', 'AtlasSelect', 'AtlasCombobox', 'AtlasCheckbox', 'AtlasRadioGroup', 'AtlasSwitch', 'AtlasDateInput', 'AtlasDateRange', 'AtlasUpload', 'AtlasSearchInput', 'AtlasSegmentedControl'], '企业表单、命令和筛选'],
  ['navigation', ['AtlasTabs', 'AtlasBreadcrumb', 'AtlasPagination', 'AtlasSteps', 'AtlasDropdown', 'AtlasTree', 'AtlasMenu'], '页面层级、模式切换和流程导航'],
  ['display', ['AtlasCard', 'AtlasTable', 'AtlasTag', 'AtlasBadge', 'AtlasAvatar', 'AtlasStatistic', 'AtlasProgress'], '结构化业务数据与状态'],
  ['feedback', ['AtlasAlert', 'AtlasTooltip', 'AtlasEmpty', 'AtlasSkeleton', 'AtlasDialog', 'AtlasDrawer', 'AtlasNotification', 'AtlasNotificationCenter'], '反馈、加载、空状态和上下文浮层'],
  ['composition', ['AtlasObjectCell', 'AtlasStatusTag', 'AtlasRowActions', 'AtlasTableToolbar', 'AtlasDataTable', 'AtlasDataGrid', 'AtlasPageHeader', 'AtlasPanel', 'AtlasAppLayout'], '企业页面的数据、标题和工作区组合'],
  ['ai', ['AtlasOrb', 'AtlasAIComposer', 'AtlasExecutionPlan', 'AtlasAIConversation', 'AtlasAIMessageBubble', 'AtlasAIStreamingText', 'AtlasAIPrompts', 'AtlasAIAttachmentList', 'AtlasAIConversationHistory', 'AtlasAIFeedback', 'AtlasMCPServerPicker', 'AtlasCitationList', 'AtlasKnowledgeSourcePicker', 'AtlasRetrievalTrace', 'AtlasToolCallCard', 'AtlasAIArtifactRenderer', 'AtlasAIStructuredInput', 'AtlasAIProvenance', 'AtlasGenUIRenderer', 'AtlasMCPToolPanel', 'AtlasCrossPageAgent'], 'AI 对话、知识检索、结构化生成、工具执行和可信控制']
]

const aiRules: Partial<Record<string, Pick<AtlasComponentKnowledge, 'summary' | 'useWhen' | 'avoidWhen'>>> = {
  AtlasOrb: {
    summary: '表达 AI 身份、思考、执行和异常状态的 Living Intelligence Core。',
    useWhen: ['AI 助手身份', '模型思考', 'Agent 执行', 'AI 异常'],
    avoidWhen: ['普通业务列表图标', '用户头像', '纯装饰', '非 AI 状态点']
  },
  AtlasAIComposer: { summary: '带上下文、推荐指令和运行状态的 AI 输入。', useWhen: ['自然语言指令', 'AI 对话输入', 'Agent 目标描述'] },
  AtlasAIConversation: { summary: '组织消息流、历史、工具栏和输入区域的对话容器。', useWhen: ['完整 AI 对话页', '业务侧边助手'] },
  AtlasAIMessageBubble: { summary: '呈现用户、助手、系统和工具消息。', useWhen: ['消息流', '流式回答', '工具结果'] },
  AtlasMCPServerPicker: { summary: '选择和检查 Agent 可访问的 MCP Server。', useWhen: ['工具配置', 'Agent 能力授权', 'MCP 连接管理'] },
  AtlasKnowledgeSourcePicker: { summary: '选择允许参与检索的知识源和权限范围。', useWhen: ['知识问答', 'RAG 配置', '权限感知检索'] },
  AtlasRetrievalTrace: { summary: '解释查询、检索、重排和引用形成过程。', useWhen: ['知识问答依据', '检索调试', 'AI 质量评测'] },
  AtlasToolCallCard: { summary: '展示工具输入、结果、权限和人工审批。', useWhen: ['Agent 工具调用', '高风险审批', '失败重试'] }
  ,AtlasAIArtifactRenderer: { summary: '安全渲染文本、代码、表格、图表和文件等 AI Artifact。', useWhen: ['生成式产物', '结构化结果', 'AI 文件输出'] }
  ,AtlasAIStructuredInput: { summary: '把业务字段约束加入 AI 目标输入。', useWhen: ['参数化生成', '可重复任务', '字段校验'] }
  ,AtlasAIProvenance: { summary: '展示模型、引用、策略、成本和 Trace。', useWhen: ['可信 AI', '审计治理', '低置信度提示'] }
  ,AtlasGenUIRenderer: { summary: '从白名单 Schema 渲染可交互 GenUI/A2UI。', useWhen: ['生成式 UI', '动态结果面板'] }
  ,AtlasMCPToolPanel: { summary: '检索、选择并审批 MCP 工具。', useWhen: ['Agent 工具授权', 'MCP 管理'] }
  ,AtlasCrossPageAgent: { summary: '展示 Agent 的跨页面路径、计划和人工控制。', useWhen: ['跨页面任务', 'Web Agent', '执行审批'] }
}

const componentContracts = new Map(atlasComponentContracts.map((contract) => [contract.name, contract]))

export const atlasComponents: AtlasComponentKnowledge[] = componentGroups.flatMap(([category, names, use]) => names.map((name) => {
  const contract = componentContracts.get(name)
  if (!contract) throw new Error(`Atlas component contract is missing: ${name}`)
  if (contract.category !== category) throw new Error(`Atlas component category drift: ${name}`)
  return {
    ...contract,
    summary: aiRules[name]?.summary ?? contract.semantics ?? `用于${use}的 Atlas EIDS 标准组件。`,
    useWhen: aiRules[name]?.useWhen ?? [use],
    avoidWhen: aiRules[name]?.avoidWhen,
    frameworks: both
  }
}))

if (atlasComponents.length !== atlasComponentContracts.length) {
  throw new Error(`Atlas component knowledge drift: ${atlasComponents.length}/${atlasComponentContracts.length}`)
}

type AtlasPagePatternContract = Pick<AtlasPagePatternKnowledge, 'primaryTask' | 'primaryAction' | 'secondaryRegions' | 'requiredStates' | 'responsiveContract' | 'informationPriority' | 'completionCriteria'>

const commonStates = ['loading', 'empty', 'error-with-retry', 'permission-denied', 'disabled', 'long-content']
const pagePatternContracts: Record<string, AtlasPagePatternContract> = {
  workbench: {
    primaryTask: '在一个入口判断今天最重要的事项并立即开始处理。', primaryAction: '处理首要待办',
    secondaryRegions: ['关键指标', '消息与业务动态'], requiredStates: [...commonStates, 'personalized-empty', 'stale-data'],
    responsiveContract: ['窄屏先展示待办，再展示指标与动态', '应用入口保持可搜索且不缩成不可读图标墙', '高优先级提醒和主操作始终可见'],
    informationPriority: ['待办与风险', '关键指标', '应用入口', '业务动态'], completionCriteria: ['用户能进入首要待办', '指标标明口径和更新时间']
  },
  'data-list': {
    primaryTask: '快速定位、比较并处理业务对象。', primaryAction: '新建对象',
    secondaryRegions: ['筛选条件', '批量操作与分页'], requiredStates: [...commonStates, 'filtered-empty', 'partial-selection', 'server-error'],
    responsiveContract: ['列按业务优先级降级，操作列不得消失', '窄屏使用对象摘要加详情 Drawer', '筛选和选择状态跨分页保持可解释'],
    informationPriority: ['对象身份', '核心状态', '关键指标', '更新时间与操作'], completionCriteria: ['筛选、选择和分页形成闭环', '行操作可通过键盘完成']
  },
  'card-list': {
    primaryTask: '按条件浏览并选择一个业务对象。', primaryAction: '新建对象',
    secondaryRegions: ['分类与筛选', '分页与批量选择'], requiredStates: [...commonStates, 'filtered-empty', 'selected'],
    responsiveContract: ['卡片由多列稳定降为单列', '卡片主操作和状态在窄屏仍可见', '长标题不能改变操作位置'],
    informationPriority: ['对象名称与状态', '摘要', '关键元数据', '次级操作'], completionCriteria: ['用户可筛选并打开对象', '卡片选择状态清晰可撤销']
  },
  detail: {
    primaryTask: '理解对象当前状态并完成最相关的后续操作。', primaryAction: '编辑对象',
    secondaryRegions: ['关联数据', '活动与版本记录'], requiredStates: [...commonStates, 'not-found', 'read-only'],
    responsiveContract: ['摘要和状态先于分组详情', '关联信息在窄屏转为 Tabs 或纵向区块', '固定操作区不能遮挡正文'],
    informationPriority: ['对象身份和状态', '关键属性', '关联数据', '操作历史'], completionCriteria: ['关键字段可扫描', '权限不足时明确可用操作']
  },
  form: {
    primaryTask: '准确完成分步录入并安全提交。', primaryAction: '保存并继续',
    secondaryRegions: ['步骤导航', '校验摘要与确认'], requiredStates: [...commonStates, 'validation-error', 'saving', 'unsaved-changes', 'submitted'],
    responsiveContract: ['字段单列化且标签不截断', '错误摘要与首个错误建立焦点跳转', '移动端主操作保持可达但不遮挡字段'],
    informationPriority: ['当前步骤任务', '必填字段', '校验与帮助', '次级字段'], completionCriteria: ['错误可定位和恢复', '提交前提供最终确认']
  },
  analytics: {
    primaryTask: '识别指标变化、原因和需要采取的行动。', primaryAction: '导出分析',
    secondaryRegions: ['维度筛选', '明细与口径说明'], requiredStates: [...commonStates, 'no-data', 'partial-data', 'stale-data'],
    responsiveContract: ['先保留核心指标与趋势，再重排图表和明细', '图例不得依赖颜色单独传达', '明细表在窄屏保留关键列和钻取入口'],
    informationPriority: ['异常与结论', '核心指标', '趋势和分布', '明细与口径'], completionCriteria: ['结论可追溯到明细', '图表具备文本替代']
  },
  settings: {
    primaryTask: '查找、修改并确认系统配置。', primaryAction: '保存设置',
    secondaryRegions: ['设置导航', '变更影响说明'], requiredStates: [...commonStates, 'dirty', 'saving', 'save-success', 'conflict'],
    responsiveContract: ['设置导航在窄屏转为选择器或 Drawer', '保存状态与未保存提示持续可见', '危险设置与普通设置分区'],
    informationPriority: ['当前配置组', '关键设置', '影响与风险', '高级设置'], completionCriteria: ['变更可保存和撤销', '冲突时不覆盖远端配置']
  },
  approval: {
    primaryTask: '在充分理解业务事实和风险后作出审批决定。', primaryAction: '批准',
    secondaryRegions: ['审批轨迹', '附件与风险提示'], requiredStates: [...commonStates, 'pending', 'approved', 'rejected', 'withdrawn'],
    responsiveContract: ['业务摘要和风险先于审批历史', '批准与拒绝保持视觉区分', '移动端操作区不遮挡审批依据'],
    informationPriority: ['审批对象与风险', '关键业务数据', '审批意见', '历史记录'], completionCriteria: ['决定必须附带身份和时间', '高风险操作二次确认']
  },
  kanban: {
    primaryTask: '判断任务分布并推动任务进入下一状态。', primaryAction: '新建任务',
    secondaryRegions: ['筛选与分组', '任务详情'], requiredStates: [...commonStates, 'dragging', 'drop-denied', 'updating'],
    responsiveContract: ['窄屏按泳道分页或切换，不压缩成不可读列', '拖拽之外提供键盘移动菜单', '任务详情使用 Drawer 保留看板上下文'],
    informationPriority: ['阻塞和逾期任务', '当前泳道', '负责人和截止时间', '次级标签'], completionCriteria: ['状态变化可撤销', '拖拽失败恢复原位置']
  },
  calendar: {
    primaryTask: '查看资源时间冲突并安排日程。', primaryAction: '新建日程',
    secondaryRegions: ['日期与视图切换', '日程详情'], requiredStates: [...commonStates, 'conflict', 'timezone-warning', 'saving'],
    responsiveContract: ['窄屏切换为日程列表或单日视图', '冲突和全天事件不依赖颜色单独表达', '详情在 Drawer 中可编辑'],
    informationPriority: ['冲突与即将开始', '日期时间', '参与者与资源', '备注'], completionCriteria: ['时间与时区明确', '冲突可被识别和解决']
  },
  files: {
    primaryTask: '在目录中定位、预览和管理文件。', primaryAction: '上传文件',
    secondaryRegions: ['目录树', '预览与版本信息'], requiredStates: [...commonStates, 'uploading', 'upload-failed', 'preview-unavailable', 'version-conflict'],
    responsiveContract: ['目录树在窄屏转为 Drawer', '文件名、状态和主要操作不可隐藏', '预览不可用时保留下载和元数据'],
    informationPriority: ['文件身份与状态', '目录位置', '版本和修改人', '预览与操作'], completionCriteria: ['上传可暂停重试', '权限和文件风险明确']
  },
  'ai-chat': {
    primaryTask: '基于明确上下文获得可验证的 AI 回答。', primaryAction: '发送问题',
    secondaryRegions: ['会话历史', '引用与工具轨迹'], requiredStates: [...commonStates, 'streaming', 'stopped', 'tool-approval', 'citation-missing'],
    responsiveContract: ['消息流优先，会话历史在窄屏转 Drawer', 'Composer 始终可达且不遮挡回答', '引用和工具结果可展开查看'],
    informationPriority: ['当前回答与人工控制', '引用依据', '工具状态', '会话历史'], completionCriteria: ['回答可停止重试', '关键结论有来源或不确定性提示']
  },
  'ai-side-assistant': {
    primaryTask: '在不离开当前业务上下文的情况下获得 AI 辅助。', primaryAction: '发送上下文问题',
    secondaryRegions: ['当前页面上下文', '引用与应用结果'], requiredStates: [...commonStates, 'streaming', 'context-stale', 'apply-preview', 'tool-approval'],
    responsiveContract: ['窄屏 AI 面板转为全屏 Drawer', '关闭助手后业务页面状态不丢失', '应用结果前提供差异预览'],
    informationPriority: ['当前业务任务', 'AI 回答', '引用和工具', '会话历史'], completionCriteria: ['上下文范围可见', '生成结果需确认后应用']
  },
  'agent-task': {
    primaryTask: '定义目标、监督执行并对高风险步骤作出决定。', primaryAction: '启动任务',
    secondaryRegions: ['执行计划', '工具调用与结果'], requiredStates: [...commonStates, 'planning', 'running', 'waiting-approval', 'paused', 'failed', 'completed'],
    responsiveContract: ['目标和当前步骤始终可见', '工具详情在窄屏使用 Drawer', '停止与审批操作保持可达'],
    informationPriority: ['当前状态与人工控制', '执行计划', '工具证据', '最终结果'], completionCriteria: ['每一步可追踪', '高风险工具未经审批不得执行']
  },
  'ai-review': {
    primaryTask: '比较生成内容并决定接受、拒绝或局部应用。', primaryAction: '应用已选变更',
    secondaryRegions: ['生成依据', '反馈与版本记录'], requiredStates: [...commonStates, 'generating', 'diff-ready', 'partial-selection', 'apply-conflict'],
    responsiveContract: ['窄屏使用逐段差异而非并排压缩', '接受和拒绝可逐项操作', '应用冲突时保留原内容'],
    informationPriority: ['差异和风险', '原文与生成内容', '引用依据', '版本历史'], completionCriteria: ['所有变更可逐项确认', '应用后可撤销']
  },
  'ai-governance': {
    primaryTask: '发现高风险 AI 行为并追溯、处置和审计。', primaryAction: '创建处置任务',
    secondaryRegions: ['质量与成本指标', '调用和审批记录'], requiredStates: [...commonStates, 'risk-detected', 'investigating', 'resolved', 'exporting'],
    responsiveContract: ['风险列表先于汇总图表', '版本和风险标签保持单行', '窄屏详情使用 Drawer 并保留处置操作'],
    informationPriority: ['高风险事件', '输入输出与工具证据', '责任主体', '趋势指标'], completionCriteria: ['事件可追溯到完整 Trace', '处置记录不可静默覆盖']
  },
  'ai-search': {
    primaryTask: '提出问题并从可信来源定位答案。', primaryAction: '搜索并生成回答',
    secondaryRegions: ['引用来源', '关联业务对象'], requiredStates: [...commonStates, 'searching', 'streaming', 'no-authorized-source', 'citation-missing'],
    responsiveContract: ['答案和来源按顺序纵向阅读', '来源筛选在窄屏转 Drawer', '无授权来源时禁止伪造回答'],
    informationPriority: ['答案与置信提示', '引用来源', '关联对象', '检索轨迹'], completionCriteria: ['结论可打开原始来源', '无证据时明确说明']
  },
  'ai-form': {
    primaryTask: '审查 AI 推荐值并安全完成业务表单。', primaryAction: '确认并提交',
    secondaryRegions: ['推荐依据', '修改差异'], requiredStates: [...commonStates, 'generating', 'recommendation-ready', 'validation-error', 'stale-recommendation'],
    responsiveContract: ['推荐说明紧邻对应字段', '窄屏不把依据放到不可发现侧栏', '用户修改后标记推荐已过期'],
    informationPriority: ['必填字段与异常', '推荐值', '生成依据', '次级字段'], completionCriteria: ['AI 不自动提交', '推荐值可逐字段接受或撤销']
  },
  'ai-analysis': {
    primaryTask: '用自然语言分析数据并验证结论与明细。', primaryAction: '运行分析',
    secondaryRegions: ['分析过程', '图表与明细'], requiredStates: [...commonStates, 'querying', 'partial-result', 'data-stale', 'citation-missing'],
    responsiveContract: ['结论先于图表，明细可下钻', '窄屏图表不横向挤压标签', '生成过程和取消操作保持可见'],
    informationPriority: ['结论与异常', '指标和图表', '查询与口径', '明细证据'], completionCriteria: ['结论可回到数据明细', '使用的数据范围和时间可见']
  },
  'ai-document': {
    primaryTask: '编辑文档并可控地使用 AI 生成、改写和引用。', primaryAction: '保存文档',
    secondaryRegions: ['AI 指令与预览', '引用和版本历史'], requiredStates: [...commonStates, 'generating', 'unsaved-changes', 'version-conflict', 'citation-missing'],
    responsiveContract: ['编辑区保持主区域', '窄屏 AI 面板转为 Drawer', '生成结果先预览再写入正文'],
    informationPriority: ['正文编辑', '未保存和冲突状态', 'AI 建议', '引用与版本'], completionCriteria: ['生成内容可撤销', '引用随内容保存']
  },
  'ai-decision': {
    primaryTask: '理解推荐、依据和风险后作出人工决策。', primaryAction: '确认决策',
    secondaryRegions: ['推荐依据', '替代方案与风险'], requiredStates: [...commonStates, 'calculating', 'recommendation-ready', 'insufficient-evidence', 'expired'],
    responsiveContract: ['推荐与风险同时可见', '窄屏按决策、依据、替代方案排序', '确认操作不与重新生成混为同级'],
    informationPriority: ['推荐和风险', '关键依据', '替代方案', '模型与数据说明'], completionCriteria: ['决策由人确认', '记录采用或拒绝原因']
  },
  'ai-batch': {
    primaryTask: '预览并批准 AI 对一批数据执行一致操作。', primaryAction: '执行批处理',
    secondaryRegions: ['影响范围', '执行计划与失败项'], requiredStates: [...commonStates, 'previewing', 'waiting-approval', 'running', 'partial-failure', 'completed'],
    responsiveContract: ['影响数量和风险始终可见', '窄屏批量明细可分页查看', '停止和重试不隐藏'],
    informationPriority: ['影响范围与风险', '指令与预览', '执行进度', '失败明细'], completionCriteria: ['执行前必须预览', '部分失败可单独重试和导出']
  },
  'agent-management': {
    primaryTask: '配置 Agent 的模型、Skills、工具和权限边界。', primaryAction: '新建 Agent',
    secondaryRegions: ['能力配置', '版本与运行状态'], requiredStates: [...commonStates, 'draft', 'validating', 'published', 'disabled', 'permission-conflict'],
    responsiveContract: ['Agent 列表与配置详情在窄屏转主从导航', '权限风险先于高级参数', '发布和停用操作保持明确区分'],
    informationPriority: ['身份与发布状态', '权限和工具', '模型与 Skills', '版本记录'], completionCriteria: ['发布前完成权限校验', '变更具备版本和审计记录']
  },
  'ai-knowledge': {
    primaryTask: '管理知识文档、同步状态与权限，并验证检索结果。', primaryAction: '导入知识源',
    secondaryRegions: ['选中文档详情', '上下文 AI 检索助手'], requiredStates: [...commonStates, 'syncing', 'selected', 'filtered-empty', 'index-failed'],
    responsiveContract: ['主表保留筛选、选择和行操作', '低于 720px 时详情与 AI 助手转为纵向区块或 Drawer', '空筛选结果清理文档详情、回答与引用'],
    informationPriority: ['知识源状态和权限', '文档主列表', '选中详情', '检索回答与引用'], completionCriteria: ['同步失败可重试', '回答受知识权限约束并可追溯']
  },
  'ai-monitor': {
    primaryTask: '监控 AI 调用健康、成本和异常并快速定位原因。', primaryAction: '创建告警规则',
    secondaryRegions: ['趋势和预算', '调用 Trace 明细'], requiredStates: [...commonStates, 'live', 'delayed', 'budget-warning', 'provider-outage'],
    responsiveContract: ['异常和预算先于总调用量', '窄屏图表转为单列并保留时间范围', 'Trace 明细通过 Drawer 打开'],
    informationPriority: ['告警与预算', '成功率和耗时', '调用趋势', 'Trace 明细'], completionCriteria: ['异常可定位到 Provider 和 Trace', '指标标明采样时间']
  },
  'ai-evaluation': {
    primaryTask: '用稳定测试集比较模型和提示词质量。', primaryAction: '运行评测',
    secondaryRegions: ['评分维度', '失败样本与证据'], requiredStates: [...commonStates, 'queued', 'running', 'partial-result', 'failed', 'completed'],
    responsiveContract: ['模型对比保持同一评分基线', '窄屏按模型切换而非压缩对比列', '失败样本可逐条打开'],
    informationPriority: ['总评分和风险', '维度对比', '失败样本', '运行配置'], completionCriteria: ['结果关联测试集版本', '评分可回到原始输入输出']
  }
}

export const atlasPagePatterns: AtlasPagePatternKnowledge[] = ([
  ['workbench', '角色工作台', 'general', ['工作台', '概览', '首页'], ['KPI', '待办', '动态'], ['AtlasPageHeader', 'AtlasStatistic', 'AtlasDataTable', 'AtlasAlert']],
  ['data-list', '数据列表页', 'general', ['列表', '表格', '数据管理'], ['筛选', '操作栏', '表格', '分页'], ['AtlasPageHeader', 'AtlasDataTable', 'AtlasTableToolbar', 'AtlasObjectCell', 'AtlasStatusTag', 'AtlasRowActions']],
  ['card-list', '卡片列表页', 'general', ['卡片', '目录'], ['筛选', '卡片网格', '分页'], ['AtlasTabs', 'AtlasCard', 'AtlasPagination']],
  ['detail', '对象详情页', 'general', ['详情', '档案'], ['摘要', '状态', '分组信息', '关联数据'], ['AtlasBreadcrumb', 'AtlasTag', 'AtlasTabs']],
  ['form', '分步表单页', 'general', ['表单', '创建', '编辑'], ['步骤', '字段分组', '确认'], ['AtlasSteps', 'AtlasInput', 'AtlasSelect', 'AtlasButton']],
  ['analytics', '数据分析页', 'general', ['分析', '报表', '图表'], ['指标', '筛选', '图表', '明细'], ['AtlasStatistic', 'AtlasSegmentedControl', 'AtlasTable']],
  ['settings', '系统设置页', 'general', ['设置', '配置'], ['设置导航', '分组配置', '保存'], ['AtlasTabs', 'AtlasInput', 'AtlasSwitch']],
  ['approval', '审批详情页', 'business', ['审批', '审核'], ['业务详情', '审批记录', '操作'], ['AtlasSteps', 'AtlasAlert', 'AtlasDialog']],
  ['kanban', '任务看板页', 'business', ['看板', '任务流转'], ['筛选', '状态泳道', '任务'], ['AtlasCard', 'AtlasAvatar', 'AtlasTag']],
  ['calendar', '团队日历页', 'business', ['日历', '排期'], ['日期导航', '日历', '日程'], ['AtlasSegmentedControl', 'AtlasTag', 'AtlasDrawer']],
  ['files', '文件管理页', 'business', ['文件', '目录'], ['目录树', '文件列表', '预览'], ['AtlasSearchInput', 'AtlasTable', 'AtlasDrawer']],
  ['ai-chat', 'AI 对话页', 'ai', ['对话', '助手', '问答'], ['会话历史', '消息流', '输入', '引用'], ['AtlasAIConversation', 'AtlasAIMessageBubble', 'AtlasAIComposer', 'AtlasCitationList']],
  ['ai-side-assistant', 'AI 侧边助手', 'ai', ['侧边助手', '页面助手'], ['当前业务页面', 'AI 面板', '上下文', '输入'], ['AtlasDrawer', 'AtlasAIMessageBubble', 'AtlasAIComposer', 'AtlasCitationList']],
  ['agent-task', 'Agent 任务工作台', 'ai', ['Agent', '执行计划', '工具调用'], ['目标', '计划', '步骤', '结果'], ['AtlasOrb', 'AtlasExecutionPlan', 'AtlasToolCallCard']],
  ['ai-review', 'AI 生成审阅页', 'ai', ['生成审阅', '差异', '接受拒绝'], ['原内容', '生成内容', '差异', '控制'], ['AtlasTabs', 'AtlasAlert', 'AtlasAIFeedback']],
  ['ai-governance', 'AI 审计治理页', 'ai', ['AI 审计', '质量', '成本'], ['指标', '风险', '工具审计', '处置'], ['AtlasStatistic', 'AtlasProgress', 'AtlasToolCallCard']],
  ['ai-search', 'AI 搜索问答页', 'ai', ['搜索问答', '引用来源'], ['问题', '答案', '引用', '关联对象'], ['AtlasAIComposer', 'AtlasAIMessageBubble', 'AtlasCitationList']],
  ['ai-form', 'AI 智能填表页', 'ai', ['智能填表', '推荐值'], ['表单', '推荐值', '依据', '确认'], ['AtlasInput', 'AtlasAIMessageBubble', 'AtlasCitationList']],
  ['ai-analysis', 'AI 数据分析页', 'ai', ['自然语言分析', '结论'], ['提问', '图表', '结论', '明细'], ['AtlasAIComposer', 'AtlasStatistic', 'AtlasCitationList']],
  ['ai-document', 'AI 文档工作台', 'ai', ['AI 文档', '改写'], ['文档编辑', '生成', '引用'], ['AtlasTextarea', 'AtlasAIComposer', 'AtlasCitationList']],
  ['ai-decision', 'AI 推荐决策页', 'ai', ['推荐决策', '风险'], ['推荐', '依据', '风险', '人工确认'], ['AtlasAlert', 'AtlasCitationList', 'AtlasAIFeedback']],
  ['ai-batch', 'AI 批处理页', 'ai', ['AI 批量处理', '批处理'], ['数据范围', '指令', '预览', '执行'], ['AtlasTable', 'AtlasAIComposer', 'AtlasExecutionPlan']],
  ['agent-management', 'Agent 管理页', 'ai', ['Agent 管理', '模型技能工具'], ['智能体', '模型', '技能', '工具', '权限'], ['AtlasTable', 'AtlasMCPServerPicker', 'AtlasTag']],
  ['ai-knowledge', 'AI 知识库管理页', 'ai', ['知识库', 'RAG', '知识源', '知识检索', '权限感知'], ['页面上下文', '知识空间与筛选', '知识文档主任务', '选中详情', '上下文 AI 助手', '状态反馈'], ['AtlasPageHeader', 'AtlasDataTable', 'AtlasTableToolbar', 'AtlasObjectCell', 'AtlasStatusTag', 'AtlasRowActions', 'AtlasPanel', 'AtlasAIComposer', 'AtlasKnowledgeSourcePicker', 'AtlasRetrievalTrace', 'AtlasCitationList']],
  ['ai-monitor', 'AI 运行监控页', 'ai', ['AI 监控', '调用量', '成本'], ['调用量', '成功率', '耗时', '成本'], ['AtlasStatistic', 'AtlasProgress', 'AtlasTable']],
  ['ai-evaluation', 'AI 质量评测页', 'ai', ['模型评测', '测试集'], ['测试集', '模型对比', '评分'], ['AtlasTable', 'AtlasProgress', 'AtlasCitationList']]
] as Array<[string, string, AtlasPagePatternKnowledge['group'], string[], string[], string[]]>).map(([id, title, group, intent, regions, recommendedComponents]) => {
  const contract = pagePatternContracts[id]
  if (!contract) throw new Error(`Page pattern contract is missing: ${id}`)
  return { id, title, group, intent, regions, recommendedComponents, ...contract }
})

export const atlasSkills: AtlasSkillKnowledge[] = [
  { id: 'atlas-eids-design-system', title: 'Atlas EIDS Skill Router', path: 'skills/atlas-eids-design-system/SKILL.md', activatesFor: ['Atlas', '企业页面', '设计系统'] },
  { id: 'atlas-react', title: 'Atlas React', path: 'skills/atlas-react/SKILL.md', activatesFor: ['React', 'TSX', '@atlas-eids/react'] },
  { id: 'atlas-vue', title: 'Atlas Vue', path: 'skills/atlas-vue/SKILL.md', activatesFor: ['Vue 3', 'SFC', '@atlas-eids/vue'] },
  { id: 'atlas-ai', title: 'Atlas AI Native', path: 'skills/atlas-ai/SKILL.md', activatesFor: ['Orb', 'AI 对话', 'Agent', '知识库', 'MCP'] },
  { id: 'atlas-page-patterns', title: 'Atlas Page Patterns', path: 'skills/atlas-page-patterns/SKILL.md', activatesFor: ['页面模板', '布局', '应用框架'] },
  { id: 'atlas-tokens', title: 'Atlas Tokens', path: 'skills/atlas-tokens/SKILL.md', activatesFor: ['颜色', '间距', '字体', '主题'] },
  { id: 'atlas-cli', title: 'Atlas CLI', path: 'skills/atlas-cli/SKILL.md', activatesFor: ['CLI', '创建项目', '生成页面', '升级'] }
]

export const atlasDesignManifest = {
  version: '0.2.0-beta.3',
  identity: 'AI-native enterprise design system with a restrained operational surface and Living Intelligence Core',
  principles: [
    '企业任务优先：信息密度、层级和操作效率高于装饰。',
    'AI 可解释：回答、引用、工具、权限、审批和审计必须形成完整链路。',
    'Orb 只表达 AI 生命状态，禁止作为普通业务图标。',
    'Living Orb 使用正式 AtlasOrb 或共享多层结构，禁止用单层渐变圆球近似。',
    '组件卡片圆角不超过 8px，表单标签位于输入上方。',
    '标准数据表行高 42px，筛选、表格和分页共享内容基线。',
    '正文阅读字号不低于 12px；页面标题、区块标题、正文和辅助信息遵循 20/16/14/12px 层级。',
    '页面间距遵循 4px 基线与 4/8/12/16/20/24/32/48px 尺度，业务样式不得随机发明间距。',
    '每个任务区域最多一个主操作；次级面板不得与主任务争夺视觉层级。',
    '响应式适配必须保留业务功能；空态、错误态和筛选结果要同步清理或恢复依赖上下文。',
    '只使用语义 Design Tokens，不在业务组件中硬编码品牌色。',
    'React 与 Vue 保持 API 语义、视觉状态和无障碍行为一致。',
    '页面必须经过构建、键盘、A11y、交互和桌面/移动视觉检查。'
  ],
  components: atlasComponents,
  pagePatterns: atlasPagePatterns,
  skills: atlasSkills,
  visualRules: atlasVisualRules
}

export function queryAtlasComponents(query = '', category?: AtlasComponentKnowledge['category']) {
  const normalized = query.trim().toLowerCase()
  return atlasComponents.filter((component) => {
    if (category && component.category !== category) return false
    if (!normalized) return true
    return [component.name, component.summary, ...component.useWhen, ...(component.avoidWhen ?? [])]
      .some((value) => value.toLowerCase().includes(normalized))
  })
}

export function queryAtlasPatterns(query = '') {
  const normalized = query.trim().toLowerCase()
  return atlasPagePatterns.filter((pattern) => !normalized || [pattern.id, pattern.title, ...pattern.intent, ...pattern.regions]
    .some((value) => value.toLowerCase().includes(normalized)))
}

export interface AtlasPagePlanInput {
  intent: string
  framework?: AtlasAgentFramework
  density?: AtlasAgentDensity
  locale?: AtlasAgentLocale
  pattern?: string
}

export interface AtlasPagePlan {
  pattern: AtlasPagePatternKnowledge
  framework: AtlasAgentFramework
  density: AtlasAgentDensity
  locale: AtlasAgentLocale
  components: AtlasComponentKnowledge[]
  instructions: string[]
}

export function planAtlasPage(input: AtlasPagePlanInput): AtlasPagePlan {
  const normalized = input.intent.toLowerCase()
  const explicit = input.pattern ? atlasPagePatterns.find((pattern) => pattern.id === input.pattern) : undefined
  const ranked = atlasPagePatterns.map((pattern) => ({
    pattern,
    score: [pattern.id, pattern.title, ...pattern.intent].reduce((score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0)
  })).sort((left, right) => right.score - left.score)
  const pattern = explicit ?? ranked[0]?.pattern ?? atlasPagePatterns[0]
  if (!pattern) throw new Error('Atlas page pattern catalog is empty')
  const names = new Set(['AtlasProvider', ...pattern.recommendedComponents])
  if (pattern.group === 'ai') names.add('AtlasOrb')
  const components = atlasComponents.filter((component) => names.has(component.name))
  return {
    pattern,
    framework: input.framework ?? 'react',
    density: input.density ?? 'standard',
    locale: input.locale ?? 'zh-CN',
    components,
    instructions: [
      `使用 ${pattern.title} 的区域顺序：${pattern.regions.join(' -> ')}。`,
      `围绕唯一主任务组织信息：${pattern.primaryTask}`,
      `主操作为“${pattern.primaryAction}”，同一区域不要再设置第二个主按钮。`,
      `信息优先级：${pattern.informationPriority.join(' > ')}。`,
      '页面采用低圆角、浅灰画布、白色内容层和紧凑企业信息结构；标准数据表行高为 42px。',
      '使用 20/16/14/12px 字体层级和 4px 间距基线；正文阅读字号不得低于 12px。',
      `覆盖状态：${pattern.requiredStates.join('、')}。`,
      ...pattern.responsiveContract.map((rule) => `响应式：${rule}。`),
      `完成标准：${pattern.completionCriteria.join('；')}。`,
      pattern.group === 'ai' ? '显式呈现来源、权限、工具状态与人工控制。' : '不要为了科技感加入无业务语义的 Orb。',
      '完成后运行 Atlas 页面校验、构建、键盘、A11y、交互与桌面/移动视觉回归。'
    ]
  }
}

export type AtlasValidationSeverity = 'error' | 'warning' | 'info'
export interface AtlasValidationIssue { code: string; severity: AtlasValidationSeverity; message: string; line?: number }
export type AtlasValidationStageName = 'source' | 'ast' | 'type' | 'dom' | 'visual'
export interface AtlasValidationStage {
  name: AtlasValidationStageName
  status: 'passed' | 'failed' | 'skipped'
  issues: AtlasValidationIssue[]
  details?: Record<string, unknown>
}
export interface AtlasDomAuditSnapshot {
  headingCount: number
  duplicateIds: string[]
  unlabeledControls: string[]
  horizontalOverflow: string[]
  clippedContent: string[]
  undersizedTargets: string[]
  primaryActionsByRegion: number[]
}
export interface AtlasVisualAuditSnapshot {
  desktopScreenshot?: string
  mobileScreenshot?: string
  baseline?: string
  diffPixelRatio?: number
  maxDiffPixelRatio?: number
}

function lineOf(source: string, index: number) {
  return source.slice(0, index).split('\n').length
}

export function validateAtlasPageSource(source: string, options: { aiPage?: boolean; framework?: AtlasAgentFramework } = {}) {
  const issues: AtlasValidationIssue[] = []
  const addMatches = (expression: RegExp, issue: Omit<AtlasValidationIssue, 'line'>) => {
    for (const match of source.matchAll(expression)) issues.push({ ...issue, line: lineOf(source, match.index ?? 0) })
  }
  addMatches(/#[0-9a-f]{3,8}\b/gi, { code: 'raw-color', severity: 'warning', message: '使用 Atlas 语义 Token 代替硬编码颜色。' })
  addMatches(/border-radius\s*:\s*(?:1[0-9]|[2-9][0-9])px/gi, { code: 'excessive-radius', severity: 'warning', message: '企业内容容器圆角应不超过 8px。' })
  addMatches(/box-shadow\s*:\s*(?!var\(--atlas-shadow-)/gi, { code: 'raw-shadow', severity: 'warning', message: '使用 Atlas 语义 Shadow Token，避免页面自行定义材质。' })
  addMatches(/font(?:-size|Size)\s*:\s*["']?(?:10|11)px\b/gi, { code: 'undersized-readable-text', severity: 'warning', message: '正文、标签和辅助信息不得使用 10/11px；使用 Caption 12px。10px Micro 只允许纯数字 Badge 等非阅读型指示。' })
  for (const match of source.matchAll(/(?:margin|padding|gap|row-gap|column-gap|rowGap|columnGap)(?:-[a-z]+|[A-Z][a-z]+)?\s*:\s*([^;}{,}]+)/g)) {
    const values = [...match[1].matchAll(/\b(\d+)px\b/g)].map((value) => Number(value[1]))
    if (values.some((value) => ![0, 4, 8, 12, 16, 20, 24, 32, 48].includes(value))) {
      issues.push({ code: 'off-scale-spacing', severity: 'warning', message: '布局间距应使用 Atlas Space Token 或 4px 基线尺度，避免随机 px 值。', line: lineOf(source, match.index ?? 0) })
    }
  }
  const overlaySources = [...source.matchAll(/<Atlas(Dialog|Drawer)\b[\s\S]*?<\/Atlas\1>/gi)].map((match) => match[0])
  const pageSource = source.replace(/<Atlas(Dialog|Drawer)\b[\s\S]*?<\/Atlas\1>/gi, '')
  const hasCompetingPrimaryActions = [pageSource, ...overlaySources]
    .some((region) => (region.match(/\bintent\s*=\s*["']primary["']/gi) ?? []).length > 1)
  if (hasCompetingPrimaryActions) {
    issues.push({ code: 'competing-primary-actions', severity: 'warning', message: '检测到多个 Primary 操作；请确认每个任务区域只有一个主操作，其余操作应降级。' })
  }
  if (/<table\b/i.test(source) && !/<Atlas(?:Data)?Table\b/.test(source)) {
    issues.push({ code: 'native-table-bypass', severity: 'error', message: '企业数据表必须使用 AtlasTable 或 AtlasDataTable，避免行高、选择、排序和 A11y 契约漂移。' })
  }
  if (/(?:<tr\b(?:(?!<\/tr>)[\s\S])*?<AtlasOrb\b|render\s*[:=][\s\S]{0,400}<AtlasOrb\b|#cell-[^>]*>[\s\S]{0,400}<AtlasOrb\b)/i.test(source)) {
    issues.push({ code: 'orb-in-data-row', severity: 'error', message: '数据行不得使用 Orb 作为普通对象图标；请使用 AtlasObjectCell、业务图标、头像或状态点。' })
  }
  if (/<Atlas(Card|Panel)\b[^>]*>(?:(?!<\/Atlas\1>)[\s\S])*<Atlas(?:Card|Panel)\b/i.test(source)) {
    issues.push({ code: 'nested-surface', severity: 'warning', message: '避免 Card/Panel 同级表面嵌套，页面区块应使用连续内容层。' })
  }
  if (/<AtlasOrb\b/.test(source) && !/(\bAI\b|Agent|Reasoner|assistant|智能|模型|知识)/i.test(source)) {
    issues.push({ code: 'orb-semantic-misuse', severity: 'error', message: 'Orb 只能用于明确的 AI 身份或运行状态，普通业务图标请改用图标、头像或状态点。' })
  }
  if (options.aiPage || /<Atlas(?:AI|MCP|Knowledge|Retrieval|ToolCall|Orb)/.test(source)) {
    if (!/(AtlasCitationList|引用|citation)/i.test(source)) issues.push({ code: 'missing-ai-evidence', severity: 'warning', message: 'AI 页面应提供引用来源或生成依据。' })
    if (/(delete|publish|批量|删除|发布)/i.test(source) && !/(approve|approval|确认|审批|AtlasDialog)/i.test(source)) issues.push({ code: 'missing-human-control', severity: 'error', message: '高风险 AI 操作必须提供确认或人工审批。' })
  }
  if (!/(<h1\b|role=["']heading["']|<AtlasPageHeader\b[^>]*\btitle\s*=)/i.test(source)) issues.push({ code: 'missing-page-heading', severity: 'warning', message: '页面应有可识别的一级标题。' })
  if (options.framework === 'react' && !/@atlas-eids\/react/.test(source)) issues.push({ code: 'missing-atlas-import', severity: 'warning', message: 'React 页面应优先使用 @atlas-eids/react。' })
  if (options.framework === 'vue' && !/@atlas-eids\/vue/.test(source)) issues.push({ code: 'missing-atlas-import', severity: 'warning', message: 'Vue 页面应优先使用 @atlas-eids/vue。' })
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues }
}

function diagnosticIssue(diagnostic: ts.Diagnostic, code: string): AtlasValidationIssue {
  const position = diagnostic.file && diagnostic.start !== undefined
    ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
    : undefined
  return {
    code,
    severity: 'error',
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    line: position ? position.line + 1 : undefined
  }
}

export function validateAtlasPageAst(source: string, options: { framework?: AtlasAgentFramework; fileName?: string } = {}) {
  const script = options.framework === 'vue'
    ? [...source.matchAll(/<script(?:\s+setup)?[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).join('\n')
    : source
  const fileName = options.fileName ?? (options.framework === 'vue' ? 'Page.vue.ts' : 'Page.tsx')
  const sourceFile = ts.createSourceFile(fileName, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const issues: AtlasValidationIssue[] = []
  const imports = new Set<string>()
  let primaryActionCount = 0
  let nativeTableLine: number | undefined

  const line = (node: ts.Node) => sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
  const walk = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const module = node.moduleSpecifier.text
      if (module.startsWith('@atlas-eids/')) {
        for (const element of node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings) ? node.importClause.namedBindings.elements : []) imports.add(element.name.text)
        if (options.framework === 'react' && module === '@atlas-eids/vue') issues.push({ code: 'wrong-framework-import', severity: 'error', message: 'React 页面不能导入 @atlas-eids/vue。', line: line(node) })
        if (options.framework === 'vue' && module === '@atlas-eids/react') issues.push({ code: 'wrong-framework-import', severity: 'error', message: 'Vue 页面不能导入 @atlas-eids/react。', line: line(node) })
      }
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sourceFile)
      if (tag === 'table' && nativeTableLine === undefined) nativeTableLine = line(node)
      if (tag === 'AtlasButton') {
        const intent = node.attributes.properties.find((property) => ts.isJsxAttribute(property) && property.name.getText(sourceFile) === 'intent')
        if (intent && ts.isJsxAttribute(intent) && intent.initializer && ts.isStringLiteral(intent.initializer) && intent.initializer.text === 'primary') primaryActionCount += 1
      }
      if (/^(button|input|select|textarea)$/.test(tag)) {
        const names = node.attributes.properties.filter(ts.isJsxAttribute).map((attribute) => attribute.name.getText(sourceFile))
        if (!names.some((name) => ['aria-label', 'aria-labelledby', 'title', 'id'].includes(name)) && tag === 'button') {
          const parentText = node.parent.getText(sourceFile)
          if (!/>\s*[^<{\s][^<{]*</.test(parentText)) issues.push({ code: 'unlabeled-native-control', severity: 'warning', message: '图标或空内容按钮需要可访问名称。', line: line(node) })
        }
      }
    }
    ts.forEachChild(node, walk)
  }
  walk(sourceFile)

  if (nativeTableLine !== undefined) issues.push({ code: 'ast-native-table', severity: 'error', message: 'AST 检测到原生 table；企业数据页应使用 AtlasTable 或 AtlasDataTable。', line: nativeTableLine })
  if (primaryActionCount > 1) issues.push({ code: 'ast-primary-action-count', severity: 'warning', message: `AST 检测到 ${primaryActionCount} 个 Primary Button，请按任务区域检查唯一主操作。` })
  const knownComponents = new Set(atlasComponents.map((component) => component.name))
  for (const name of imports) if (name.startsWith('Atlas') && !knownComponents.has(name)) issues.push({ code: 'unknown-atlas-component', severity: 'error', message: `组件 ${name} 不在当前 Atlas 组件契约中。` })
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues, details: { imports: [...imports], primaryActionCount } }
}

export function validateAtlasPageTypes(source: string, options: { framework?: AtlasAgentFramework; fileName?: string } = {}) {
  const script = options.framework === 'vue'
    ? [...source.matchAll(/<script(?:\s+setup)?[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).join('\n')
    : source
  const result = ts.transpileModule(script, {
    fileName: options.fileName ?? (options.framework === 'vue' ? 'Page.vue.ts' : 'Page.tsx'),
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, strict: true }
  })
  const issues = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error).map((diagnostic) => diagnosticIssue(diagnostic, 'type-syntax'))
  return { valid: issues.length === 0, issues, details: { mode: 'transpile', emittedBytes: result.outputText.length } }
}

export function validateAtlasDomSnapshot(snapshot: AtlasDomAuditSnapshot) {
  const issues: AtlasValidationIssue[] = []
  if (snapshot.headingCount === 0) issues.push({ code: 'dom-missing-heading', severity: 'error', message: '渲染页面缺少可访问标题。' })
  if (snapshot.duplicateIds.length) issues.push({ code: 'dom-duplicate-id', severity: 'error', message: `检测到重复 ID：${snapshot.duplicateIds.join('、')}` })
  if (snapshot.unlabeledControls.length) issues.push({ code: 'dom-unlabeled-control', severity: 'error', message: `存在无可访问名称的控件：${snapshot.unlabeledControls.join('、')}` })
  if (snapshot.horizontalOverflow.length) issues.push({ code: 'dom-horizontal-overflow', severity: 'error', message: `页面存在横向溢出：${snapshot.horizontalOverflow.join('、')}` })
  if (snapshot.clippedContent.length) issues.push({ code: 'dom-clipped-content', severity: 'error', message: `存在被裁切的内容：${snapshot.clippedContent.join('、')}` })
  if (snapshot.undersizedTargets.length) issues.push({ code: 'dom-target-size', severity: 'warning', message: `交互目标小于 32px：${snapshot.undersizedTargets.join('、')}` })
  if (snapshot.primaryActionsByRegion.some((count) => count > 1)) issues.push({ code: 'dom-competing-primary-actions', severity: 'warning', message: '渲染页面的同一任务区域存在多个 Primary 操作。' })
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues }
}

export function validateAtlasVisualSnapshot(snapshot: AtlasVisualAuditSnapshot) {
  const issues: AtlasValidationIssue[] = []
  const limit = snapshot.maxDiffPixelRatio ?? 0.04
  if (snapshot.diffPixelRatio !== undefined && snapshot.diffPixelRatio > limit) issues.push({ code: 'visual-regression', severity: 'error', message: `视觉差异 ${(snapshot.diffPixelRatio * 100).toFixed(2)}% 超过阈值 ${(limit * 100).toFixed(2)}%。` })
  if (!snapshot.desktopScreenshot || !snapshot.mobileScreenshot) issues.push({ code: 'visual-missing-viewport', severity: 'warning', message: '视觉验收需要同时提供 Desktop 与 Mobile 截图。' })
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues }
}

export function validateAtlasPagePipeline(input: {
  source: string
  framework?: AtlasAgentFramework
  aiPage?: boolean
  fileName?: string
  dom?: AtlasDomAuditSnapshot
  visual?: AtlasVisualAuditSnapshot
}) {
  const source = validateAtlasPageSource(input.source, input)
  const ast = validateAtlasPageAst(input.source, input)
  const type = validateAtlasPageTypes(input.source, input)
  const stage = (name: AtlasValidationStageName, result?: { valid: boolean; issues: AtlasValidationIssue[]; details?: Record<string, unknown> }): AtlasValidationStage => result
    ? { name, status: result.valid ? 'passed' : 'failed', issues: result.issues, details: result.details }
    : { name, status: 'skipped', issues: [] }
  const stages = [stage('source', source), stage('ast', ast), stage('type', type), stage('dom', input.dom ? validateAtlasDomSnapshot(input.dom) : undefined), stage('visual', input.visual ? validateAtlasVisualSnapshot(input.visual) : undefined)]
  const issues = stages.flatMap((entry) => entry.issues)
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues, stages }
}

export interface AtlasAgentLoopHooks {
  generate(plan: AtlasPagePlan): Promise<string>
  verify(source: string, plan: AtlasPagePlan): Promise<{ ok: boolean; diagnostics?: string[] }>
  repair?(source: string, diagnostics: string[], plan: AtlasPagePlan): Promise<string>
}

export function createAtlasAgentDevelopmentLoop(hooks: AtlasAgentLoopHooks, options: { maxAttempts?: number } = {}) {
  return {
    async run(input: AtlasPagePlanInput) {
      const plan = planAtlasPage(input)
      let source = await hooks.generate(plan)
      const attempts: Array<{ validation: ReturnType<typeof validateAtlasPageSource>; diagnostics: string[] }> = []
      const maxAttempts = Math.max(1, options.maxAttempts ?? 3)
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const validation = validateAtlasPageSource(source, { aiPage: plan.pattern.group === 'ai', framework: plan.framework })
        const verification = await hooks.verify(source, plan)
        const diagnostics = [...validation.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.message), ...(verification.diagnostics ?? [])]
        attempts.push({ validation, diagnostics })
        if (validation.valid && verification.ok) return { status: 'completed' as const, plan, source, attempts }
        if (!hooks.repair || attempt === maxAttempts - 1) return { status: 'failed' as const, plan, source, attempts }
        source = await hooks.repair(source, diagnostics, plan)
      }
      return { status: 'failed' as const, plan, source, attempts }
    }
  }
}

import { atlasComponentContracts, atlasVisualRules, type AtlasComponentCategory, type AtlasComponentVisualContract } from '@atlas-eids/core'

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
  ['input', ['AtlasButton', 'AtlasInput', 'AtlasTextarea', 'AtlasSelect', 'AtlasCheckbox', 'AtlasRadioGroup', 'AtlasSwitch', 'AtlasDateInput', 'AtlasSearchInput', 'AtlasSegmentedControl'], '企业表单、命令和筛选'],
  ['navigation', ['AtlasTabs', 'AtlasBreadcrumb', 'AtlasPagination', 'AtlasSteps', 'AtlasDropdown'], '页面层级、模式切换和流程导航'],
  ['display', ['AtlasCard', 'AtlasTable', 'AtlasTag', 'AtlasBadge', 'AtlasAvatar', 'AtlasStatistic', 'AtlasProgress'], '结构化业务数据与状态'],
  ['feedback', ['AtlasAlert', 'AtlasTooltip', 'AtlasEmpty', 'AtlasSkeleton', 'AtlasDialog', 'AtlasDrawer'], '反馈、加载、空状态和上下文浮层'],
  ['composition', ['AtlasObjectCell', 'AtlasStatusTag', 'AtlasRowActions', 'AtlasTableToolbar', 'AtlasDataTable', 'AtlasPageHeader', 'AtlasPanel'], '企业页面的数据、标题和工作区组合'],
  ['ai', ['AtlasOrb', 'AtlasAIComposer', 'AtlasExecutionPlan', 'AtlasAIConversation', 'AtlasAIMessageBubble', 'AtlasAIStreamingText', 'AtlasAIPrompts', 'AtlasAIAttachmentList', 'AtlasAIConversationHistory', 'AtlasAIFeedback', 'AtlasMCPServerPicker', 'AtlasCitationList', 'AtlasKnowledgeSourcePicker', 'AtlasRetrievalTrace', 'AtlasToolCallCard'], 'AI 对话、知识检索、工具执行和可信控制']
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

export const atlasPagePatterns: AtlasPagePatternKnowledge[] = [
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
  ['ai-knowledge', 'AI 知识库管理页', 'ai', ['知识库', 'RAG', '知识源', '知识检索', '权限感知'], ['数据源', '解析', '权限', '评测'], ['AtlasKnowledgeSourcePicker', 'AtlasRetrievalTrace', 'AtlasCitationList']],
  ['ai-monitor', 'AI 运行监控页', 'ai', ['AI 监控', '调用量', '成本'], ['调用量', '成功率', '耗时', '成本'], ['AtlasStatistic', 'AtlasProgress', 'AtlasTable']],
  ['ai-evaluation', 'AI 质量评测页', 'ai', ['模型评测', '测试集'], ['测试集', '模型对比', '评分'], ['AtlasTable', 'AtlasProgress', 'AtlasCitationList']]
].map(([id, title, group, intent, regions, recommendedComponents]) => ({ id, title, group, intent, regions, recommendedComponents })) as AtlasPagePatternKnowledge[]

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
  version: '0.2.0-beta.2',
  identity: 'AI-native enterprise design system with a restrained operational surface and Living Intelligence Core',
  principles: [
    '企业任务优先：信息密度、层级和操作效率高于装饰。',
    'AI 可解释：回答、引用、工具、权限、审批和审计必须形成完整链路。',
    'Orb 只表达 AI 生命状态，禁止作为普通业务图标。',
    'Living Orb 使用正式 AtlasOrb 或共享多层结构，禁止用单层渐变圆球近似。',
    '组件卡片圆角不超过 8px，表单标签位于输入上方。',
    '标准数据表行高 42px，筛选、表格和分页共享内容基线。',
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
      '页面采用低圆角、浅灰画布、白色内容层和紧凑企业信息结构；标准数据表行高为 42px。',
      pattern.group === 'ai' ? '显式呈现来源、权限、工具状态与人工控制。' : '不要为了科技感加入无业务语义的 Orb。',
      '完成后运行 Atlas 页面校验、构建、键盘、A11y、交互与桌面/移动视觉回归。'
    ]
  }
}

export type AtlasValidationSeverity = 'error' | 'warning' | 'info'
export interface AtlasValidationIssue { code: string; severity: AtlasValidationSeverity; message: string; line?: number }

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
  if (!/(<h1\b|role=["']heading["'])/i.test(source)) issues.push({ code: 'missing-page-heading', severity: 'warning', message: '页面应有可识别的一级标题。' })
  if (options.framework === 'react' && !/@atlas-eids\/react/.test(source)) issues.push({ code: 'missing-atlas-import', severity: 'warning', message: 'React 页面应优先使用 @atlas-eids/react。' })
  if (options.framework === 'vue' && !/@atlas-eids\/vue/.test(source)) issues.push({ code: 'missing-atlas-import', severity: 'warning', message: 'Vue 页面应优先使用 @atlas-eids/vue。' })
  return { valid: !issues.some((issue) => issue.severity === 'error'), issues }
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

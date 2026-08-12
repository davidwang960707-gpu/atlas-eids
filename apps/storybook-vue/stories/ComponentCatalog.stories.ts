import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Eye, FileText, Filter, MoreHorizontal, Pencil, Plus, Trash2 } from '@lucide/vue'
import {
  AtlasAIAttachmentList, AtlasAIComposer, AtlasAIConversation, AtlasAIConversationHistory, AtlasAIFeedback, AtlasAIMessageBubble, AtlasAIPrompts, AtlasAIStreamingText,
  AtlasAlert, AtlasAvatar, AtlasBadge, AtlasBreadcrumb, AtlasButton, AtlasCard, AtlasCitationList,
  AtlasCheckbox, AtlasDateInput, AtlasDialog, AtlasDrawer, AtlasDropdown, AtlasEmpty,
  AtlasExecutionPlan, AtlasInput, AtlasKnowledgeSourcePicker, AtlasMCPServerPicker, AtlasOrb, AtlasPagination, AtlasProgress, AtlasRadioGroup, AtlasRetrievalTrace,
  AtlasSearchInput, AtlasSegmentedControl, AtlasSelect, AtlasSkeleton, AtlasStatistic, AtlasSteps,
  AtlasDataTable, AtlasObjectCell, AtlasPageHeader, AtlasPanel, AtlasRowActions, AtlasStatusTag, AtlasTableToolbar,
  AtlasSwitch, AtlasTable, AtlasTabs, AtlasTag, AtlasTextarea, AtlasToolCallCard, AtlasTooltip
} from '@atlas-eids/vue'

const meta = { title: 'Vue/组件状态矩阵', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const components = { AtlasAIAttachmentList, AtlasAIComposer, AtlasAIConversation, AtlasAIConversationHistory, AtlasAIFeedback, AtlasAIMessageBubble, AtlasAIPrompts, AtlasAIStreamingText, AtlasAlert, AtlasAvatar, AtlasBadge, AtlasBreadcrumb, AtlasButton, AtlasCard, AtlasCitationList, AtlasCheckbox, AtlasDataTable, AtlasDateInput, AtlasDialog, AtlasDrawer, AtlasDropdown, AtlasEmpty, AtlasExecutionPlan, AtlasInput, AtlasKnowledgeSourcePicker, AtlasMCPServerPicker, AtlasObjectCell, AtlasOrb, AtlasPageHeader, AtlasPagination, AtlasPanel, AtlasProgress, AtlasRadioGroup, AtlasRetrievalTrace, AtlasRowActions, AtlasSearchInput, AtlasSegmentedControl, AtlasSelect, AtlasSkeleton, AtlasStatistic, AtlasStatusTag, AtlasSteps, AtlasSwitch, AtlasTable, AtlasTableToolbar, AtlasTabs, AtlasTag, AtlasTextarea, AtlasToolCallCard, AtlasTooltip, Eye, FileText, Filter, MoreHorizontal, Pencil, Plus, Trash2 }
const options = [{ label: '标准', value: 'standard' }, { label: '紧凑', value: 'compact' }, { label: '舒适', value: 'comfortable', disabled: true }]
const rowActions = [{ id: 'view', label: '查看' }, { id: 'edit', label: '编辑' }, { id: 'delete', label: '删除', danger: true }, { id: 'more', label: '更多' }]
const rows = [
  { id: 'AT-1048', task: '内容质量检查', owner: '王六', status: '运行中', updated: '10 分钟前' },
  { id: 'AT-1047', task: '知识索引更新', owner: '林可', status: '待复核', updated: '35 分钟前' },
  { id: 'AT-1046', task: '数据异常识别', owner: '陈默', status: '已完成', updated: '1 小时前' },
  { id: 'AT-1045', task: '周报摘要生成', owner: '李宁', status: '已完成', updated: '2 小时前' }
]
const columns = [{ key: 'id', title: '编号', width: 132, sortable: true }, { key: 'task', title: '任务名称', width: '36%', sortable: true }, { key: 'owner', title: '负责人' }, { key: 'status', title: '状态', width: 104 }, { key: 'updated', title: '更新时间' }]
const make = (component: string, states: string[], template: string, story: Partial<Story> = {}): Story => ({
  ...story,
  parameters: { atlas: { component, states } },
  render: (args) => ({
    components,
    setup() {
      return { args, checked: ref(true), value: ref('standard'), page: ref(3), open: ref(false), query: ref(''), selected: ref(['AT-1048']), sortKey: ref('id'), sortDirection: ref('ascending'), options, rowActions, rows, columns }
    },
    template: `<section class="story-stage">${template}</section>`
  })
})

export const Button = make('AtlasButton', ['neutral', 'primary', 'danger', 'loading', 'disabled'], `<div class="story-control"><AtlasButton :intent="args.intent" :size="args.size" :loading="args.loading" :disabled="args.disabled">{{ args.label }}</AtlasButton><span class="story-control-copy"><strong>实时参数预览</strong>在 Controls 中调整语义、尺寸与状态。</span></div><div class="story-row"><AtlasButton>次要操作</AtlasButton><AtlasButton intent="primary">主要操作</AtlasButton><AtlasButton intent="danger">危险操作</AtlasButton><AtlasButton loading>提交中</AtlasButton><AtlasButton disabled>不可用</AtlasButton></div>`, {
  args: { label: '可调按钮', intent: 'primary', size: 'default', loading: false, disabled: false },
  argTypes: { label: { control: 'text', description: '按钮文案' }, intent: { control: 'select', options: ['neutral', 'primary', 'danger'] }, size: { control: 'inline-radio', options: ['compact', 'default', 'comfortable'] }, loading: { control: 'boolean' }, disabled: { control: 'boolean' } }
})
Button.play = async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: '可调按钮' })); await expect(canvas.getByRole('button', { name: '不可用' })).toBeDisabled() }
export const Input = make('AtlasInput', ['default', 'hint', 'error', 'disabled'], `<div class="story-row"><AtlasInput label="任务名称" hint="最多 40 个字符"/><AtlasInput label="负责人" error="请选择负责人"/><AtlasInput label="归档编号" disabled model-value="AT-1048"/></div>`)
Input.play = async ({ canvasElement }) => { const input = within(canvasElement).getByLabelText('任务名称'); await userEvent.type(input, '知识库同步'); await expect(input).toHaveValue('知识库同步') }
export const Select = make('AtlasSelect', ['default', 'disabled-option'], `<AtlasSelect v-model="value" label="页面密度" :options="options"/>`)
export const Textarea = make('AtlasTextarea', ['default', 'error'], `<div class="story-row"><AtlasTextarea label="执行说明" hint="说明目标和约束"/><AtlasTextarea label="审批原因" error="审批原因不能为空"/></div>`)
export const Checkbox = make('AtlasCheckbox', ['checked', 'unchecked', 'indeterminate', 'disabled'], `<div class="story-row"><AtlasCheckbox v-model="checked" label="记录审计"/><AtlasCheckbox :model-value="false" indeterminate label="选择部分"/><AtlasCheckbox :model-value="false" disabled label="不可用"/></div>`)
Checkbox.play = async ({ canvasElement }) => { const checkbox = within(canvasElement).getByRole('checkbox', { name: '记录审计' }); await userEvent.click(checkbox); await expect(checkbox).not.toBeChecked() }
export const RadioGroup = make('AtlasRadioGroup', ['selected', 'disabled-option'], `<AtlasRadioGroup v-model="value" label="页面密度" :options="options"/>`)
export const Switch = make('AtlasSwitch', ['on', 'off', 'disabled'], `<div class="story-row"><AtlasSwitch v-model="checked" label="启用审批"/><AtlasSwitch :model-value="false" disabled label="策略锁定"/></div>`)
Switch.play = async ({ canvasElement }) => { const toggle = within(canvasElement).getByRole('switch', { name: '启用审批' }); await userEvent.click(toggle); await expect(toggle).toHaveAttribute('aria-checked', 'false') }
export const DateInput = make('AtlasDateInput', ['empty', 'value', 'error'], `<div class="story-row"><AtlasDateInput label="开始日期"/><AtlasDateInput label="结束日期" model-value="2026-08-11"/><AtlasDateInput label="交付日期" error="不能早于今天"/></div>`)
export const SearchInput = make('AtlasSearchInput', ['empty', 'typing', 'submitted'], `<AtlasSearchInput v-model="query"/>`)
export const SegmentedControl = make('AtlasSegmentedControl', ['compact', 'standard', 'comfortable'], `<AtlasSegmentedControl v-model="value" label="页面密度" :items="options"/>`)
export const Card = make('AtlasCard', ['default', 'selected', 'actions'], `<div class="story-grid"><AtlasCard title="经营分析" description="实时指标与趋势">内容区域</AtlasCard><AtlasCard selected title="智能审阅" description="已选中">内容区域</AtlasCard></div>`)
export const Tabs = make('AtlasTabs', ['active', 'count', 'disabled'], `<AtlasTabs v-model="value" :items="[{id:'standard',label:'全部',count:28},{id:'running',label:'运行中',count:8},{id:'archived',label:'已归档',disabled:true}]"/>`)
export const Breadcrumb = make('AtlasBreadcrumb', ['link', 'current'], `<AtlasBreadcrumb :items="[{label:'工作台',href:'#/'},{label:'任务中心',href:'#/tasks'},{label:'AT-1048'}]"/>`)
export const Pagination = make('AtlasPagination', ['first', 'middle', 'last'], `<AtlasPagination v-model="page" :page-count="8"/>`)
export const Steps = make('AtlasSteps', ['completed', 'current', 'pending', 'error'], `<AtlasSteps :items="[{id:'1',title:'创建任务',status:'completed'},{id:'2',title:'配置规则',status:'current'},{id:'3',title:'验证结果',status:'pending'},{id:'4',title:'发布',status:'error'}]"/>`)
export const Dropdown = make('AtlasDropdown', ['closed', 'open', 'disabled', 'danger'], `<AtlasDropdown label="更多操作" :items="[{id:'copy',label:'复制'},{id:'archive',label:'归档',disabled:true},{id:'delete',label:'删除',danger:true}]"/>`)
export const Table = make('AtlasTable', ['data', 'hover', 'selected', 'sorted', 'empty', 'loading'], `<AtlasTable v-model:selected-ids="selected" caption="任务列表" :columns="columns" :rows="rows" selectable :sort-key="sortKey" :sort-direction="sortDirection" @sort="({key,direction}) => { sortKey=key; sortDirection=direction }"><template #cell-task="{row}"><AtlasObjectCell :title="row.task" :meta="row.id" :tone="row.status === '已完成' ? 'success' : 'primary'"><template #icon><FileText :size="16"/></template></AtlasObjectCell></template><template #cell-status="{row}"><AtlasStatusTag :tone="row.status === '待复核' ? 'warning' : row.status === '已完成' ? 'success' : 'primary'">{{ row.status }}</AtlasStatusTag></template></AtlasTable>`)
export const ObjectCell = make('AtlasObjectCell', ['default', 'interactive', 'disabled'], `<div class="story-row"><AtlasObjectCell title="内容质量检查" meta="AT-1048" tone="primary"><template #icon><FileText :size="16"/></template></AtlasObjectCell><AtlasObjectCell title="数据异常识别" meta="AT-1046" description="最近更新 1 小时前" tone="success" interactive><template #icon><Filter :size="16"/></template></AtlasObjectCell></div>`)
export const StatusTag = make('AtlasStatusTag', ['neutral', 'primary', 'info', 'success', 'warning', 'danger'], `<div class="story-row"><AtlasStatusTag v-for="tone in ['neutral','primary','info','success','warning','danger']" :key="tone" :tone="tone">{{ tone }}</AtlasStatusTag></div>`)
export const RowActions = make('AtlasRowActions', ['default', 'disabled', 'danger', 'overflow'], `<AtlasRowActions :items="rowActions" @action="() => {}"><template #action-view><Eye :size="16"/></template><template #action-edit><Pencil :size="16"/></template><template #action-delete><Trash2 :size="16"/></template></AtlasRowActions>`)
export const TableToolbar = make('AtlasTableToolbar', ['default', 'filtered', 'selection', 'disabled'], `<AtlasTableToolbar><template #search><AtlasSearchInput v-model="query" placeholder="筛选任务"/></template><template #filters><AtlasButton><Filter :size="16"/>筛选</AtlasButton></template><template #selection><span>已选 1 项</span></template><template #actions><AtlasButton intent="primary"><Plus :size="16"/>新建</AtlasButton></template></AtlasTableToolbar>`)
export const DataTable = make('AtlasDataTable', ['data', 'filtered', 'selection', 'empty', 'loading'], `<div class="story-stage"><AtlasDataTable v-model:selected-ids="selected" title="任务执行排名" description="实时数据" caption="任务列表" :columns="columns" :rows="rows" selectable><template #toolbar><AtlasTableToolbar><template #search><AtlasSearchInput v-model="query" placeholder="筛选任务"/></template><template #actions><AtlasButton intent="primary"><Plus :size="16"/>新建</AtlasButton></template></AtlasTableToolbar></template><template #cell-task="{row}"><AtlasObjectCell :title="row.task" :meta="row.id" :tone="row.status === '已完成' ? 'success' : 'primary'"><template #icon><FileText :size="16"/></template></AtlasObjectCell></template><template #cell-status="{row}"><AtlasStatusTag :tone="row.status === '待复核' ? 'warning' : row.status === '已完成' ? 'success' : 'primary'">{{ row.status }}</AtlasStatusTag></template><template #footer><span>已选择 {{ selected.length }} 项</span><span>1-4 / 128</span></template></AtlasDataTable></div>`)
export const PageHeader = make('AtlasPageHeader', ['default', 'description', 'breadcrumbs', 'actions'], `<div class="story-stage"><AtlasPageHeader title="任务中心" description="统一查看、筛选和处理企业智能任务。" :breadcrumbs="[{label:'工作台',href:'#/'},{label:'任务中心'}]"><template #actions><AtlasButton>刷新</AtlasButton><AtlasButton intent="primary"><Plus :size="16"/>新建任务</AtlasButton></template></AtlasPageHeader></div>`)
export const PanelStory = make('AtlasPanel', ['default', 'header', 'actions', 'footer'], `<AtlasPanel title="运行概览" description="最近 24 小时"><template #actions><AtlasButton size="compact">查看详情</AtlasButton></template><div class="story-row"><AtlasStatistic label="运行任务" value="1,284" trend="up" trend-label="+12.4%"/><AtlasStatistic label="成功率" value="98.7" suffix="%"/></div><template #footer><AtlasButton intent="primary">确认</AtlasButton></template></AtlasPanel>`)
export const Tag = make('AtlasTag', ['neutral', 'primary', 'success', 'warning', 'danger', 'removable'], `<div class="story-row"><AtlasTag intent="neutral">neutral</AtlasTag><AtlasTag intent="primary">primary</AtlasTag><AtlasTag intent="success">success</AtlasTag><AtlasTag intent="warning">warning</AtlasTag><AtlasTag intent="danger">danger</AtlasTag><AtlasTag removable>可移除</AtlasTag></div>`)
export const Badge = make('AtlasBadge', ['count', 'dot', 'overflow'], `<div class="story-row"><AtlasBadge :count="8"><AtlasButton>待办</AtlasButton></AtlasBadge><AtlasBadge dot intent="warning"><AtlasButton>告警</AtlasButton></AtlasBadge><AtlasBadge :count="128"><AtlasButton>消息</AtlasButton></AtlasBadge></div>`)
export const Avatar = make('AtlasAvatar', ['initials', 'image', 'sizes'], `<div class="story-row"><AtlasAvatar name="王六"/><AtlasAvatar name="Atlas Admin" :size="40"/><AtlasAvatar name="林可" :size="48"/></div>`)
export const Statistic = make('AtlasStatistic', ['up', 'down', 'flat'], `<div class="story-grid"><AtlasStatistic label="运行任务" value="1,284" trend="up" trend-label="+12.4%"/><AtlasStatistic label="异常" value="17" trend="down" trend-label="-3"/><AtlasStatistic label="成功率" value="98.7" suffix="%" trend="flat"/></div>`)
export const Progress = make('AtlasProgress', ['primary', 'success', 'warning', 'danger'], `<div class="story-stack"><AtlasProgress :value="68" label="任务完成度"/><AtlasProgress :value="100" label="发布完成" intent="success"/><AtlasProgress :value="82" label="预算使用" intent="warning"/><AtlasProgress :value="96" label="容量告警" intent="danger"/></div>`)
export const Alert = make('AtlasAlert', ['info', 'success', 'warning', 'danger', 'closable'], `<div class="story-stack"><AtlasAlert title="同步任务已开始"/><AtlasAlert title="发布完成" intent="success"/><AtlasAlert title="预算接近阈值" intent="warning"/><AtlasAlert title="跨租户访问已拦截" intent="danger" closable/></div>`)
export const Tooltip = make('AtlasTooltip', ['hover', 'focus'], `<AtlasTooltip content="由 Atlas Reasoner 生成"><AtlasButton aria-label="查看 AI 说明">AI</AtlasButton></AtlasTooltip>`)
export const Empty = make('AtlasEmpty', ['without-action', 'with-action'], `<AtlasEmpty title="暂无任务" description="调整筛选条件或创建新任务。"><template #action><AtlasButton intent="primary">新建任务</AtlasButton></template></AtlasEmpty>`)
export const Skeleton = make('AtlasSkeleton', ['one-line', 'multi-line'], `<div class="story-stack"><AtlasSkeleton :lines="1"/><AtlasSkeleton :lines="4"/></div>`)
export const Dialog = make('AtlasDialog', ['closed', 'open', 'escape'], `<AtlasButton @click="open=true">打开对话框</AtlasButton><AtlasDialog v-model:open="open" title="确认发布">发布后将生成审计记录。</AtlasDialog>`)
export const Drawer = make('AtlasDrawer', ['closed', 'open', 'mask-close'], `<AtlasButton @click="open=true">查看详情</AtlasButton><AtlasDrawer :open="open" title="任务详情" @close="open=false">AT-1048 · 内容质量检查</AtlasDrawer>`)
export const Orb = make('AtlasOrb', ['idle', 'thinking', 'running', 'error', 'without-ring'], `<div class="story-control"><AtlasOrb :state="args.state" :size="args.size" :show-ring="args.showRing" :label="args.label"/><span class="story-control-copy"><strong>Living Intelligence Core</strong>轨道约束、呼吸形变、液态碰撞与状态色共同表达 AI 运行状态。</span></div><div class="story-row"><AtlasOrb v-for="state in ['idle','thinking','running','error']" :key="state" :state="state" :size="72"/></div>`, {
  args: { state: 'thinking', size: 132, showRing: true, label: 'Atlas AI' },
  argTypes: { state: { control: 'inline-radio', options: ['idle', 'thinking', 'running', 'error'] }, size: { control: { type: 'range', min: 48, max: 220, step: 4 } }, showRing: { control: 'boolean' }, label: { control: 'text' } }
})
export const AIComposer = make('AtlasAIComposer', ['empty', 'context', 'suggestion', 'busy'], `<AtlasAIComposer v-model="query" :placeholder="args.placeholder" :busy="args.busy" :contexts="args.contexts" :suggestions="args.suggestions"/>`, {
  args: { placeholder: '描述目标、输出形式和约束条件...', busy: false, contexts: ['客户 AC-1048', '近 30 天'], suggestions: ['分析风险', '生成摘要'] },
  argTypes: { placeholder: { control: 'text' }, busy: { control: 'boolean' }, contexts: { control: 'object' }, suggestions: { control: 'object' } }
})
export const ExecutionPlan = make('AtlasExecutionPlan', ['pending', 'running', 'completed', 'failed', 'approval'], `<AtlasExecutionPlan stoppable :steps="[{id:'1',title:'读取授权数据',status:'completed'},{id:'2',title:'生成变更方案',status:'running'},{id:'3',title:'写入业务系统',status:'approval'},{id:'4',title:'验证结果',status:'pending'},{id:'5',title:'异常恢复',status:'failed'}]"/>`)
export const AIConversation = make('AtlasAIConversation', ['history', 'streaming', 'composer', 'error'], `<AtlasAIConversation title="Atlas Reasoner" subtitle="企业知识与执行助手" status="thinking"><AtlasAIMessageBubble role="assistant" content="已完成授权范围内的检索。"/><template #composer><AtlasAIComposer v-model="query"/></template></AtlasAIConversation>`)
export const AIMessageBubble = make('AtlasAIMessageBubble', ['user', 'assistant', 'system', 'tool', 'streaming'], `<AtlasAIMessageBubble role="assistant" name="Atlas Reasoner" content="已完成授权范围内的检索。"/>`)
export const AIStreamingText = make('AtlasAIStreamingText', ['streaming', 'complete', 'stopped', 'error'], `<div class="story-stack"><AtlasAIStreamingText text="正在综合检索结果"/><AtlasAIStreamingText text="生成完成" status="complete"/><AtlasAIStreamingText text="Provider 响应异常" status="error"/></div>`)
export const AIPrompts = make('AtlasAIPrompts', ['default', 'category', 'description'], `<AtlasAIPrompts :items="[{id:'1',label:'分析异常原因',category:'分析',description:'结合近 30 天指标'},{id:'2',label:'生成行动清单',category:'执行'}]"/>`)
export const AIAttachmentList = make('AtlasAIAttachmentList', ['ready', 'uploading', 'failed', 'removable'], `<AtlasAIAttachmentList removable :items="[{id:'a1',name:'经营报告.pdf',mediaType:'application/pdf',size:840000},{id:'a2',name:'数据字典.xlsx',mediaType:'application/xlsx',status:'uploading'},{id:'a3',name:'异常日志.txt',mediaType:'text/plain',status:'failed'}]"/>`)
export const AIConversationHistory = make('AtlasAIConversationHistory', ['active', 'pinned', 'preview', 'create'], `<AtlasAIConversationHistory active-id="h1" creatable :items="[{id:'h1',title:'分析高风险任务',preview:'3 项需要关注',updatedAt:'10:42',pinned:true},{id:'h2',title:'周报摘要',preview:'已生成草稿',updatedAt:'昨天'}]"/>`)
export const AIFeedback = make('AtlasAIFeedback', ['empty', 'helpful', 'unhelpful', 'report'], `<AtlasAIFeedback v-model="query" reportable/>`)
export const MCPServerPicker = make('AtlasMCPServerPicker', ['connected', 'disconnected', 'selected', 'transport'], `<AtlasMCPServerPicker v-model="selected" addable :servers="[{id:'m1',name:'Atlas Page Tools',status:'connected',toolCount:12,transport:'webmcp'},{id:'m2',name:'Java Audit',status:'connected',toolCount:6,transport:'http'}]"/>`)
export const CitationList = make('AtlasCitationList', ['source', 'excerpt', 'confidence', 'interactive'], `<AtlasCitationList interactive :items="[{id:'c1',title:'企业权限策略 v2.8',source:'知识库',excerpt:'高风险写入必须经过人工审批。',confidence:.96}]"/>`)
export const KnowledgeSourcePicker = make('AtlasKnowledgeSourcePicker', ['ready', 'syncing', 'error', 'selected'], `<AtlasKnowledgeSourcePicker v-model="selected" :sources="[{id:'s1',name:'产品文档',type:'document',status:'ready',count:286,scope:'当前租户'},{id:'s2',name:'客户数据仓库',type:'database',status:'syncing',count:12840,scope:'授权字段'}]"/>`)
export const RetrievalTrace = make('AtlasRetrievalTrace', ['pending', 'running', 'completed', 'failed'], `<AtlasRetrievalTrace :steps="[{id:'r1',title:'理解查询与租户范围',status:'completed',durationMs:18},{id:'r2',title:'混合检索 286 个文档',status:'completed',durationMs:84},{id:'r3',title:'权限过滤与重排',status:'running'}]"/>`)
export const ToolCallCard = make('AtlasToolCallCard', ['queued', 'running', 'approval', 'completed', 'failed'], `<AtlasToolCallCard :call="{id:'t1',name:'records.publish',description:'将 12 条变更写入业务系统',permission:'high-risk',status:'approval',input:{records:12}}"/>`)

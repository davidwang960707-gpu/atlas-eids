import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Eye, FileText, Filter, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  AtlasAIAttachmentList, AtlasAIComposer, AtlasAIConversation, AtlasAIConversationHistory, AtlasAIFeedback, AtlasAIMessageBubble, AtlasAIPrompts, AtlasAIStreamingText,
  AtlasAlert, AtlasAvatar, AtlasBadge, AtlasBreadcrumb, AtlasButton, AtlasCard, AtlasCitationList,
  AtlasCheckbox, AtlasDateInput, AtlasDialog, AtlasDrawer, AtlasDropdown, AtlasEmpty,
  AtlasExecutionPlan, AtlasInput, AtlasKnowledgeSourcePicker, AtlasMCPServerPicker, AtlasOrb, AtlasPagination, AtlasProgress, AtlasRadioGroup, AtlasRetrievalTrace,
  AtlasSearchInput, AtlasSegmentedControl, AtlasSelect, AtlasSkeleton, AtlasStatistic, AtlasSteps,
  AtlasDataTable, AtlasObjectCell, AtlasPageHeader, AtlasPanel, AtlasRowActions, AtlasStatusTag, AtlasTableToolbar,
  AtlasSwitch, AtlasTable, AtlasTabs, AtlasTag, AtlasTextarea, AtlasToolCallCard, AtlasTooltip, type AtlasTableColumn
} from '@atlas-eids/react'

const meta = { title: 'React/组件状态矩阵', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const matrix = (component: string, states: string[]) => ({ atlas: { component, states } })
const options = [{ label: '标准', value: 'standard' }, { label: '紧凑', value: 'compact' }, { label: '舒适', value: 'comfortable', disabled: true }]
const Panel = ({ children }: { children: ReactNode }) => <section className="story-stage">{children}</section>

interface ButtonStoryArgs { label: string; intent: 'neutral' | 'primary' | 'danger'; size: 'compact' | 'default' | 'comfortable'; loading: boolean; disabled: boolean }
export const Button: StoryObj<ButtonStoryArgs> = {
  args: { label: '可调按钮', intent: 'primary', size: 'default', loading: false, disabled: false },
  argTypes: {
    label: { control: 'text', description: '按钮文案' },
    intent: { control: 'select', options: ['neutral', 'primary', 'danger'] },
    size: { control: 'inline-radio', options: ['compact', 'default', 'comfortable'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
  parameters: matrix('AtlasButton', ['neutral', 'primary', 'danger', 'loading', 'disabled']),
  render: (args) => <Panel><div className="story-control"><AtlasButton intent={args.intent} size={args.size} loading={args.loading} disabled={args.disabled}>{args.label}</AtlasButton><span className="story-control-copy"><strong>实时参数预览</strong>在 Controls 中调整语义、尺寸与状态。</span></div><div className="story-row"><AtlasButton>次要操作</AtlasButton><AtlasButton intent="primary">主要操作</AtlasButton><AtlasButton intent="danger">危险操作</AtlasButton><AtlasButton loading>提交中</AtlasButton><AtlasButton disabled>不可用</AtlasButton></div></Panel>,
  play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: '可调按钮' })); await expect(canvas.getByRole('button', { name: '不可用' })).toBeDisabled() }
}

export const Input: Story = {
  parameters: matrix('AtlasInput', ['default', 'hint', 'error', 'disabled']),
  render: () => <Panel><div className="story-row"><AtlasInput label="任务名称" hint="最多 40 个字符"/><AtlasInput label="负责人" error="请选择负责人"/><AtlasInput label="归档编号" disabled value="AT-1048" readOnly/></div></Panel>,
  play: async ({ canvasElement }) => { const input = within(canvasElement).getByLabelText('任务名称'); await userEvent.type(input, '知识库同步'); await expect(input).toHaveValue('知识库同步') }
}

export const Select: Story = { parameters: matrix('AtlasSelect', ['default', 'disabled-option']), render: () => <Panel><AtlasSelect label="页面密度" options={options} defaultValue="standard"/></Panel> }
export const Textarea: Story = { parameters: matrix('AtlasTextarea', ['default', 'error']), render: () => <Panel><div className="story-row"><AtlasTextarea label="执行说明" hint="说明目标和约束"/><AtlasTextarea label="审批原因" error="审批原因不能为空"/></div></Panel> }

export const Checkbox: Story = { parameters: matrix('AtlasCheckbox', ['checked', 'unchecked', 'indeterminate', 'disabled']), render: () => { const [checked, setChecked] = useState(true); return <Panel><div className="story-row"><AtlasCheckbox checked={checked} onChange={setChecked} label="记录审计"/><AtlasCheckbox checked={false} indeterminate onChange={() => {}} label="选择部分"/><AtlasCheckbox checked={false} disabled onChange={() => {}} label="不可用"/></div></Panel> }, play: async ({ canvasElement }) => { const checkbox = within(canvasElement).getByRole('checkbox', { name: '记录审计' }); await userEvent.click(checkbox); await expect(checkbox).not.toBeChecked() } }
export const RadioGroup: Story = { parameters: matrix('AtlasRadioGroup', ['selected', 'disabled-option']), render: () => { const [value, setValue] = useState('standard'); return <Panel><AtlasRadioGroup label="页面密度" options={options} value={value} onChange={setValue}/></Panel> } }
export const Switch: Story = { parameters: matrix('AtlasSwitch', ['on', 'off', 'disabled']), render: () => { const [checked, setChecked] = useState(true); return <Panel><div className="story-row"><AtlasSwitch checked={checked} onChange={setChecked} label="启用审批"/><AtlasSwitch checked={false} disabled onChange={() => {}} label="策略锁定"/></div></Panel> }, play: async ({ canvasElement }) => { const toggle = within(canvasElement).getByRole('switch', { name: '启用审批' }); await userEvent.click(toggle); await expect(toggle).toHaveAttribute('aria-checked', 'false') } }
export const DateInput: Story = { parameters: matrix('AtlasDateInput', ['empty', 'value', 'error']), render: () => <Panel><div className="story-row"><AtlasDateInput label="开始日期"/><AtlasDateInput label="结束日期" defaultValue="2026-08-11"/><AtlasDateInput label="交付日期" error="不能早于今天"/></div></Panel> }
export const SearchInput: Story = { parameters: matrix('AtlasSearchInput', ['empty', 'typing', 'submitted']), render: () => { const [value, setValue] = useState(''); const [result, setResult] = useState(''); return <Panel><AtlasSearchInput value={value} onChange={setValue} onSearch={setResult}/><output aria-live="polite">{result}</output></Panel> }, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.type(canvas.getByRole('searchbox'), 'Atlas'); await userEvent.keyboard('{Enter}'); await expect(canvas.getByText('Atlas')).toBeInTheDocument() } }
export const SegmentedControl: Story = { parameters: matrix('AtlasSegmentedControl', ['compact', 'standard', 'comfortable']), render: () => { const [value, setValue] = useState('standard'); return <Panel><AtlasSegmentedControl label="页面密度" items={options} value={value} onChange={setValue}/></Panel> } }

export const Card: Story = { parameters: matrix('AtlasCard', ['default', 'selected', 'actions']), render: () => <div className="story-grid"><AtlasCard title="经营分析" description="实时指标与趋势">内容区域</AtlasCard><AtlasCard selected title="智能审阅" description="已选中">内容区域</AtlasCard></div> }
export const Tabs: Story = { parameters: matrix('AtlasTabs', ['active', 'count', 'disabled']), render: () => { const [value, setValue] = useState('all'); return <Panel><AtlasTabs value={value} onChange={setValue} items={[{ id: 'all', label: '全部', count: 28 }, { id: 'running', label: '运行中', count: 8 }, { id: 'archived', label: '已归档', disabled: true }]}/></Panel> }, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('tab', { name: /运行中/ })); await expect(canvas.getByRole('tab', { name: /运行中/ })).toHaveAttribute('aria-selected', 'true') } }
export const Breadcrumb: Story = { parameters: matrix('AtlasBreadcrumb', ['link', 'current']), render: () => <Panel><AtlasBreadcrumb items={[{ label: '工作台', href: '#/' }, { label: '任务中心', href: '#/tasks' }, { label: 'AT-1048' }]}/></Panel> }
export const Pagination: Story = { parameters: matrix('AtlasPagination', ['first', 'middle', 'last']), render: () => { const [page, setPage] = useState(3); return <Panel><AtlasPagination page={page} pageCount={8} onChange={setPage}/></Panel> }, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: '下一页' })); await expect(canvas.getByRole('button', { name: '4' })).toHaveAttribute('aria-current', 'page') } }
export const Steps: Story = { parameters: matrix('AtlasSteps', ['completed', 'current', 'pending', 'error']), render: () => <Panel><AtlasSteps items={[{ id: '1', title: '创建任务', status: 'completed' }, { id: '2', title: '配置规则', status: 'current' }, { id: '3', title: '验证结果', status: 'pending' }, { id: '4', title: '发布', status: 'error' }]}/></Panel> }
export const Dropdown: Story = { parameters: matrix('AtlasDropdown', ['closed', 'open', 'disabled', 'danger']), render: () => <Panel><AtlasDropdown label="更多操作" items={[{ id: 'copy', label: '复制' }, { id: 'archive', label: '归档', disabled: true }, { id: 'delete', label: '删除', danger: true }]} onSelect={() => {}}/></Panel> }

interface Row { id: string; task: string; owner: string; status: '运行中' | '待复核' | '已完成'; updated: string }
const columns: AtlasTableColumn<Row>[] = [
  { key: 'id', title: '编号', width: 132, sortable: true },
  { key: 'task', title: '任务名称', width: '36%', sortable: true, render: (row) => <AtlasObjectCell title={row.task} meta={row.id} icon={<FileText/>} tone={row.status === '已完成' ? 'success' : 'primary'}/> },
  { key: 'owner', title: '负责人' },
  { key: 'status', title: '状态', width: 104, render: (row) => <AtlasStatusTag tone={row.status === '待复核' ? 'warning' : row.status === '已完成' ? 'success' : 'primary'}>{row.status}</AtlasStatusTag> },
  { key: 'updated', title: '更新时间' }
]
const rows: Row[] = [
  { id: 'AT-1048', task: '内容质量检查', owner: '王六', status: '运行中', updated: '10 分钟前' },
  { id: 'AT-1047', task: '知识索引更新', owner: '林可', status: '待复核', updated: '35 分钟前' },
  { id: 'AT-1046', task: '数据异常识别', owner: '陈默', status: '已完成', updated: '1 小时前' },
  { id: 'AT-1045', task: '周报摘要生成', owner: '李宁', status: '已完成', updated: '2 小时前' }
]
export const Table: Story = { parameters: matrix('AtlasTable', ['data', 'hover', 'selected', 'sorted', 'empty', 'loading']), render: () => { const [selected, setSelected] = useState<Array<string | number>>(['AT-1048']); const [sort, setSort] = useState<{ key: keyof Row | string; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' }); return <Panel><AtlasTable caption="任务列表" columns={columns} rows={rows} selectedIds={selected} onSelect={setSelected} sortKey={sort.key} sortDirection={sort.direction} onSort={(key, direction) => setSort({ key, direction })}/></Panel> } }
export const ObjectCell: Story = { parameters: matrix('AtlasObjectCell', ['default', 'interactive', 'disabled']), render: () => <Panel><div className="story-row"><AtlasObjectCell title="内容质量检查" meta="AT-1048" icon={<FileText/>} tone="primary"/><AtlasObjectCell title="数据异常识别" meta="AT-1046" description="最近更新 1 小时前" icon={<Filter/>} tone="success" interactive/></div></Panel> }
export const StatusTag: Story = { parameters: matrix('AtlasStatusTag', ['neutral', 'primary', 'info', 'success', 'warning', 'danger']), render: () => <Panel><div className="story-row">{(['neutral', 'primary', 'info', 'success', 'warning', 'danger'] as const).map((tone) => <AtlasStatusTag key={tone} tone={tone}>{tone}</AtlasStatusTag>)}</div></Panel> }
export const RowActions: Story = { parameters: matrix('AtlasRowActions', ['default', 'disabled', 'danger', 'overflow']), render: () => <Panel><AtlasRowActions items={[{ id: 'view', label: '查看', icon: <Eye/> }, { id: 'edit', label: '编辑', icon: <Pencil/> }, { id: 'delete', label: '删除', icon: <Trash2/>, danger: true }, { id: 'more', label: '更多', icon: <MoreHorizontal/> }]} onAction={() => {}}/></Panel> }
export const TableToolbar: Story = { parameters: matrix('AtlasTableToolbar', ['default', 'filtered', 'selection', 'disabled']), render: () => <Panel><AtlasTableToolbar search={<AtlasSearchInput value="" onChange={() => {}} onSearch={() => {}} placeholder="筛选任务"/>} filters={<AtlasButton><Filter size={16}/>筛选</AtlasButton>} selection={<span>已选 1 项</span>} actions={<AtlasButton intent="primary"><Plus size={16}/>新建</AtlasButton>}/></Panel> }
export const DataTable: Story = { parameters: matrix('AtlasDataTable', ['data', 'filtered', 'selection', 'empty', 'loading']), render: () => { const [selected, setSelected] = useState<Array<string | number>>(['AT-1048']); return <Panel><AtlasDataTable title="任务执行排名" description="实时数据" caption="任务列表" columns={columns} rows={rows} selectedIds={selected} onSelect={setSelected} toolbar={<AtlasTableToolbar search={<AtlasSearchInput value="" onChange={() => {}} onSearch={() => {}} placeholder="筛选任务"/>} actions={<AtlasButton intent="primary"><Plus size={16}/>新建</AtlasButton>}/>} footer={<><span>已选择 {selected.length} 项</span><span>1-4 / 128</span></>}/></Panel> } }
export const PageHeader: Story = { parameters: matrix('AtlasPageHeader', ['default', 'description', 'breadcrumbs', 'actions']), render: () => <Panel><AtlasPageHeader title="任务中心" description="统一查看、筛选和处理企业智能任务。" breadcrumbs={[{ label: '工作台', href: '#/' }, { label: '任务中心' }]} actions={<><AtlasButton>刷新</AtlasButton><AtlasButton intent="primary"><Plus size={16}/>新建任务</AtlasButton></>}/></Panel> }
export const PanelStory: Story = { name: 'Panel', parameters: matrix('AtlasPanel', ['default', 'header', 'actions', 'footer']), render: () => <AtlasPanel title="运行概览" description="最近 24 小时" actions={<AtlasButton size="compact">查看详情</AtlasButton>} footer={<AtlasButton intent="primary">确认</AtlasButton>}><div className="story-row"><AtlasStatistic label="运行任务" value="1,284" trend="up" trendLabel="+12.4%"/><AtlasStatistic label="成功率" value="98.7" suffix="%"/></div></AtlasPanel> }
export const Tag: Story = { parameters: matrix('AtlasTag', ['neutral', 'primary', 'success', 'warning', 'danger', 'removable']), render: () => <Panel><div className="story-row">{(['neutral', 'primary', 'success', 'warning', 'danger'] as const).map((intent) => <AtlasTag key={intent} intent={intent}>{intent}</AtlasTag>)}<AtlasTag removable>可移除</AtlasTag></div></Panel> }
export const Badge: Story = { parameters: matrix('AtlasBadge', ['count', 'dot', 'overflow']), render: () => <Panel><div className="story-row"><AtlasBadge count={8}><AtlasButton>待办</AtlasButton></AtlasBadge><AtlasBadge dot intent="warning"><AtlasButton>告警</AtlasButton></AtlasBadge><AtlasBadge count={128}><AtlasButton>消息</AtlasButton></AtlasBadge></div></Panel> }
export const Avatar: Story = { parameters: matrix('AtlasAvatar', ['initials', 'image', 'sizes']), render: () => <Panel><div className="story-row"><AtlasAvatar name="王六"/><AtlasAvatar name="Atlas Admin" size={40}/><AtlasAvatar name="林可" size={48}/></div></Panel> }
export const Statistic: Story = { parameters: matrix('AtlasStatistic', ['up', 'down', 'flat']), render: () => <div className="story-grid"><AtlasStatistic label="运行任务" value="1,284" trend="up" trendLabel="+12.4%"/><AtlasStatistic label="异常" value="17" trend="down" trendLabel="-3"/><AtlasStatistic label="成功率" value="98.7" suffix="%" trend="flat"/></div> }
export const Progress: Story = { parameters: matrix('AtlasProgress', ['primary', 'success', 'warning', 'danger']), render: () => <Panel><div className="story-stack"><AtlasProgress value={68} label="任务完成度"/><AtlasProgress value={100} label="发布完成" intent="success"/><AtlasProgress value={82} label="预算使用" intent="warning"/><AtlasProgress value={96} label="容量告警" intent="danger"/></div></Panel> }
export const Alert: Story = { parameters: matrix('AtlasAlert', ['info', 'success', 'warning', 'danger', 'closable']), render: () => <Panel><div className="story-stack"><AtlasAlert title="同步任务已开始"/><AtlasAlert title="发布完成" intent="success"/><AtlasAlert title="预算接近阈值" intent="warning"/><AtlasAlert title="跨租户访问已拦截" intent="danger" closable/></div></Panel> }
export const Tooltip: Story = { parameters: matrix('AtlasTooltip', ['hover', 'focus']), render: () => <Panel><AtlasTooltip content="由 Atlas Reasoner 生成"><AtlasButton aria-label="查看 AI 说明">AI</AtlasButton></AtlasTooltip></Panel> }
export const Empty: Story = { parameters: matrix('AtlasEmpty', ['without-action', 'with-action']), render: () => <Panel><AtlasEmpty title="暂无任务" description="调整筛选条件或创建新任务。" action={<AtlasButton intent="primary">新建任务</AtlasButton>}/></Panel> }
export const Skeleton: Story = { parameters: matrix('AtlasSkeleton', ['one-line', 'multi-line']), render: () => <Panel><div className="story-stack"><AtlasSkeleton lines={1}/><AtlasSkeleton lines={4}/></div></Panel> }
export const Dialog: Story = { parameters: matrix('AtlasDialog', ['closed', 'open', 'escape']), render: () => { const [open, setOpen] = useState(false); return <Panel><AtlasButton onClick={() => setOpen(true)}>打开对话框</AtlasButton><AtlasDialog open={open} title="确认发布" onClose={() => setOpen(false)} footer={<AtlasButton intent="primary">确认</AtlasButton>}>发布后将生成审计记录。</AtlasDialog></Panel> } }
export const Drawer: Story = { parameters: matrix('AtlasDrawer', ['closed', 'open', 'mask-close']), render: () => { const [open, setOpen] = useState(false); return <Panel><AtlasButton onClick={() => setOpen(true)}>查看详情</AtlasButton><AtlasDrawer open={open} title="任务详情" onClose={() => setOpen(false)}>AT-1048 · 内容质量检查</AtlasDrawer></Panel> } }

interface OrbStoryArgs { state: 'idle' | 'thinking' | 'running' | 'error'; size: number; showRing: boolean; label: string }
export const Orb: StoryObj<OrbStoryArgs> = {
  args: { state: 'thinking', size: 132, showRing: true, label: 'Atlas AI' },
  argTypes: {
    state: { control: 'inline-radio', options: ['idle', 'thinking', 'running', 'error'] },
    size: { control: { type: 'range', min: 48, max: 220, step: 4 } },
    showRing: { control: 'boolean' },
    label: { control: 'text' }
  },
  parameters: matrix('AtlasOrb', ['idle', 'thinking', 'running', 'error', 'without-ring']),
  render: (args) => <Panel><div className="story-control"><AtlasOrb {...args}/><span className="story-control-copy"><strong>Living Intelligence Core</strong>轨道约束、呼吸形变、液态碰撞与状态色共同表达 AI 运行状态。</span></div><div className="story-row">{(['idle', 'thinking', 'running', 'error'] as const).map((state) => <AtlasOrb key={state} state={state} size={72}/>)}</div></Panel>
}

interface ComposerStoryArgs { placeholder: string; busy: boolean; contexts: string[]; suggestions: string[] }
export const AIComposer: StoryObj<ComposerStoryArgs> = {
  args: { placeholder: '描述目标、输出形式和约束条件...', busy: false, contexts: ['客户 AC-1048', '近 30 天'], suggestions: ['分析风险', '生成摘要'] },
  argTypes: {
    placeholder: { control: 'text' },
    busy: { control: 'boolean' },
    contexts: { control: 'object' },
    suggestions: { control: 'object' }
  },
  parameters: matrix('AtlasAIComposer', ['empty', 'context', 'suggestion', 'busy']),
  render: (args) => <Panel><AtlasAIComposer {...args} onSubmit={() => {}}/></Panel>
}
export const ExecutionPlan: Story = { parameters: matrix('AtlasExecutionPlan', ['pending', 'running', 'completed', 'failed', 'approval']), render: () => <Panel><AtlasExecutionPlan onStop={() => {}} steps={[{ id: '1', title: '读取授权数据', status: 'completed' }, { id: '2', title: '生成变更方案', status: 'running' }, { id: '3', title: '写入业务系统', status: 'approval' }, { id: '4', title: '验证结果', status: 'pending' }, { id: '5', title: '异常恢复', status: 'failed' }]}/></Panel> }

const citations = [{ id: 'c1', title: '企业权限策略 v2.8', source: '知识库', excerpt: '高风险写入必须经过人工审批。', confidence: .96 }]
const sources = [{ id: 's1', name: '产品文档', type: 'document' as const, status: 'ready' as const, count: 286, scope: '当前租户' }, { id: 's2', name: '客户数据仓库', type: 'database' as const, status: 'syncing' as const, count: 12840, scope: '授权字段' }]
const servers = [{ id: 'm1', name: 'Atlas Page Tools', status: 'connected' as const, toolCount: 12, transport: 'webmcp' as const }, { id: 'm2', name: 'Java Audit', status: 'connected' as const, toolCount: 6, transport: 'http' as const }]
const retrieval = [{ id: 'r1', title: '理解查询与租户范围', status: 'completed' as const, durationMs: 18 }, { id: 'r2', title: '混合检索 286 个文档', status: 'completed' as const, durationMs: 84 }, { id: 'r3', title: '权限过滤与重排', status: 'running' as const }]

export const AIConversation: Story = { parameters: matrix('AtlasAIConversation', ['history', 'streaming', 'composer', 'error']), render: () => <div style={{ width: 880 }}><AtlasAIConversation title="Atlas Reasoner" subtitle="企业知识与执行助手" status="thinking" history={<AtlasAIConversationHistory items={[{ id: 'h1', title: '分析高风险任务', preview: '发现 3 项临期任务', updatedAt: '10:42' }]} activeId="h1" onSelect={() => {}} onCreate={() => {}}/>} composer={<AtlasAIComposer suggestions={['查看依据', '生成行动项']} onSubmit={() => {}}/>}><AtlasAIMessageBubble role="user" content="分析本周高风险任务"/><AtlasAIMessageBubble role="assistant" streaming citations={citations} content={<AtlasAIStreamingText text="发现 3 项临期任务，其中 1 项需要人工审批。"/>}/></AtlasAIConversation></div> }
export const AIMessageBubble: Story = { parameters: matrix('AtlasAIMessageBubble', ['user', 'assistant', 'system', 'tool', 'streaming']), render: () => <Panel><AtlasAIMessageBubble role="assistant" name="Atlas Reasoner" content="已完成授权范围内的检索。" citations={citations}/></Panel> }
export const AIStreamingText: Story = { parameters: matrix('AtlasAIStreamingText', ['streaming', 'complete', 'stopped', 'error']), render: () => <Panel><div className="story-stack"><AtlasAIStreamingText text="正在综合检索结果"/><AtlasAIStreamingText text="生成完成" status="complete"/><AtlasAIStreamingText text="Provider 响应异常" status="error"/></div></Panel> }
export const AIPrompts: Story = { parameters: matrix('AtlasAIPrompts', ['default', 'category', 'description']), render: () => <Panel><AtlasAIPrompts items={[{ id: '1', label: '分析异常原因', category: '分析', description: '结合近 30 天指标' }, { id: '2', label: '生成行动清单', category: '执行', description: '保留人工确认' }]} onSelect={() => {}}/></Panel> }
export const AIAttachmentList: Story = { parameters: matrix('AtlasAIAttachmentList', ['ready', 'uploading', 'failed', 'removable']), render: () => <Panel><AtlasAIAttachmentList items={[{ id: 'a1', name: '经营报告.pdf', mediaType: 'application/pdf', size: 840000 }, { id: 'a2', name: '数据字典.xlsx', mediaType: 'application/xlsx', status: 'uploading' }, { id: 'a3', name: '异常日志.txt', mediaType: 'text/plain', status: 'failed' }]} onRemove={() => {}} onRetry={() => {}}/></Panel> }
export const AIConversationHistory: Story = { parameters: matrix('AtlasAIConversationHistory', ['active', 'pinned', 'preview', 'create']), render: () => <Panel><AtlasAIConversationHistory activeId="h1" onSelect={() => {}} onCreate={() => {}} items={[{ id: 'h1', title: '分析高风险任务', preview: '3 项需要关注', updatedAt: '10:42', pinned: true }, { id: 'h2', title: '周报摘要', preview: '已生成草稿', updatedAt: '昨天' }]}/></Panel> }
export const AIFeedback: Story = { parameters: matrix('AtlasAIFeedback', ['empty', 'helpful', 'unhelpful', 'report']), render: () => { const [value, setValue] = useState<'helpful' | 'unhelpful' | null>(null); return <Panel><AtlasAIFeedback value={value} onChange={setValue} onReport={() => {}}/></Panel> } }
export const MCPServerPicker: Story = { parameters: matrix('AtlasMCPServerPicker', ['connected', 'disconnected', 'selected', 'transport']), render: () => { const [selected, setSelected] = useState(['m1']); return <Panel><AtlasMCPServerPicker servers={servers} selectedIds={selected} onChange={setSelected} onAdd={() => {}}/></Panel> } }
export const CitationList: Story = { parameters: matrix('AtlasCitationList', ['source', 'excerpt', 'confidence', 'interactive']), render: () => <Panel><AtlasCitationList items={citations} onOpen={() => {}}/></Panel> }
export const KnowledgeSourcePicker: Story = { parameters: matrix('AtlasKnowledgeSourcePicker', ['ready', 'syncing', 'error', 'selected']), render: () => { const [selected, setSelected] = useState(['s1']); return <Panel><AtlasKnowledgeSourcePicker sources={sources} selectedIds={selected} onChange={setSelected}/></Panel> } }
export const RetrievalTrace: Story = { parameters: matrix('AtlasRetrievalTrace', ['pending', 'running', 'completed', 'failed']), render: () => <Panel><AtlasRetrievalTrace steps={retrieval}/></Panel> }
export const ToolCallCard: Story = { parameters: matrix('AtlasToolCallCard', ['queued', 'running', 'approval', 'completed', 'failed']), render: () => <Panel><AtlasToolCallCard call={{ id: 't1', name: 'records.publish', description: '将 12 条变更写入业务系统', permission: 'high-risk', status: 'approval', input: { records: 12 } }} onApprove={() => {}} onReject={() => {}}/></Panel> }

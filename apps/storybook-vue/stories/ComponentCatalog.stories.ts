import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import {
  AtlasAIComposer, AtlasAlert, AtlasAvatar, AtlasBadge, AtlasBreadcrumb, AtlasButton, AtlasCard,
  AtlasCheckbox, AtlasDateInput, AtlasDialog, AtlasDrawer, AtlasDropdown, AtlasEmpty,
  AtlasExecutionPlan, AtlasInput, AtlasOrb, AtlasPagination, AtlasProgress, AtlasRadioGroup,
  AtlasSearchInput, AtlasSegmentedControl, AtlasSelect, AtlasSkeleton, AtlasStatistic, AtlasSteps,
  AtlasSwitch, AtlasTable, AtlasTabs, AtlasTag, AtlasTextarea, AtlasTooltip
} from '@atlas-eids/vue'

const meta = { title: 'Vue/组件状态矩阵', parameters: { layout: 'centered' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const components = { AtlasAIComposer, AtlasAlert, AtlasAvatar, AtlasBadge, AtlasBreadcrumb, AtlasButton, AtlasCard, AtlasCheckbox, AtlasDateInput, AtlasDialog, AtlasDrawer, AtlasDropdown, AtlasEmpty, AtlasExecutionPlan, AtlasInput, AtlasOrb, AtlasPagination, AtlasProgress, AtlasRadioGroup, AtlasSearchInput, AtlasSegmentedControl, AtlasSelect, AtlasSkeleton, AtlasStatistic, AtlasSteps, AtlasSwitch, AtlasTable, AtlasTabs, AtlasTag, AtlasTextarea, AtlasTooltip }
const options = [{ label: '标准', value: 'standard' }, { label: '紧凑', value: 'compact' }, { label: '舒适', value: 'comfortable', disabled: true }]
const rows = [{ id: 'AT-1048', task: '内容质量检查', owner: '王六' }, { id: 'AT-1047', task: '知识索引更新', owner: '林可' }]
const columns = [{ key: 'id', title: '编号' }, { key: 'task', title: '任务' }, { key: 'owner', title: '负责人' }]
const make = (component: string, states: string[], template: string): Story => ({
  parameters: { atlas: { component, states } },
  render: () => ({
    components,
    setup() {
      return { checked: ref(true), value: ref('standard'), page: ref(3), open: ref(false), query: ref(''), selected: ref([]), options, rows, columns }
    },
    template: `<section class="story-panel" style="min-width:620px">${template}</section>`
  })
})

export const Button = make('AtlasButton', ['neutral', 'primary', 'danger', 'loading', 'disabled'], `<div class="story-row"><AtlasButton>次要操作</AtlasButton><AtlasButton intent="primary">主要操作</AtlasButton><AtlasButton intent="danger">危险操作</AtlasButton><AtlasButton loading>提交中</AtlasButton><AtlasButton disabled>不可用</AtlasButton></div>`)
Button.play = async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: '主要操作' })); await expect(canvas.getByRole('button', { name: '不可用' })).toBeDisabled() }
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
export const Table = make('AtlasTable', ['data', 'selected', 'empty'], `<AtlasTable v-model:selected-ids="selected" caption="任务列表" :columns="columns" :rows="rows" selectable/>`)
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
export const Orb = make('AtlasOrb', ['idle', 'thinking', 'running', 'error', 'without-ring'], `<div class="story-row"><AtlasOrb state="idle" :size="80"/><AtlasOrb state="thinking" :size="80"/><AtlasOrb state="running" :size="80"/><AtlasOrb state="error" :size="80"/><AtlasOrb :size="80" :show-ring="false"/></div>`)
export const AIComposer = make('AtlasAIComposer', ['empty', 'context', 'suggestion', 'busy'], `<AtlasAIComposer v-model="query" :contexts="['客户 AC-1048','近 30 天']" :suggestions="['分析风险','生成摘要']"/>`)
export const ExecutionPlan = make('AtlasExecutionPlan', ['pending', 'running', 'completed', 'failed', 'approval'], `<AtlasExecutionPlan stoppable :steps="[{id:'1',title:'读取授权数据',status:'completed'},{id:'2',title:'生成变更方案',status:'running'},{id:'3',title:'写入业务系统',status:'approval'},{id:'4',title:'验证结果',status:'pending'},{id:'5',title:'异常恢复',status:'failed'}]"/>`)

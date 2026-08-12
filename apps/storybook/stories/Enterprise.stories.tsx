import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AtlasAlert, AtlasButton, AtlasCard, AtlasCheckbox, AtlasInput, AtlasPagination, AtlasProgress, AtlasRadioGroup, AtlasSelect, AtlasStatistic, AtlasSwitch, AtlasTable, AtlasTag, type AtlasTableColumn } from '@atlas-eids/react'

const meta = { title: 'React/企业核心组件', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Controls: Story = { render: () => {
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState('standard')
  const [page, setPage] = useState(2)
  return <div className="story-stack"><section className="story-panel"><h2>操作与输入</h2><div className="story-row"><AtlasButton>次要操作</AtlasButton><AtlasButton intent="primary">主要操作</AtlasButton><AtlasButton intent="danger">危险操作</AtlasButton><AtlasInput label="任务名称" defaultValue="知识库同步"/><AtlasSelect label="所属空间" options={[{ label: '数据运营', value: 'ops' }, { label: '客户成功', value: 'cs' }]}/></div></section><section className="story-panel"><h2>选择与导航</h2><div className="story-row"><AtlasCheckbox checked={checked} onChange={setChecked} label="记录审计日志"/><AtlasSwitch checked={checked} onChange={setChecked} label="启用审批"/><AtlasRadioGroup label="页面密度" value={radio} onChange={setRadio} options={[{ label: '紧凑', value: 'compact' }, { label: '标准', value: 'standard' }]}/><AtlasPagination page={page} pageCount={6} onChange={setPage}/></div></section></div>
} }

interface Row { id: string; task: string; owner: string; status: string }
const rows: Row[] = [{ id: 'AT-1048', task: '内容质量检查', owner: '王六', status: '运行中' }, { id: 'AT-1047', task: '知识索引更新', owner: '林可', status: '待复核' }]
const columns: AtlasTableColumn<Row>[] = [{ key: 'id', title: '编号' }, { key: 'task', title: '任务' }, { key: 'owner', title: '责任人' }, { key: 'status', title: '状态', render: (row) => <AtlasTag intent={row.status === '运行中' ? 'success' : 'warning'}>{row.status}</AtlasTag> }]
export const DataDisplay: Story = { render: () => <div className="story-stack"><div className="story-grid"><AtlasCard title="今日待办"><AtlasStatistic label="待处理" value={18} trend="down" trendLabel="较昨日 3 项"/></AtlasCard><AtlasCard title="AI 协同率"><AtlasProgress label="任务覆盖" value={68}/></AtlasCard><AtlasCard title="系统状态"><AtlasAlert title="服务运行正常" intent="success"/></AtlasCard></div><section className="story-panel"><AtlasTable caption="任务列表" rows={rows} columns={columns}/></section></div> }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { AtlasAntdButton, AtlasAntdForm, AtlasAntdInput, AtlasAntdProvider, AtlasAntdSelect, AtlasAntdTable } from '@atlas-eids/adapter-antd-react'

const meta = { title: 'Adapters/Ant Design 运行时', parameters: { layout: 'centered' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const RuntimeWrapper: Story = { render: () => <AtlasAntdProvider><div className="story-stack"><section className="story-panel"><h2>Atlas 语义，Ant Design 运行时</h2><AtlasAntdForm><div className="story-row"><AtlasAntdInput placeholder="输入任务名称"/><AtlasAntdSelect style={{ width: 180 }} defaultValue="running" options={[{ label: '运行中', value: 'running' }, { label: '待复核', value: 'review' }]}/><AtlasAntdButton>取消</AtlasAntdButton><AtlasAntdButton intent="primary">提交</AtlasAntdButton></div></AtlasAntdForm></section><section className="story-panel"><AtlasAntdTable rowKey="id" pagination={false} dataSource={[{ id: 1, task: '内容质量检查', status: '运行中' }]} columns={[{ title: '任务', dataIndex: 'task' }, { title: '状态', dataIndex: 'status' }]}/></section></div></AtlasAntdProvider> }

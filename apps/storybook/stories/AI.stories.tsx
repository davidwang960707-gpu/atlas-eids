import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AtlasAIComposer, AtlasExecutionPlan, AtlasOrb, AtlasTag, type AtlasExecutionStep } from '@atlas-eids/react'

const meta = { title: 'React/AI 原生组件', parameters: { layout: 'centered' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const LivingOrb: Story = { render: () => <div className="story-stack"><section className="story-panel"><h2>状态不是装饰</h2><div className="story-row">{(['idle', 'thinking', 'running', 'error'] as const).map((state) => <div key={state} style={{ display: 'grid', justifyItems: 'center', gap: 10 }}><AtlasOrb state={state} size={92}/><AtlasTag intent={state === 'error' ? 'danger' : state === 'running' ? 'success' : 'primary'}>{state}</AtlasTag></div>)}</div></section></div> }

export const ComposerAndPlan: Story = { render: () => {
  const [busy, setBusy] = useState(false)
  const [steps, setSteps] = useState<AtlasExecutionStep[]>([{ id: '1', title: '读取经营指标', status: 'completed' }, { id: '2', title: '识别异常原因', status: 'running' }, { id: '3', title: '写入周报', status: 'approval' }])
  return <div className="story-stack"><AtlasAIComposer busy={busy} contexts={['华东区经营数据']} suggestions={['分析异常', '生成清单']} onSubmit={() => { setBusy(true); window.setTimeout(() => setBusy(false), 500) }}/><AtlasExecutionPlan steps={steps} onApprove={(id) => setSteps(steps.map((step) => step.id === id ? { ...step, status: 'completed' } : step))}/></div>
} }

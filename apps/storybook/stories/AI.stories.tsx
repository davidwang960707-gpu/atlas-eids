import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AtlasAIComposer, AtlasExecutionPlan, AtlasOrb, AtlasTag, type AtlasExecutionStep } from '@atlas-eids/react'

const meta = { title: 'React/AI 原生组件', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

interface OrbStoryArgs { state: 'idle' | 'thinking' | 'running' | 'error'; size: number; showRing: boolean }
export const LivingOrb: StoryObj<OrbStoryArgs> = {
  args: { state: 'thinking', size: 148, showRing: true },
  argTypes: { state: { control: 'inline-radio', options: ['idle', 'thinking', 'running', 'error'] }, size: { control: { type: 'range', min: 64, max: 240, step: 4 } }, showRing: { control: 'boolean' } },
  render: (args) => <div className="story-stack"><section className="story-panel"><h2>状态不是装饰</h2><div className="story-control"><AtlasOrb {...args}/><span className="story-control-copy"><strong>Atlas Living Orb</strong>仅在 AI 身份、思考、执行与异常状态中使用。</span></div><div className="story-row">{(['idle', 'thinking', 'running', 'error'] as const).map((state) => <div key={state} style={{ display: 'grid', justifyItems: 'center', gap: 10 }}><AtlasOrb state={state} size={76}/><AtlasTag intent={state === 'error' ? 'danger' : state === 'running' ? 'success' : 'primary'}>{state}</AtlasTag></div>)}</div></section></div>
}

interface ComposerStoryArgs { placeholder: string; contexts: string[]; suggestions: string[] }
export const ComposerAndPlan: StoryObj<ComposerStoryArgs> = {
  args: { placeholder: '描述目标、输出形式和约束条件...', contexts: ['华东区经营数据'], suggestions: ['分析异常', '生成清单'] },
  argTypes: { placeholder: { control: 'text' }, contexts: { control: 'object' }, suggestions: { control: 'object' } },
  render: (args) => {
  const [busy, setBusy] = useState(false)
  const [steps, setSteps] = useState<AtlasExecutionStep[]>([{ id: '1', title: '读取经营指标', status: 'completed' }, { id: '2', title: '识别异常原因', status: 'running' }, { id: '3', title: '写入周报', status: 'approval' }])
  return <div className="story-stack"><AtlasAIComposer {...args} busy={busy} onSubmit={() => { setBusy(true); window.setTimeout(() => setBusy(false), 500) }}/><AtlasExecutionPlan steps={steps} onApprove={(id) => setSteps(steps.map((step) => step.id === id ? { ...step, status: 'completed' } : step))}/></div>
} }

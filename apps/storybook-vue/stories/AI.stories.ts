import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AtlasAIComposer, AtlasExecutionPlan, AtlasOrb, AtlasTag } from '@atlas-eids/vue'

const meta = { title: 'Vue/AI 原生组件', parameters: { layout: 'centered' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const components = { AtlasAIComposer, AtlasExecutionPlan, AtlasOrb, AtlasTag }

export const LivingOrb: Story = {
  args: { state: 'thinking', size: 148, showRing: true },
  argTypes: { state: { control: 'inline-radio', options: ['idle', 'thinking', 'running', 'error'] }, size: { control: { type: 'range', min: 64, max: 240, step: 4 } }, showRing: { control: 'boolean' } },
  render: (args) => ({
    components,
    setup: () => ({ args, states: ['idle', 'thinking', 'running', 'error'] }),
    template: `<div class="story-stack"><section class="story-panel"><h2>状态不是装饰</h2><div class="story-control"><AtlasOrb :state="args.state" :size="args.size" :show-ring="args.showRing"/><span class="story-control-copy"><strong>Atlas Living Orb</strong>仅在 AI 身份、思考、执行与异常状态中使用。</span></div><div class="story-row"><div v-for="state in states" :key="state" style="display:grid;justify-items:center;gap:10px"><AtlasOrb :state="state" :size="76"/><AtlasTag :intent="state === 'error' ? 'danger' : state === 'running' ? 'success' : 'primary'">{{ state }}</AtlasTag></div></div></section></div>`
  })
}

export const ComposerAndPlan: Story = {
  args: { placeholder: '描述目标、输出形式和约束条件...', contexts: ['华东区经营数据'], suggestions: ['分析异常', '生成清单'] },
  argTypes: { placeholder: { control: 'text' }, contexts: { control: 'object' }, suggestions: { control: 'object' } },
  render: (args) => ({
    components,
    setup() {
      const prompt = ref('')
      const busy = ref(false)
      const steps = ref([{ id: '1', title: '读取经营指标', status: 'completed' }, { id: '2', title: '识别异常原因', status: 'running' }, { id: '3', title: '写入周报', status: 'approval' }])
      const submit = () => { busy.value = true; window.setTimeout(() => { busy.value = false }, 500) }
      const approve = (id: string) => { steps.value = steps.value.map((step) => step.id === id ? { ...step, status: 'completed' } : step) }
      return { args, prompt, busy, steps, submit, approve }
    },
    template: `<div class="story-stack"><AtlasAIComposer v-model="prompt" :placeholder="args.placeholder" :contexts="args.contexts" :suggestions="args.suggestions" :busy="busy" @submit="submit"/><AtlasExecutionPlan :steps="steps" @approve="approve"/></div>`
  })
}

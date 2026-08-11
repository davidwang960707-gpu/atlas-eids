import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { AtlasAlert, AtlasButton, AtlasInput, AtlasOrb, AtlasProgress, AtlasSelect, AtlasSwitch, AtlasTag } from '@atlas-eids/vue'

const meta = { title: 'Vue/企业与 AI 组件' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const RuntimeComponents: Story = {
  render: () => ({
    components: { AtlasAlert, AtlasButton, AtlasInput, AtlasOrb, AtlasProgress, AtlasSelect, AtlasSwitch, AtlasTag },
    setup() { const enabled = ref(true); return { enabled } },
    template: `<div class="story-stack"><section class="story-panel"><h2>操作与输入</h2><div class="story-row"><AtlasButton>次要操作</AtlasButton><AtlasButton intent="primary">主要操作</AtlasButton><AtlasInput label="任务名称" model-value="知识库同步"/><AtlasSelect label="所属空间" model-value="ops" :options="[{label:'数据运营',value:'ops'},{label:'客户成功',value:'cs'}]"/><AtlasSwitch v-model="enabled" label="记录审计日志"/></div></section><section class="story-panel"><h2>AI 状态与反馈</h2><div class="story-row"><AtlasOrb state="thinking" :size="92"/><AtlasProgress label="任务完成度" :value="68" style="width:260px"/><AtlasTag intent="success">运行中</AtlasTag></div><div style="margin-top:16px"><AtlasAlert title="服务运行正常" intent="success"/></div></section></div>`
  })
}

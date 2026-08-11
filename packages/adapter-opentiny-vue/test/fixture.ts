import { createApp, h } from 'vue'
import { AtlasTinyButton, AtlasTinyInput } from '../dist/index.js'

createApp({
  render: () => h('main', [h(AtlasTinyInput, { modelValue: 'Atlas EIDS' }), h(AtlasTinyButton, { intent: 'primary' }, () => '运行时 Wrapper')])
}).mount('#app')

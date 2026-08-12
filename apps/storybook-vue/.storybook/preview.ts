import type { Preview } from '@storybook/vue3-vite'
import { AtlasProvider } from '@atlas-eids/vue'
import '@atlas-eids/vue/styles.css'
import './preview.css'

const preview: Preview = {
  decorators: [(_, context) => ({ components: { AtlasProvider }, setup: () => ({ theme: context.globals.theme ?? 'light', density: context.globals.density ?? 'standard', locale: context.globals.locale ?? 'zh-CN' }), template: '<AtlasProvider :theme="theme" :density="density" :locale="locale"><div class="storybook-atlas"><story /></div></AtlasProvider>' })],
  globalTypes: {
    theme: { description: 'Atlas 主题', defaultValue: 'light', toolbar: { icon: 'paintbrush', items: ['light', 'dark'], dynamicTitle: true } },
    density: { description: 'Atlas 密度', defaultValue: 'standard', toolbar: { icon: 'component', items: ['compact', 'standard', 'comfortable'], dynamicTitle: true } },
    locale: { description: 'Atlas 语言', defaultValue: 'zh-CN', toolbar: { icon: 'globe', items: ['zh-CN', 'en-US'], dynamicTitle: true } }
  },
  parameters: { layout: 'fullscreen', controls: { expanded: true }, a11y: { test: 'error' }, backgrounds: { disable: true } },
  tags: ['autodocs']
}
export default preview

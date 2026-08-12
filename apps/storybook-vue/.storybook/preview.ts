import type { Preview } from '@storybook/vue3-vite'
import '@atlas-eids/vue/styles.css'
import './preview.css'

const preview: Preview = {
  decorators: [(_, context) => ({ setup: () => ({ theme: context.globals.theme ?? 'light' }), template: '<div class="storybook-atlas" :data-atlas-theme="theme"><story /></div>' })],
  globalTypes: { theme: { description: 'Atlas 主题', defaultValue: 'light', toolbar: { icon: 'paintbrush', items: ['light', 'dark'], dynamicTitle: true } } },
  parameters: { layout: 'centered', controls: { expanded: true }, a11y: { test: 'error' }, backgrounds: { disable: true } },
  tags: ['autodocs']
}
export default preview

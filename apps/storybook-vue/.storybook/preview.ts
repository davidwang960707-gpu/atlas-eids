import type { Preview } from '@storybook/vue3-vite'
import '@atlas-eids/vue/styles.css'
import './preview.css'

const preview: Preview = {
  decorators: [() => ({ template: '<div class="storybook-atlas" data-atlas-theme="light"><story /></div>' })],
  parameters: { layout: 'centered', controls: { expanded: true }, a11y: { test: 'error' }, backgrounds: { disable: true } },
  tags: ['autodocs']
}
export default preview

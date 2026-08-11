import type { Preview } from '@storybook/react-vite'
import { createElement } from 'react'
import '@atlas-eids/react/styles.css'
import './preview.css'

const preview: Preview = {
  decorators: [(Story, context) => createElement('div', { className: 'storybook-atlas', 'data-atlas-theme': context.globals.theme ?? 'light' }, createElement(Story))],
  globalTypes: { theme: { description: 'Atlas 主题', defaultValue: 'light', toolbar: { icon: 'paintbrush', items: ['light', 'dark'], dynamicTitle: true } } },
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    a11y: { test: 'error' },
    backgrounds: { disable: true }
  },
  tags: ['autodocs']
}

export default preview

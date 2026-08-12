import type { Preview } from '@storybook/react-vite'
import { createElement } from 'react'
import { AtlasProvider } from '@atlas-eids/react'
import '@atlas-eids/react/styles.css'
import './preview.css'

const preview: Preview = {
  decorators: [(Story, context) => createElement(AtlasProvider, { theme: context.globals.theme ?? 'light', density: context.globals.density ?? 'standard', locale: context.globals.locale ?? 'zh-CN' }, createElement('div', { className: 'storybook-atlas' }, createElement(Story)))],
  globalTypes: {
    theme: { description: 'Atlas 主题', defaultValue: 'light', toolbar: { icon: 'paintbrush', items: ['light', 'dark'], dynamicTitle: true } },
    density: { description: 'Atlas 密度', defaultValue: 'standard', toolbar: { icon: 'component', items: ['compact', 'standard', 'comfortable'], dynamicTitle: true } },
    locale: { description: 'Atlas 语言', defaultValue: 'zh-CN', toolbar: { icon: 'globe', items: ['zh-CN', 'en-US'], dynamicTitle: true } }
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    backgrounds: { disable: true }
  },
  tags: ['autodocs']
}

export default preview

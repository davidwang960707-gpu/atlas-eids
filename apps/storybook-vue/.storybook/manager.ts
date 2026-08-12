import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Atlas EIDS · Vue 3',
    brandUrl: '/',
    colorPrimary: '#7B61FF',
    colorSecondary: '#4F46E5',
    appBg: '#F3F5F8',
    appContentBg: '#FFFFFF',
    appPreviewBg: '#EEF1F5',
    appBorderColor: '#DDE1E8',
    appBorderRadius: 6,
    fontBase: 'Inter, "SF Pro Text", "PingFang SC", sans-serif',
    fontCode: '"SFMono-Regular", Consolas, monospace',
    textColor: '#1D2129',
    textInverseColor: '#FFFFFF',
    barTextColor: '#667085',
    barSelectedColor: '#4F46E5',
    barHoverColor: '#4F46E5',
    barBg: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputBorder: '#CBD1DC',
    inputTextColor: '#1D2129',
    inputBorderRadius: 5
  })
})

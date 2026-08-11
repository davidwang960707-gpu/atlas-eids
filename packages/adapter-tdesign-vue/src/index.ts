import { defineComponent, h, type App, type Component } from 'vue'
import { Button, Dialog, Drawer, Form, Input, Select, Table, Tabs } from 'tdesign-vue-next'

export const atlasTDesignVariables: Record<string, string> = {
  '--td-brand-color': '#4F46E5',
  '--td-brand-color-hover': '#4338CA',
  '--td-bg-color-page': '#F5F7FA',
  '--td-bg-color-container': '#FFFFFF',
  '--td-text-color-primary': '#1D2129',
  '--td-text-color-secondary': '#4E5969',
  '--td-component-border': '#E5E8EF',
  '--td-radius-default': '6px'
}

const runtimeWrapper = (name: string, component: Component, defaults: Record<string, unknown> = {}) => defineComponent({
  name,
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(component, { ...defaults, ...attrs }, slots)
  }
})

export const AtlasTButton = defineComponent({
  name: 'AtlasTButton',
  inheritAttrs: false,
  props: { intent: { type: String, default: 'neutral' } },
  setup(props, { attrs, slots }) {
    return () => h(Button, { theme: props.intent === 'danger' ? 'danger' : props.intent === 'primary' ? 'primary' : 'default', ...attrs }, slots)
  }
})
export const AtlasTInput = runtimeWrapper('AtlasTInput', Input)
export const AtlasTSelect = runtimeWrapper('AtlasTSelect', Select)
export const AtlasTTable = runtimeWrapper('AtlasTTable', Table, { rowKey: 'id' })
export const AtlasTDialog = runtimeWrapper('AtlasTDialog', Dialog)
export const AtlasTDrawer = runtimeWrapper('AtlasTDrawer', Drawer, { size: '420px' })
export const AtlasTTabs = runtimeWrapper('AtlasTTabs', Tabs)
export const AtlasTForm = runtimeWrapper('AtlasTForm', Form, { labelAlign: 'top' })

export const AtlasTDesign = {
  install(app: App) {
    const entries = { AtlasTButton, AtlasTInput, AtlasTSelect, AtlasTTable, AtlasTDialog, AtlasTDrawer, AtlasTTabs, AtlasTForm }
    Object.entries(entries).forEach(([name, component]) => app.component(name, component))
  }
}

export { Button as TButton, Input as TInput, Select as TSelect, Table as TTable, Dialog as TDialog, Drawer as TDrawer, Tabs as TTabs, Form as TForm }

import { defineComponent, h, type App, type Component } from 'vue'
import Button from '@opentiny/vue-button'
import DialogBox from '@opentiny/vue-dialog-box'
import Drawer from '@opentiny/vue-drawer'
import Form from '@opentiny/vue-form'
import Grid from '@opentiny/vue-grid'
import Input from '@opentiny/vue-input'
import Select from '@opentiny/vue-select'
import Tabs from '@opentiny/vue-tabs'

export const atlasOpenTinyVariables: Record<string, string> = {
  '--tv-base-color-brand': '#4F46E5',
  '--tv-base-color-brand-hover': '#4338CA',
  '--tv-base-color-bg-1': '#FFFFFF',
  '--tv-base-color-bg-2': '#F5F7FA',
  '--tv-base-color-text-1': '#1D2129',
  '--tv-base-color-text-2': '#4E5969',
  '--tv-base-color-border': '#E5E8EF',
  '--tv-base-border-radius': '6px'
}

const runtimeWrapper = (name: string, component: Component, defaults: Record<string, unknown> = {}) => defineComponent({
  name,
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(component, { ...defaults, ...attrs }, slots)
  }
})

export const AtlasTinyButton = defineComponent({
  name: 'AtlasTinyButton',
  inheritAttrs: false,
  props: { intent: { type: String, default: 'neutral' } },
  setup(props, { attrs, slots }) {
    return () => h(Button, { type: props.intent === 'danger' ? 'danger' : props.intent === 'primary' ? 'primary' : 'default', ...attrs }, slots)
  }
})
export const AtlasTinyInput = runtimeWrapper('AtlasTinyInput', Input)
export const AtlasTinySelect = runtimeWrapper('AtlasTinySelect', Select)
export const AtlasTinyGrid = runtimeWrapper('AtlasTinyGrid', Grid)
export const AtlasTinyDialog = runtimeWrapper('AtlasTinyDialog', DialogBox)
export const AtlasTinyDrawer = runtimeWrapper('AtlasTinyDrawer', Drawer, { width: '420px' })
export const AtlasTinyTabs = runtimeWrapper('AtlasTinyTabs', Tabs)
export const AtlasTinyForm = runtimeWrapper('AtlasTinyForm', Form, { labelPosition: 'top' })

export const AtlasOpenTiny = {
  install(app: App) {
    const entries = { AtlasTinyButton, AtlasTinyInput, AtlasTinySelect, AtlasTinyGrid, AtlasTinyDialog, AtlasTinyDrawer, AtlasTinyTabs, AtlasTinyForm }
    Object.entries(entries).forEach(([name, component]) => app.component(name, component))
  }
}

export { Button as TinyButton, Input as TinyInput, Select as TinySelect, Grid as TinyGrid, DialogBox as TinyDialog, Drawer as TinyDrawer, Tabs as TinyTabs, Form as TinyForm }

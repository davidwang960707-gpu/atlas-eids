import { defineAtlasPlugin, type AtlasComponentDescriptor, type AtlasPlugin } from '@atlas-eids/plugin-sdk'

export type AtlasAdapterId = 'antd' | 'tdesign' | 'opentiny'

export interface AtlasThirdPartyAdapter {
  id: AtlasAdapterId
  name: string
  framework: 'react' | 'vue'
  packageName: string
  tokenMap: Record<string, string>
  components: AtlasComponentDescriptor[]
}

const componentSet = (
  prefix: string,
  source: string,
  framework: 'react' | 'vue',
  names: Array<[string, AtlasComponentDescriptor['category']]>
) => names.map(([name, category]) => ({
  id: `${prefix}.${name.toLowerCase()}`,
  name,
  framework,
  source,
  exportName: name,
  category
}))

const commonComponents: Array<[string, AtlasComponentDescriptor['category']]> = [
  ['Button', 'foundation'],
  ['Input', 'foundation'],
  ['Select', 'foundation'],
  ['Form', 'foundation'],
  ['Table', 'data'],
  ['Tabs', 'navigation'],
  ['Dialog', 'feedback'],
  ['Drawer', 'feedback']
]

export const adapters: Record<AtlasAdapterId, AtlasThirdPartyAdapter> = {
  antd: {
    id: 'antd',
    name: 'Ant Design',
    framework: 'react',
    packageName: 'antd',
    tokenMap: {
      colorPrimary: 'color.action.primary',
      colorBgLayout: 'color.bg.canvas',
      colorBgContainer: 'color.bg.surface',
      colorText: 'color.text.primary',
      colorBorder: 'color.border.default',
      borderRadius: 'radius.control',
      controlHeight: 'control.height.default'
    },
    components: componentSet('antd', 'antd', 'react', commonComponents.map(([name, category]) => [name === 'Dialog' ? 'Modal' : name, category]))
  },
  tdesign: {
    id: 'tdesign',
    name: 'TDesign Vue Next',
    framework: 'vue',
    packageName: 'tdesign-vue-next',
    tokenMap: {
      '--td-brand-color': 'color.action.primary',
      '--td-bg-color-page': 'color.bg.canvas',
      '--td-bg-color-container': 'color.bg.surface',
      '--td-text-color-primary': 'color.text.primary',
      '--td-component-border': 'color.border.default',
      '--td-radius-default': 'radius.control'
    },
    components: componentSet('tdesign', 'tdesign-vue-next', 'vue', commonComponents)
  },
  opentiny: {
    id: 'opentiny',
    name: 'OpenTiny Vue',
    framework: 'vue',
    packageName: '@opentiny/vue',
    tokenMap: {
      '--tv-base-color-brand': 'color.action.primary',
      '--tv-base-color-bg-1': 'color.bg.surface',
      '--tv-base-color-bg-2': 'color.bg.canvas',
      '--tv-base-color-text-1': 'color.text.primary',
      '--tv-base-color-border': 'color.border.default',
      '--tv-base-border-radius': 'radius.control'
    },
    components: componentSet('opentiny', '@opentiny/vue', 'vue', commonComponents)
  }
}

export function createAdapterPlugin(adapter: AtlasThirdPartyAdapter): AtlasPlugin {
  return defineAtlasPlugin({
    id: `adapter.${adapter.id}`,
    name: `${adapter.name} Adapter`,
    version: '0.2.0-beta.1',
    setup(context) {
      const disposers = adapter.components.map((component) => context.components.register(component))
      Object.entries(adapter.tokenMap).forEach(([externalToken, atlasToken]) => {
        context.tokens.set(`adapter.${adapter.id}.${externalToken}`, atlasToken)
      })
      return () => disposers.forEach((dispose) => dispose())
    }
  })
}

export function resolveAdapterTheme(adapter: AtlasThirdPartyAdapter, atlasTheme: Record<string, string>) {
  return Object.fromEntries(Object.entries(adapter.tokenMap).map(([externalToken, atlasToken]) => [externalToken, atlasTheme[atlasToken]]))
}

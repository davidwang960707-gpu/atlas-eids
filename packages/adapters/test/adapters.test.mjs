import assert from 'node:assert/strict'
import test from 'node:test'
import { createPluginHost } from '@atlas-eids/plugin-sdk'
import { adapters, createAdapterPlugin, resolveAdapterTheme } from '../dist/index.js'

test('OpenTiny adapter registers component metadata and semantic tokens', async () => {
  const host = createPluginHost()
  await host.install(createAdapterPlugin(adapters.opentiny))
  assert.ok(host.context.components.get('opentiny.button'))
  assert.equal(host.context.components.list().length, 8)

  const theme = resolveAdapterTheme(adapters.opentiny, {
    'color.action.primary': '#7B61FF',
    'color.bg.surface': '#FFFFFF',
    'color.bg.canvas': '#F5F7FA',
    'color.text.primary': '#1D2129',
    'color.border.default': '#E5E8EF',
    'radius.control': '6px'
  })
  assert.equal(theme['--tv-base-color-brand'], '#7B61FF')
})

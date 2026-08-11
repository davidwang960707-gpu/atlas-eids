import assert from 'node:assert/strict'
import test from 'node:test'
import { AtlasPluginIndex, AtlasPluginSandbox, createPluginHost, defineAtlasPlugin, signAtlasPluginManifest, verifyAtlasPluginManifest } from '../dist/index.js'

test('plugins register and clean up extension assets', async () => {
  const host = createPluginHost()
  const plugin = defineAtlasPlugin({
    id: 'example',
    name: 'Example',
    version: '1.0.0',
    setup(context) {
      const dispose = context.components.register({
        id: 'example.button',
        name: 'Button',
        framework: 'react',
        source: '@example/ui',
        category: 'foundation'
      })
      return dispose
    }
  })

  await host.install(plugin)
  assert.equal(host.context.components.list().length, 1)
  assert.equal(host.uninstall('example'), true)
  assert.equal(host.context.components.list().length, 0)
})

test('host enforces permissions, API compatibility and dependency versions', async () => {
  const restricted = createPluginHost({}, { grantedPermissions: ['components:write'], apiVersion: '1.2.0' })
  await assert.rejects(restricted.install(defineAtlasPlugin({
    id: 'unsafe', name: 'Unsafe', version: '1.0.0', permissions: ['tools:write'],
    setup() {}
  })), /permission denied/)
  await assert.rejects(restricted.install(defineAtlasPlugin({
    id: 'future', name: 'Future', version: '1.0.0', apiVersion: '2.0.0',
    setup() {}
  })), /API is incompatible/)

  const host = createPluginHost()
  await host.install(defineAtlasPlugin({ id: 'foundation', name: 'Foundation', version: '1.4.0', setup() {} }))
  await host.install(defineAtlasPlugin({
    id: 'feature', name: 'Feature', version: '1.0.0',
    dependencies: [{ id: 'foundation', version: '^1.0.0' }],
    permissions: ['pages:write'],
    setup(context) {
      context.pages.register({ id: 'feature.page', name: 'Feature', category: 'test', capabilities: [] })
    }
  }))
  assert.equal(host.context.pages.list().length, 1)
  host.uninstall('feature')
  assert.equal(host.context.pages.list().length, 0)
})

test('failed plugin setup rolls back partial registrations', async () => {
  const host = createPluginHost()
  await assert.rejects(host.install(defineAtlasPlugin({
    id: 'broken', name: 'Broken', version: '1.0.0', permissions: ['components:write'],
    setup(context) {
      context.components.register({ id: 'broken.item', name: 'Broken', framework: 'react', source: 'broken', category: 'foundation' })
      throw new Error('setup failed')
    }
  })), /setup failed/)
  assert.equal(host.context.components.list().length, 0)
})

test('signed manifests detect tampering and plugin indexes require HTTPS', async () => {
  const keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
  const manifest = { id: 'insight', name: 'Insight', version: '1.0.0', apiVersion: '1.0.0', entry: 'https://plugins.example/insight.js', sandbox: 'worker', permissions: ['components:write'], exposes: ['analyze'] }
  const signed = await signAtlasPluginManifest(manifest, 'atlas-test', keys.privateKey)
  assert.equal(await verifyAtlasPluginManifest(signed, keys.publicKey), true)
  signed.manifest.version = '9.9.9'
  assert.equal(await verifyAtlasPluginManifest(signed, keys.publicKey), false)
  assert.throws(() => new AtlasPluginIndex([{ id: 'unsafe', manifestUrl: 'http://example.test/plugin.json' }]), /HTTPS/)
})

test('sandbox only invokes exposed methods and resolves isolated transport messages', async () => {
  let listener
  const sent = []
  const transport = {
    post(message) { sent.push(message); queueMicrotask(() => listener({ ...message, type: 'response', payload: { score: 98 } })) },
    subscribe(next) { listener = next; return () => { listener = undefined } },
    dispose() {}
  }
  const manifest = { id: 'quality', name: 'Quality', version: '1.0.0', apiVersion: '1.0.0', entry: 'https://plugins.example/quality.js', sandbox: 'worker', permissions: [], exposes: ['score'] }
  const sandbox = new AtlasPluginSandbox(manifest, transport, 100)
  assert.deepEqual(await sandbox.invoke('score', { documentId: 'D-1' }), { score: 98 })
  assert.equal(sent[0].method, 'score')
  assert.throws(() => sandbox.invoke('delete', {}), /not exposed/)
  sandbox.dispose()
})

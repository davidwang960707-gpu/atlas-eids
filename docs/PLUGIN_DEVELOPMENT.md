# 插件与第三方组件接入

`@atlas-eids/plugin-sdk` 提供统一插件生命周期。插件可以注册组件、页面、Agent 工具和扩展 Token。

```ts
import { createPluginHost, defineAtlasPlugin } from '@atlas-eids/plugin-sdk'

const host = createPluginHost()
const plugin = defineAtlasPlugin({
  id: 'example.analytics',
  name: 'Analytics Plugin',
  version: '1.0.0',
  apiVersion: '1.0.0',
  permissions: ['components:write'],
  setup(context) {
    return context.components.register({
      id: 'example.metric-card',
      name: 'MetricCard',
      framework: 'react',
      source: '@example/analytics-ui',
      category: 'data'
    })
  }
})

await host.install(plugin)
```

## 权限、依赖与隔离

插件可以声明 `components:write`、`pages:write`、`tools:write` 和 `tokens:write`。Host 可限制实际授权；未获授权的安装会在 `setup` 前失败。插件还可以声明依赖和兼容的 Plugin API 主版本：

```ts
const host = createPluginHost({}, {
  apiVersion: '1.2.0',
  grantedPermissions: ['components:write', 'pages:write']
})

const feature = defineAtlasPlugin({
  id: 'example.feature',
  name: 'Feature Plugin',
  version: '1.0.0',
  apiVersion: '1.0.0',
  dependencies: [{ id: 'example.foundation', version: '^1.0.0' }],
  permissions: ['pages:write'],
  setup(context) {
    context.pages.register({
      id: 'example.feature-page',
      name: 'Feature',
      category: '业务扩展',
      capabilities: ['read']
    })
  }
})
```

Host 会自动追踪注册项，插件卸载或安装失败时回滚自己创建的组件、页面和工具；插件不能注销不属于自己的注册项。进程内 Host 适合受信插件，不可信代码应使用下述 Worker 或 iframe 沙箱。

## Manifest、签名与沙箱

外部插件通过 Manifest 声明入口、权限、沙箱类型和可调用方法。SDK 支持 ECDSA SHA-256 签名验证与 HTTPS 插件索引：

```ts
import { AtlasPluginIndex, createAtlasWorkerSandbox, verifyAtlasPluginManifest } from '@atlas-eids/plugin-sdk'

const index = await AtlasPluginIndex.load('https://plugins.example.com/atlas-index.json')
const trusted = await verifyAtlasPluginManifest(signedManifest, publicKey)
if (!trusted) throw new Error('插件签名无效')

const worker = new Worker(signedManifest.manifest.entry, { type: 'module' })
const sandbox = createAtlasWorkerSandbox(signedManifest.manifest, worker)
await sandbox.invoke('render.metric', { id: 'revenue' })
```

`AtlasPluginSandbox` 只允许调用 Manifest `exposes` 中的方法，并提供 Request ID、超时、错误回传和统一销毁。iframe Transport 默认设置 `sandbox="allow-scripts"`，同时校验 `source` 与 `origin`；宿主仍需配置 CSP、可信公钥轮换、插件撤销列表和服务端权限校验。

## 第三方适配器

`@atlas-eids/adapters` 提供 Token 与组件能力元数据；下列独立 package 提供真实运行时 Wrapper：

- `@atlas-eids/adapter-antd-react`
- `@atlas-eids/adapter-tdesign-vue`
- `@atlas-eids/adapter-opentiny-vue`

适配器把 Atlas 语义 Token 映射为第三方 Token，并注册 Button、Input、Select、Form、Table、Tabs、Dialog 和 Drawer 的组件描述。

```ts
import { createPluginHost } from '@atlas-eids/plugin-sdk'
import { adapters, createAdapterPlugin } from '@atlas-eids/adapters'

const host = createPluginHost()
await host.install(createAdapterPlugin(adapters.opentiny))
```

运行时层已覆盖 Provider/Plugin、Button、Input、Select、Table/Grid、Dialog/Modal、Drawer、Tabs 和 Form，并对品牌色、功能色、圆角、密度与容器色进行语义映射。Wrapper 仍保持 Experimental：它保证核心组件可以运行和透传原生 Props/事件，但不承诺抹平三套组件库的全部表单校验、虚拟滚动或高级组件差异。

新增或升级 Wrapper 时必须通过构建测试、运行时 Fixture、Token 映射检查，并在 Storybook 或独立示例中验证真实渲染；不得复制第三方组件源码。

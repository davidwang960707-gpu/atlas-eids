# @atlas-eids/plugin-sdk

Atlas EIDS 插件生命周期与组件、页面、工具注册表，支持权限、依赖、API 版本、注册隔离、失败回滚、ECDSA Manifest 签名、HTTPS 插件索引，以及 Worker / iframe 沙箱通信。

```ts
import { createPluginHost, defineAtlasPlugin } from '@atlas-eids/plugin-sdk'
```

状态：Beta。完整示例见 [`docs/PLUGIN_DEVELOPMENT.md`](../../docs/PLUGIN_DEVELOPMENT.md)。

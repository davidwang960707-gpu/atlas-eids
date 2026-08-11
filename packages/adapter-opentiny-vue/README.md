# Atlas OpenTiny Vue Adapter

`@atlas-eids/adapter-opentiny-vue` 通过 OpenTiny 按需 packages 提供 Atlas 运行时 Wrapper，避免引入完整组件集合。

```ts
import { AtlasOpenTiny } from '@atlas-eids/adapter-opentiny-vue'

app.use(AtlasOpenTiny)
```

当前覆盖 Button、Input、Select、Grid、Dialog、Drawer、Tabs 与 Form，状态为 Experimental。

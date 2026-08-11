# Atlas Ant Design React Adapter

`@atlas-eids/adapter-antd-react` 用 Atlas 语义 Token 包装 Ant Design 的 Provider、Button、Input、Select、Table、Modal、Drawer、Tabs 与 Form。

```tsx
import { AtlasAntdButton, AtlasAntdProvider } from '@atlas-eids/adapter-antd-react'

<AtlasAntdProvider>
  <AtlasAntdButton intent="primary">确认</AtlasAntdButton>
</AtlasAntdProvider>
```

该 package 为 Experimental。原生 Props 与事件保持透传，高级组件差异由业务项目显式处理。

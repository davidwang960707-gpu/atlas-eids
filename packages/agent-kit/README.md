# @atlas-eids/agent-kit

面向 Coding Agent 的 Atlas EIDS 设计知识、页面规划和规范校验运行时。

```ts
import { planAtlasPage, validateAtlasPageSource } from '@atlas-eids/agent-kit'

const plan = planAtlasPage({ intent: '知识库检索与引用页面', framework: 'react' })
const result = validateAtlasPageSource(source, { aiPage: true, framework: 'react' })
```

该包直接消费 `@atlas-eids/core` 的组件视觉契约，是 Skills、CLI 和 MCP Server 共同使用的查询、规划与校验层。构建时会生成 `manifests/` 下四份 Machine Manifest，避免组件知识和设计规范在多处漂移。

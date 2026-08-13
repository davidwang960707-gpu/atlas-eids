---
name: atlas-eids-design-system
description: Atlas EIDS 总入口。用于规划、实现、检查或修复 React/Vue 企业应用、页面模板、AI 原生交互、Living Orb、Design Tokens、CLI 和 MCP；当用户要求页面符合 Atlas 风格或核对跨端一致性时使用。
---

# Atlas EIDS Skill Router

Atlas EIDS 是面向 AI 原生企业应用的设计与工程系统。页面必须同时满足企业任务效率、可信 AI 控制、React/Vue 一致性和 Atlas 视觉识别。

## 必须遵循的闭环

1. 确认目标框架、页面任务、用户角色和是否包含 AI 行为。
2. 优先调用 MCP `atlas_plan_page`；没有 MCP 时运行 `npm run atlas -- agent plan "<需求>" --json`。
3. 读取 `atlas://contracts/visual-rules` 与当前组件的 `atlas_get_visual_contract`；没有 MCP 时查看 `manifests/visual-rules.json` 并运行 `npm run atlas -- knowledge contract <组件名>`。
4. 只读取当前任务需要的专项 Skill 和 Reference，不一次加载全部资料。
5. 对每个将使用的组件调用 `atlas_get_component_api`，或运行 `npm run atlas -- knowledge components <名称>`；不得根据截图猜 Props。
6. 实现真实 Loading、Empty、Error、Disabled、权限和响应式状态，不交付纯示意画面。
7. 调用 `atlas_validate_page`；CLI 回退为 `npm run atlas -- validate <file> --framework react|vue`，AI 页面增加 `--ai`。发布候选继续使用 Runtime Validator 组合执行 AST、Type、DOM、Playwright 与视觉检查。
8. 执行构建、键盘、A11y、交互、跨浏览器和桌面/移动视觉检查，并与同框架 Storybook、页面模板及品牌页对照。

## 专项 Skills

| 场景 | Skill |
| --- | --- |
| React 页面与组件 | `../atlas-react/SKILL.md` |
| Vue 3 页面与组件 | `../atlas-vue/SKILL.md` |
| Orb、对话、知识、Agent、MCP | `../atlas-ai/SKILL.md` |
| 应用框架与页面模板 | `../atlas-page-patterns/SKILL.md` |
| 色彩、字体、间距、主题 | `../atlas-tokens/SKILL.md` |
| 创建、生成、升级与校验 | `../atlas-cli/SKILL.md` |

实现或审查视觉时读取 [视觉质量契约](references/visual-quality.md)；图表任务再读取 [数据可视化规则](references/charts.md)。

## 不可破坏的规则

- Orb 只用于 AI 身份、思考、执行和异常状态，不用于普通列表图标、头像或装饰。
- Orb 必须使用正式 `AtlasOrb` 或共享 Living Orb 结构，不用单层渐变圆球近似。
- 内容容器使用低圆角，普通面板不超过 `8px`；表格标准数据行保持 `42px`，不要把页面区块全部做成浮动卡片。
- 业务组件只使用 Atlas 语义 Design Tokens，不硬编码品牌色。
- AI 结果必须按风险提供引用、工具状态、权限提示、人工确认或审计信息。
- AI Artifact、结构化输入与 GenUI 必须经过 Core Schema 验证；不渲染模型返回的任意 HTML、脚本或未注册组件。
- React 与 Vue 的组件语义、状态和可访问行为保持一致。
- 官网负责品牌表达，应用页负责企业任务；一致性以 Token、组件语义和 Orb 契约为核心，不强行复制官网 Hero。
- 生成页面后必须校验，不把编译通过或单张截图当作设计验收完成。

## 跨框架契约门槛

修改共享组件时，先更新 `packages/core/src/component-contracts.ts`，再分别实现 React 与 Vue。验收不能只比较组件名，还必须核对：

- Anatomy、语义和状态集合一致，状态类名及状态色含义一致。
- React Props/Callback 与 Vue Props/Slots/Emits 可以遵循各自框架习惯，但默认值、受控行为和用户结果一致。
- Light/Dark、Compact/Standard/Comfortable、zh-CN/en-US 均有稳定基线。
- DOM 角色、可访问名称、键盘导航、焦点、Disabled、Loading、Empty 和 Error 行为一致。
- 关键几何通过 `tests/storybook/parity.spec.ts` 核对，不能以肉眼相似替代。

涉及 Tokens 或共享组件的任务，完成前至少运行 `npm run test:design-contract`、`npm run test:api-contract`、`npm run test:storybook`；涉及组合页面时继续运行 E2E、A11y 与视觉回归。

## 可用知识入口

```bash
npm run atlas -- knowledge components MCP
npm run atlas -- knowledge contract AtlasDataTable
npm run atlas -- knowledge patterns 知识库
npm run atlas -- agent plan "带引用和权限过滤的知识问答页" --framework react --json
npm run atlas -- validate src/pages/KnowledgePage.tsx --framework react --ai
```

MCP Resources 除设计知识外，还提供 `atlas://contracts/component-contracts`、`atlas://contracts/page-recipes`、`atlas://contracts/token-contract`、`atlas://contracts/visual-rules` 四份机器契约。

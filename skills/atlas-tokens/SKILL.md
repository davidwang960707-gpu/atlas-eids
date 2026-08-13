---
name: atlas-tokens
description: 使用或维护 Atlas EIDS 语义 Design Tokens，构建浅色、深色、紧凑、标准和舒适密度界面；涉及颜色、字体、间距、圆角、动效、图表或第三方主题映射时使用。
---

# Atlas Design Tokens

唯一源文件：`packages/tokens/src/tokens.json`。源文件遵循 DTCG 2025.10，并固定为 Global、Semantic、Component、State 四层。CSS、TypeScript、`manifests/token-contract.json` 与 `figma/atlas-eids.variables.json` 均由脚本生成，不在组件或 Figma 中维护第二份颜色表。

## 使用原则

- 背景、文字、边框、操作、状态、阴影、圆角和动效均使用 `--atlas-*` 语义变量。
- `#7B61FF` 是品牌主色，不意味着所有图表、卡片和装饰都使用紫色。
- 内容画布、表面层、浮层之间依靠中性背景、边框和轻量阴影建立层级。
- 成功、警告、错误和信息色只表达语义，不作为装饰主题。
- 当前 Control `6px`、Panel `8px`、Overlay `10px`；普通页面卡片与面板不超过 `8px`，按钮、输入和标签遵守 Token 尺度。
- Standard 控件高度 `32px`，Compact `28px`，Comfortable `40px`；数据表标准行高 `42px`。
- 字体层级固定为：Micro `10px`、Caption `12px`、Body `14px`、Heading Small `16px`、Heading Medium `18px`、Heading Large/Title `20px`、Metric `26px`。
- Micro 只允许纯数字 Badge 或非阅读型指示；正文、标签、辅助信息和 AI 引用不得使用 `10/11px`，最小阅读字号是 Caption `12px`。
- 页面标题使用 Heading Large，区块和组合组件标题使用 Heading Small；不要让 `h1/h2/h3` 继承同一个 Body 字号。
- 字体不随 viewport 连续缩放。行高使用 `line.height.heading/body/tight`，不要在页面中重新发明一套行高。
- 布局间距只使用 `space.1/2/3/4/5/6/8/12`，即 `4/8/12/16/20/24/32/48px`；边框、图标几何和组件固有尺寸不属于布局间距。
- 新 CSS 变量必须先进入 Token 源并完成构建。禁止引用未定义的 `--atlas-*` 变量并依赖浏览器继承兜底。
- Global 只保存原始尺度；Semantic 表达主题意图；Component 约束组件几何与材质；State 表达 Focus、Selected、Disabled 等交互状态。页面不得直接消费 Global 品牌色替代 Semantic Action。

## 主题与密度

React 和 Vue 组件树都由 `AtlasProvider` 设置 `theme="light|dark"`、`density="compact|standard|comfortable"`、`locale="zh-CN|en-US"`。Vue 也可通过 `AtlasEIDS` 全局注册组件，但主题边界仍使用 Provider。

图表颜色使用 `css/tokens.css` 的 `--chart-*` 语义变量，规则读取 `../atlas-eids-design-system/references/charts.md`。第三方 Adapter 通过语义映射接入，不在业务页面另建一套颜色表。

React/Vue 示例统一导入 `examples/shared/tokens.css`；官网静态页使用构建生成的 `css/atlas-tokens.generated.css` 与兼容层。不得恢复框架私有 `styles/tokens.css`，也不得手工编辑任何 `*.generated.css` 或 Manifest。

新增 Token 后运行：

```bash
npm run build -w @atlas-eids/tokens
npm run build:manifests
npm run build:figma
npm run test -w @atlas-eids/tokens
npm run test:design-contract
npm run test:figma
npm run test:visual
```

随后检查 React、Vue、Storybook、模板和文档是否同步。

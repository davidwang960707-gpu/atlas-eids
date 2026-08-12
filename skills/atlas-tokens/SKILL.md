---
name: atlas-tokens
description: 使用或维护 Atlas EIDS 语义 Design Tokens，构建浅色、深色、紧凑、标准和舒适密度界面；涉及颜色、字体、间距、圆角、动效、图表或第三方主题映射时使用。
---

# Atlas Design Tokens

唯一源文件：`packages/tokens/src/tokens.json`。构建产物、CSS 变量与 `manifests/token-contract.json` 由脚本生成，不在组件中维护第二份颜色表。

## 使用原则

- 背景、文字、边框、操作、状态、阴影、圆角和动效均使用 `--atlas-*` 语义变量。
- `#7B61FF` 是品牌主色，不意味着所有图表、卡片和装饰都使用紫色。
- 内容画布、表面层、浮层之间依靠中性背景、边框和轻量阴影建立层级。
- 成功、警告、错误和信息色只表达语义，不作为装饰主题。
- 当前 Control `6px`、Panel `8px`、Overlay `10px`；普通页面卡片与面板不超过 `8px`，按钮、输入和标签遵守 Token 尺度。
- Standard 控件高度 `32px`，Compact `28px`，Comfortable `40px`；数据表标准行高 `42px`。
- Body `14px`、Caption `12px`、Title `20px` 是基础层级；页面标题可按组合层使用约 `20-24px`，不随 viewport 连续缩放。
- 字体不随 viewport 连续缩放，紧凑控制区使用小而清晰的标题。

## 主题与密度

React 和 Vue 组件树都由 `AtlasProvider` 设置 `theme="light|dark"`、`density="compact|standard|comfortable"`、`locale="zh-CN|en-US"`。Vue 也可通过 `AtlasEIDS` 全局注册组件，但主题边界仍使用 Provider。

图表颜色使用 `css/tokens.css` 的 `--chart-*` 语义变量，规则读取 `../atlas-eids-design-system/references/charts.md`。第三方 Adapter 通过语义映射接入，不在业务页面另建一套颜色表。

React/Vue 示例统一导入 `examples/shared/tokens.css`；官网静态页使用构建生成的 `css/atlas-tokens.generated.css` 与兼容层。不得恢复框架私有 `styles/tokens.css`，也不得手工编辑任何 `*.generated.css` 或 Manifest。

新增 Token 后运行：

```bash
npm run build -w @atlas-eids/tokens
npm run build:manifests
npm run test -w @atlas-eids/tokens
npm run test:design-contract
npm run test:visual
```

随后检查 React、Vue、Storybook、模板和文档是否同步。

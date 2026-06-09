# 快速开始

这份文档用于帮助你预览 Atlas EIDS，并运行 React / Vue 3 示例。

## 环境要求

- 现代浏览器
- React / Vue 示例需要 Node.js 18 或更高版本
- npm、pnpm 或 yarn

静态展示页可以直接打开，不需要安装依赖。

## 预览静态展示页

在项目根目录执行：

```bash
open index.html
```

也可以启动本地服务：

```bash
npx --yes http-server -p 37772 -c-1
```

访问：

```text
http://localhost:37772
```

## 运行 React 示例

```bash
cd examples/react
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 运行 Vue 3 示例

```bash
cd examples/vue3
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 常用文件

- `index.html`：主展示页和设计系统说明入口
- `css/tokens.css`：基础 Design Tokens
- `css/dark-theme.css`：Dark Theme 变量
- `css/light-theme.css`：Light Theme 变量
- `css/main.css`：组件、布局和页面样式
- `js/theme-switcher.js`：主题切换和偏好保存
- `js/main.js`：Tabs、导航和通用交互
- `examples/react`：React 组件示例
- `examples/vue3`：Vue 3 组件示例

## 验证

公开发布前建议运行：

```bash
cd examples/react && npm install && npm run build
cd ../vue3 && npm install && npm run build
```


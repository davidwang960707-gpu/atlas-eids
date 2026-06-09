# 贡献指南

感谢你愿意一起改进 Atlas EIDS。

## 可以贡献什么

- 改进组件质量、可访问性和响应式表现
- 增加 React 或 Vue 3 组件示例
- 优化 Design Tokens、主题覆盖和视觉一致性
- 改进文档、示例和使用说明
- 通过截图和视口信息反馈视觉问题

## 本地开发

静态展示页：

```bash
npx --yes http-server -p 37772 -c-1
```

React 示例：

```bash
cd examples/react
npm install
npm run dev
```

Vue 3 示例：

```bash
cd examples/vue3
npm install
npm run dev
```

## Pull Request 检查项

- 变更范围保持聚焦，尽量只解决一个问题。
- 遵循现有视觉语言、Design Tokens、圆角、动效和主题规则。
- 如果修改 UI，需要检查 Dark / Light Theme。
- 如果修改布局，需要检查 480px、768px 和桌面宽度附近的响应式表现。
- 修改示例后运行对应构建：

```bash
cd examples/react && npm run build
cd examples/vue3 && npm run build
```

## 设计约定

- 优先使用 Design Tokens，不直接写死颜色。
- 保持液态金属 Orb 的核心概念，不把它退化成普通图标。
- 企业级 UI 要保持冷静、可读、高效。
- 避免使用和 Atlas 主色无关的装饰性色彩。
- 不轻易引入新依赖，除非它能明显提升可维护性、可访问性或工程质量。

## Commit 风格

推荐使用简短、清晰的提交信息：

```text
feat: add liquid orb state styles
fix: improve light mode chart spacing
docs: add component usage notes
```


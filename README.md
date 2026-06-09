# Atlas EIDS

Atlas EIDS 是一套面向 AI 原生企业级产品的界面设计系统。它包含静态设计系统展示页、React 与 Vue 3 组件示例、AI 交互模式、数据可视化风格，以及深浅色主题的 Design Tokens。

> EIDS = Enterprise Intelligence Design System

## 亮点

- AI 原生 Orb 交互系统：液态金属 Core、外层轨道、状态动效和 AI 辅助输入
- 企业级 UI 基础能力：按钮、表单、卡片、表格、反馈、Markdown、Code Block 和导航
- 品牌化数据可视化色板，适用于图表和 Dashboard
- 基于 CSS Variables 的 Dark / Light Theme
- React 18 与 Vue 3 组件示例
- 主展示页使用纯 HTML/CSS/JavaScript，可直接打开，无需构建

## Orb 设计理念

Orb 是 Atlas EIDS 的 AI 存在感核心。它不是一个普通头像、图标或装饰性圆球，而是一个被外层轨道约束的智能生命体：有呼吸、有能量场、有液态金属般的内部流动，也能根据不同任务状态产生细微的形态变化。

Orb 的 Core 需要接近外层 orbit，像被轨道包裹和约束的能量体，而不是漂在中间的小球。内部纹理不追求固定的几何图案，而是通过柔性的高光、阻尼感流动、随机形变和金属质感，表现 AI 正在感知、思考和响应。

不同状态通过节奏和能量变化区分：

- `idle`：低频呼吸，保持安静但有生命感。
- `thinking`：辉光增强，内部流动更明显，像正在组织信息。
- `running`：偏青绿色能量，表达执行、处理和完成中的状态。
- `error`：轻微紧张和收缩感，用更高对比的能量提示异常。

设计上需要注意：Orb 可以柔性变形，但不能突破外层轨道；可以有氛围和辉光，但不能抢走业务内容的注意力。它应该像一个可信赖的 AI 入口，在界面中持续提供“智能正在场”的感受。

## 快速预览

在线访问：

- [Atlas EIDS 主展示页](https://davidwang960707-gpu.github.io/atlas-eids/)
- [Atlas EIDS 启动页](https://davidwang960707-gpu.github.io/atlas-eids/launcher.html)

直接打开主展示页：

```bash
open index.html
```

或在根目录启动本地服务：

```bash
npx --yes http-server -p 37772 -c-1
```

然后访问：

```text
http://localhost:37772
```

## 项目结构

```text
AUI-UX/
├── index.html                 # Atlas EIDS 主展示页
├── launcher.html              # 本地快速入口页
├── css/                       # Design Tokens、主题和全局样式
├── js/                        # 主题切换、Tabs、Orb Demo、代码复制
├── examples/
│   ├── react/                 # React + TypeScript + Vite 示例
│   └── vue3/                  # Vue 3 + TypeScript + Vite 示例
├── docs/                      # 开源文档
└── skills/                    # 可维护的 AI Assistant Skills 与设计系统知识
```

## React 示例

```bash
cd examples/react
npm install
npm run dev
```

构建：

```bash
npm run build
```

## Vue 3 示例

```bash
cd examples/vue3
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 文档

- [快速开始](docs/GETTING_STARTED.md)
- [Design Tokens](docs/DESIGN_TOKENS.md)
- [组件说明](docs/COMPONENTS.md)
- [路线图](docs/ROADMAP.md)
- [贡献指南](CONTRIBUTING.md)
- [安全策略](SECURITY.md)
- [变更日志](CHANGELOG.md)
- [Atlas EIDS Skill](skills/atlas-eids-design-system/SKILL.md)

## 设计原则

- AI 应该有存在感、响应感和生命感，但不制造视觉噪音。
- 企业级界面应该冷静、清晰、易扫描，适合高频操作。
- 数据可视化优先使用克制的品牌色板，避免装饰性的彩虹配色。
- 组件需要同时适配 Dark Theme 和 Light Theme。
- React / Vue 示例应与静态展示页保持同一套视觉语言。

## License

本项目使用 MIT License，详见 [LICENSE](LICENSE)。

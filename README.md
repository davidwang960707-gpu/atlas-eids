# Atlas EIDS

<div align="center">

  <img src="https://github.com/davidwang960707-gpu.png" width="120" height="120" alt="王六 avatar" />

  <h3>Atlas EIDS · Enterprise Intelligence Design System</h3>

  <p>
    面向未来 AI 原生 OS 的企业智能设计系统。
  </p>

  <p>
    <img src="https://img.shields.io/badge/AI%20Native-Design%20System-111827?style=for-the-badge&logo=openai&logoColor=white" alt="AI Native Design System" />
    <img src="https://img.shields.io/badge/Orb%20AI-Living%20Interface-7B61FF?style=for-the-badge&logo=sparkles&logoColor=white" alt="Orb AI Living Interface" />
    <img src="https://img.shields.io/badge/React%20%2F%20Vue-Examples-4F46E5?style=for-the-badge&logo=vite&logoColor=white" alt="React Vue Examples" />
  </p>

  <p>
    <a href="https://davidwang960707-gpu.github.io/atlas-eids/">
      <img src="https://img.shields.io/badge/%E5%9C%A8%E7%BA%BF%E5%B1%95%E7%A4%BA%E7%AB%99-Atlas%20EIDS-22D3EE?style=for-the-badge&logo=githubpages&logoColor=white" alt="在线展示站" />
    </a>
    <a href="https://davidwang960707-gpu.github.io/atlas-eids/launcher.html">
      <img src="https://img.shields.io/badge/Launcher-%E5%90%AF%E5%8A%A8%E9%A1%B5-B7A7FF?style=for-the-badge&logo=github&logoColor=white" alt="Atlas EIDS 启动页" />
    </a>
  </p>

</div>

---

## 这是什么

Atlas EIDS 是一套面向 AI 原生企业级产品的界面设计系统。

它不只是按钮、表格、卡片和表单的样式集合，而是在探索一种新的企业级 AI 交互语言：当 Agent、Copilot、自动化工作流和业务系统共同存在时，界面应该如何表达智能、状态、信任、协作和执行。

你可以把这个仓库理解成：

- 一个 AI Native Enterprise UI 的视觉与交互样板间
- 一套包含 Design Tokens、基础组件、企业组件和数据可视化规范的设计系统
- 一个 Orb AI 生命体交互组件的概念原型
- 一个 React / Vue 组件实现的参考项目
- 一个可以继续维护 Skills、文档和组件规范的开源入口

## 在线预览

- [Atlas EIDS 主展示页](https://davidwang960707-gpu.github.io/atlas-eids/)
- [Atlas EIDS 启动页](https://davidwang960707-gpu.github.io/atlas-eids/launcher.html)
- [GitHub 仓库](https://github.com/davidwang960707-gpu/atlas-eids)

## 现在包含什么

- **Hero 与品牌系统**：面向 AI 原生 OS 的设计系统首页表达
- **Orb AI Components**：液态金属 Core、外层轨道、呼吸感、状态动效和 AI 辅助输入
- **基础组件**：按钮、输入框、选择器、Tabs、卡片、列表、表格、反馈组件
- **企业级 UI**：Agent Card、Chat、Timeline、Command Bar、Status Monitor 等
- **数据可视化**：品牌化色板、面积图、柱状图、Dashboard 风格示例
- **Markdown / Code Block**：适合 AI 输出、文档、代码片段和知识库场景
- **Dark / Light Theme**：基于 CSS Variables 的主题系统
- **React / Vue 示例**：用于验证同一套视觉语言在不同前端栈中的落地
- **Skills 文档**：把 Atlas EIDS 的设计原则沉淀成可维护的 AI Assistant Skills

## Orb 设计理念

Orb 是 Atlas EIDS 的 AI 存在感核心。

它不是一个普通头像、图标或装饰性圆球，而是一个被外层 orbit 约束的智能生命体：有呼吸、有能量场、有液态金属般的内部流动，也能根据不同任务状态产生细微的形态变化。

Orb 的 Core 需要接近外层轨道，像被轨道包裹和约束的能量体，而不是漂在中间的小球。内部纹理不追求固定几何图案，而是通过柔性的高光、阻尼感流动、随机形变和金属质感，表现 AI 正在感知、思考和响应。

不同状态通过节奏和能量变化区分：

- `idle`：低频呼吸，保持安静但有生命感。
- `thinking`：辉光增强，内部流动更明显，像正在组织信息。
- `running`：偏青绿色能量，表达执行、处理和完成中的状态。
- `error`：轻微紧张和收缩感，用更高对比的能量提示异常。

设计上需要注意：Orb 可以柔性变形，但不能突破外层轨道；可以有氛围和辉光，但不能抢走业务内容的注意力。它应该像一个可信赖的 AI 入口，在界面中持续提供“智能正在场”的感受。

## 快速开始

主展示页使用纯 HTML/CSS/JavaScript，可直接打开：

```bash
open index.html
```

也可以在根目录启动本地服务：

```bash
npx --yes http-server -p 37772 -c-1
```

然后访问：

```text
http://localhost:37772
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

## 项目结构

```text
AUI-UX/
├── index.html                 # Atlas EIDS 主展示页
├── launcher.html              # GitHub Pages / 本地快速入口页
├── css/                       # Design Tokens、主题和全局样式
├── js/                        # 主题切换、Tabs、Orb Demo、代码复制
├── examples/
│   ├── react/                 # React + TypeScript + Vite 示例
│   └── vue3/                  # Vue 3 + TypeScript + Vite 示例
├── docs/                      # 开源文档
└── skills/                    # 可维护的 AI Assistant Skills 与设计系统知识
```

## 文档入口

- [快速开始](docs/GETTING_STARTED.md)
- [Design Tokens](docs/DESIGN_TOKENS.md)
- [组件说明](docs/COMPONENTS.md)
- [路线图](docs/ROADMAP.md)
- [贡献指南](CONTRIBUTING.md)
- [安全策略](SECURITY.md)
- [变更日志](CHANGELOG.md)
- [Atlas EIDS Skill](skills/atlas-eids-design-system/SKILL.md)

## 设计原则

- **AI 有存在感**：让智能状态可感知，但不制造视觉噪音。
- **企业级要冷静**：界面要清晰、克制、易扫描，适合高频业务操作。
- **数据可视化要可信**：优先使用品牌化、可解释、可比较的图表语言。
- **动效服务状态**：呼吸、流动、辉光和形变都应该表达状态，而不是单纯炫技。
- **跨技术栈一致**：React / Vue 示例应与静态展示页保持同一套视觉语言。

## 适合谁关注

- 正在设计 AI Agent、Copilot、企业工作台或自动化系统的人
- 想把 AI 原生交互做得更有存在感和可信度的设计师
- 需要一套企业级 UI 基础样板的前端开发者
- 想维护 Design Tokens、组件文档和 AI Skills 的团队
- 对未来 AI Native OS 界面形态感兴趣的人

## 贡献原则

- 优先提交能提升真实使用体验的改进。
- 不提交客户数据、账号密钥、合同原件、内部系统截图或其他敏感信息。
- 视觉改动需要同时考虑 Light Theme 与 Dark Theme。
- 组件改动尽量保持静态页、React 示例和 Vue 示例的设计语言一致。
- Orb 相关改动需要保留生命感、呼吸感、液态金属感和外层轨道约束。

## License

本项目使用 MIT License，详见 [LICENSE](LICENSE)。

---

<div align="center">

  <b>王六在线维护 Atlas EIDS。让企业级 AI 界面更有生命感，也更值得信任。</b>

</div>

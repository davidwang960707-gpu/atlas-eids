# Changesets

面向用户的 package 变更需要附带 Changeset：

```bash
npm run changeset
```

选择受影响的 `@atlas-eids/*` package，并用中文说明行为变化。React 与 Vue 组件包已配置为联动版本，公共组件 API 变更必须同时检查两个实现。

发布前依次执行：

```bash
npm run check
npx changeset pre enter beta
npm run version-packages
npm run release:verify-beta
npm run release:beta
```

`release:verify-beta` 会拒绝任何 `-dev` 或非 `-beta.N` 版本，防止误把开发版本推入 Registry。`release:beta` 需要 npm Trusted Publishing 或 `NPM_TOKEN`。未经维护者确认，不执行真实发布。

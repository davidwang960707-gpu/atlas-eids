import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { listBlueprints, pageBlueprints } from './page-catalog.mjs'
import { applicationLayouts, listApplicationLayouts as listLayouts } from './app-layout-catalog.mjs'

const moduleRoot = dirname(fileURLToPath(import.meta.url))
const templateRoot = resolve(moduleRoot, basename(moduleRoot) === 'dist' ? 'templates' : '../templates')
const packageVersion = JSON.parse(readFileSync(resolve(moduleRoot, '../package.json'), 'utf8')).version
const validName = /^[a-z][a-z0-9-]*$/

const appCss = `@import '@atlas-eids/tokens/tokens.css';
@import '@atlas-eids/FRAMEWORK/styles.css';
* { box-sizing: border-box; }
body { margin: 0; background: #f5f7fa; }
.app-shell { min-height: 100vh; }
.app-header { height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid var(--atlas-color-border-default); background: var(--atlas-color-bg-surface); }
.brand { display: flex; align-items: center; gap: 10px; }
.workspace { display: grid; grid-template-columns: 216px 1fr; min-height: calc(100vh - 48px); }
.sidebar { padding: 16px 10px; border-right: 1px solid var(--atlas-color-border-default); background: var(--atlas-color-bg-surface); }
.sidebar button { width: 100%; height: 34px; margin-bottom: 4px; border: 0; border-radius: var(--atlas-radius-control); background: transparent; color: var(--atlas-color-text-secondary); text-align: left; }
.sidebar button.active { background: var(--atlas-color-action-soft); color: var(--atlas-color-action-primary); }
.content { padding: 24px; }
.page-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title h1 { margin: 0; font-size: 20px; }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.topnav { display: flex; align-items: center; gap: 4px; }
.topnav button, .app-tabs button { min-height: 32px; padding: 0 12px; border: 0; border-radius: var(--atlas-radius-control); background: transparent; color: var(--atlas-color-text-secondary); }
.topnav button.active, .app-tabs button.active { background: var(--atlas-color-action-soft); color: var(--atlas-color-action-primary); }
.app-tabs { display: flex; gap: 2px; min-height: 40px; padding: 5px 16px; border-bottom: 1px solid var(--atlas-color-border-default); background: var(--atlas-color-bg-surface); }
.tenant-switcher { height: 32px; padding: 0 28px 0 10px; border: 1px solid var(--atlas-color-border-default); border-radius: var(--atlas-radius-control); background: var(--atlas-color-bg-surface); color: var(--atlas-color-text-primary); }
.app-launcher { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; border-bottom: 1px solid var(--atlas-color-border-default); background: var(--atlas-color-border-default); }
.app-launcher button { min-height: 64px; border: 0; background: var(--atlas-color-bg-surface); color: var(--atlas-color-text-secondary); }
.layout-top .workspace, .layout-workbench .workspace, .layout-fullscreen .workspace { grid-template-columns: 1fr; }
.layout-top .sidebar, .layout-workbench .sidebar, .layout-fullscreen .sidebar { display: none; }
.layout-sidebar .app-header .topnav, .layout-sidebar .app-header > span { display: none; }
.layout-fullscreen .app-header { height: 42px; }
.layout-fullscreen .content { min-height: calc(100vh - 42px); padding: 12px; background: var(--atlas-color-bg-surface); }
.atlas-root[data-atlas-density="compact"] .content { padding: 16px; }
.atlas-root[data-atlas-density="compact"] .generated-section li { padding-block: 8px; }
.atlas-root[data-atlas-density="comfortable"] .content { padding: 32px; }
.atlas-root[data-atlas-density="comfortable"] .generated-section li { padding-block: 14px; }
@media (max-width: 800px) { .workspace { grid-template-columns: 1fr; } .sidebar { display: none; } .content { padding: 16px; } .grid { grid-template-columns: 1fr; } }
`

const apiClientSource = `const tenant = import.meta.env.VITE_ATLAS_TENANT || 'atlas-cn'
let accessToken = ''

async function getAtlasAccessToken() {
  if (accessToken) return accessToken
  const response = await fetch('/api/v1/auth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: import.meta.env.VITE_ATLAS_DEMO_USER || 'analyst',
      password: import.meta.env.VITE_ATLAS_DEMO_PASSWORD || 'atlas-local-only',
      tenant
    })
  })
  if (!response.ok) throw new Error(\`Atlas authentication failed: \${response.status}\`)
  const session = await response.json()
  accessToken = session.accessToken
  return accessToken
}

export async function streamAtlasAI(message: string, onDelta: (delta: string) => void, signal?: AbortSignal) {
  const token = await getAtlasAccessToken()
  const response = await fetch('/api/v1/ai/chat/stream', {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: \`Bearer \${token}\`, 'X-Atlas-Tenant': tenant },
    body: JSON.stringify({ message, contexts: ['current-page'], model: 'atlas-reasoner' }),
    signal
  })
  if (!response.ok || !response.body) throw new Error(\`Atlas API failed: \${response.status}\`)
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\\n\\n')
    buffer = events.pop() ?? ''
    for (const event of events) {
      const data = event.split('\\n').find((line) => line.startsWith('data:'))?.slice(5).trim()
      if (!data) continue
      const payload = JSON.parse(data)
      if (typeof payload.delta === 'string') onDelta(payload.delta)
    }
  }
}
`

const pageCss = `
.generated-page { display: grid; gap: 16px; }
.generated-page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.generated-page-head small { color: var(--atlas-color-text-tertiary); }
.generated-page-head h1 { margin: 4px 0 6px; font-size: 24px; }
.generated-page-head p { max-width: 720px; margin: 0; color: var(--atlas-color-text-secondary); }
.generated-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.generated-metric { min-height: 112px; padding: 18px; border: 1px solid var(--atlas-color-border-default); border-radius: var(--atlas-radius-card); background: var(--atlas-color-bg-surface); }
.generated-metric span, .generated-metric small { display: block; color: var(--atlas-color-text-secondary); }
.generated-metric strong { display: block; margin: 8px 0 4px; font-size: 26px; }
.generated-sections { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.generated-sections.kind-board { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.generated-section { min-width: 0; border: 1px solid var(--atlas-color-border-default); border-radius: var(--atlas-radius-card); background: var(--atlas-color-bg-surface); overflow: hidden; }
.generated-section header { display: flex; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--atlas-color-border-default); }
.generated-section header h2 { margin: 0; font-size: 15px; }
.generated-section header span { color: var(--atlas-color-text-tertiary); font-size: 12px; }
.generated-section ul { margin: 0; padding: 6px 16px 10px; list-style: none; }
.generated-section li { padding: 11px 0; border-bottom: 1px solid var(--atlas-color-border-subtle, var(--atlas-color-border-default)); color: var(--atlas-color-text-secondary); }
.generated-section li:last-child { border-bottom: 0; }
@media (max-width: 800px) { .generated-page-head { align-items: stretch; flex-direction: column; } .generated-metrics, .generated-sections, .generated-sections.kind-board { grid-template-columns: 1fr; } }
`

function atlasConfigSource(configuration) {
  return `export const atlasConfig = ${JSON.stringify(configuration, null, 2)} as const\n`
}

function navigationSource(locale) {
  const labels = locale === 'en-US'
    ? ['Overview', 'Task Center', 'AI Analytics', 'System Settings']
    : ['业务概览', '任务中心', '智能分析', '系统设置']
  return `export const atlasNavigation = ${JSON.stringify([
    { id: 'overview', label: labels[0], path: '#/', permission: 'workspace:read' },
    { id: 'tasks', label: labels[1], path: '#/tasks', permission: 'tasks:read' },
    { id: 'analytics', label: labels[2], path: '#/analytics', permission: 'analytics:read' },
    { id: 'settings', label: labels[3], path: '#/settings', permission: 'settings:write' }
  ], null, 2)} as const\n`
}

const authSource = `export interface AtlasSession {
  actor: string
  roles: string[]
  tenants: string[]
  activeTenant: string
}

export const demoSession: AtlasSession = {
  actor: 'analyst',
  roles: ['USER'],
  tenants: ['atlas-cn'],
  activeTenant: 'atlas-cn'
}

export function canAccess(permission: string, session: AtlasSession = demoSession) {
  if (session.roles.includes('ADMIN')) return true
  return !permission.endsWith(':write')
}
`

const routerSource = `import { atlasNavigation } from './navigation'
import { canAccess, type AtlasSession } from './auth'

export function resolveAtlasRoute(hash = globalThis.location?.hash || '#/', session?: AtlasSession) {
  const route = atlasNavigation.find((item) => item.path === hash) ?? atlasNavigation[0]
  return canAccess(route.permission, session) ? route : atlasNavigation[0]
}
`

function reactAdapterSource(adapter) {
  if (adapter === 'antd') {
    return `import type { ReactNode } from 'react'\nimport { AtlasProvider } from '@atlas-eids/react'\nimport { AtlasAntdProvider } from '@atlas-eids/adapter-antd-react'\nimport { atlasConfig } from './atlas-config'\nexport function AtlasRuntimeProvider({ children }: { children: ReactNode }) { return <AtlasProvider density={atlasConfig.density} locale={atlasConfig.locale}><AtlasAntdProvider>{children}</AtlasAntdProvider></AtlasProvider> }\n`
  }
  return `import type { ReactNode } from 'react'\nimport { AtlasProvider } from '@atlas-eids/react'\nimport { atlasConfig } from './atlas-config'\nexport function AtlasRuntimeProvider({ children }: { children: ReactNode }) { return <AtlasProvider density={atlasConfig.density} locale={atlasConfig.locale}>{children}</AtlasProvider> }\n`
}

function vueAdapterSource(adapter) {
  if (adapter === 'tdesign') {
    return `import type { App } from 'vue'\nimport { AtlasTDesign } from '@atlas-eids/adapter-tdesign-vue'\nexport function installAtlasAdapter(app: App) { app.use(AtlasTDesign) }\n`
  }
  if (adapter === 'opentiny') {
    return `import type { App } from 'vue'\nimport { AtlasOpenTiny } from '@atlas-eids/adapter-opentiny-vue'\nexport function installAtlasAdapter(app: App) { app.use(AtlasOpenTiny) }\n`
  }
  return `import type { App } from 'vue'\nexport function installAtlasAdapter(_app: App) {}\n`
}

function reactShellSource(configuration) {
  const layout = applicationLayouts[configuration.frameworkLayout]
  return `import type { ReactNode } from 'react'
import { AtlasOrb } from '@atlas-eids/react'
import { atlasConfig } from './atlas-config'
import { atlasNavigation } from './navigation'
import { canAccess, demoSession } from './auth'

const regions = ${JSON.stringify(layout.regions)} as const
const has = (region: string) => regions.includes(region as never)

export function AtlasApplicationShell({ children }: { children: ReactNode }) {
  const menu = atlasNavigation.filter((item) => canAccess(item.permission))
  return <div className={\`app-shell layout-\${atlasConfig.frameworkLayout}\`}>
    <header className="app-header"><div className="brand"><AtlasOrb size={28}/><strong>Atlas Workspace</strong></div>{has('topnav') && <nav className="topnav" aria-label="产品导航">{menu.slice(0, 3).map((item, index) => <button className={index === 0 ? 'active' : undefined} key={item.id}>{item.label}</button>)}</nav>}{has('tenant-switcher') ? <select className="tenant-switcher" aria-label="当前租户" defaultValue={demoSession.activeTenant}>{demoSession.tenants.map((tenant) => <option key={tenant}>{tenant}</option>)}</select> : <span>${layout.title}</span>}</header>
    {has('launcher') && <nav className="app-launcher" aria-label="应用入口">{menu.map((item) => <button key={item.id}>{item.label}</button>)}</nav>}
    {has('tabs') && <nav className="app-tabs" aria-label="页面标签"><button className="active">${configuration.locale === 'en-US' ? 'Overview' : '业务概览'}</button><button>${configuration.locale === 'en-US' ? 'Task detail' : '任务详情'}</button></nav>}
    <div className="workspace">{has('sidebar') && <aside className="sidebar">{menu.map((item, index) => <button className={index === 0 ? 'active' : undefined} key={item.id}>{item.label}</button>)}</aside>}<main className="content">{children}</main></div>
  </div>
}
`
}

function vueShellSource(configuration) {
  const layout = applicationLayouts[configuration.frameworkLayout]
  return `<script setup lang="ts">
import { AtlasOrb } from '@atlas-eids/vue'
import { atlasConfig } from './atlas-config'
import { atlasNavigation } from './navigation'
import { canAccess, demoSession } from './auth'
const regions = ${JSON.stringify(layout.regions)} as const
const has = (region: string) => regions.includes(region as never)
const menu = atlasNavigation.filter((item) => canAccess(item.permission))
</script>
<template><div class="app-shell" :class="\`layout-\${atlasConfig.frameworkLayout}\`">
  <header class="app-header"><div class="brand"><AtlasOrb :size="28"/><strong>Atlas Workspace</strong></div><nav v-if="has('topnav')" class="topnav" aria-label="产品导航"><button v-for="(item,index) in menu.slice(0,3)" :key="item.id" :class="{active:index===0}">{{ item.label }}</button></nav><select v-if="has('tenant-switcher')" class="tenant-switcher" aria-label="当前租户"><option v-for="tenant in demoSession.tenants" :key="tenant">{{ tenant }}</option></select><span v-else>${layout.title}</span></header>
  <nav v-if="has('launcher')" class="app-launcher" aria-label="应用入口"><button v-for="item in menu" :key="item.id">{{ item.label }}</button></nav>
  <nav v-if="has('tabs')" class="app-tabs" aria-label="页面标签"><button class="active">${configuration.locale === 'en-US' ? 'Overview' : '业务概览'}</button><button>${configuration.locale === 'en-US' ? 'Task detail' : '任务详情'}</button></nav>
  <div class="workspace"><aside v-if="has('sidebar')" class="sidebar"><button v-for="(item,index) in menu" :key="item.id" :class="{active:index===0}">{{ item.label }}</button></aside><main class="content"><slot/></main></div>
</div></template>
`
}

function reactPageSource(pattern) {
  const blueprint = pageBlueprints[pattern]
  return `import { AtlasButton } from '@atlas-eids/react'\n\nconst page = ${JSON.stringify({ id: pattern, ...blueprint }, null, 2)} as const\n\nexport function GeneratedPage() {\n  return <section className="generated-page" data-template={page.id}>\n    <header className="generated-page-head"><div><small>{page.group} / {page.id}</small><h1>{page.title}</h1><p>{page.description}</p></div><AtlasButton intent="primary">{page.action}</AtlasButton></header>\n    <div className="generated-metrics">{page.metrics.map(([label, value, trend]) => <article className="generated-metric" key={label}><span>{label}</span><strong>{value}</strong><small>{trend}</small></article>)}</div>\n    <div className={\`generated-sections kind-\${page.kind}\`}>{page.sections.map(([title, meta, items]) => <article className="generated-section" key={title}><header><h2>{title}</h2><span>{meta}</span></header><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>\n  </section>\n}\n`
}

function vuePageSource(pattern) {
  const blueprint = pageBlueprints[pattern]
  return `<script setup lang="ts">\nimport { AtlasButton } from '@atlas-eids/vue'\nconst page = ${JSON.stringify({ id: pattern, ...blueprint }, null, 2)} as const\n</script>\n<template>\n  <section class="generated-page" :data-template="page.id">\n    <header class="generated-page-head"><div><small>{{ page.group }} / {{ page.id }}</small><h1>{{ page.title }}</h1><p>{{ page.description }}</p></div><AtlasButton intent="primary">{{ page.action }}</AtlasButton></header>\n    <div class="generated-metrics"><article v-for="metric in page.metrics" :key="metric[0]" class="generated-metric"><span>{{ metric[0] }}</span><strong>{{ metric[1] }}</strong><small>{{ metric[2] }}</small></article></div>\n    <div class="generated-sections" :class="\`kind-\${page.kind}\`"><article v-for="section in page.sections" :key="section[0]" class="generated-section"><header><h2>{{ section[0] }}</h2><span>{{ section[1] }}</span></header><ul><li v-for="item in section[2]" :key="item">{{ item }}</li></ul></article></div>\n  </section>\n</template>\n`
}

function packageDependency(packageName, packageSource, target) {
  if (packageSource === 'workspace') {
    const directories = {
      '@atlas-eids/tokens': 'tokens',
      '@atlas-eids/react': 'react',
      '@atlas-eids/vue': 'vue',
      '@atlas-eids/adapter-antd-react': 'adapter-antd-react',
      '@atlas-eids/adapter-tdesign-vue': 'adapter-tdesign-vue',
      '@atlas-eids/adapter-opentiny-vue': 'adapter-opentiny-vue'
    }
    const directory = directories[packageName]
    if (!directory) throw new Error(`Unknown workspace package: ${packageName}`)
    const packagePath = resolve(moduleRoot, '../../', directory)
    return `file:${relative(target, packagePath).replaceAll('\\\\', '/')}`
  }
  return `^${packageVersion}`
}

function reactFiles(name, packageSource, target, pattern, configuration) {
  const blueprint = pageBlueprints[pattern]
  const dependencies = {
    '@atlas-eids/react': packageDependency('@atlas-eids/react', packageSource, target),
    '@atlas-eids/tokens': packageDependency('@atlas-eids/tokens', packageSource, target),
    ...(configuration.adapter === 'antd' ? { '@atlas-eids/adapter-antd-react': packageDependency('@atlas-eids/adapter-antd-react', packageSource, target) } : {}),
    ...(configuration.adapter === 'antd' ? { antd: '^6.6.0' } : {}),
    react: '^19.1.1',
    'react-dom': '^19.1.1'
  }
  return {
    'package.json': JSON.stringify({ name, version: '0.1.0', private: true, type: 'module', scripts: { dev: 'vite', build: 'tsc && vite build', preview: 'vite preview' }, dependencies, devDependencies: { '@types/react': '^19.1.9', '@types/react-dom': '^19.1.7', '@vitejs/plugin-react': '^6.0.5', typescript: '^5.9.2', vite: '^8.2.1' } }, null, 2) + '\n',
    'index.html': `<!doctype html><html lang="${configuration.locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Atlas Workspace</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n`,
    'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', useDefineForClassFields: true, lib: ['ES2022', 'DOM'], allowJs: false, skipLibCheck: true, esModuleInterop: true, allowSyntheticDefaultImports: true, strict: true, forceConsistentCasingInFileNames: true, module: 'ESNext', moduleResolution: 'Bundler', resolveJsonModule: true, isolatedModules: true, noEmit: true, jsx: 'react-jsx' }, include: ['src'], references: [] }, null, 2) + '\n',
    'vite.config.ts': "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nexport default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:8080' } } })\n",
    'src/main.tsx': `import React, { useState } from 'react'\nimport ReactDOM from 'react-dom/client'\nimport { AtlasAIComposer, AtlasCard } from '@atlas-eids/react'\nimport { AtlasRuntimeProvider } from './atlas-adapter'\nimport { AtlasApplicationShell } from './AppShell'\nimport { streamAtlasAI } from './atlas-api'\nimport { GeneratedPage } from './GeneratedPage'\nimport './styles.css'\n\nconst showAI = ${Boolean(blueprint.ai)}\n\nfunction App() {\n  const [busy, setBusy] = useState(false)\n  const [answer, setAnswer] = useState('')\n  const ask = async (prompt: string) => { setBusy(true); setAnswer(''); try { await streamAtlasAI(prompt, (delta) => setAnswer((current) => current + delta)) } catch { setAnswer('无法连接 Java 后端，请确认 server 已在 8080 端口启动。') } finally { setBusy(false) } }\n  return <AtlasRuntimeProvider><AtlasApplicationShell><GeneratedPage />{showAI && <section className="generated-ai"><AtlasAIComposer busy={busy} contexts={["当前页面", "${blueprint.title}"]} suggestions={["分析当前页面", "生成执行摘要"]} onSubmit={ask} />{answer && <AtlasCard title="Java SSE 响应"><p>{answer}</p></AtlasCard>}</section>}</AtlasApplicationShell></AtlasRuntimeProvider>\n}\n\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)\n`,
    'src/AppShell.tsx': reactShellSource(configuration),
    'src/GeneratedPage.tsx': reactPageSource(pattern),
    'src/atlas-config.ts': atlasConfigSource(configuration),
    'src/atlas-adapter.tsx': reactAdapterSource(configuration.adapter),
    'src/navigation.ts': navigationSource(configuration.locale),
    'src/auth.ts': authSource,
    'src/router.ts': routerSource,
    'src/atlas-api.ts': apiClientSource,
    'src/vite-env.d.ts': '/// <reference types="vite/client" />\n',
    'src/styles.css': appCss.replaceAll('FRAMEWORK', 'react') + pageCss + '.generated-ai { display: grid; gap: 12px; margin-top: 4px; }\n'
  }
}

function vueFiles(name, packageSource, target, pattern, configuration) {
  const blueprint = pageBlueprints[pattern]
  const dependencies = {
    '@atlas-eids/tokens': packageDependency('@atlas-eids/tokens', packageSource, target),
    '@atlas-eids/vue': packageDependency('@atlas-eids/vue', packageSource, target),
    ...(configuration.adapter === 'tdesign' ? { '@atlas-eids/adapter-tdesign-vue': packageDependency('@atlas-eids/adapter-tdesign-vue', packageSource, target) } : {}),
    ...(configuration.adapter === 'opentiny' ? { '@atlas-eids/adapter-opentiny-vue': packageDependency('@atlas-eids/adapter-opentiny-vue', packageSource, target) } : {}),
    ...(configuration.adapter === 'tdesign' ? { 'tdesign-vue-next': '^1.20.5' } : {}),
    ...(configuration.adapter === 'opentiny' ? {
      '@opentiny/vue-button': '^3.31.0', '@opentiny/vue-dialog-box': '^3.31.0', '@opentiny/vue-drawer': '^3.31.0', '@opentiny/vue-form': '^3.31.0', '@opentiny/vue-grid': '^3.31.0', '@opentiny/vue-input': '^3.31.0', '@opentiny/vue-select': '^3.31.0', '@opentiny/vue-tabs': '^3.31.0'
    } : {}),
    vue: '^3.5.18'
  }
  return {
    'package.json': JSON.stringify({ name, version: '0.1.0', private: true, type: 'module', scripts: { dev: 'vite', build: 'vue-tsc && vite build', preview: 'vite preview' }, dependencies, devDependencies: { '@vitejs/plugin-vue': '^6.0.8', typescript: '^5.9.2', vite: '^8.2.1', 'vue-tsc': '^3.3.9' } }, null, 2) + '\n',
    'index.html': `<!doctype html><html lang="${configuration.locale}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Atlas Workspace</title></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>\n`,
    'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', useDefineForClassFields: true, module: 'ESNext', moduleResolution: 'Bundler', strict: true, jsx: 'preserve', resolveJsonModule: true, isolatedModules: true, esModuleInterop: true, lib: ['ES2022', 'DOM'], skipLibCheck: true }, include: ['src/**/*.ts', 'src/**/*.vue'] }, null, 2) + '\n',
    'vite.config.ts': "import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\nexport default defineConfig({ plugins: [vue()], server: { proxy: { '/api': 'http://localhost:8080' } } })\n",
    'src/main.ts': "import { createApp } from 'vue'\nimport App from './App.vue'\nimport { installAtlasAdapter } from './atlas-adapter'\nimport './styles.css'\nconst app = createApp(App)\ninstallAtlasAdapter(app)\napp.mount('#app')\n",
    'src/App.vue': `<script setup lang="ts">\nimport { ref } from 'vue'\nimport { AtlasAIComposer, AtlasCard, AtlasProvider } from '@atlas-eids/vue'\nimport { atlasConfig } from './atlas-config'\nimport { streamAtlasAI } from './atlas-api'\nimport AtlasApplicationShell from './AppShell.vue'\nimport GeneratedPage from './GeneratedPage.vue'\nconst showAI = ${Boolean(blueprint.ai)}\nconst prompt = ref('')\nconst answer = ref('')\nconst busy = ref(false)\nconst ask = async (message: string) => { busy.value = true; answer.value = ''; try { await streamAtlasAI(message, (delta) => answer.value += delta) } catch { answer.value = '无法连接 Java 后端，请确认 server 已在 8080 端口启动。' } finally { busy.value = false } }\n</script>\n<template><AtlasProvider :density="atlasConfig.density" :locale="atlasConfig.locale"><AtlasApplicationShell><GeneratedPage/><section v-if="showAI" class="generated-ai"><AtlasAIComposer v-model="prompt" :busy="busy" :contexts="['当前页面','${blueprint.title}']" :suggestions="['分析当前页面','生成执行摘要']" @submit="ask"/><AtlasCard v-if="answer" title="Java SSE 响应"><p>{{ answer }}</p></AtlasCard></section></AtlasApplicationShell></AtlasProvider></template>\n`,
    'src/AppShell.vue': vueShellSource(configuration),
    'src/GeneratedPage.vue': vuePageSource(pattern),
    'src/atlas-config.ts': atlasConfigSource(configuration),
    'src/atlas-adapter.ts': vueAdapterSource(configuration.adapter),
    'src/navigation.ts': navigationSource(configuration.locale),
    'src/auth.ts': authSource,
    'src/router.ts': routerSource,
    'src/atlas-api.ts': apiClientSource,
    'src/vite-env.d.ts': '/// <reference types="vite/client" />\n',
    'src/styles.css': appCss.replaceAll('FRAMEWORK', 'vue') + pageCss + '.generated-ai { display: grid; gap: 12px; margin-top: 4px; }\n'
  }
}

const densities = ['compact', 'standard', 'comfortable']
const locales = ['zh-CN', 'en-US']

function validateConfiguration(configuration) {
  if (!['react', 'vue'].includes(configuration.framework)) throw new Error(`Unsupported framework: ${configuration.framework}`)
  if (!['none', 'java'].includes(configuration.backend)) throw new Error(`Unsupported backend: ${configuration.backend}`)
  if (!pageBlueprints[configuration.template]) throw new Error(`Unknown page template: ${configuration.template}`)
  if (!applicationLayouts[configuration.frameworkLayout]) throw new Error(`Unknown application layout: ${configuration.frameworkLayout}`)
  if (!densities.includes(configuration.density)) throw new Error(`Unsupported density: ${configuration.density}`)
  if (!locales.includes(configuration.locale)) throw new Error(`Unsupported locale: ${configuration.locale}`)
  const adapters = configuration.framework === 'react' ? ['native', 'antd'] : ['native', 'tdesign', 'opentiny']
  if (!adapters.includes(configuration.adapter)) throw new Error(`Unsupported ${configuration.framework} adapter: ${configuration.adapter}`)
  if (!['registry', 'workspace'].includes(configuration.packageSource)) throw new Error(`Unsupported package source: ${configuration.packageSource}`)
}

function hash(contents) {
  return createHash('sha256').update(contents).digest('hex')
}

function projectFiles(configuration, target) {
  return configuration.framework === 'react'
    ? reactFiles(configuration.name, configuration.packageSource, target, configuration.template, configuration)
    : vueFiles(configuration.name, configuration.packageSource, target, configuration.template, configuration)
}

async function readOptional(path) {
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    if (error && error.code === 'ENOENT') return undefined
    throw error
  }
}

async function writeFiles(target, files) {
  for (const [file, contents] of Object.entries(files)) {
    const path = resolve(target, file)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, contents)
  }
}

export async function createProject(options) {
  const {
    name,
    framework = 'react',
    backend = 'none',
    template = 'workbench',
    frameworkLayout = 'sidebar',
    density = 'standard',
    locale = 'zh-CN',
    adapter = 'native',
    packageSource = 'registry',
    cwd = process.cwd()
  } = options
  if (!validName.test(name)) throw new Error('Project name must use lowercase letters, numbers and hyphens')
  const configuration = { schemaVersion: 1, generatorVersion: packageVersion, name, framework, backend, template, frameworkLayout, density, locale, adapter, packageSource }
  validateConfiguration(configuration)
  const target = resolve(cwd, name)
  const files = projectFiles(configuration, target)
  await writeFiles(target, files)
  if (backend === 'java') {
    const javaTemplate = resolve(templateRoot, 'java-spring-boot')
    const javaBuildOutput = resolve(javaTemplate, 'target')
    await cp(javaTemplate, resolve(target, 'server'), {
      recursive: true,
      filter: (source) => basename(source) !== '.DS_Store' && source !== javaBuildOutput && !source.startsWith(`${javaBuildOutput}${sep}`)
    })
  }
  await writeFile(resolve(target, '.atlas-eids.json'), JSON.stringify({
    ...configuration,
    managedFiles: Object.fromEntries(Object.entries(files).map(([file, contents]) => [file, hash(contents)]))
  }, null, 2) + '\n')
  await writeFile(resolve(target, 'README.md'), `# ${name}\n\n由 Atlas EIDS CLI 生成，初始页面模板为 \`${template}\`（${pageBlueprints[template].title}）。\n\n## 前端\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n${backend === 'java' ? '\n## Java 后端\n\n需要 Java 21 与 Maven 3.9+。模板内置本地 JWT / 外部 OIDC、RBAC、租户校验、Flyway、PostgreSQL Profile、AI Provider 与 Agent 审批回放，接口和生产配置见 `server/README.md`。前端默认以本地 `analyst` Demo 账号获取 Token，可通过 `VITE_ATLAS_DEMO_USER`、`VITE_ATLAS_DEMO_PASSWORD` 和 `VITE_ATLAS_TENANT` 覆盖；生产环境应改接企业登录态。\n\n```bash\ncd server\nmvn test\nmvn spring-boot:run\n```\n' : ''}`)
  return { target, framework, backend, template, frameworkLayout, density, locale, adapter, packageSource, files: Object.keys(files) }
}

export function listPagePatterns() {
  return listBlueprints().map(({ id, sections, ...blueprint }) => ({
    id,
    ...blueprint,
    regions: sections.map(([title]) => title)
  }))
}

export function listApplicationLayouts() {
  return listLayouts()
}

export async function upgradeProject(options = {}) {
  const target = resolve(options.cwd ?? process.cwd(), options.target ?? '.')
  const metadataPath = resolve(target, '.atlas-eids.json')
  const metadataSource = await readOptional(metadataPath)
  if (!metadataSource) throw new Error(`Atlas project metadata not found: ${metadataPath}`)
  const previous = JSON.parse(metadataSource)
  const configuration = {
    ...previous,
    ...Object.fromEntries(['frameworkLayout', 'density', 'locale', 'adapter'].flatMap((key) => options[key] ? [[key, options[key]]] : [])),
    generatorVersion: packageVersion
  }
  delete configuration.managedFiles
  validateConfiguration(configuration)
  const files = projectFiles(configuration, target)
  const changes = []
  for (const [file, expected] of Object.entries(files)) {
    const current = await readOptional(resolve(target, file))
    const previousHash = previous.managedFiles?.[file]
    const status = current === undefined
      ? 'create'
      : current === expected
        ? 'unchanged'
        : previousHash && hash(current) !== previousHash
          ? 'conflict'
          : 'update'
    changes.push({ file, status })
  }
  const conflicts = changes.filter((change) => change.status === 'conflict')
  if (!options.dryRun && (options.force || conflicts.length === 0)) {
    const writable = Object.fromEntries(Object.entries(files).filter(([file]) => {
      const status = changes.find((change) => change.file === file)?.status
      return status === 'create' || status === 'update' || (status === 'conflict' && options.force)
    }))
    await writeFiles(target, writable)
    await writeFile(metadataPath, JSON.stringify({
      ...configuration,
      managedFiles: Object.fromEntries(Object.entries(files).map(([file, contents]) => [file, hash(contents)]))
    }, null, 2) + '\n')
  }
  return { target, dryRun: Boolean(options.dryRun), changes, conflicts }
}

export async function generatePage(options) {
  const blueprint = pageBlueprints[options.pattern]
  if (!blueprint) throw new Error(`Unknown page pattern: ${options.pattern}`)
  const framework = options.framework ?? 'react'
  if (!['react', 'vue'].includes(framework)) throw new Error(`Unsupported framework: ${framework}`)
  const source = framework === 'react' ? reactPageSource(options.pattern) : vuePageSource(options.pattern)
  const extension = framework === 'react' ? 'tsx' : 'vue'
  const target = resolve(options.cwd ?? process.cwd(), options.output ?? `${options.pattern}.atlas.${extension}`)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, source)
  return target
}

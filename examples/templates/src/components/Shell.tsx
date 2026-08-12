import { useState, type ReactNode } from 'react'
import { AtlasAvatar, AtlasBadge, AtlasButton, AtlasDropdown, AtlasOrb, AtlasSearchInput } from '@atlas-eids/react'
import { Bell, ChevronLeft, ChevronRight, Command, Menu, Moon, Search, Sun } from 'lucide-react'
import type { TemplateRoute } from '../template-types'

export function Shell({ routes, current, onNavigate, children, embedded = false }: { routes: TemplateRoute[]; current: string; onNavigate: (id: string) => void; children: ReactNode; embedded?: boolean }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [query, setQuery] = useState('')
  const groups = Array.from(new Set(routes.map((route) => route.group)))

  const navigate = (id: string) => { onNavigate(id); setMobileOpen(false) }
  if (embedded) return <main className="page-main embedded-main" id="main-content">{children}</main>
  return <div className={`pattern-app ${collapsed ? 'nav-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} data-atlas-theme={theme}>
    <header className="global-header">
      <button className="mobile-menu" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="打开导航"><Menu size={19} /></button>
      <a className="global-brand" href="#/workbench" aria-label="Atlas EIDS Pattern Lab 首页" onClick={() => navigate('workbench')}>
        <AtlasOrb size={32} showRing={false} label="Atlas EIDS" />
        <span><strong>Atlas EIDS</strong><small>Pattern Lab</small></span>
      </a>
      <button className="product-switch" type="button"><Command size={16} /><span>企业智能工作台</span></button>
      <div className="global-search"><Search size={16} /><input aria-label="全局搜索" placeholder="搜索页面、任务与对象" /><kbd>⌘ K</kbd></div>
      <div className="global-tools">
        <AtlasButton aria-label="切换主题" title="切换主题" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</AtlasButton>
        <button type="button" className="icon-button" aria-label="通知"><AtlasBadge dot><Bell size={18} /></AtlasBadge></button>
        <AtlasDropdown label={<span className="user-menu"><AtlasAvatar name="王六" size={28} /><b>王六</b></span>} items={[{ id: 'profile', label: '个人中心' }, { id: 'tenant', label: '切换租户' }, { id: 'logout', label: '退出登录', danger: true }]} onSelect={() => undefined} />
      </div>
    </header>

    <aside className="side-nav">
      <div className="mobile-nav-search"><AtlasSearchInput value={query} onChange={setQuery} onSearch={setQuery} placeholder="筛选模板" /></div>
      <nav aria-label="模板导航">
        {groups.map((group) => <section key={group}><h2>{group}</h2>{routes.filter((route) => route.group === group && route.label.includes(query)).map((route) => {
          const Icon = route.icon
          return <button key={route.id} type="button" className={current === route.id ? 'active' : ''} aria-current={current === route.id ? 'page' : undefined} onClick={() => navigate(route.id)} title={collapsed ? route.label : undefined}><Icon size={17} /><span>{route.label}</span></button>
        })}</section>)}
      </nav>
      <button type="button" className="collapse-nav" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? '展开导航' : '收起导航'}>{collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>收起导航</span></>}</button>
    </aside>

    <main className="page-main" id="main-content">{children}</main>
    <button type="button" className="mobile-mask" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />
  </div>
}

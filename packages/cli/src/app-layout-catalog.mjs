export const applicationLayouts = {
  sidebar: {
    title: '左侧导航框架',
    description: '左侧菜单、轻量品牌栏与稳定内容区，适合 ERP、CRM 和后台管理。',
    navigation: 'side',
    regions: ['brand', 'sidebar', 'content'],
    capabilities: ['route-navigation', 'permission-menu', 'theme-switch']
  },
  top: {
    title: '顶部导航框架',
    description: '顶部一级导航与通栏内容区，适合门户和业务模块较少的系统。',
    navigation: 'top',
    regions: ['header', 'topnav', 'content'],
    capabilities: ['route-navigation', 'permission-menu', 'theme-switch']
  },
  hybrid: {
    title: '混合导航框架',
    description: '顶部产品导航与左侧业务菜单组合，适合大型平台。',
    navigation: 'hybrid',
    regions: ['header', 'topnav', 'sidebar', 'content'],
    capabilities: ['product-navigation', 'business-navigation', 'permission-menu', 'theme-switch']
  },
  workbench: {
    title: '工作台框架',
    description: '应用入口、待办、消息和业务指标共同构成角色工作台。',
    navigation: 'launcher',
    regions: ['header', 'launcher', 'content'],
    capabilities: ['application-launcher', 'route-navigation', 'theme-switch']
  },
  tabs: {
    title: '多标签页框架',
    description: '导航、页面标签栏和内容区并存，支持高频多任务切换。',
    navigation: 'tabs',
    regions: ['header', 'sidebar', 'tabs', 'content'],
    capabilities: ['persistent-tabs', 'route-navigation', 'permission-menu', 'theme-switch']
  },
  fullscreen: {
    title: '全屏工作区框架',
    description: '精简导航、工具栏和全屏画布，适合设计器、编排器与大屏。',
    navigation: 'workspace',
    regions: ['toolbar', 'canvas'],
    capabilities: ['fullscreen-canvas', 'compact-toolbar', 'route-navigation', 'theme-switch']
  },
  tenant: {
    title: '多租户框架',
    description: '租户切换、系统导航和租户内容明确分层，适合 SaaS 管理平台。',
    navigation: 'tenant',
    regions: ['header', 'tenant-switcher', 'sidebar', 'content'],
    capabilities: ['tenant-switch', 'tenant-header', 'permission-menu', 'route-navigation', 'theme-switch']
  }
}

export const layoutIds = Object.keys(applicationLayouts)

export function listApplicationLayouts() {
  return Object.entries(applicationLayouts).map(([id, layout]) => ({ id, ...layout }))
}

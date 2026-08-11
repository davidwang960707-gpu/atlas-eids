export const applicationLayouts = {
  sidebar: {
    title: '左侧导航框架',
    description: '左侧菜单、轻量品牌栏与稳定内容区，适合 ERP、CRM 和后台管理。',
    regions: ['brand', 'sidebar', 'content']
  },
  top: {
    title: '顶部导航框架',
    description: '顶部一级导航与通栏内容区，适合门户和业务模块较少的系统。',
    regions: ['header', 'topnav', 'content']
  },
  hybrid: {
    title: '混合导航框架',
    description: '顶部产品导航与左侧业务菜单组合，适合大型平台。',
    regions: ['header', 'topnav', 'sidebar', 'content']
  },
  workbench: {
    title: '工作台框架',
    description: '应用入口、待办、消息和业务指标共同构成角色工作台。',
    regions: ['header', 'launcher', 'content']
  },
  tabs: {
    title: '多标签页框架',
    description: '导航、页面标签栏和内容区并存，支持高频多任务切换。',
    regions: ['header', 'sidebar', 'tabs', 'content']
  },
  fullscreen: {
    title: '全屏工作区框架',
    description: '精简导航、工具栏和全屏画布，适合设计器、编排器与大屏。',
    regions: ['toolbar', 'canvas']
  },
  tenant: {
    title: '多租户框架',
    description: '租户切换、系统导航和租户内容明确分层，适合 SaaS 管理平台。',
    regions: ['header', 'tenant-switcher', 'sidebar', 'content']
  }
}

export const layoutIds = Object.keys(applicationLayouts)

export function listApplicationLayouts() {
  return Object.entries(applicationLayouts).map(([id, layout]) => ({ id, ...layout }))
}

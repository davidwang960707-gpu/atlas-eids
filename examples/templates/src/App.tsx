import { lazy, Suspense, useEffect, useState } from 'react'
import { AtlasProvider, AtlasSkeleton } from '@atlas-eids/react'
import { BarChart3, Bot, BrainCircuit, CalendarDays, ClipboardCheck, Columns3, FolderOpen, FormInput, LayoutDashboard, ListChecks, MessageSquareText, Settings2, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { Shell } from './components/Shell'
import type { TemplateRoute } from './template-types'

const WorkbenchPage = lazy(() => import('./pages/WorkbenchPage').then((module) => ({ default: module.WorkbenchPage })))
const DataListPage = lazy(() => import('./pages/DataListPage').then((module) => ({ default: module.DataListPage })))
const CardListPage = lazy(() => import('./pages/CardListPage').then((module) => ({ default: module.CardListPage })))
const DetailPage = lazy(() => import('./pages/DetailPage').then((module) => ({ default: module.DetailPage })))
const FormPage = lazy(() => import('./pages/FormPage').then((module) => ({ default: module.FormPage })))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))
const ApprovalPage = lazy(() => import('./pages/ApprovalPage').then((module) => ({ default: module.ApprovalPage })))
const KanbanPage = lazy(() => import('./pages/KanbanPage').then((module) => ({ default: module.KanbanPage })))
const CalendarPage = lazy(() => import('./pages/CalendarPage').then((module) => ({ default: module.CalendarPage })))
const FileManagerPage = lazy(() => import('./pages/FileManagerPage').then((module) => ({ default: module.FileManagerPage })))
const AIChatPage = lazy(() => import('./pages/AIChatPage').then((module) => ({ default: module.AIChatPage })))
const AgentTaskPage = lazy(() => import('./pages/AgentTaskPage').then((module) => ({ default: module.AgentTaskPage })))
const AIReviewPage = lazy(() => import('./pages/AIReviewPage').then((module) => ({ default: module.AIReviewPage })))
const AIGovernancePage = lazy(() => import('./pages/AIGovernancePage').then((module) => ({ default: module.AIGovernancePage })))
const AIKnowledgePage = lazy(() => import('./pages/AIKnowledgePage').then((module) => ({ default: module.AIKnowledgePage })))

export const templateRoutes: TemplateRoute[] = [
  { id: 'workbench', group: '通用页面', label: '角色工作台', description: '待办、指标与业务动态', icon: LayoutDashboard, component: WorkbenchPage },
  { id: 'data-list', group: '通用页面', label: '数据列表页', description: '查询、表格与批量操作', icon: ListChecks, component: DataListPage },
  { id: 'card-list', group: '通用页面', label: '卡片列表页', description: '能力与应用目录', icon: Columns3, component: CardListPage },
  { id: 'detail', group: '通用页面', label: '客户详情页', description: '对象摘要与关系信息', icon: UserRound, component: DetailPage },
  { id: 'form', group: '通用页面', label: '分步表单页', description: '复杂配置与提交确认', icon: FormInput, component: FormPage },
  { id: 'analytics', group: '通用页面', label: '经营分析页', description: '指标、趋势与风险', icon: BarChart3, component: AnalyticsPage },
  { id: 'settings', group: '通用页面', label: '系统设置页', description: '组织级配置', icon: Settings2, component: SettingsPage },
  { id: 'approval', group: '业务场景', label: '审批详情页', description: '信息、记录与决策', icon: ClipboardCheck, component: ApprovalPage },
  { id: 'kanban', group: '业务场景', label: '任务看板页', description: '任务状态流转', icon: Columns3, component: KanbanPage },
  { id: 'calendar', group: '业务场景', label: '团队日历页', description: '日程与资源安排', icon: CalendarDays, component: CalendarPage },
  { id: 'files', group: '业务场景', label: '文件管理页', description: '目录、文件与预览', icon: FolderOpen, component: FileManagerPage },
  { id: 'ai-chat', group: 'AI 原生', label: 'AI 对话页', description: '消息、引用与反馈', icon: MessageSquareText, component: AIChatPage },
  { id: 'agent-task', group: 'AI 原生', label: 'Agent 任务工作台', description: '计划、工具与审批', icon: Bot, component: AgentTaskPage },
  { id: 'ai-review', group: 'AI 原生', label: 'AI 生成审阅页', description: '对比、接受与撤销', icon: Sparkles, component: AIReviewPage },
  { id: 'ai-governance', group: 'AI 原生', label: 'AI 审计治理页', description: '调用、风险与审计', icon: ShieldCheck, component: AIGovernancePage },
  { id: 'ai-knowledge', group: 'AI 原生', label: 'AI 知识工作台', description: '知识源、检索与引用', icon: BrainCircuit, component: AIKnowledgePage }
]

const routeFromHash = () => window.location.hash.replace(/^#\/?/, '') || 'workbench'

export function App() {
  const [current, setCurrent] = useState(routeFromHash)
  useEffect(() => { const onHashChange = () => setCurrent(routeFromHash()); window.addEventListener('hashchange', onHashChange); return () => window.removeEventListener('hashchange', onHashChange) }, [])
  const route = templateRoutes.find((item) => item.id === current) ?? templateRoutes[0]
  const Page = route.component
  const navigate = (id: string) => { window.location.hash = `/${id}`; setCurrent(id); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const embedded = new URLSearchParams(window.location.search).get('embed') === '1'
  return <AtlasProvider><Shell routes={templateRoutes} current={route.id} onNavigate={navigate} embedded={embedded}><Suspense fallback={<div className="page-loading"><AtlasSkeleton lines={8} label="页面模板加载中"/></div>}><Page/></Suspense></Shell></AtlasProvider>
}

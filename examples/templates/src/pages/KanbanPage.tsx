import { useState } from 'react'
import { AtlasAvatar, AtlasButton, AtlasDropdown, AtlasTag } from '@atlas-eids/react'
import { CalendarDays, MoreHorizontal, Plus } from 'lucide-react'
import { PageHeader, StatusDot } from '../components/Page'

const initial = [
  { id: 'KB-18', title: '梳理客户续约风险规则', owner: '王六', status: 'todo', priority: '高', due: '8月13日', tag: '经营分析' },
  { id: 'KB-19', title: '接入知识库增量同步', owner: '林可', status: 'todo', priority: '中', due: '8月15日', tag: '知识工程' },
  { id: 'KB-20', title: '完成 Agent 权限回归测试', owner: '周宁', status: 'doing', priority: '高', due: '今天', tag: '安全治理' },
  { id: 'KB-21', title: '优化经营驾驶舱首屏', owner: '陈启', status: 'doing', priority: '中', due: '8月16日', tag: '体验设计' },
  { id: 'KB-22', title: '发布多租户审计能力', owner: '吴越', status: 'review', priority: '高', due: '8月12日', tag: '平台工程' },
  { id: 'KB-23', title: '归档七月服务报告', owner: '王六', status: 'done', priority: '低', due: '已完成', tag: '客户成功' }
]

export function KanbanPage() {
  const [tasks, setTasks] = useState(initial)
  const columns = [{ id: 'todo', label: '待处理' }, { id: 'doing', label: '进行中' }, { id: 'review', label: '待复核' }, { id: 'done', label: '已完成' }]
  const move = (id: string, direction: number) => setTasks(tasks.map((task) => task.id === id ? { ...task, status: columns[Math.max(0, Math.min(columns.length - 1, columns.findIndex((column) => column.id === task.status) + direction))].id } : task))
  return <>
    <PageHeader eyebrow="业务场景" title="任务看板页" description="围绕状态流转组织工作，通过轻量操作推进任务并保留责任上下文。" primary="新建任务" />
    <div className="kanban-toolbar"><div><AtlasTag intent="primary">产品交付</AtlasTag><span>迭代 26.8 · 8 月 5 日至 8 月 18 日</span></div><div><AtlasAvatar name="王六"/><AtlasAvatar name="林可"/><AtlasAvatar name="周宁"/><AtlasButton size="compact"><Plus size={14}/>邀请</AtlasButton></div></div>
    <div className="kanban-board">{columns.map((column) => <section className="kanban-column" key={column.id}><header><StatusDot tone={column.id === 'review' ? 'warning' : column.id === 'done' ? 'success' : 'neutral'}>{column.label}</StatusDot><b>{tasks.filter((task) => task.status === column.id).length}</b><AtlasButton size="compact" aria-label={`在${column.label}新建任务`}><Plus size={14}/></AtlasButton></header><div>{tasks.filter((task) => task.status === column.id).map((task) => <article className="kanban-card" key={task.id}><div className="kanban-card-top"><span>{task.id}</span><AtlasDropdown label={<MoreHorizontal size={15}/>} items={[{ id: 'left', label: '移到上一列', disabled: column.id === 'todo' }, { id: 'right', label: '移到下一列', disabled: column.id === 'done' }, { id: 'delete', label: '删除', danger: true }]} onSelect={(action) => action === 'delete' ? setTasks(tasks.filter((item) => item.id !== task.id)) : move(task.id, action === 'left' ? -1 : 1)}/></div><h2>{task.title}</h2><AtlasTag intent={task.priority === '高' ? 'danger' : task.priority === '中' ? 'warning' : 'neutral'}>{task.priority}优先级</AtlasTag><footer><span><AtlasAvatar name={task.owner} size={26}/>{task.owner}</span><small><CalendarDays size={13}/>{task.due}</small></footer></article>)}</div></section>)}</div>
  </>
}

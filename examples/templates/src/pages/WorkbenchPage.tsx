import { useState } from 'react'
import { AtlasAlert, AtlasButton, AtlasProgress, AtlasStatistic, AtlasTag } from '@atlas-eids/react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowUpRight, Check, Clock3 } from 'lucide-react'
import { PageHeader, Panel, StatusDot } from '../components/Page'

const trend = [
  { day: '周一', tasks: 86, ai: 46 }, { day: '周二', tasks: 102, ai: 58 }, { day: '周三', tasks: 94, ai: 61 },
  { day: '周四', tasks: 126, ai: 76 }, { day: '周五', tasks: 118, ai: 82 }, { day: '周六', tasks: 132, ai: 91 }, { day: '今天', tasks: 148, ai: 106 }
]

export function WorkbenchPage() {
  const [notice, setNotice] = useState(true)
  const [done, setDone] = useState<string[]>([])
  const tasks = [{ id: 'a', title: '确认华东区预算调整', owner: '财务共享中心', time: '10:30' }, { id: 'b', title: '复核 Agent 批处理范围', owner: '数据运营组', time: '14:00' }, { id: 'c', title: '发布客户洞察周报', owner: '经营分析组', time: '17:30' }]
  return <>
    <PageHeader eyebrow="通用页面" title="角色工作台" description="聚合待办、经营指标和 AI 执行状态，支持用户在一个页面完成高频决策。" primary="创建任务" onPrimary={() => document.getElementById('task-list')?.scrollIntoView()} />
    {notice && <AtlasAlert title="3 个高风险任务等待确认" description="Agent 已完成预执行检查，在人工批准前不会写入生产系统。" intent="warning" closable onClose={() => setNotice(false)} />}
    <div className="stat-grid">
      <AtlasStatistic label="今日待办" value={18} trend="down" trendLabel="较昨日 3 项" />
      <AtlasStatistic label="运行流程" value="1,284" trend="up" trendLabel="本周 +12.4%" />
      <AtlasStatistic label="AI 协同率" value={68} suffix="%" trend="up" trendLabel="本月 +8.1%" />
      <AtlasStatistic label="平均处理时长" value={4.6} suffix="h" trend="down" trendLabel="缩短 32min" />
    </div>
    <div className="dashboard-grid">
      <Panel title="工作负载趋势" description="任务吞吐与 AI 协同处理量" action={<AtlasTag intent="success">实时</AtlasTag>} className="chart-panel">
        <div className="chart-wrap" role="img" aria-label="过去七日工作负载面积图">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={{ width: 720, height: 270 }}><AreaChart data={trend} margin={{ top: 10, right: 6, left: -22, bottom: 4 }}><defs><linearGradient id="tasks-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7B61FF" stopOpacity=".28"/><stop offset="1" stopColor="#7B61FF" stopOpacity=".02"/></linearGradient></defs><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="var(--atlas-color-border-default)"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--atlas-color-text-tertiary)', fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--atlas-color-text-tertiary)', fontSize: 12 }}/><Tooltip contentStyle={{ borderRadius: 6, borderColor: 'var(--atlas-color-border-default)' }}/><Area isAnimationActive={false} type="monotone" dataKey="tasks" stroke="#7B61FF" strokeWidth={2} fill="url(#tasks-fill)" activeDot={{ r: 4 }}/><Area isAnimationActive={false} type="monotone" dataKey="ai" stroke="#06B6D4" strokeWidth={2} fill="transparent" activeDot={{ r: 4 }}/></AreaChart></ResponsiveContainer>
        </div>
        <div className="chart-legend"><span><i className="violet"/>全部任务</span><span><i className="cyan"/>AI 协同</span></div>
      </Panel>
      <Panel title="今日待办" description={`${done.length}/${tasks.length} 已完成`} className="task-panel">
        <div className="task-list" id="task-list">{tasks.map((task) => <button type="button" key={task.id} className={done.includes(task.id) ? 'done' : ''} onClick={() => setDone(done.includes(task.id) ? done.filter((id) => id !== task.id) : [...done, task.id])}><i>{done.includes(task.id) ? <Check size={14}/> : <Clock3 size={14}/>}</i><span><strong>{task.title}</strong><small>{task.owner}</small></span><time>{task.time}</time></button>)}</div>
        <AtlasButton className="full-action">进入待办中心 <ArrowUpRight size={15}/></AtlasButton>
      </Panel>
      <Panel title="目标完成度" description="本月核心目标推进情况">
        <div className="progress-list"><AtlasProgress label="客户运营自动化" value={82}/><AtlasProgress label="知识库治理" value={64} intent="success"/><AtlasProgress label="财务流程迁移" value={47} intent="warning"/></div>
      </Panel>
      <Panel title="系统健康" description="关键服务运行状态">
        <div className="health-list"><span><StatusDot>核心 API</StatusDot><b>99.98%</b></span><span><StatusDot>Agent Runtime</StatusDot><b>184 ms</b></span><span><StatusDot tone="warning">知识检索</StatusDot><b>轻微延迟</b></span></div>
      </Panel>
    </div>
  </>
}

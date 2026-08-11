import { useState } from 'react'
import { AtlasButton, AtlasDialog, AtlasInput, AtlasSelect, AtlasTag } from '@atlas-eids/react'
import { ChevronLeft, ChevronRight, Clock3, MapPin } from 'lucide-react'
import { PageHeader, Panel } from '../components/Page'

const events = [{ day: 3, title: '周经营例会', tone: 'primary' }, { day: 5, title: '华东客户复盘', tone: 'success' }, { day: 7, title: 'Agent 评审', tone: 'warning' }, { day: 11, title: '产品路线图同步', tone: 'primary' }, { day: 12, title: '安全策略演练', tone: 'danger' }, { day: 18, title: '版本发布窗口', tone: 'success' }, { day: 21, title: '客户成功培训', tone: 'warning' }, { day: 26, title: '月度数据结算', tone: 'primary' }]

export function CalendarPage() {
  const [selected, setSelected] = useState(12)
  const [dialog, setDialog] = useState(false)
  const dayEvent = events.find((event) => event.day === selected)
  return <>
    <PageHeader eyebrow="业务场景" title="团队日历页" description="统一呈现会议、里程碑与资源安排，支持按日期快速创建日程。" primary="新建日程" onPrimary={() => setDialog(true)} />
    <div className="calendar-layout">
      <Panel className="calendar-panel"><div className="calendar-head"><div><AtlasButton aria-label="上个月"><ChevronLeft size={16}/></AtlasButton><h2>2026 年 8 月</h2><AtlasButton aria-label="下个月"><ChevronRight size={16}/></AtlasButton></div><AtlasButton>今天</AtlasButton></div><div className="calendar-grid calendar-week"><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div><div className="calendar-grid calendar-days">{Array.from({ length: 35 }, (_, index) => { const day = index - 4; const event = events.find((item) => item.day === day); return <button key={index} type="button" disabled={day < 1 || day > 31} className={`${selected === day ? 'selected' : ''} ${day === 11 ? 'today' : ''}`} onClick={() => setSelected(day)}><span>{day > 0 && day <= 31 ? day : ''}</span>{event && <small className={`is-${event.tone}`}>{event.title}</small>}</button> })}</div></Panel>
      <aside className="calendar-agenda"><header><span>8 月 {selected} 日</span><h2>{dayEvent ? '1 项安排' : '暂无安排'}</h2></header>{dayEvent ? <article><AtlasTag intent={dayEvent.tone as 'primary' | 'success' | 'warning' | 'danger'}>{dayEvent.title}</AtlasTag><h3>{dayEvent.title}</h3><p><Clock3 size={14}/> 14:00 - 15:30</p><p><MapPin size={14}/> Atlas 会议室 3</p><div className="agenda-attendees"><span>王</span><span>林</span><span>周</span><small>+4</small></div><AtlasButton intent="primary">查看详情</AtlasButton></article> : <div className="agenda-empty"><p>这一天还没有安排。</p><AtlasButton onClick={() => setDialog(true)}>创建日程</AtlasButton></div>}</aside>
    </div>
    <AtlasDialog open={dialog} title="创建日程" onClose={() => setDialog(false)} footer={<><AtlasButton onClick={() => setDialog(false)}>取消</AtlasButton><AtlasButton intent="primary" onClick={() => setDialog(false)}>创建</AtlasButton></>}><div className="dialog-form"><AtlasInput label="日程主题" placeholder="输入日程名称"/><AtlasInput label="开始时间" type="datetime-local"/><AtlasSelect label="日程类型" options={[{ label: '会议', value: 'meeting' }, { label: '里程碑', value: 'milestone' }]}/></div></AtlasDialog>
  </>
}

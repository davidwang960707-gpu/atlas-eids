import { useState } from 'react'
import { AtlasButton, AtlasSegmentedControl, AtlasSelect, AtlasStatistic, AtlasTag } from '@atlas-eids/react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Maximize2, Sparkles } from 'lucide-react'
import { ExportButton, PageHeader, Panel, StatusDot } from '../components/Page'

const revenue = [{ month: '2月', actual: 76, target: 72 }, { month: '3月', actual: 84, target: 79 }, { month: '4月', actual: 80, target: 86 }, { month: '5月', actual: 96, target: 91 }, { month: '6月', actual: 104, target: 98 }, { month: '7月', actual: 112, target: 106 }, { month: '8月', actual: 126, target: 114 }]
const regions = [{ name: '华东', value: 86 }, { name: '华南', value: 72 }, { name: '华北', value: 64 }, { name: '西南', value: 51 }, { name: '海外', value: 38 }]

export function AnalyticsPage() {
  const [period, setPeriod] = useState('month')
  return <>
    <PageHeader eyebrow="分析与报表" title="经营分析页" description="以指标、趋势、结构和异常为主线，让经营信息可比较、可下钻。" primary="创建订阅" />
    <div className="analysis-toolbar"><AtlasSegmentedControl label="统计周期" value={period} onChange={setPeriod} items={[{ label: '本月', value: 'month' }, { label: '本季', value: 'quarter' }, { label: '本年', value: 'year' }]}/><AtlasSelect aria-label="所属区域" defaultValue="all" options={[{ label: '全部区域', value: 'all' }, { label: '华东区', value: 'east' }, { label: '华南区', value: 'south' }]}/><ExportButton/></div>
    <div className="stat-grid analysis-stats"><AtlasStatistic label="经营收入" value="1.26" suffix="亿" trend="up" trendLabel="同比 +18.4%"/><AtlasStatistic label="综合毛利率" value="42.8" suffix="%" trend="up" trendLabel="提升 2.1pp"/><AtlasStatistic label="活跃客户" value="8,642" trend="up" trendLabel="净增 386"/><AtlasStatistic label="风险敞口" value="286" suffix="万" trend="down" trendLabel="降低 12.6%"/></div>
    <div className="analytics-grid">
      <Panel title="收入与目标趋势" description="单位：百万元" action={<AtlasButton size="compact" aria-label="放大趋势图"><Maximize2 size={14}/></AtlasButton>} className="revenue-panel"><div className="chart-wrap large"><ResponsiveContainer width="100%" height="100%"><LineChart data={revenue} margin={{ top: 12, right: 14, left: -18, bottom: 2 }}><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="var(--atlas-color-border-default)"/><XAxis dataKey="month" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Line isAnimationActive={false} type="monotone" dataKey="actual" stroke="#7B61FF" strokeWidth={3} dot={{ r: 3, fill: '#7B61FF', strokeWidth: 0 }} activeDot={{ r: 5 }}/><Line isAnimationActive={false} type="monotone" dataKey="target" stroke="#86909C" strokeWidth={1.5} strokeDasharray="5 5" dot={false}/></LineChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="violet"/>实际收入</span><span><i className="gray"/>经营目标</span></div></Panel>
      <Panel title="区域贡献" description="按确认收入排序"><div className="chart-wrap bars"><ResponsiveContainer width="100%" height="100%"><BarChart data={regions} layout="vertical" margin={{ top: 0, right: 12, left: 2, bottom: 0 }}><XAxis type="number" hide/><YAxis type="category" dataKey="name" width={42} axisLine={false} tickLine={false}/><Tooltip cursor={{ fill: 'var(--atlas-color-bg-subtle)' }}/><Bar isAnimationActive={false} dataKey="value" radius={[0, 3, 3, 0]} barSize={12}>{regions.map((_, index) => <Cell key={index} fill={index === 0 ? '#7B61FF' : index === 1 ? '#4F46E5' : '#B7A7FF'} opacity={1 - index * .1}/>)}</Bar></BarChart></ResponsiveContainer></div></Panel>
      <Panel title="AI 经营洞察" action={<AtlasTag intent="primary"><Sparkles size={12}/> Atlas</AtlasTag>} className="insight-panel"><div className="insight-summary"><strong>本月收入高于目标 10.5%</strong><p>主要由华东区设备服务续约拉动；海外渠道转化仍低于基线，建议复核重点商机的交付周期。</p></div><ul className="insight-list"><li><StatusDot>华东区续约贡献 46%</StatusDot><span>正向</span></li><li><StatusDot tone="warning">海外商机周期延长 8 天</StatusDot><span>关注</span></li><li><StatusDot>毛利率连续 3 月改善</StatusDot><span>稳定</span></li></ul></Panel>
      <Panel title="重点风险"><table className="compact-table"><thead><tr><th>风险事项</th><th>影响</th><th>责任团队</th></tr></thead><tbody><tr><td>交付资源冲突</td><td><AtlasTag intent="warning">中</AtlasTag></td><td>华南交付中心</td></tr><tr><td>应收账款超期</td><td><AtlasTag intent="danger">高</AtlasTag></td><td>企业客户部</td></tr><tr><td>渠道目标缺口</td><td><AtlasTag intent="warning">中</AtlasTag></td><td>海外事业部</td></tr></tbody></table></Panel>
    </div>
  </>
}

import React, { useMemo, useState } from 'react';
import './FrameworkGallery.css';

const frameworks = [
  { id: 'sidebar', name: '左侧导航', structure: '菜单 + 工具栏 + 内容区', use: 'ERP、CRM 与后台管理系统' },
  { id: 'top', name: '顶部导航', structure: '一级导航 + 内容区', use: '门户与轻量业务系统' },
  { id: 'mixed', name: '混合导航', structure: '产品导航 + 业务菜单', use: '大型平台与多产品系统' },
  { id: 'workbench', name: '工作台', structure: '应用入口 + 待办 + 指标', use: 'OA、协同办公与员工门户' },
  { id: 'tabs', name: '多标签页', structure: '导航 + 页面标签 + 内容', use: 'ERP 与高频多任务场景' },
  { id: 'canvas', name: '全屏工作区', structure: '精简导航 + 工具栏 + 画布', use: '设计器、编排器与大屏' },
  { id: 'tenant', name: '多租户', structure: '租户切换 + 系统导航', use: 'SaaS 管理平台' }
] as const;

const tasks = [
  { id: 'AT-1048', name: '内容质量检查', agent: 'Atlas Review', state: '运行中', time: '刚刚' },
  { id: 'AT-1047', name: '知识索引更新', agent: 'Knowledge Agent', state: '待确认', time: '4 分钟前' },
  { id: 'AT-1046', name: '数据异常识别', agent: 'Insight Agent', state: '已完成', time: '12 分钟前' },
  { id: 'AT-1045', name: '周报摘要生成', agent: 'Writing Agent', state: '已完成', time: '28 分钟前' }
];

const navItems = ['概览', '任务中心', '智能分析', '运行记录'];
const productItems = ['工作台', '任务', '分析'];
const pageTabs = ['工作台', '任务详情', '分析报告'];
const tenants = ['North Region', 'Global Studio', 'Sandbox Team'];

const FrameworkGallery: React.FC = () => {
  const [activeId, setActiveId] = useState<(typeof frameworks)[number]['id']>('sidebar');
  const [activeNav, setActiveNav] = useState('概览');
  const [activeProduct, setActiveProduct] = useState('工作台');
  const [activePageTab, setActivePageTab] = useState('任务详情');
  const [tenantIndex, setTenantIndex] = useState(0);
  const [selectedTask, setSelectedTask] = useState('AT-1048');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  const active = frameworks.find((item) => item.id === activeId) ?? frameworks[0];
  const filteredTasks = useMemo(() => tasks.filter((task) => `${task.id}${task.name}${task.agent}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  };

  return (
    <section className="content-section framework-gallery" id="frameworks">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Application Frameworks</span>
          <h2>七种系统骨架，七个真实工作区</h2>
        </div>
        <p>选择框架后可以切换导航、筛选任务、选择记录、切换租户或操作画布。</p>
      </div>

      <div className="framework-tabs" role="tablist" aria-label="应用框架">
        {frameworks.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={activeId === item.id} className={activeId === item.id ? 'active' : ''} onClick={() => setActiveId(item.id)}>{item.name}</button>
        ))}
      </div>

      <div className={`framework-preview layout-${activeId}`}>
        <div className="preview-productbar">
          <div className="preview-brand-mark"></div>
          <strong>Atlas Workspace</strong>
          <div className="preview-product-links">
            {productItems.map((item) => <button key={item} type="button" className={activeProduct === item ? 'active' : ''} onClick={() => setActiveProduct(item)}>{item}</button>)}
          </div>
          {activeId === 'tenant' && <button className="preview-tenant" type="button" onClick={() => { setTenantIndex((tenantIndex + 1) % tenants.length); flash('租户上下文已切换'); }}>{tenants[tenantIndex]} <span>⌄</span></button>}
          <div className="preview-global-actions"><button type="button" aria-label="搜索" onClick={() => flash('已打开全局搜索')}>⌕</button><button type="button" aria-label="通知" onClick={() => flash('当前没有未读通知')}>·</button><span className="preview-avatar">WL</span></div>
        </div>

        <aside className="preview-sidebar">
          <div className="preview-sidebar-title">Workspace</div>
          {navItems.map((item, index) => <button key={item} type="button" className={activeNav === item ? 'is-active' : ''} onClick={() => setActiveNav(item)}><i>{['⌂', '□', '⌁', '◷'][index]}</i>{item}</button>)}
          <div className="preview-sidebar-agent"><span></span><div><strong>Atlas Core</strong><small>在线 · 3 个任务</small></div></div>
        </aside>

        <div className="preview-main">
          <div className="preview-toolbar">
            <div><span>Workspace / {activeProduct}</span><strong>{active.name}框架</strong><small>{active.structure}</small></div>
            <div className="preview-toolbar-actions"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索任务" /></label><button type="button" onClick={() => flash('示例任务已创建')}>新建任务</button></div>
          </div>

          {activeId === 'tabs' && <div className="preview-page-tabs">{pageTabs.map((item) => <button key={item} type="button" className={activePageTab === item ? 'active' : ''} onClick={() => setActivePageTab(item)}>{item}<span>{item === '任务详情' ? '×' : ''}</span></button>)}</div>}

          {activeId === 'canvas' ? (
            <div className="preview-canvas-shell">
              <div className="preview-canvas-tools"><button type="button" onClick={() => flash('已撤销上一步')}>↶</button><button type="button" onClick={() => flash('已重做')}>↷</button><span>72%</span><button type="button" onClick={() => flash('画布已居中')}>⌖</button></div>
              <div className="preview-canvas-workspace"><div className="preview-node"><span>Input</span><strong>接收业务数据</strong><small>Schema validated</small></div><i></i><div className="preview-node strong"><span>Agent</span><strong>分析并生成结论</strong><small>Atlas Reasoner</small></div><i></i><div className="preview-node"><span>Human</span><strong>人工确认</strong><small>Required</small></div></div>
            </div>
          ) : activeId === 'workbench' ? (
            <div className="preview-workbench">
              <div className="preview-apps"><header><strong>常用应用</strong><button type="button" onClick={() => flash('已打开全部应用')}>全部应用</button></header><div>{['AI 协作', '任务中心', '数据分析', '知识库'].map((item, index) => <button key={item} type="button" onClick={() => flash(`已打开${item}`)}><i>{index + 1}</i><span>{item}</span></button>)}</div></div>
              <div className="preview-todos"><header><strong>我的待办</strong><span>6 项</span></header>{tasks.slice(0, 3).map((task) => <button key={task.id} type="button" onClick={() => setSelectedTask(task.id)} className={selectedTask === task.id ? 'active' : ''}><i></i><span><strong>{task.name}</strong><small>{task.agent}</small></span><em>{task.time}</em></button>)}</div>
              <div className="preview-workbench-metric"><span>本周完成率</span><strong>96.4%</strong><div><i></i></div><small>较上周提升 4.8%</small></div>
            </div>
          ) : (
            <div className="preview-dashboard">
              <div className="preview-metrics"><article><small>运行任务</small><strong>1,284</strong><em>+12.4%</em></article><article><small>待确认</small><strong>18</strong><em>高优先级 4 项</em></article><article><small>平均耗时</small><strong>2m 16s</strong><em>-18s</em></article><article><small>成功率</small><strong>98.6%</strong><em>目标 97%</em></article></div>
              <div className="preview-chart"><header><div><small>最近 7 天</small><strong>智能任务运行趋势</strong></div><button type="button" onClick={() => flash('图表已导出')}>导出</button></header><div className="preview-chart-canvas"><span></span><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="任务运行趋势"><path d="M0 150 C60 144 88 98 145 114 C205 130 228 72 292 84 C350 96 376 42 438 58 C498 74 548 30 600 20" /><path d="M0 165 C76 154 104 148 160 153 C220 160 256 125 310 136 C374 148 412 108 468 121 C524 133 562 102 600 108" /></svg><div><span>周一</span><span>周二</span><span>周三</span><span>周四</span><span>周五</span><span>周六</span><span>周日</span></div></div></div>
              <div className="preview-queue"><header><strong>任务队列</strong><span>{filteredTasks.length} 项</span></header><div className="preview-table-head"><span>任务</span><span>负责人</span><span>状态</span><span>更新时间</span></div>{filteredTasks.map((task) => <button key={task.id} type="button" className={selectedTask === task.id ? 'selected' : ''} onClick={() => setSelectedTask(task.id)}><span><b>{task.name}</b><small>{task.id}</small></span><span>{task.agent}</span><em className={`state-${task.state}`}>{task.state}</em><time>{task.time}</time></button>)}</div>
            </div>
          )}
          <div className={`preview-notice ${notice ? 'show' : ''}`} role="status">{notice}</div>
        </div>
      </div>

      <div className="framework-meta"><strong>{active.name}框架</strong><span>{active.structure}</span><span>适用：{active.use}</span><b>可交互 Demo</b></div>
    </section>
  );
};

export default FrameworkGallery;

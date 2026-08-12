import React, { useState } from 'react';
import AgentOrb, { OrbState } from './components/AgentOrb';
import AgentCard from './components/AgentCard';
import NeuralInput from './components/NeuralInput';
import StreamBlock from './components/StreamBlock';
import InsightPanel from './components/InsightPanel';
import MetricStrip from './components/MetricStrip';
import WorkflowTimeline from './components/WorkflowTimeline';
import FrameworkGallery from './components/FrameworkGallery';
import AITrustPanel from './components/AITrustPanel';
import './App.css';

const orbStates: Array<{ state: OrbState; label: string; note: string }> = [
  { state: 'idle', label: 'Idle', note: '低频呼吸' },
  { state: 'thinking', label: 'Thinking', note: '液态推理' },
  { state: 'running', label: 'Running', note: '执行能量' },
  { state: 'error', label: 'Error', note: '紧张反馈' }
];

const App: React.FC = () => {
  const [orbState, setOrbState] = useState<OrbState>('thinking');
  const [inputValue, setInputValue] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className="app" data-theme={theme}>
      <header className="studio-nav">
        <a className="studio-brand" href="#top" aria-label="Atlas EIDS React 首页">
          <AgentOrb state="idle" size={34} showRing={false} />
          <span><strong>Atlas EIDS</strong><small>React Kit</small></span>
        </a>
        <nav aria-label="示例导航"><a href="#orb-system">Orb</a><a href="#frameworks">框架</a><a href="#components">组件</a><a href="#governance">治理</a></nav>
        <button className="theme-switch" type="button" role="switch" aria-checked={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <span></span>{theme === 'dark' ? '深色' : '浅色'}
        </button>
      </header>

      <main id="top">
        <section className="developer-hero">
          <div className="developer-copy">
            <span className="hero-kicker">Atlas Developer Preview</span>
            <h1>React Components</h1>
            <p>把有生命感的 AI 交互、企业框架与可信执行状态，组合成可复用的 React 组件。</p>
            <div className="hero-actions"><a className="primary-link" href="#frameworks">浏览框架</a><a href="#components">查看组件</a></div>
          </div>
          <div className="developer-orb-stage">
            <AgentOrb state={orbState} size={224} />
            <div className="orb-stage-status"><span>{orbState}</span><strong>Living Intelligence Core</strong></div>
          </div>
        </section>

        <section className="content-section orb-system" id="orb-system">
          <div className="section-heading"><div><span className="section-kicker">Living Interface</span><h2>Orb 不是图标，是状态本身</h2></div><p>Core 始终被轨道约束，内部材质以呼吸、碰撞与阻尼表达智能状态。</p></div>
          <div className="orb-grid">
            {orbStates.map((item) => (
              <button key={item.state} type="button" className={`orb-demo ${orbState === item.state ? 'active' : ''}`} onClick={() => setOrbState(item.state)} aria-pressed={orbState === item.state}>
                <AgentOrb state={item.state} size={96} />
                <span><strong>{item.label}</strong><small>{item.note}</small></span>
              </button>
            ))}
          </div>
        </section>

        <FrameworkGallery />

        <section className="content-section component-lab" id="components">
          <div className="section-heading"><div><span className="section-kicker">Component Lab</span><h2>从输入到洞察，保持完整上下文</h2></div><p>核心组件保持低业务耦合，可组合进不同企业工作流。</p></div>
          <div className="component-split">
            <AgentCard title="协作智能体" subtitle="Task Copilot" description="统一呈现任务能力、运行状态与可复核输出。" tags={['任务编排', '状态管理', '可复核输出', '工作流']} status="online" />
            <div className="ui-stack">
              <NeuralInput mention="AI Assistant" placeholder="输入目标、粘贴上下文或选择工具..." value={inputValue} onChange={setInputValue} />
              <StreamBlock header="Atlas · 任务执行流" content={<><p>正在聚合上下文与工具结果...</p><p style={{ color: 'var(--text-accent)' }}>已形成可复核输出，等待人工确认。</p></>} isStreaming={true} />
            </div>
          </div>
          <div className="intelligence-grid">
            <InsightPanel title="任务洞察" summary="Agent 已将关键结论、待确认项与建议动作整理成可复核清单。" confidence={86} items={[{ label: '边界定义清晰', value: '已识别触发条件、依赖项与执行边界。', level: 'success' }, { label: '关键节点待复核', value: '存在上下文缺口，需要人工补充。', level: 'warning' }, { label: '建议沉淀交付', value: '可导出执行清单并保留版本记录。', level: 'info' }]} />
            <div className="system-stack">
              <MetricStrip title="系统指标面板" metrics={[{ label: '吞吐率', value: '1244', delta: '示例数据 +12%' }, { label: '平均延迟', value: '184ms', delta: '示例数据 -9ms' }, { label: '任务完成率', value: '98.1%', delta: '示例数据' }]} />
              <WorkflowTimeline title="流程进度" steps={[{ label: '数据摄取', status: 'done', text: '输入数据已完成归一化与校验。' }, { label: '分析推理', status: 'running', text: '特征聚类与规则匹配进行中。' }, { label: '结果复核', status: 'pending', text: '等待人工确认后发布。' }]} />
            </div>
          </div>
        </section>

        <section className="content-section" id="governance">
          <div className="section-heading"><div><span className="section-kicker">Human Control</span><h2>智能执行必须可解释、可停止、可确认</h2></div><p>执行计划、工具调用、风险提示和人工决策在一个视图中闭环。</p></div>
          <AITrustPanel />
        </section>
      </main>

      <footer className="studio-footer"><strong>Atlas EIDS for React</strong><span>Enterprise Intelligence Design System</span></footer>
    </div>
  );
};

export default App;

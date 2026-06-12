import React, { useState } from 'react';
import AgentOrb, { OrbState } from './components/AgentOrb';
import AgentCard from './components/AgentCard';
import NeuralInput from './components/NeuralInput';
import StreamBlock from './components/StreamBlock';
import InsightPanel from './components/InsightPanel';
import MetricStrip from './components/MetricStrip';
import WorkflowTimeline from './components/WorkflowTimeline';
import './styles/tokens.css';
import './App.css';

const App: React.FC = () => {
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Atlas EIDS - React Components</h1>
        <p>Enterprise Intelligence Design System</p>
      </header>

      <main className="app-main">
        {/* Orb Showcase */}
        <section className="section">
          <h2>Agent Orb</h2>
          <div className="orb-grid">
            <div className="orb-demo">
              <AgentOrb state="idle" size={80} />
              <span>Idle</span>
            </div>
            <div className="orb-demo">
              <AgentOrb state="thinking" size={80} />
              <span>Thinking</span>
            </div>
            <div className="orb-demo">
              <AgentOrb state="running" size={80} />
              <span>Running</span>
            </div>
            <div className="orb-demo">
              <AgentOrb state="error" size={80} />
              <span>Error</span>
            </div>
          </div>

          <div className="controls">
            <h3>Interactive Demo</h3>
            <div className="button-group">
              <button
                className={orbState === 'idle' ? 'active' : ''}
                onClick={() => setOrbState('idle')}
              >
                Idle
              </button>
              <button
                className={orbState === 'thinking' ? 'active' : ''}
                onClick={() => setOrbState('thinking')}
              >
                Thinking
              </button>
              <button
                className={orbState === 'running' ? 'active' : ''}
                onClick={() => setOrbState('running')}
              >
                Running
              </button>
              <button
                className={orbState === 'error' ? 'active' : ''}
                onClick={() => setOrbState('error')}
              >
                Error
              </button>
            </div>
            <div className="demo-orb">
              <AgentOrb state={orbState} size={120} />
            </div>
          </div>
        </section>

        {/* Agent Card */}
        <section className="section">
          <h2>Agent Card</h2>
          <AgentCard
            title="协作智能体"
            subtitle="Task Copilot"
            description="统一呈现协作任务、证据线索与执行建议，支持可追溯与状态同步。"
            tags={['任务编排', '状态管理', '可复核输出', '工作流']}
            status="online"
          />
        </section>

        {/* Neural Input & Stream */}
        <section className="section">
          <h2>Input & Stream</h2>
          <div className="ui-stack">
            <NeuralInput
              mention="AI Assistant"
              placeholder="生成本周汇总并输出可执行任务..."
              value={inputValue}
              onChange={setInputValue}
            />
            <StreamBlock
              header="Atlas · 任务执行流"
              content={
                <>
                  <p>正在检索关联数据源...</p>
                  <p style={{ color: 'var(--text-accent)' }}>
                    已形成 3 个可执行输出项：
                  </p>
                  <p>1. 任务优先级重排建议</p>
                </>
              }
              isStreaming={true}
            />
            <InsightPanel
              title="任务洞察"
              summary="Agent 已完成任务片段聚合，并将关键结论、待确认项与建议动作整理成可复核清单。"
              confidence={86}
              items={[
                {
                  label: '边界定义清晰',
                  value: '已识别触发条件、依赖项与执行边界，可直接进入排程。',
                  level: 'success'
                },
                {
                  label: '关键节点待复核',
                  value: '节点 N-1 存在上下文缺失，建议补充外部输入后继续生成。',
                  level: 'warning'
                },
                {
                  label: '建议沉淀交付',
                  value: '可一键导出执行清单，支持项目内同步与版本追溯。',
                  level: 'info'
                }
              ]}
            />
            <MetricStrip
              title="系统指标面板"
              metrics={[
                { label: '吞吐率', value: '1244', delta: '较昨日 +12%' },
                { label: '平均延迟', value: '184ms', delta: '较昨日 -9ms' },
                { label: '任务完成率', value: '98.1%', delta: '本周波动范围 0.4pp' }
              ]}
            />
            <WorkflowTimeline
              title="流程进度"
              steps={[
                { label: '数据摄取', status: 'done', text: '已完成输入数据归一化与校验。' },
                { label: '分析推理', status: 'running', text: '特征聚类与规则匹配进行中。' },
                { label: '结果复核', status: 'pending', text: '等待人工确认后发布结果。' }
              ]}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import AgentOrb, { OrbState } from './components/AgentOrb';
import AgentCard from './components/AgentCard';
import NeuralInput from './components/NeuralInput';
import StreamBlock from './components/StreamBlock';
import InsightPanel from './components/InsightPanel';
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
            title="法务审查助手"
            subtitle="Legal AI Agent"
            description="基于 GB/T 9704 规范与 RAG 混合检索，提供合同风险扫描、违约条款提取与合规性自动检测。"
            tags={['Contract', 'Risk Analysis', 'OCR', 'Reasoning']}
            status="online"
          />
        </section>

        {/* Neural Input & Stream */}
        <section className="section">
          <h2>Input & Stream</h2>
          <div className="ui-stack">
            <NeuralInput
              mention="法务Agent"
              placeholder="审查这份采购合同的违约条款..."
              value={inputValue}
              onChange={setInputValue}
            />
            <StreamBlock
              header="Atlas · 正在生成推理过程"
              content={
                <>
                  <p>正在解析《示例合同.pdf》...</p>
                  <p style={{ color: 'var(--text-accent)' }}>
                    已识别 3 处潜在违约风险：
                  </p>
                  <p>1. 第 4.2 条违约金上限设定过低...</p>
                </>
              }
              isStreaming={true}
            />
            <InsightPanel
              title="合同审查洞察"
              summary="Agent 已完成条款结构化扫描，并将风险项、建议动作和证据位置整理为可复核的交付摘要。"
              confidence={86}
              items={[
                {
                  label: '交付边界清晰',
                  value: '已识别验收条件、交付节点与附件清单，可进入业务复核。',
                  level: 'success'
                },
                {
                  label: '违约条款需复核',
                  value: '第 4.2 条违约金上限偏低，建议结合采购金额重新测算。',
                  level: 'warning'
                },
                {
                  label: '建议生成纪要',
                  value: '可一键生成审查纪要，并同步给法务、采购和项目负责人。',
                  level: 'info'
                }
              ]}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

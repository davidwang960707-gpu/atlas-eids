<template>
  <div class="app">
    <header class="app-header">
      <h1>Atlas EIDS - Vue 3 Components</h1>
      <p>Enterprise Intelligence Design System</p>
    </header>

    <main class="app-main">
      <!-- Orb Showcase -->
      <section class="section">
        <h2>Agent Orb</h2>
        <div class="orb-grid">
          <div class="orb-demo">
            <AgentOrb state="idle" :size="80" />
            <span>Idle</span>
          </div>
          <div class="orb-demo">
            <AgentOrb state="thinking" :size="80" />
            <span>Thinking</span>
          </div>
          <div class="orb-demo">
            <AgentOrb state="running" :size="80" />
            <span>Running</span>
          </div>
          <div class="orb-demo">
            <AgentOrb state="error" :size="80" />
            <span>Error</span>
          </div>
        </div>

        <div class="controls">
          <h3>Interactive Demo</h3>
          <div class="button-group">
            <button
              :class="{ active: orbState === 'idle' }"
              @click="orbState = 'idle'"
            >
              Idle
            </button>
            <button
              :class="{ active: orbState === 'thinking' }"
              @click="orbState = 'thinking'"
            >
              Thinking
            </button>
            <button
              :class="{ active: orbState === 'running' }"
              @click="orbState = 'running'"
            >
              Running
            </button>
            <button
              :class="{ active: orbState === 'error' }"
              @click="orbState = 'error'"
            >
              Error
            </button>
          </div>
          <div class="demo-orb">
            <AgentOrb :state="orbState" :size="120" />
          </div>
        </div>
      </section>

      <!-- Agent Card -->
      <section class="section">
        <h2>Agent Card</h2>
        <AgentCard
          title="协作智能体"
          subtitle="Task Copilot"
          description="统一呈现协作任务、证据线索与执行建议，支持可追溯与状态同步。"
          :tags="['任务编排', '状态管理', '可复核输出', '工作流']"
          status="online"
        />
      </section>

      <!-- Neural Input & Stream -->
      <section class="section">
        <h2>Input & Stream</h2>
        <div class="ui-stack">
          <NeuralInput
            v-model="inputValue"
            mention="AI Assistant"
            placeholder="生成本周汇总并输出可执行任务..."
          />
          <StreamBlock
            header="Atlas · 任务执行流"
            :is-streaming="true"
          >
            <p>正在检索关联数据源...</p>
            <p style="color: var(--text-accent);">已形成 3 个可执行输出项：</p>
            <p>1. 任务优先级重排建议</p>
          </StreamBlock>
          <InsightPanel
            title="任务洞察"
            summary="Agent 已完成任务片段聚合，并将关键结论、待确认项与建议动作整理成可复核清单。"
            :confidence="86"
            :items="insightItems"
          />
          <MetricStrip
            title="系统指标面板"
            :metrics="metricItems"
          />
          <WorkflowTimeline
            title="流程进度"
            :steps="workflowSteps"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { OrbState } from './components/AgentOrb.vue';
import AgentOrb from './components/AgentOrb.vue';
import AgentCard from './components/AgentCard.vue';
import NeuralInput from './components/NeuralInput.vue';
import StreamBlock from './components/StreamBlock.vue';
import InsightPanel from './components/InsightPanel.vue';
import MetricStrip from './components/MetricStrip.vue';
import WorkflowTimeline from './components/WorkflowTimeline.vue';

const orbState = ref<OrbState>('idle');
const inputValue = ref('');

const insightItems = [
  {
    label: '边界定义清晰',
    value: '已识别触发条件、依赖项与执行边界，可直接进入排程。',
    level: 'success' as const
  },
  {
    label: '关键节点待复核',
    value: '节点 N-1 存在上下文缺失，建议补充外部输入后继续生成。',
    level: 'warning' as const
  },
  {
    label: '建议沉淀交付',
    value: '可一键导出执行清单，支持项目内同步与版本追溯。',
    level: 'info' as const
  }
];

const metricItems = [
  { label: '吞吐率', value: '1244', delta: '较昨日 +12%' },
  { label: '平均延迟', value: '184ms', delta: '较昨日 -9ms' },
  { label: '任务完成率', value: '98.1%', delta: '本周波动范围 0.4pp' }
];

const workflowSteps = [
  { label: '数据摄取', status: 'done' as const, text: '已完成输入数据归一化与校验。' },
  { label: '分析推理', status: 'running' as const, text: '特征聚类与规则匹配进行中。' },
  { label: '结果复核', status: 'pending' as const, text: '等待人工确认后发布结果。' }
];

</script>

<style scoped>
.app {
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 8%, rgba(183, 167, 255, 0.16), transparent 34%),
    radial-gradient(circle at 82% 16%, rgba(0, 184, 169, 0.08), transparent 28%),
    var(--bg-primary);
  color: var(--text-primary);
  padding: 48px 40px;
}

.app-header {
  text-align: center;
  margin-bottom: 60px;
}

.app-header h1 {
  font-size: clamp(42px, 6vw, 72px);
  margin-bottom: 12px;
  letter-spacing: 0;
  background: linear-gradient(135deg, #fff 0%, var(--cognitive-glow) 56%, var(--chart-teal) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-header p {
  font-size: 18px;
  color: var(--text-secondary);
}

.section {
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 40px;
  border: 1px solid rgba(183, 167, 255, 0.14);
  border-radius: 28px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)),
    var(--card-bg);
  box-shadow: 0 28px 90px rgba(7, 8, 22, 0.22);
  backdrop-filter: var(--blur-glass);
}

.section h2 {
  font-size: 32px;
  margin-bottom: 32px;
  color: var(--text-primary);
  letter-spacing: 0;
}

.section h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: var(--text-accent);
}

.orb-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 40px;
}

.orb-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.orb-demo span {
  font-size: 14px;
  color: var(--text-secondary);
}

.controls {
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.button-group button {
  min-height: 42px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(183, 167, 255, 0.16);
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 650;
  transition: all 0.2s;
}

.button-group button:hover {
  border-color: var(--atlas-violet);
}

.button-group button.active {
  background: linear-gradient(135deg, var(--atlas-violet), var(--chart-teal));
  border-color: rgba(255, 255, 255, 0.18);
  color: white;
  box-shadow: 0 12px 28px rgba(91, 70, 229, 0.28);
}

.demo-orb {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.ui-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 768px) {
  .app { padding: 20px; }
  .orb-grid { grid-template-columns: repeat(2, 1fr); }
  .button-group { flex-wrap: wrap; }
}
</style>

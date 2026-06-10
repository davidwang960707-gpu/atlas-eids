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
          title="法务审查助手"
          subtitle="Legal AI Agent"
          description="基于 GB/T 9704 规范与 RAG 混合检索，提供合同风险扫描、违约条款提取与合规性自动检测。"
          :tags="['Contract', 'Risk Analysis', 'OCR', 'Reasoning']"
          status="online"
        />
      </section>

      <!-- Neural Input & Stream -->
      <section class="section">
        <h2>Input & Stream</h2>
        <div class="ui-stack">
          <NeuralInput
            v-model="inputValue"
            mention="法务Agent"
            placeholder="审查这份采购合同的违约条款..."
          />
          <StreamBlock
            header="Atlas · 正在生成推理过程"
            :is-streaming="true"
          >
            <p>正在解析《示例合同.pdf》...</p>
            <p style="color: var(--text-accent);">已识别 3 处潜在违约风险：</p>
            <p>1. 第 4.2 条违约金上限设定过低...</p>
          </StreamBlock>
          <InsightPanel
            title="合同审查洞察"
            summary="Agent 已完成条款结构化扫描，并将风险项、建议动作和证据位置整理为可复核的交付摘要。"
            :confidence="86"
            :items="insightItems"
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

const orbState = ref<OrbState>('idle');
const inputValue = ref('');
const insightItems = [
  {
    label: '交付边界清晰',
    value: '已识别验收条件、交付节点与附件清单，可进入业务复核。',
    level: 'success' as const
  },
  {
    label: '违约条款需复核',
    value: '第 4.2 条违约金上限偏低，建议结合采购金额重新测算。',
    level: 'warning' as const
  },
  {
    label: '建议生成纪要',
    value: '可一键生成审查纪要，并同步给法务、采购和项目负责人。',
    level: 'info' as const
  }
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

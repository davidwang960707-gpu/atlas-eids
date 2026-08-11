<template>
  <div class="app" :data-theme="theme">
    <header class="studio-nav">
      <a class="studio-brand" href="#top" aria-label="Atlas EIDS Vue 首页">
        <AgentOrb state="idle" :size="34" :show-ring="false" />
        <span><strong>Atlas EIDS</strong><small>Vue 3 Kit</small></span>
      </a>
      <nav aria-label="示例导航"><a href="#orb-system">Orb</a><a href="#frameworks">框架</a><a href="#components">组件</a><a href="#governance">治理</a></nav>
      <button class="theme-switch" type="button" role="switch" :aria-checked="theme === 'dark'" @click="theme = theme === 'dark' ? 'light' : 'dark'">
        <span></span>{{ theme === 'dark' ? '深色' : '浅色' }}
      </button>
    </header>

    <main id="top">
      <section class="developer-hero">
        <div class="developer-copy">
          <span class="hero-kicker">Atlas Developer Preview</span>
          <h1>Vue 3 Components</h1>
          <p>把有生命感的 AI 交互、企业框架与可信执行状态，组合成可复用的 Vue 3 组件。</p>
          <div class="hero-actions"><a class="primary-link" href="#frameworks">浏览框架</a><a href="#components">查看组件</a></div>
        </div>
        <div class="developer-orb-stage">
          <AgentOrb :state="orbState" :size="224" />
          <div class="orb-stage-status"><span>{{ orbState }}</span><strong>Living Intelligence Core</strong></div>
        </div>
      </section>

      <section class="content-section orb-system" id="orb-system">
        <div class="section-heading"><div><span class="section-kicker">Living Interface</span><h2>Orb 不是图标，是状态本身</h2></div><p>Core 始终被轨道约束，内部材质以呼吸、碰撞与阻尼表达智能状态。</p></div>
        <div class="orb-grid">
          <button v-for="item in orbStates" :key="item.state" type="button" :class="['orb-demo', { active: orbState === item.state }]" :aria-pressed="orbState === item.state" @click="orbState = item.state">
            <AgentOrb :state="item.state" :size="96" />
            <span><strong>{{ item.label }}</strong><small>{{ item.note }}</small></span>
          </button>
        </div>
      </section>

      <FrameworkGallery />

      <section class="content-section component-lab" id="components">
        <div class="section-heading"><div><span class="section-kicker">Component Lab</span><h2>从输入到洞察，保持完整上下文</h2></div><p>核心组件保持低业务耦合，可组合进不同企业工作流。</p></div>
        <div class="component-split">
          <AgentCard title="协作智能体" subtitle="Task Copilot" description="统一呈现任务能力、运行状态与可复核输出。" :tags="['任务编排', '状态管理', '可复核输出', '工作流']" status="online" />
          <div class="ui-stack">
            <NeuralInput v-model="inputValue" mention="AI Assistant" placeholder="输入目标、粘贴上下文或选择工具..." />
            <StreamBlock header="Atlas · 任务执行流" :is-streaming="true"><p>正在聚合上下文与工具结果...</p><p style="color: var(--text-accent);">已形成可复核输出，等待人工确认。</p></StreamBlock>
          </div>
        </div>
        <div class="intelligence-grid">
          <InsightPanel title="任务洞察" summary="Agent 已将关键结论、待确认项与建议动作整理成可复核清单。" :confidence="86" :items="insightItems" />
          <div class="system-stack">
            <MetricStrip title="系统指标面板" :metrics="metricItems" />
            <WorkflowTimeline title="流程进度" :steps="workflowSteps" />
          </div>
        </div>
      </section>

      <section class="content-section" id="governance">
        <div class="section-heading"><div><span class="section-kicker">Human Control</span><h2>智能执行必须可解释、可停止、可确认</h2></div><p>执行计划、工具调用、风险提示和人工决策在一个视图中闭环。</p></div>
        <AITrustPanel />
      </section>
    </main>

    <footer class="studio-footer"><strong>Atlas EIDS for Vue 3</strong><span>Enterprise Intelligence Design System</span></footer>
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
import FrameworkGallery from './components/FrameworkGallery.vue';
import AITrustPanel from './components/AITrustPanel.vue';

const theme = ref<'dark' | 'light'>('dark');
const orbState = ref<OrbState>('thinking');
const inputValue = ref('');
const orbStates: Array<{ state: OrbState; label: string; note: string }> = [
  { state: 'idle', label: 'Idle', note: '低频呼吸' }, { state: 'thinking', label: 'Thinking', note: '液态推理' }, { state: 'running', label: 'Running', note: '执行能量' }, { state: 'error', label: 'Error', note: '紧张反馈' }
];
const insightItems = [
  { label: '边界定义清晰', value: '已识别触发条件、依赖项与执行边界。', level: 'success' as const },
  { label: '关键节点待复核', value: '存在上下文缺口，需要人工补充。', level: 'warning' as const },
  { label: '建议沉淀交付', value: '可导出执行清单并保留版本记录。', level: 'info' as const }
];
const metricItems = [
  { label: '吞吐率', value: '1244', delta: '示例数据 +12%' }, { label: '平均延迟', value: '184ms', delta: '示例数据 -9ms' }, { label: '任务完成率', value: '98.1%', delta: '示例数据' }
];
const workflowSteps = [
  { label: '数据摄取', status: 'done' as const, text: '输入数据已完成归一化与校验。' },
  { label: '分析推理', status: 'running' as const, text: '特征聚类与规则匹配进行中。' },
  { label: '结果复核', status: 'pending' as const, text: '等待人工确认后发布。' }
];
</script>

<style src="./App.css"></style>

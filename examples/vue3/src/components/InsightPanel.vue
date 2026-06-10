<template>
  <div class="insight-panel">
    <div class="insight-panel__header">
      <div>
        <span class="insight-panel__eyebrow">AI Insight</span>
        <h3>{{ title }}</h3>
      </div>
      <div class="insight-panel__score" :aria-label="`置信度 ${confidence}%`">
        <span>{{ confidence }}%</span>
        <small>置信度</small>
      </div>
    </div>

    <p class="insight-panel__summary">{{ summary }}</p>

    <div class="insight-panel__meter">
      <div :style="{ width: `${confidence}%` }"></div>
    </div>

    <div class="insight-panel__grid">
      <article
        v-for="item in items"
        :key="item.label"
        :class="['insight-item', `insight-item--${item.level}`]"
      >
        <div class="insight-item__meta">
          <span class="insight-item__dot"></span>
          {{ levelText[item.level] }}
        </div>
        <strong>{{ item.label }}</strong>
        <p>{{ item.value }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
type InsightLevel = 'success' | 'warning' | 'info';

interface InsightItem {
  label: string;
  value: string;
  level: InsightLevel;
}

defineProps<{
  title: string;
  summary: string;
  confidence: number;
  items: InsightItem[];
}>();

const levelText: Record<InsightLevel, string> = {
  success: '已确认',
  warning: '需复核',
  info: '建议'
};
</script>

<style scoped>
.insight-panel {
  position: relative;
  overflow: hidden;
  padding: 28px;
  border: 1px solid rgba(183, 167, 255, 0.16);
  border-radius: 24px;
  background:
    radial-gradient(circle at 82% 0%, rgba(0, 184, 169, 0.14), transparent 32%),
    radial-gradient(circle at 8% 12%, rgba(123, 97, 255, 0.18), transparent 30%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025)),
    var(--card-bg);
  box-shadow:
    0 24px 70px rgba(7, 8, 22, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: var(--blur-glass);
}

.insight-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(183, 167, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(183, 167, 255, 0.055) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.76), transparent 78%);
  pointer-events: none;
}

.insight-panel__header,
.insight-panel__grid,
.insight-panel__summary,
.insight-panel__meter {
  position: relative;
  z-index: 1;
}

.insight-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.insight-panel__eyebrow {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--text-accent);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0;
}

.insight-panel h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 26px;
  line-height: 1.18;
  letter-spacing: 0;
}

.insight-panel__score {
  display: grid;
  place-items: center;
  width: 86px;
  height: 86px;
  flex: 0 0 86px;
  border: 1px solid rgba(183, 167, 255, 0.2);
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 24%, rgba(255, 255, 255, 0.42), transparent 28%),
    conic-gradient(from 210deg, var(--atlas-violet), var(--chart-teal), var(--deep-neural), var(--atlas-violet));
  box-shadow:
    0 18px 44px rgba(91, 70, 229, 0.26),
    inset 0 0 28px rgba(255, 255, 255, 0.2);
}

.insight-panel__score span {
  color: #fff;
  font-size: 23px;
  font-weight: 780;
  line-height: 1;
}

.insight-panel__score small {
  margin-top: -22px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 11px;
}

.insight-panel__summary {
  max-width: 760px;
  margin: 0 0 18px;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.75;
}

.insight-panel__meter {
  height: 8px;
  overflow: hidden;
  margin-bottom: 22px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.08);
}

.insight-panel__meter div {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--atlas-violet), var(--chart-teal));
  box-shadow: 0 0 22px rgba(0, 184, 169, 0.32);
}

.insight-panel__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.insight-item {
  min-height: 142px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
}

.insight-item__meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 12px;
}

.insight-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 12px currentColor;
}

.insight-item strong {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.35;
}

.insight-item p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

.insight-item--success .insight-item__meta { color: var(--success); }
.insight-item--warning .insight-item__meta { color: var(--warning); }
.insight-item--info .insight-item__meta { color: var(--atlas-cyan); }

@media (max-width: 820px) {
  .insight-panel__header {
    flex-direction: column;
  }

  .insight-panel__grid {
    grid-template-columns: 1fr;
  }
}
</style>

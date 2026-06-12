<template>
  <section class="metric-strip" :aria-label="title">
    <header class="metric-strip__header">
      <span class="metric-strip__label">Metric Overview</span>
      <h3>{{ title }}</h3>
    </header>
    <div class="metric-strip__grid">
      <article
        v-for="item in metrics"
        :key="item.label"
        class="metric-card"
      >
        <p class="metric-card__label">{{ item.label }}</p>
        <strong class="metric-card__value">{{ item.value }}</strong>
        <p v-if="item.delta" class="metric-card__delta">{{ item.delta }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Metric {
  label: string;
  value: string;
  delta?: string;
}

defineProps<{
  title: string;
  metrics: Metric[];
}>();
</script>

<style scoped>
.metric-strip {
  padding: 26px;
  border: 1px solid rgba(183, 167, 255, 0.16);
  border-radius: 22px;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025));
  box-shadow:
    0 24px 72px rgba(7, 8, 22, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.metric-strip__header {
  margin-bottom: 16px;
}

.metric-strip__label {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--text-accent);
  font-size: 12px;
  font-family: var(--font-mono);
}

.metric-strip h3 {
  margin: 0;
  font-size: 26px;
  color: var(--text-primary);
  line-height: 1.18;
}

.metric-strip__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  min-height: 114px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
}

.metric-card__label {
  margin: 0 0 10px;
  color: var(--text-secondary);
  font-size: 12px;
}

.metric-card__value {
  color: var(--text-primary);
  font-size: 30px;
  letter-spacing: 0;
}

.metric-card__delta {
  margin: 10px 0 0;
  color: var(--atlas-cyan);
  font-size: 12px;
}

@media (max-width: 820px) {
  .metric-strip__grid {
    grid-template-columns: 1fr;
  }
}
</style>

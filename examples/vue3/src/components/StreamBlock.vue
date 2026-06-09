<template>
  <div class="stream-block">
    <div class="stream-header">
      <div v-if="isStreaming" class="dot"></div>
      {{ header }}
    </div>
    <div class="stream-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  header?: string;
  isStreaming?: boolean;
}

withDefaults(defineProps<Props>(), {
  header: 'Atlas · 正在生成',
  isStreaming: true
});
</script>

<style scoped>
.stream-block {
  position: relative;
  overflow: hidden;
  padding: 22px 24px;
  border: 1px solid rgba(183, 167, 255, 0.16);
  border-radius: 22px;
  background:
    linear-gradient(145deg, rgba(123, 97, 255, 0.08), rgba(0, 184, 169, 0.035)),
    rgba(255, 255, 255, 0.025);
  box-shadow:
    0 18px 52px rgba(7, 8, 22, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(22px);
}

.stream-block::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, var(--chart-primary), var(--chart-teal));
  box-shadow: 0 0 18px rgba(109, 93, 248, 0.48);
}

.stream-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  color: var(--text-accent);
  font-size: 13px;
  font-weight: 700;
}

.stream-header .dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--chart-teal);
  box-shadow: 0 0 14px rgba(0, 184, 169, 0.72);
  animation: streamPulse 1.5s infinite;
}

.stream-content {
  position: relative;
  z-index: 1;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.stream-content p {
  margin: 0 0 8px;
}

.stream-content p:last-child {
  margin-bottom: 0;
}

@keyframes streamPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.48; transform: scale(0.72); }
}
</style>

<template>
  <div
    :class="['orb-wrapper', `state-${state}`]"
    :style="{ width: size + 'px', height: size + 'px', '--orb-size': size + 'px' }"
  >
    <div class="orb-atmosphere"></div>
    <template v-if="showRing">
      <div class="orb-ring orb-ring-primary"></div>
      <div class="orb-ring orb-ring-secondary"></div>
    </template>
    <div class="orb">
      <div class="orb-depth"></div>
      <div class="orb-caustic"></div>
      <div class="orb-liquid"></div>
      <div class="orb-specular"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type OrbState = 'idle' | 'thinking' | 'running' | 'error';

interface Props {
  state?: OrbState;
  size?: number;
  showRing?: boolean;
}

withDefaults(defineProps<Props>(), {
  state: 'idle',
  size: 80,
  showRing: true
});
</script>

<style src="../../../shared/agent-orb.css"></style>\n

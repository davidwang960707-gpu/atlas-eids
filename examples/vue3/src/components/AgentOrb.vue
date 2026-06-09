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
      <div class="orb-liquid"></div>
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

<style scoped>
.orb-wrapper {
  --orb-scale: 1;
  position: relative;
  display: grid;
  place-items: center;
  isolation: isolate;
  overflow: visible;
}

.orb-atmosphere {
  position: absolute;
  inset: -18%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.18), transparent 34%),
    radial-gradient(circle, rgba(183, 167, 255, 0.34), transparent 58%),
    conic-gradient(from 155deg, transparent 0 15%, rgba(255, 255, 255, 0.22) 19%, rgba(123, 97, 255, 0.34) 25%, transparent 35% 62%, rgba(183, 167, 255, 0.28) 72%, transparent 84%);
  filter: blur(3px) saturate(1.14);
  opacity: 0.92;
  z-index: 0;
  pointer-events: none;
  animation: orbField 11s ease-in-out infinite;
}

.orb-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.orb-ring-primary {
  inset: -2%;
  border: 1px dashed rgba(216, 198, 255, 0.58);
  box-shadow:
    0 0 calc(var(--orb-size) * 0.16) rgba(123, 97, 255, 0.2),
    inset 0 0 calc(var(--orb-size) * 0.12) rgba(255, 255, 255, 0.12);
  animation: orbRingSpin 18s linear infinite;
}

.orb-ring-secondary {
  inset: -12%;
  border: 1px solid rgba(183, 167, 255, 0.2);
  box-shadow:
    inset 0 0 calc(var(--orb-size) * 0.32) rgba(183, 167, 255, 0.09),
    0 0 calc(var(--orb-size) * 0.28) rgba(123, 97, 255, 0.1);
  animation: orbRingDrift 12s ease-in-out infinite;
}

.orb {
  position: relative;
  width: 88%;
  height: 88%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 49% 51% 50% 50% / 50% 49% 51% 50%;
  background:
    radial-gradient(circle at 27% 18%, rgba(255, 255, 255, 1) 0 5%, rgba(255, 245, 255, 0.86) 10%, transparent 22%),
    radial-gradient(circle at 78% 84%, rgba(25, 21, 68, 0.52), transparent 34%),
    radial-gradient(ellipse at 39% 42%, rgba(255, 255, 255, 0.24), transparent 38%),
    conic-gradient(from 248deg at 52% 53%, rgba(255, 255, 255, 0.38), rgba(123, 97, 255, 0.08), rgba(238, 226, 255, 0.34), rgba(42, 35, 118, 0.34), rgba(255, 255, 255, 0.28)),
    radial-gradient(ellipse at 49% 54%, rgba(248, 241, 255, 0.78), transparent 45%),
    linear-gradient(135deg, #A898FF 0%, var(--atlas-violet) 44%, var(--deep-neural) 100%);
  background-size: 120% 120%, 122% 122%, 132% 132%, 150% 150%, 125% 125%, 100% 100%;
  background-position: 27% 18%, 78% 84%, 39% 42%, 52% 53%, 49% 54%, 50% 50%;
  box-shadow:
    0 calc(var(--orb-size) * 0.15) calc(var(--orb-size) * 0.5) rgba(109, 93, 248, 0.42),
    0 0 0 calc(var(--orb-size) * 0.03) rgba(183, 167, 255, 0.06),
    0 0 calc(var(--orb-size) * 0.2) rgba(183, 167, 255, 0.24),
    inset calc(var(--orb-size) * 0.08) calc(var(--orb-size) * 0.08) calc(var(--orb-size) * 0.16) rgba(255, 255, 255, 0.3),
    inset calc(var(--orb-size) * -0.16) calc(var(--orb-size) * -0.18) calc(var(--orb-size) * 0.34) rgba(17, 15, 55, 0.5),
    inset 0 0 calc(var(--orb-size) * 0.18) rgba(238, 226, 255, 0.28);
  z-index: 2;
  transform-origin: center;
  animation:
    orbBreathe 5.8s ease-in-out infinite,
    orbShapeShift 10.7s ease-in-out infinite,
    orbSurfaceFlow 14.6s ease-in-out infinite;
}

.orb::before {
  content: '';
  position: absolute;
  inset: -18%;
  border-radius: 45% 55% 52% 48% / 52% 44% 56% 48%;
  background:
    radial-gradient(ellipse at 38% 43%, rgba(255, 255, 255, 0.24), transparent 32%),
    radial-gradient(ellipse at 66% 38%, rgba(211, 196, 255, 0.24), transparent 34%),
    conic-gradient(from 92deg at 52% 50%, rgba(255, 255, 255, 0.12), rgba(194, 173, 255, 0.28), transparent 34%, rgba(255, 255, 255, 0.18), transparent 68%, rgba(183, 167, 255, 0.2), rgba(255, 255, 255, 0.12));
  filter: blur(2px) contrast(1.08) saturate(1.12);
  opacity: 0.82;
  z-index: 3;
  pointer-events: none;
  animation: orbMembrane 7.8s ease-in-out infinite;
}

.orb::after {
  content: '';
  position: absolute;
  inset: -32%;
  border-radius: 42% 58% 64% 36% / 44% 38% 62% 56%;
  background:
    radial-gradient(ellipse at 42% 48%, rgba(255, 255, 255, 0.42), transparent 28%),
    radial-gradient(ellipse at 62% 64%, rgba(183, 167, 255, 0.48), transparent 40%),
    radial-gradient(ellipse at 35% 68%, rgba(123, 97, 255, 0.24), transparent 38%),
    conic-gradient(from 148deg at 51% 54%, rgba(255, 255, 255, 0.18), rgba(183, 167, 255, 0.52), rgba(42, 35, 118, 0.24), rgba(248, 241, 255, 0.38), rgba(123, 97, 255, 0.18), rgba(255, 255, 255, 0.18));
  mix-blend-mode: screen;
  opacity: 0.98;
  transform: translate3d(-7%, 4%, 0) rotate(-22deg) scale(1.08);
  filter: blur(3.4px) saturate(1.2) contrast(1.04);
  z-index: 2;
  pointer-events: none;
  animation: orbLiquid 6.8s ease-in-out infinite, orbMetalFlow 13.3s linear infinite;
}

.orb-liquid {
  position: absolute;
  inset: 16%;
  border-radius: 44% 56% 58% 42% / 48% 46% 54% 52%;
  background:
    radial-gradient(ellipse at 45% 45%, rgba(255, 255, 255, 0.34), transparent 34%),
    radial-gradient(ellipse at 68% 56%, rgba(223, 211, 255, 0.3), transparent 36%),
    conic-gradient(from 220deg, transparent, rgba(255, 255, 255, 0.16), rgba(123, 97, 255, 0.18), transparent 68%);
  filter: blur(4px) saturate(1.18);
  mix-blend-mode: screen;
  opacity: 0.84;
  z-index: 4;
  animation: orbLiquidCore 8.6s ease-in-out infinite;
}

.state-thinking .orb {
  animation-duration: 4.2s, 7.2s, 9s;
  box-shadow:
    0 calc(var(--orb-size) * 0.15) calc(var(--orb-size) * 0.56) rgba(109, 93, 248, 0.52),
    0 0 calc(var(--orb-size) * 0.34) rgba(183, 167, 255, 0.44),
    inset calc(var(--orb-size) * 0.08) calc(var(--orb-size) * 0.08) calc(var(--orb-size) * 0.16) rgba(255, 255, 255, 0.34),
    inset calc(var(--orb-size) * -0.16) calc(var(--orb-size) * -0.18) calc(var(--orb-size) * 0.34) rgba(17, 15, 55, 0.48);
}

.state-running .orb {
  background:
    radial-gradient(circle at 27% 18%, rgba(255, 255, 255, 1) 0 5%, rgba(236, 255, 249, 0.86) 10%, transparent 22%),
    conic-gradient(from 248deg at 52% 53%, rgba(255, 255, 255, 0.38), rgba(0, 196, 140, 0.18), rgba(203, 255, 240, 0.38), rgba(20, 83, 73, 0.34), rgba(255, 255, 255, 0.28)),
    linear-gradient(135deg, #7FF7D2 0%, var(--success) 45%, #047857 100%);
}

.state-running .orb-ring-primary {
  border-color: rgba(0, 196, 140, 0.56);
  animation-duration: 7s;
}

.state-error .orb {
  background:
    radial-gradient(circle at 27% 18%, rgba(255, 255, 255, 0.96) 0 6%, rgba(255, 223, 231, 0.82) 11%, transparent 24%),
    conic-gradient(from 248deg at 52% 53%, rgba(255, 255, 255, 0.28), rgba(255, 90, 122, 0.2), rgba(255, 202, 214, 0.36), rgba(97, 18, 42, 0.34), rgba(255, 255, 255, 0.18)),
    linear-gradient(135deg, #FFB7C8 0%, var(--danger) 46%, #9F1239 100%);
  animation:
    orbBreathe 4.8s ease-in-out infinite,
    orbShapeShift 8s ease-in-out infinite,
    orbSurfaceFlow 10s ease-in-out infinite,
    orbErrorTension 700ms ease-in-out infinite;
}

.state-error .orb-ring-primary,
.state-error .orb-ring-secondary {
  border-color: rgba(255, 90, 122, 0.42);
}

@keyframes orbBreathe {
  0%, 100% { transform: scale(0.99); filter: brightness(1) saturate(1.05); }
  48% { transform: scale(1.045); filter: brightness(1.14) saturate(1.16); }
  62% { transform: scale(1.018); }
}

@keyframes orbShapeShift {
  0%, 100% { border-radius: 49% 51% 50% 50% / 50% 49% 51% 50%; }
  23% { border-radius: 54% 46% 58% 42% / 46% 54% 44% 56%; }
  47% { border-radius: 44% 56% 48% 52% / 57% 43% 55% 45%; }
  71% { border-radius: 52% 48% 43% 57% / 44% 58% 42% 56%; }
}

@keyframes orbSurfaceFlow {
  0%, 100% { background-position: 27% 18%, 78% 84%, 39% 42%, 52% 53%, 49% 54%, 50% 50%; }
  38% { background-position: 24% 22%, 73% 78%, 47% 36%, 66% 42%, 42% 60%, 50% 50%; }
  72% { background-position: 34% 16%, 84% 86%, 36% 48%, 38% 66%, 58% 47%, 50% 50%; }
}

@keyframes orbMembrane {
  0%, 100% { transform: translate3d(-2%, 0, 0) rotate(0deg) scale(1.02); opacity: 0.76; }
  42% { transform: translate3d(4%, -3%, 0) rotate(24deg) scale(1.1); opacity: 0.9; }
  74% { transform: translate3d(-5%, 4%, 0) rotate(-18deg) scale(1.04); opacity: 0.72; }
}

@keyframes orbLiquid {
  0%, 100% { transform: translate3d(-7%, 4%, 0) rotate(-22deg) scale(1.08); }
  33% { transform: translate3d(7%, -5%, 0) rotate(18deg) scale(1.16); }
  67% { transform: translate3d(-1%, 8%, 0) rotate(44deg) scale(1.04); }
}

@keyframes orbMetalFlow {
  to { filter: hue-rotate(12deg) blur(3.4px) saturate(1.24) contrast(1.05); }
}

@keyframes orbLiquidCore {
  0%, 100% {
    transform: translate3d(-5%, 3%, 0) rotate(-18deg) scale(0.98);
    border-radius: 44% 56% 58% 42% / 48% 46% 54% 52%;
  }
  35% {
    transform: translate3d(10%, -8%, 0) rotate(36deg) scale(1.12);
    border-radius: 60% 40% 44% 56% / 42% 58% 40% 60%;
  }
  72% {
    transform: translate3d(-7%, 9%, 0) rotate(94deg) scale(1.04);
    border-radius: 42% 58% 62% 38% / 58% 42% 54% 46%;
  }
}

@keyframes orbField {
  0%, 100% { transform: scale(0.94) rotate(0deg); opacity: 0.78; }
  50% { transform: scale(1.05) rotate(22deg); opacity: 1; }
}

@keyframes orbRingSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes orbRingDrift {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.72; }
  50% { transform: scale(1.04) rotate(-18deg); opacity: 1; }
}

@keyframes orbErrorTension {
  0%, 100% { translate: 0 0; }
  30% { translate: -1px 0; }
  70% { translate: 1px 0; }
}
</style>

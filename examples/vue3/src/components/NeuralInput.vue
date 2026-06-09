<template>
  <div class="neural-input">
    <div class="input-orb">
      <span></span>
    </div>
    <label class="input-text">
      <span v-if="mention" class="mention">@{{ mention }}</span>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput"
      />
    </label>
    <button class="magic-action" type="button" aria-label="AI assist">
      AI
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  placeholder?: string;
  mention?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '输入您的问题...',
  mention: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<style scoped>
.neural-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 64px;
  padding: 12px 14px 12px 18px;
  border: 1px solid rgba(183, 167, 255, 0.18);
  border-radius: 24px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.025)),
    radial-gradient(circle at 12% 0%, rgba(183, 167, 255, 0.16), transparent 38%);
  box-shadow:
    0 18px 48px rgba(20, 18, 48, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(24px);
  transition: border-color var(--transition-smooth), box-shadow var(--transition-smooth), transform var(--transition-smooth);
}

.neural-input:hover,
.neural-input:focus-within {
  transform: translateY(-1px);
  border-color: rgba(123, 97, 255, 0.52);
  box-shadow:
    0 24px 70px rgba(91, 70, 229, 0.22),
    0 0 0 6px rgba(123, 97, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.input-orb {
  position: relative;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 46% 54% 52% 48% / 48% 45% 55% 52%;
  overflow: hidden;
  background:
    radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.95) 0 12%, transparent 30%),
    conic-gradient(from 218deg, rgba(255, 255, 255, 0.28), rgba(183, 167, 255, 0.5), rgba(79, 70, 229, 0.36), rgba(255, 255, 255, 0.22)),
    linear-gradient(135deg, #A898FF 0%, var(--atlas-violet) 48%, var(--deep-neural) 100%);
  box-shadow:
    0 0 22px rgba(123, 97, 255, 0.38),
    inset 7px 7px 12px rgba(255, 255, 255, 0.28),
    inset -9px -11px 18px rgba(24, 20, 70, 0.46);
  animation: inputOrbBreathe 4.8s ease-in-out infinite, inputOrbShape 8s ease-in-out infinite;
}

.input-orb::before,
.input-orb span {
  content: '';
  position: absolute;
  inset: -22%;
  border-radius: 44% 56% 58% 42% / 48% 46% 54% 52%;
  background:
    radial-gradient(ellipse at 42% 48%, rgba(255, 255, 255, 0.38), transparent 30%),
    radial-gradient(ellipse at 64% 62%, rgba(183, 167, 255, 0.46), transparent 40%),
    conic-gradient(from 140deg, transparent, rgba(255, 255, 255, 0.18), rgba(123, 97, 255, 0.22), transparent 70%);
  mix-blend-mode: screen;
  filter: blur(2px);
  opacity: 0.9;
  animation: inputOrbFlow 6s ease-in-out infinite;
}

.input-text {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.input-text .mention {
  flex: 0 0 auto;
  color: var(--text-accent);
  font-weight: 600;
}

.input-text input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: 16px;
}

.input-text input::placeholder {
  color: var(--text-secondary);
}

.magic-action {
  position: relative;
  flex: 0 0 auto;
  min-width: 44px;
  height: 40px;
  border: 1px solid rgba(183, 167, 255, 0.2);
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgba(123, 97, 255, 0.92), rgba(0, 184, 169, 0.9)),
    radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.42), transparent 34%);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(91, 70, 229, 0.24);
  transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
}

.magic-action:hover {
  transform: translateY(-1px) scale(1.03);
  box-shadow: 0 18px 38px rgba(91, 70, 229, 0.34);
}

@keyframes inputOrbBreathe {
  0%, 100% { transform: scale(0.98); filter: brightness(1) saturate(1.06); }
  52% { transform: scale(1.06); filter: brightness(1.14) saturate(1.18); }
}

@keyframes inputOrbShape {
  0%, 100% { border-radius: 46% 54% 52% 48% / 48% 45% 55% 52%; }
  42% { border-radius: 56% 44% 48% 52% / 44% 58% 42% 56%; }
  76% { border-radius: 42% 58% 60% 40% / 58% 42% 52% 48%; }
}

@keyframes inputOrbFlow {
  0%, 100% { transform: translate3d(-6%, 4%, 0) rotate(-18deg) scale(1); }
  50% { transform: translate3d(9%, -8%, 0) rotate(42deg) scale(1.12); }
}
</style>

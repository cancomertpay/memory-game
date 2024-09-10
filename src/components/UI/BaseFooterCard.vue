<script setup lang="ts">
import { watch } from 'vue';
import useGameStore from '../../store/game';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  title: string;
  value: string | number;
  isCurrentTurn: boolean;
  success: number;
}>();

const gameStore = useGameStore();
const { comboCount, maxComboMultiplier, comboTimeout } = storeToRefs(gameStore);

const showSuccessEffect = ref(false);
const showBonusText = ref(false);

watch(
  () => props.success,
  (newVal, oldVal) => {
    if (comboCount.value === 0 && newVal > oldVal) {
      showSuccessEffect.value = true;
      showBonusText.value = true;

      setTimeout(() => {
        showSuccessEffect.value = false;
      }, 1500);

      setTimeout(() => {
        showBonusText.value = false;
      }, 1000);
    }
  },
  { deep: true }
);

const calculateColor = (comboValue: number) => {
  const ratio = comboValue / maxComboMultiplier.value;
  if (ratio <= 0.2) return 'bg-hotter';
  if (ratio <= 0.4) return 'bg-even-hotter';
  if (ratio <= 0.6) return 'bg-blazing';
  if (ratio <= 0.8) return 'bg-explosive';
  return 'bg-success';
};

const bgClass = computed(() => {
  if (showSuccessEffect.value) {
    return 'bg-success';
  }

  if (props.title === 'Moves') {
    return 'bg-[#DFE7EC] !text-accent';
  }

  if (props.isCurrentTurn && comboCount.value === 0) {
    return 'bg-primary text-white-smoke';
  } else if (!props.isCurrentTurn) {
    return 'bg-[#DFE7EC]';
  }

  return calculateColor(comboCount.value);
});

const animationClass = computed(() => {
  if (showSuccessEffect.value) {
    return 'animate-success-scale';
  }

  return props.isCurrentTurn && comboCount.value > 1
    ? 'animate-pulse'
    : 'animate-fade-out';
});

const animationDuration = computed(() => {
  if (showSuccessEffect.value) {
    return '1.5s';
  }

  if (comboCount.value > 0) {
    const speedFactor = Math.max(comboTimeout.value / 5000, 0.2);
    return `${speedFactor}s`;
  }

  return '0.3s';
});

const styleDuration = computed(() => {
  if (showSuccessEffect.value) {
    return '1.5s';
  }

  if (comboCount.value > 0) {
    return `${comboTimeout.value / 1000}s`;
  }

  return '0.3s';
});

const titleClass = computed(() => {
  if (props.title === 'Moves') {
    return 'text-muted';
  }
  return props.isCurrentTurn ? 'text-white-smoke ' : 'text-muted';
});

const valueClass = computed(() => {
  if (props.title === 'Moves') {
    return 'text-accent';
  }
  return props.isCurrentTurn ? 'text-white-smoke' : 'text-accent';
});
</script>

<template>
  <div @click="gameStore.increaseComboManually">
    <span
      class="card-base transition-all duration-300 relative"
      :class="[bgClass, animationClass]"
      :style="{
        animationDuration: animationDuration,
        transitionDuration: styleDuration,
      }"
    >
      <span
        class="title"
        :class="titleClass"
      >
        {{ props.title }}
      </span>

      <span
        class="default"
        :class="valueClass"
      >
        {{ props.value }}
      </span>

      <span
        v-if="props.isCurrentTurn && comboCount > 0"
        class="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full text-sm text-white-smoke font-bold"
        :class="bgClass"
      >
        {{ `${comboCount}x` }}
      </span>

      <span
        v-if="showBonusText"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-deep-navy animate-bonus-fade"
      >
        +1
      </span>
    </span>

    <div
      v-show="props.isCurrentTurn && props.title != 'Moves'"
      class="current-turn-text"
    >
      Current Turn
    </div>
  </div>
</template>

<style scoped>
.card-base {
  @apply flex items-center justify-between gap-10 p-6 w-[255px] h-[72px] rounded-xl;
}
.title {
  @apply text-body;
}
.default {
  @apply text-h2;
}
.current-turn-text {
  @apply py-5 text-[18px] text-deep-navy font-bold uppercase text-center tracking-widest;
}

.bg-even-hotter {
  @apply bg-[#ff6000] drop-shadow-[0_0_20px_rgba(255,96,0,1)];
}

.bg-blazing {
  @apply bg-[#ff4500] drop-shadow-[0_0_25px_rgba(255,69,0,1.1)];
}

.bg-explosive {
  @apply bg-[#ff2400] drop-shadow-[0_0_30px_rgba(255,36,0,1.2)];
}

.bg-success {
  @apply bg-green-500 drop-shadow-[0_0_35px_rgba(72,187,120,1.2)];
}

@keyframes success-scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1) rotateX(360deg);
  }
}

.animate-success-scale {
  animation: success-scale 1.5s ease-in-out forwards;
}

@keyframes bonus-fade {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(30px);
    opacity: 0;
  }
}

.animate-bonus-fade {
  animation: bonus-fade 1s ease-in-out forwards;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse infinite ease-in-out;
}

@keyframes fade-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
}

.animate-fade-out {
  animation: fade-out 0.5s ease-in-out forwards;
}
</style>

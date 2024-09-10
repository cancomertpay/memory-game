<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import useGameStore from '../../store/game';
import useGameConfigStore from '../../store/gameConfig';

const props = defineProps<{
  value: any;
  isSelected: boolean;
  isMatched: boolean;
  isTemporaryMatched: boolean;
}>();

const configStore = useGameConfigStore();
const gameStore = useGameStore();
const { gameOptions } = storeToRefs(configStore);
const { isGameRestarted } = storeToRefs(gameStore);

const cardClass = computed(() => {
  if (props.isTemporaryMatched) {
    return 'matched';
  } else if (props.isMatched) {
    return 'open';
  }
  if (props.isSelected) return 'open';
  return 'close';
});

const cardInner = computed(() =>
  gameOptions.value.gridSize === '4x4' ? 'x4' : 'x6'
);
const cardBaseClass = computed(() =>
  !isGameRestarted.value ? 'card' : 'restarted-card'
);
</script>

<template>
  <div :class="[cardBaseClass, cardClass, cardInner]">
    {{ props.value }}
  </div>
</template>

<style scoped>
.card {
  @apply flex items-center justify-center text-white-smoke rounded-full cursor-pointer transition-all duration-200 ease-in;
}

.restarted-card {
  @apply flex items-center justify-center text-white-smoke rounded-full cursor-pointer;
}

.matched {
  @apply bg-primary scale-110 animate-pulse transition-all duration-200;
}

.open {
  @apply bg-secondary;
}

.close {
  @apply bg-deep-navy text-deep-navy hover:bg-secondary hover:text-secondary;
}

.x4 {
  @apply size-[72.53px] md:size-[118px] text-gameNumber4x4;
}

.x6 {
  @apply size-[46.88px] md:size-[82px] text-gameNumber6x6;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string | number;
  isWinner?: boolean;
  bonus?: number;
}>();

const cardBg = computed(() => {
  if (props.isWinner) {
    return 'winner-bg';
  } else {
    return 'card-bg';
  }
});

const cardTitle = computed(() => {
  if (props.isWinner) {
    return 'winner-title-color';
  } else {
    return 'title-color';
  }
});

const cardDefault = computed(() => {
  if (props.isWinner) {
    return 'winner-default-color';
  } else {
    return 'default-color';
  }
});
</script>

<template>
  <div
    class="card-base"
    :class="cardBg"
  >
    <span
      class="title"
      :class="cardTitle"
    >
      {{ props.title }} {{ props.isWinner ? '(Winner!)' : '' }}
    </span>
    <div class="flex items-center justify-center gap-2">
      <span
        v-show="props.bonus! > 0 && props.title.toLocaleLowerCase() !== 'moves taken' && props.title.toLocaleLowerCase() !== 'time elapsed'"
        class="text-sm"
        :class="cardDefault"
        >(+{{ props.bonus }})</span
      >
      <span
        class="default"
        :class="cardDefault"
        >{{ props.value }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.card-base {
  @apply flex items-center justify-between w-full h-[72px] gap-10 p-6 rounded-xl;
}

.card-bg {
  @apply bg-[#DFE7EC];
}

.winner-bg {
  @apply bg-deep-navy;
}

.winner-title-color {
  @apply text-white-smoke;
}

.title-color {
  @apply text-muted;
}

.title {
  @apply text-body;
}

.winner-default-color {
  @apply text-white-smoke;
}

.default-color {
  @apply text-accent;
}

.default {
  @apply text-h2;
}
</style>

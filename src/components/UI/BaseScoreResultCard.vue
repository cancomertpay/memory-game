<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string | number;
  isWinner?: boolean;
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
      {{ props.title }}
    </span>
    <span
      class="default"
      :class="cardDefault"
      >{{ props.value }}</span
    >
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

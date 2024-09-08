<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: string | number;
  isCurrentTurn: boolean;
}>();
</script>

<template>
  <div>
    <span
      class="card-base transition-all duration-300"
      :class="{ 'current-turn': props.isCurrentTurn }"
    >
      <span
        class="title"
        :class="{ '!text-white-smoke': props.isCurrentTurn }"
      >
        {{ props.title }}
      </span>
      <span
        class="default"
        :class="{ '!text-white-smoke': props.isCurrentTurn }"
        >{{ props.value }}</span
      >
    </span>
    <div
      v-show="props.isCurrentTurn"
      class="current-turn-text"
    >
      Current Turn
    </div>
  </div>
</template>

<style scoped>
.card-base {
  @apply flex items-center justify-between gap-10 p-6 w-[255px] h-[72px] bg-[#DFE7EC] rounded-xl;
}
.title {
  @apply text-body text-muted;
}
.default {
  @apply text-h2 text-accent;
}
.current-turn {
  @apply !bg-primary;
}
.current-turn-text {
  @apply py-5 text-[18px] text-deep-navy font-bold uppercase text-center tracking-widest;
}
</style>

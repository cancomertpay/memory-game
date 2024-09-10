<script setup lang="ts">
import { computed } from 'vue';
import { CONTAINER_LAYOUT } from '../../models/enums';

const props = defineProps<{
  layout: CONTAINER_LAYOUT;
}>();

const containerLayout = computed(() => {
  switch (props.layout) {
    case CONTAINER_LAYOUT.START:
      return 'start-layout';
    case CONTAINER_LAYOUT.GAME:
      return 'game-layout';
    default:
      return '';
  }
});
</script>

<template>
  <section :class="containerLayout">
    <slot></slot>
  </section>
</template>

<style scoped>
.start-layout {
  @apply flex flex-col items-center justify-center gap-16 min-h-screen w-full;
}

.game-layout {
  @apply relative flex flex-col justify-between min-h-screen w-full py-20 px-40 bg-white-smoke;
}
</style>

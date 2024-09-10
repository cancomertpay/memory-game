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
  @apply relative flex flex-col justify-between min-h-screen w-full px-5 py-10 md:p-10 lg:py-10 xl:py-20 lg:px-40 bg-white-smoke;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { BUTTON_STYLE } from '../../models/enums';

const props = defineProps<{
  buttonStyle: BUTTON_STYLE;
  isActive?: boolean;
}>();

const buttonClass = computed(() => {
  switch (props.buttonStyle) {
    case BUTTON_STYLE.PRIMARY:
      return 'primary';
    case BUTTON_STYLE.SECONDARY:
      return 'secondary';
    case BUTTON_STYLE.MENU_BIG:
      return 'menu-big';
    case BUTTON_STYLE.MENU_SELECTION:
      return 'menu-selection';
    default:
      return '';
  }
});
</script>

<template>
  <button
    class="py-3 px-10 rounded-full active:scale-75 transition-all duration-300 ease-in"
    :class="[buttonClass, { active: isActive }]"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.primary {
  @apply bg-primary text-h3 text-white-smoke hover:opacity-60;
}
.secondary {
  @apply bg-[#DFE7EC] text-h3 text-accent hover:bg-info hover:text-white-smoke;
}
.menu-big {
  @apply bg-primary text-h2 text-white-smoke w-full active:scale-95 hover:opacity-60;
}
.menu-selection {
  @apply py-2 px-0 w-full bg-secondary text-white-smoke text-[26px] font-bold hover:bg-info active:scale-100;
}
.menu-selection.active {
  @apply bg-accent scale-105;
}
</style>

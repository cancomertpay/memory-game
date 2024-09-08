<script setup lang="ts">
import { DEFAULT_GAME_OPTIONS } from '../../constants';
import { BUTTON_STYLE } from '../../models/enums';
import useGameStore from '../../store/gameConfig';
import BaseButton from './BaseButton.vue';
import { ref } from 'vue';
const props = defineProps<{
  title: string;
  options: string[];
  storeKey: keyof typeof DEFAULT_GAME_OPTIONS;
  default?: string;
}>();

const store = useGameStore();

const activeOption = ref<string | null>(props.default || null);

const handleOptionClick = (option: string) => {
  activeOption.value = option?.toLocaleLowerCase();
  store.setGameOptions({ [props.storeKey]: option.toLocaleLowerCase() });
};
</script>

<template>
  <div>
    <h2 class="mb-2 text-h3 text-muted">{{ props.title }}</h2>
    <div class="flex items-center justify-center gap-10">
      <BaseButton
        v-for="(option, index) in props.options"
        :key="index"
        :button-style="BUTTON_STYLE.MENU_SELECTION"
        :is-active="activeOption === option?.toLocaleLowerCase()"
        @click="handleOptionClick(option)"
      >
        {{ option }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>

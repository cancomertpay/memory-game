<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useGameStore from '../../../store/game';
import useGameConfigStore from '../../../store/gameConfig';
import { computed } from 'vue';
import BasePairCard from '../../UI/BasePairCard.vue';

const configStore = useGameConfigStore();
const gameStore = useGameStore();

const { matchedCards, selectedCards, temporaryMatchedCards } =
  storeToRefs(gameStore);

const { gameOptions, gameData } = storeToRefs(configStore);

const gridSizeClass = computed(() => {
  return gameOptions.value.gridSize === '4x4' ? 'grid-4x4' : 'grid-6x6';
});
</script>

<template>
  <transition
    name="slide-left"
    appear
    mode="out-in"
  >
    <main class="flex items-center justify-center my-20">
      <div
        class="game-grid"
        :class="gridSizeClass"
      >
        <BasePairCard
          v-for="(item, index) in gameData"
          :key="index"
          :value="item"
          :is-selected="selectedCards.includes(index)"
          :is-matched="matchedCards.includes(index)"
          :is-temporary-matched="temporaryMatchedCards.includes(index)"
          @click="gameStore.selectCard(index)"
        />
      </div>
    </main>
  </transition>
</template>

<style scoped>
.grid-4x4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
  gap: 1rem;
}

.grid-6x6 {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  place-items: center;
  gap: 1rem;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.8s ease;
}

.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>

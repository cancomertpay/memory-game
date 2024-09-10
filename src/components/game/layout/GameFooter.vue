<script setup lang="ts">
import { computed } from 'vue';
import useGameStore from '../../../store/game';
import useGameConfigStore from '../../../store/gameConfig';
import { storeToRefs } from 'pinia';
import { formatTime } from '../../../utils/helpers';
import BaseFooterCard from '../../UI/BaseFooterCard.vue';

const configStore = useGameConfigStore();
const gameStore = useGameStore();

const { players } = storeToRefs(configStore);
const { timeElapsed, isSinglePlayer, roundCount, currentTurn } =
  storeToRefs(gameStore);

const formattedTimeElapsed = computed(() => {
  return formatTime(timeElapsed.value);
});
</script>

<template>
  <transition
    name="slide-up"
    appear
    mode="out-in"
  >
    <footer class="flex justify-center flex-wrap gap-8">
      <template v-if="isSinglePlayer">
        <BaseFooterCard
          :id="players[0].id"
          :success="players[0].success"
          title="Time"
          :value="formattedTimeElapsed"
          :is-current-turn="false"
        />
        <BaseFooterCard
          :id="players[0].id"
          :success="players[0].success"
          title="Moves"
          :value="roundCount"
          :is-current-turn="true"
        />
      </template>

      <template v-else>
        <BaseFooterCard
          v-for="(player, index) in players"
          :key="player.id"
          :id="player.id"
          :title="player.name"
          :value="player.success"
          :success="player.success"
          :is-current-turn="index === currentTurn"
        />
      </template>
    </footer>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

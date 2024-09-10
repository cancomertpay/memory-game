<script setup lang="ts">
import { computed, watch } from 'vue';
import BaseModal from '../UI/BaseModal.vue';
import { formatTime } from '../../utils/helpers';
import { storeToRefs } from 'pinia';
import useGameStore from '../../store/game';
import useGameConfigStore from '../../store/gameConfig';
import useModalStore from '../../store/modal';
import { BUTTON_STYLE } from '../../models/enums';
import { Confetti } from 'fast-confetti';
import BaseScoreResultCard from '../UI/BaseScoreResultCard.vue';
import BaseButton from '../UI/BaseButton.vue';


const modalStore = useModalStore();
const configStore = useGameConfigStore();
const gameStore = useGameStore();


const { players } = storeToRefs(configStore);

const { roundCount, timeElapsed, isSinglePlayer, winners } =
  storeToRefs(gameStore);

const formattedTimeElapsed = computed(() => {
  return formatTime(timeElapsed.value);
});

const winnerTitle = computed(() => {
  if (winners.value.length > 1) {
    return 'It’s a tie!';
  } else {
    return `Player ${winners.value} Wins!`;
  }
});

const handleRestarClick = () => {
  modalStore.closeModal();
  gameStore.restartGame();
};

const handleNewGameClick = () => {
  modalStore.closeModal();
  gameStore.startNewGame();
};

</script>

<template>
  <BaseModal>
    <div
      v-if="isSinglePlayer"
      class="flex flex-col items-center justify-center gap-12"
    >
      <div class="text-center">
        <h1 class="text-h1 text-deep-navy">You did it!</h1>
        <p class="text-body text-muted">Game over! Here’s how you got on…</p>
      </div>
      <div class="flex flex-col items-center justify-center gap-5 w-full">
        <BaseScoreResultCard
          title="Time Elapsed"
          :value="formattedTimeElapsed"
        />
        <BaseScoreResultCard
          title="Moves Taken"
          :value="`${roundCount} Moves`"
        />
      </div>
      <div class="flex items-center justify-center gap-5 w-full">
        <BaseButton
          class="block flex-1"
          :button-style="BUTTON_STYLE.PRIMARY"
          @click="handleRestarClick"
          >Restart</BaseButton
        >
        <BaseButton
          class="block flex-1"
          :button-style="BUTTON_STYLE.SECONDARY"
          @click="handleNewGameClick"
          >Setup New Game</BaseButton
        >
      </div>
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center gap-12"
    >
      <div class="text-center">
        <h1 class="text-h1 text-deep-navy">{{ winnerTitle }}</h1>
        <p class="text-body text-muted">Game over! Here’s how you got on…</p>
      </div>
      <div class="flex flex-col items-center justify-center gap-5 w-full">
        <BaseScoreResultCard
          v-for="player in players"
          :title="player.name"
          :value="`${player.success} Pairs`"
          :isWinner="winners.includes(player.id)"
          :bonus="player.bonus"
        />
      </div>
      <div class="flex items-center justify-center gap-5 w-full">
        <BaseButton
          class="block flex-1"
          :button-style="BUTTON_STYLE.PRIMARY"
          @click="handleRestarClick"
          >Restart</BaseButton
        >
        <BaseButton
          class="block flex-1"
          :button-style="BUTTON_STYLE.SECONDARY"
          @click="handleNewGameClick"
          >Setup New Game</BaseButton
        >
      </div>
    </div>
  </BaseModal>
</template>

<style scoped></style>

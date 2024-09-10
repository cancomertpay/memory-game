<script setup lang="ts">
import { computed, onUnmounted } from 'vue';
import BaseButton from '../components/UI/BaseButton.vue';
import Container from '../components/UI/BaseContainer.vue';
import BrandLogo from '../components/UI/BrandLogo.vue';
import { BUTTON_STYLE, CONTAINER_LAYOUT } from '../models/enums';
import useGameConfigStore from '../store/gameConfig';
import { storeToRefs } from 'pinia';
import BasePairCard from '../components/UI/BasePairCard.vue';
import useGameStore from '../store/game';
import BaseFooterCard from '../components/UI/BaseFooterCard.vue';
import { formatTime } from '../utils/helpers';
import BaseModal from '../components/UI/BaseModal.vue';
import useModalStore from '../store/modal';
import BaseScoreResultCard from '../components/UI/BaseScoreResultCard.vue';

const modalStore = useModalStore();
const configStore = useGameConfigStore();

const { gameData, players, gameOptions } = storeToRefs(configStore);

const gameStore = useGameStore();

const {
  matchedCards,
  roundCount,
  selectedCards,
  temporaryMatchedCards,
  timeElapsed,
  currentTurn,
  isSinglePlayer,
  winners,
} = storeToRefs(gameStore);

const gridSizeClass = computed(() => {
  return configStore.gameOptions.gridSize === '4x4' ? 'grid-4x4' : 'grid-6x6';
});

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

onUnmounted(() => {
  gameStore.stopTimer();
});
</script>

<template>
  <Container :layout="CONTAINER_LAYOUT.GAME">
    <transition
      name="slide-down"
      appear
      mode="out-in"
    >
      <header class="w-full flex items-center justify-between">
        <BrandLogo />
        <div class="space-x-5">
          <BaseButton
            :button-style="BUTTON_STYLE.PRIMARY"
            @click="gameStore.restartGame()"
            >Restart</BaseButton
          >
          <BaseButton
            :button-style="BUTTON_STYLE.SECONDARY"
            @click="gameStore.startNewGame"
            >New Game</BaseButton
          >
        </div>
      </header>
    </transition>

    <transition
      name="slide-left"
      appear
      mode="out-in"
    >
      <main class="flex items-center justify-center my-20">
        <div
          :class="{
            'w-[532px] h-[532px]': gameOptions.gridSize === '4x4',
            'w-[572px] h-[572px]': gameOptions.gridSize === '6x6',
          }"
        >
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
        </div>
      </main>
    </transition>
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
  </Container>
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

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.8s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
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

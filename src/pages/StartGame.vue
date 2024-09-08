<script setup lang="ts">
import BaseButton from '../components/UI/BaseButton.vue';
import BrandLogo from '../components/UI/BrandLogo.vue';
import Card from '../components/UI/BaseCard.vue';
import Container from '../components/UI/BaseContainer.vue';
import GameOptions from '../components/UI/GameOptions.vue';
import { BUTTON_STYLE, CONTAINER_LAYOUT } from '../models/enums';
import { DEFAULT_GAME_OPTIONS } from '../constants';
import { ref, onMounted } from 'vue';
import useGameConfigStore from '../store/gameConfig';
import { storeToRefs } from 'pinia';

const store = useGameConfigStore();
const { isGameStarted } = storeToRefs(store);
const closing = ref(false);
const scaleComplete = ref(false);

const disableScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableScroll = () => {
  document.body.style.overflow = '';
};

const triggerScaleAnimation = () => {
  setTimeout(() => {
    scaleComplete.value = true;
    setTimeout(() => {
      scaleComplete.value = false;
    }, 1500);
  }, 1200);
};

const handleStartGame = () => {
  closing.value = true;
  setTimeout(() => {
    store.prepareGameData();
    store.startGame();
    closing.value = false;
  }, 1200);
};

onMounted(() => {
  triggerScaleAnimation();
});
</script>

<template>
  <Container :layout="CONTAINER_LAYOUT.START">
    <transition
      name="slide-down"
      appear
      mode="out-in"
      @before-enter="disableScroll"
      @after-enter="enableScroll"
      @before-leave="disableScroll"
      @after-leave="enableScroll"
    >
      <div v-if="!isGameStarted && !closing">
        <BrandLogo
          class="fill-white-smoke"
          :class="{ 'scale-rotate': scaleComplete }"
        />
      </div>
    </transition>

    <transition
      name="slide-up"
      appear
      mode="out-in"
      @before-enter="disableScroll"
      @after-enter="enableScroll"
      @before-leave="disableScroll"
      @after-leave="enableScroll"
    >
      <div v-if="!isGameStarted && !closing">
        <Card>
          <GameOptions
            title="Select Theme"
            :options="['Numbers', 'Icons']"
            store-key="gameTheme"
            :default="DEFAULT_GAME_OPTIONS.gameTheme"
          />
          <GameOptions
            title="Number of Players"
            :options="['1', '2', '3', '4']"
            store-key="numberOfPlayers"
            :default="DEFAULT_GAME_OPTIONS.numberOfPlayers"
          />
          <GameOptions
            title="Grid Size"
            :options="['4x4', '6x6']"
            store-key="gridSize"
            :default="DEFAULT_GAME_OPTIONS.gridSize"
          />
          <BaseButton
            :button-style="BUTTON_STYLE.MENU_BIG"
            @click="handleStartGame"
            >Start Game</BaseButton
          >
        </Card>
      </div>
    </transition>
  </Container>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 1.2s cubic-bezier(0.25, 1, 0.5, 1);
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

.scale-rotate {
  animation: logoScaleRotateEffect 1.5s ease-in-out;
}

@keyframes logoScaleRotateEffect {
  0% {
    transform: scale(1) rotatex(0deg);
  }
  50% {
    transform: scale(1.2) rotatex(360deg);
  }
  100% {
    transform: scale(1) rotatex(0deg);
  }
}
</style>

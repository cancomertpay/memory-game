<script setup lang="ts">
import BaseModal from '../../UI/BaseModal.vue';
import BaseButton from '../../UI/BaseButton.vue';
import { BUTTON_STYLE } from '../../../models/enums';
import useGameStore from '../../../store/game';
import useModalStore from '../../../store/modal';
import BrandLogo from '../../UI/BrandLogo.vue';

const modalStore = useModalStore();
const gameStore = useGameStore();
</script>

<template>
  <transition
    name="slide-down"
    appear
    mode="out-in"
  >
    <header class="w-full flex items-center justify-between">
      <BrandLogo />
      <div class="md:hidden">
        <BaseButton
          :button-style="BUTTON_STYLE.PRIMARY"
          @click="modalStore.openModal"
          >Menu</BaseButton
        >
        <BaseModal>
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
        </BaseModal>
      </div>
      <nav class="hidden md:block space-x-5">
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
      </nav>
    </header>
  </transition>
</template>

<style scoped>
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
</style>

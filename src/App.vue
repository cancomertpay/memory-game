<script setup lang="ts">
import StartGame from './pages/StartGame.vue';
import TheGame from './pages/TheGame.vue';
import useGameStore from './store/gameConfig';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const store = useGameStore();
const { isGameStarted } = storeToRefs(store);
const bgColor = ref('#152938'); // StartGame'in arka plan rengi

// Oyun başladığında arka plan rengini değiştirmek için izleme
watch(isGameStarted, (newValue) => {
  if (newValue) {
    bgColor.value = '#FCFCFC'; // TheGame'in arka plan rengi
  } else {
    bgColor.value = '#152938'; // StartGame'in arka plan rengi
  }
});
</script>

<template>
  <div
    :style="{ backgroundColor: bgColor }"
    class="app-container"
  >
    <transition
      name="fade"
      mode="out-in"
    >
      <component
        :is="!isGameStarted ? StartGame : TheGame"
        key="game-transition"
      ></component>
    </transition>
  </div>
</template>

<style scoped>
.app-container {
  transition: background-color 1s ease-in-out; /* Smooth background transition */
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

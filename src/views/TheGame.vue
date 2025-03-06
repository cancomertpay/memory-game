<script setup lang="ts">
import { onUnmounted } from 'vue';
import Container from '../components/UI/BaseContainer.vue';
import { CONTAINER_LAYOUT } from '../models/enums';
import useGameStore from '../store/game';
import Header from '../components/game/layout/GameHeader.vue';
import Main from '../components/game/layout/GameMain.vue';
import Footer from '../components/game/layout/GameFooter.vue';
import ScoreModal from '../components/score/ScoreModal.vue';

const gameStore = useGameStore();

onUnmounted(() => {
  gameStore.stopTimer();
});
</script>

<template>
  <Container :layout="CONTAINER_LAYOUT.GAME">
    <Header />
    <Main />
    <Footer />
    <ScoreModal />
  </Container>
</template>

<style scoped>

</style>

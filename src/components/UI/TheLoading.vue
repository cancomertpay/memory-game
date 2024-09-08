<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loadingComplete = ref(false); // Loading işlemi bittiğinde diğer bileşene geçiş yapılacak

// 3 saniye sürecek olan loading ekranını başlatıyoruz
const triggerLoadingScreen = () => {
  setTimeout(() => {
    loadingComplete.value = true; // Loading işlemi tamamlanıyor
  }, 3000); // 3 saniye bekleme süresi
};

onMounted(() => {
  triggerLoadingScreen();
});
</script>

<template>
  <transition
    name="fade"
    mode="out-in"
  >
    <div
      v-if="!loadingComplete"
      class="loading-screen"
    >
      <BrandLogo class="loading-logo" />
    </div>
  </transition>
</template>

<style scoped>
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85); /* Karanlık arka plan */
}

.loading-logo {
  animation: logoLoading 3s ease-in-out; /* 3 saniyelik animasyon */
}

@keyframes logoLoading {
  0% {
    transform: scale(1) rotateX(0deg);
  }
  50% {
    transform: scale(1.5) rotateX(360deg); /* Logo büyür ve döner */
  }
  100% {
    transform: scale(1) rotateX(720deg); /* Döngü tamamlanır */
  }
}
</style>

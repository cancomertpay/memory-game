<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useModalStore from '../../store/modal';
import { watch } from 'vue';
import { Confetti } from 'confetti-manager';

const modalStore = useModalStore();
const { isModalOpen } = storeToRefs(modalStore);

const confetti = new Confetti();

watch(isModalOpen, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
    confetti.fall([], {
      scalar: 1.5,
      gravity: 2,
      shapes: ['circle', 'square'],
    });
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <teleport to="body">
    <transition
      name="fade"
      appear
    >
      <div
        class="outside"
        v-if="isModalOpen"
        @click="modalStore.closeModal"
      >
        <transition
          name="slide-fade"
          appear
        >
          <div
            class="card-base"
            @click.stop
          >
            <slot></slot>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.outside {
  @apply fixed top-0 left-0 flex items-center justify-center min-h-screen w-full bg-black/30;
}

.card-base {
  @apply min-w-[654px] min-h-[510px] p-16 bg-white-smoke rounded-2xl z-50;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(50px); /* Aşağıdan yukarıya smooth slide */
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

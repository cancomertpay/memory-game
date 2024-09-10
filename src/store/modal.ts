import { defineStore } from 'pinia';
import { ref } from 'vue';

const useModalStore = defineStore('modal', () => {
  const isModalOpen = ref(false);

  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
});

export default useModalStore;

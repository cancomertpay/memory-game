import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import useGameConfigStore from './gameConfig';
import useModalStore from './modal';
import { Confetti } from 'confetti-manager';

const useGameStore = defineStore('the-game', () => {
  const config = useGameConfigStore();
  const modal = useModalStore();
  const { gameData, gameOptions, players } = storeToRefs(config);

  const confetti = new Confetti();

  const selectedCards = ref<number[]>([]);
  const matchedCards = ref<number[]>([]);
  const temporaryMatchedCards = ref<number[]>([]);
  const roundCount = ref(0);
  const timeElapsed = ref(0);
  const isGameRestarted = ref(false);
  const winners = ref<number[]>([]);
  const gameScores = ref<{ id: number; player: string; success: number }[]>([]);
  const comboCount = ref(0);
  const comboMultiplier = ref(1);
  const maxComboMultiplier = ref(4);

  const isComboMaxReached = computed(() => {
    return comboCount.value >= maxComboMultiplier.value;
  });

  const comboTimeout = computed(() => {
    return Math.max(1000, 5000 - comboMultiplier.value * 500);
  });

  const currentTurn = computed(() => {
    return roundCount.value % Number(gameOptions.value.numberOfPlayers);
  });

  const isSinglePlayer = computed(() => {
    return gameOptions.value.numberOfPlayers === '1';
  });

  const isGameFinished = computed(() => {
    return matchedCards.value.length === gameData.value.length;
  });

  const increaseComboManually = () => {
    comboCount.value++;
    if (comboCount.value >= maxComboMultiplier.value) {
      players.value[currentTurn.value].success++;
      resetCombo();
    } else {
      comboMultiplier.value = Math.min(
        comboMultiplier.value + 1,
        maxComboMultiplier.value
      );
      startComboTimer();
    }
  };

  let comboTimer: any;
  let timer: any;

  const startTimer = () => {
    timer = setInterval(() => {
      timeElapsed.value++;
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  const resetCombo = () => {
    comboCount.value = 0;
    comboMultiplier.value = 1;
  };

  const startComboTimer = () => {
    clearTimeout(comboTimer);

    const timeoutDuration = Math.max(1000, comboTimeout.value);

    comboTimer = setTimeout(() => {
      resetCombo();
    }, timeoutDuration);
  };

  const selectCard = (index: number) => {
    if (
      matchedCards.value.includes(index) ||
      selectedCards.value.includes(index) ||
      selectedCards.value.length === 2
    ) {
      return;
    }

    selectedCards.value.push(index);

    if (selectedCards.value.length === 2) {
      const isMatch = checkForMatch();

      if (!isMatch) {
        players.value[currentTurn.value].moves++;
        roundCount.value++;
        resetCombo();
      } else {
        comboCount.value++;
        if (comboCount.value >= maxComboMultiplier.value) {
          players.value[currentTurn.value].success++;
          resetCombo();
        } else {
          comboMultiplier.value = Math.min(
            comboMultiplier.value + 1,
            maxComboMultiplier.value
          );
        }
        startComboTimer();
      }
    }

    if (matchedCards.value.length === gameData.value.length) {
      stopTimer();
    }
  };

  const checkForMatch = (): boolean => {
    const [firstIndex, secondIndex] = selectedCards.value;

    if (firstIndex === secondIndex) {
      setTimeout(() => {
        selectedCards.value = [];
      }, 1000);
      return false;
    }

    if (gameData.value[firstIndex] === gameData.value[secondIndex]) {
      temporaryMatchedCards.value = [
        ...temporaryMatchedCards.value,
        firstIndex,
        secondIndex,
      ];
      matchedCards.value = [...matchedCards.value, firstIndex, secondIndex];

      players.value[currentTurn.value].success++;

      setTimeout(() => {
        temporaryMatchedCards.value = [];
        selectedCards.value = [];
      }, 1000);

      return true;
    } else {
      setTimeout(() => {
        selectedCards.value = [];
      }, 1000);

      return false;
    }
  };

  const startNewGame = () => {
    stopTimer();
    config.resetGame();
    selectedCards.value = [];
    matchedCards.value = [];
    temporaryMatchedCards.value = [];
    roundCount.value = 0;
    timeElapsed.value = 0;
    resetCombo();
  };

  const restartGame = () => {
    stopTimer();
    isGameRestarted.value = true;
    config.prepareGameData();
    selectedCards.value = [];
    matchedCards.value = [];
    temporaryMatchedCards.value = [];
    roundCount.value = 0;
    timeElapsed.value = 0;
    resetCombo();
  };

  watch(roundCount, (val) => {
    if (val === 1 && isSinglePlayer) {
      startTimer();
    }
  });

  watch(isGameRestarted, () => {
    setTimeout(() => {
      isGameRestarted.value = false;
    }, 100);
  });

  watch(isGameFinished, (val) => {
    if (val && !modal.isModalOpen) {
      modal.openModal();
    }
  });

  watch(
    matchedCards,
    (newVal, oldVal) => {
      if (newVal.length > oldVal.length) {
        if (comboCount.value === 0) {
          confetti.pride([], {
            colors: ['#4CAF50', '#8BC34A'],
            duration: 1000,
          });
        } else {
          confetti.pride([], {
            colors: ['#FDA214', '#152938'],
            duration: 1000,
          });
        }
      }
    },
    { deep: true }
  );

  watch(isGameFinished, (val) => {
    if (val) {
      const maxSuccess = Math.max(
        ...players.value.map((player) => player.success)
      );

      winners.value = players.value
        .filter((player) => player.success === maxSuccess)
        .map((player) => player.id);

      gameScores.value = players.value
        .map((player) => ({
          id: player.id,
          player: player.name,
          success: player.success,
        }))
        .sort((a, b) => b.success - a.success);
    }
  });

  return {
    selectedCards,
    matchedCards,
    temporaryMatchedCards,
    timeElapsed,
    roundCount,
    isGameRestarted,
    currentTurn,
    isSinglePlayer,
    isGameFinished,
    gameScores,
    winners,
    comboCount,
    comboMultiplier,
    maxComboMultiplier,
    comboTimeout,
    isComboMaxReached,
    increaseComboManually,
    selectCard,
    stopTimer,
    startNewGame,
    restartGame,
  };
});

export default useGameStore;

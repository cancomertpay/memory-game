import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import useGameConfigStore from './gameConfig';
import useModalStore from './modal';
import { Confetti } from 'confetti-manager';

const useGameStore = defineStore('the-game', () => {
  const config = useGameConfigStore();
  const modal = useModalStore();
  const { gameData, gameOptions } = storeToRefs(config);

  const confetti = new Confetti();

  const selectedCards = ref<number[]>([]);
  const matchedCards = ref<number[]>([]);
  const temporaryMatchedCards = ref<number[]>([]);
  const roundCount = ref(0);
  const timeElapsed = ref(0);
  const isGameRestarted = ref(false);
  const playerRounds = ref<number[]>(
    Array(Number(gameOptions.value.numberOfPlayers)).fill(0)
  );
  const playerSuccesses = ref<number[]>(
    Array(Number(gameOptions.value.numberOfPlayers)).fill(0)
  );
  const winners = ref<number[]>([]);
  const gameScores = ref<
    { playerId: number; player: string; success: number }[]
  >([]);

  const currentTurn = computed(() => {
    return roundCount.value % Number(gameOptions.value.numberOfPlayers);
  });

  const isSinglePlayer = computed(() => {
    return gameOptions.value.numberOfPlayers === '1';
  });

  const isGameFinished = computed(() => {
    return matchedCards.value.length === gameData.value.length;
  });

  let timer: any;

  const startTimer = () => {
    timer = setInterval(() => {
      timeElapsed.value++;
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timer);
  };

  const startNewGame = () => {
    stopTimer();
    config.resetGame();
    selectedCards.value = [];
    matchedCards.value = [];
    temporaryMatchedCards.value = [];
    roundCount.value = 0;
    timeElapsed.value = 0;
    playerRounds.value = Array(Number(gameOptions.value.numberOfPlayers)).fill(
      0
    );
    playerSuccesses.value = Array(
      Number(gameOptions.value.numberOfPlayers)
    ).fill(0);
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
    playerRounds.value = Array(Number(gameOptions.value.numberOfPlayers)).fill(
      0
    );
    playerSuccesses.value = Array(
      Number(gameOptions.value.numberOfPlayers)
    ).fill(0);
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
        // Sadece doğru tahmin yapılmadığında tur dönsün
        playerRounds.value[currentTurn.value]++;
        roundCount.value++;
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

      const currentSuccess = playerSuccesses.value[currentTurn.value] || 0;
      playerSuccesses.value = [
        ...playerSuccesses.value.slice(0, currentTurn.value),
        currentSuccess + 1,
        ...playerSuccesses.value.slice(currentTurn.value + 1),
      ];

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

  watch(
    () => gameOptions.value.numberOfPlayers,
    (newPlayerAmount) => {
      playerRounds.value = Array(Number(newPlayerAmount)).fill(0);
    }
  );

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
        confetti.pride([], {
          colors: ['#FDA214', '#152938'],
          duration: 2000,
        });
      }
    },
    { deep: true }
  );

  watch(
    playerSuccesses,
    (newVal) => {
      newVal.forEach((success, index) => {
        console.log(`Player ${index + 1}: ${success} successes`);
      });
    },
    { deep: true }
  );

  watch(isGameFinished, (val) => {
    if (val) {
      const maxSuccess = Math.max(...playerSuccesses.value);

      winners.value = playerSuccesses.value
        .map((success, index) => (success === maxSuccess ? index + 1 : null))
        .filter((player) => player !== null) as number[];

      gameScores.value = playerSuccesses.value
        .map((success, index) => ({
          playerId: index + 1,
          player: `${index + 1} Pairs`,
          success: success,
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
    playerRounds,
    currentTurn,
    isSinglePlayer,
    playerSuccesses,
    isGameFinished,
    gameScores,
    winners,
    selectCard,
    stopTimer,
    startNewGame,
    restartGame,
  };
});

export default useGameStore;

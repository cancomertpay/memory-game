import { defineStore } from 'pinia';
import { Ref, ref, watch } from 'vue';
import { DEFAULT_GAME_OPTIONS, GAME_SEED } from '../constants';
import { shuffleArray } from '../utils/helpers';

const useGameConfigStore = defineStore('game-config', () => {
  const gameOptions: Ref<typeof DEFAULT_GAME_OPTIONS> = ref({
    ...DEFAULT_GAME_OPTIONS,
  });
  const isGameStarted = ref(false);
  const gameData: Ref<string[]> = ref([]);

  const setGameOptions = (
    options: Partial<typeof DEFAULT_GAME_OPTIONS>
  ): void => {
    gameOptions.value = { ...gameOptions.value, ...options };
  };

  const startGame = (): void => {
    isGameStarted.value = true;
  };

  const resetGame = (): void => {
    gameOptions.value = { ...DEFAULT_GAME_OPTIONS };
    isGameStarted.value = false;
  };

  const prepareGameData = () => {
    const theme = gameOptions.value.gameTheme;
    const gridSize = gameOptions.value.gridSize === '4x4' ? 16 : 36;

    const gameSeed = theme === 'numbers' ? GAME_SEED.numbers : GAME_SEED.icons;

    const limitedGameData = gameSeed.slice(0, gridSize / 2);
    gameData.value = shuffleArray([...limitedGameData, ...limitedGameData]);
  };

  watch(isGameStarted, () => {
    console.log(
      'game options:',
      gameOptions.value,
      'game data:',
      gameData.value
    );
  });

  return {
    gameOptions,
    isGameStarted,
    gameData,
    setGameOptions,
    startGame,
    resetGame,
    prepareGameData,
  };
});

export default useGameConfigStore;

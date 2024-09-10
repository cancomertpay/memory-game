import { defineStore } from 'pinia';
import { Ref, ref, watch } from 'vue';
import { DEFAULT_GAME_OPTIONS, GAME_SEED } from '../constants';
import { shuffleArray } from '../utils/helpers';
import { IPlayers } from '../models/interfaces';

const useGameConfigStore = defineStore('game-config', () => {
  const gameOptions: Ref<typeof DEFAULT_GAME_OPTIONS> = ref({
    ...DEFAULT_GAME_OPTIONS,
  });
  const isGameStarted = ref(false);
  const gameData: Ref<string[]> = ref([]);
  const players: Ref<IPlayers[]> = ref([]);

  const setGameOptions = (
    options: Partial<typeof DEFAULT_GAME_OPTIONS>
  ): void => {
    gameOptions.value = { ...gameOptions.value, ...options };
  };

  const startGame = (): void => {
    isGameStarted.value = true;
  };

  const resetGame = (): void => {
    isGameStarted.value = false;
  };

  const prepareGameData = () => {
    const theme = gameOptions.value.gameTheme;
    const gridSize = gameOptions.value.gridSize === '4x4' ? 16 : 36;

    const gameSeed = theme === 'numbers' ? GAME_SEED.numbers : GAME_SEED.icons;

    const numberOfPlayers = Number(gameOptions.value.numberOfPlayers);
    players.value = Array.from({ length: numberOfPlayers }, (_, index) => ({
      id: index + 1,
      name: `Player ${index + 1}`,
      moves: 0,
      success: 0,
      bonus: 0,
    }));

    const limitedGameData = gameSeed.slice(0, gridSize / 2);
    gameData.value = shuffleArray([...limitedGameData, ...limitedGameData]);
  };

  watch(
    players,
    () => {
      console.table(
        players.value.map((player) => ({
          PlayerID: player.id,
          PlayerName: player.name,
          Rounds: player.moves,
          Successes: player.success,
          Bonus: player.bonus,
        }))
      );
    },
    { deep: true }
  );

  return {
    gameOptions,
    isGameStarted,
    gameData,
    players,
    setGameOptions,
    startGame,
    resetGame,
    prepareGameData,
  };
});

export default useGameConfigStore;

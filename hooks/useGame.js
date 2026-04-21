import { useState, useCallback } from 'react';

const initialState = {
  status: 'waiting',
  round: 0,
  totalRounds: 0,
  drawerId: null,
  word: null,
  wordLength: null,
  timeLeft: 80,
  roundDuration: 80,
  guessedPlayers: [],
  players: [],
  messages: [],
};

const useGame = () => {
  const [gameState, setGameState] = useState(initialState);

  const updateGameState = useCallback((updates) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  const addMessage = useCallback((message) => {
    setGameState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  return {
    gameState,
    updateGameState,
    addMessage,
    setGameState,
    resetGame,
  };
};

export default useGame;

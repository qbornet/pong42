import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useGameOver } from './useGameOver';

export function useGameStarted(): { isGameStarted: boolean } {
  const { socket } = useSocketContext();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { isGameOver } = useGameOver();

  useEffect(() => {
    if (isGameOver) {
      setIsGameStarted(false);
    }
  }, [isGameOver]);

  useEffect(() => {
    const onStartGame = () => {
      setIsGameStarted(true);
    };
    socket.on('startGame', onStartGame);

    return () => {
      socket.off('startGame', onStartGame);
    };
  }, [socket]);
  return { isGameStarted };
}

import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export function useGameOver(): { isGameOver: boolean } {
  const { socket } = useSocketContext();
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const onGameOver = (over: boolean) => {
      setIsGameOver(over);
    };

    socket.on('gameOver', onGameOver);

    return () => {
      socket.off('gameOver', onGameOver);
    };
  }, [socket]);

  return { isGameOver };
}

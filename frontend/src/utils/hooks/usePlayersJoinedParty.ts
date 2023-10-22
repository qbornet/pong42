import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useGameOver } from './useGameOver';

export function usePlayerReady(): { isPlayerReady: boolean } {
  const { socket } = useSocketContext();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { isGameOver } = useGameOver();

  useEffect(() => {
    setIsPlayerReady(false);
  }, [isGameOver]);

  useEffect(() => {
    const onP1Ready = (ready: boolean) => {
      setIsPlayerReady(ready);
    };

    socket.on('playerReady', onP1Ready);
    return () => {
      socket.off('playerReady', onP1Ready);
    };
  });
  return { isPlayerReady };
}

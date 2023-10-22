import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export function useGameStarted(): { isGameStarted: boolean } {
  const { socket } = useSocketContext();
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const onStartGame = (roomName: string) => {
      console.log(`Jeu demarre dans la salle: ${roomName}`);
      setIsGameStarted(true);
    };
    socket.on('startGame', onStartGame);

    return () => {
      socket.off('startGame', onStartGame);
    };
  }, [socket]);
  return { isGameStarted };
}

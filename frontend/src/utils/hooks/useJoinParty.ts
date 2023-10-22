import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useGameOver } from './useGameOver';

export function useJoinParty(): { hasJoinParty: boolean } {
  const { socket } = useSocketContext();
  const [hasJoinParty, setHasJoinParty] = useState(false);
  const { isGameOver } = useGameOver();

  useEffect(() => {
    setHasJoinParty(false);
  }, [isGameOver]);

  useEffect(() => {
    const onJoinParty = () => {
      setHasJoinParty(true);
    };

    socket.on('joinParty', onJoinParty);
    return () => {
      socket.off('joinParty', onJoinParty);
    };
  });
  return { hasJoinParty };
}

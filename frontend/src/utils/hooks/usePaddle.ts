import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';

export function usePaddle() {
  const { socket } = useSocketContext();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        socket.emit('keyboardEvent', event.code);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [socket]);
}

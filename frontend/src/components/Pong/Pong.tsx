import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';
import { Canvas } from './Canvas';
import { useDraw } from '../../utils/hooks/useDraw';
import { useGameStarted } from '../../utils/hooks/useStartGame';
import { usePaddle } from '../../utils/hooks/usePaddle';

export default function Pong() {
  const { socket } = useSocketContext();
  const { drawClassicGame } = useDraw();
  usePaddle();
  useGameStarted();

  useEffect(() => {
    connectSocket();
  }, []);

  function handleReadyClick() {
    socket.emit('playerReady');
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <button
        type="button"
        onClick={handleReadyClick}
        className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      >
        Ready
      </button>
      <Canvas
        draw={drawClassicGame}
        className="flex items-center rounded-lg shadow-lg"
        width={1200}
        height={700}
      />
    </div>
  );
}

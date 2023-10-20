import { useRef, useState, useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';

interface Position {
  x: number;
  y: number;
}

interface Paddle extends Position {
  width: number;
  height: number;
}

interface Canva {
  width: number;
  height: number;
}

interface GameState {
  ball: Position;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  canva: Canva;
  scorePlayer1: number;
  scorePlayer2: number;
}

export default function Pong() {
  const { socket } = useSocketContext();

  const [playerRole, setPlayerRole] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState | undefined>();

  useEffect(() => {
    connectSocket();
    function handleKey(event: KeyboardEvent) {
      if (playerRole === 2) {
        socket.emit('paddleMovement2', event.code);
      } else if (playerRole === 1) {
        socket.emit('paddleMovement1', event.code);
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [socket, playerRole]);

  useEffect(() => {
    if (gameState && gameState.scorePlayer1 >= 10) {
      setIsGameOver(true);
      setGameOverMessage('Player 1 Wins!');
      // socket.emit('Player 1 Wins');
    } else if (gameState && gameState.scorePlayer2 >= 10) {
      setIsGameOver(true);
      setGameOverMessage('Player 2 Wins!');
      // socket.emit('Player 2 Wins');
    }
  }, [gameState]);

  function handleReadyClick() {
    socket.emit('playerReady');
  }

  useEffect(() => {
    const onGameState = (state: GameState) => {
      setGameState(state);
    };
    const onPlayerRole = (role: number) => {
      setPlayerRole(role);
    };
    const onStartGame = (roomName: string) => {
      console.log(`Jeu demarre dans la salle: ${roomName}`);
    };
    socket.on('gameState', onGameState);
    socket.on('playerRole', onPlayerRole);
    socket.on('startGame', onStartGame);

    return () => {
      socket.off('gameState', onGameState);
      socket.off('playerRole', onPlayerRole);
      socket.off('startGame', onStartGame);
    };
  }, [socket, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    let animationFrameId: number;

    // dessine ligne poitillee au centre
    function drawNet() {
      if (context && gameState) {
        const netWidth = 10;
        const netHeight = 10;
        const gap = 18;
        const numberOfDashes = gameState.canva.height / (netHeight + gap);

        context.fillStyle = '#ffffff';
        for (let i = 0; i < numberOfDashes; i += 1) {
          context.fillRect(
            gameState.canva.width / 2 - netWidth / 2,
            i * (netHeight + gap),
            netWidth,
            netHeight
          );
        }
      }
    }

    function resetCanvas() {
      if (context && gameState) {
        context.fillStyle = '#000000';
        context.fillRect(0, 0, gameState.canva.width, gameState.canva.height);
      }
    }

    // dessine le message de fin de partie
    function drawGameOverMessage(message: string) {
      if (context && gameState) {
        context.fillStyle = '#ffffff';
        context.font = '50px Arial';
        context.textAlign = 'center';
        context.fillText(
          message,
          gameState.canva.width / 2,
          gameState.canva.height / 2
        );
      }
    }

    // dessine la raquette
    function drawPaddle(x: number, y: number) {
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(x, y, 10, 100);
      }
    }

    // dessiner la balle
    function drawBall(x: number, y: number) {
      if (context) {
        context.beginPath();
        context.arc(x, y, 5, 0, Math.PI * 2);
        context.fillStyle = '#ffffff';
        context.fill();
        context.closePath();
      }
    }

    // ligne de touche du haut
    function drawUpperLine() {
      if (context && gameState) {
        context.beginPath();
        context.lineWidth = 10;
        context.moveTo(0, 0);
        context.lineTo(gameState.canva.width, 0);
        context.strokeStyle = '#ffffff';
        context.stroke();
      }
    }

    // ligne de touche du bas
    function drawLowerLine() {
      if (context && gameState) {
        context.beginPath();
        context.lineWidth = 10;
        context.moveTo(0, gameState.canva.height);
        context.lineTo(gameState.canva.width, gameState.canva.height);
        context.strokeStyle = '#ffffff';
        context.stroke();
      }
    }

    // afficher le score
    function drawScore() {
      if (context && gameState) {
        context.fillStyle = '#ffffff';
        context.font = '50px Arial';
        context.fillText(String(gameState.scorePlayer1), 500, 70);
        context.fillText(String(gameState.scorePlayer2), 670, 70);
      }
    }

    function draw() {
      resetCanvas();
      if (isGameOver) {
        drawGameOverMessage(gameOverMessage);
      } else if (gameState) {
        drawScore();
        drawNet();
        drawUpperLine();
        drawLowerLine();
        drawPaddle(gameState.leftPaddle.x, gameState.leftPaddle.y);
        drawPaddle(gameState.rightPaddle.x, gameState.rightPaddle.y);
        drawBall(gameState.ball.x, gameState.ball.y);
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, playerRole, socket, gameOverMessage, isGameOver]);

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <button
        type="button"
        onClick={handleReadyClick}
        className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      >
        Ready
      </button>
      <canvas
        className="flex items-center rounded-lg shadow-lg"
        ref={canvasRef}
        width={1200}
        height={700}
      />
    </div>
  );
}

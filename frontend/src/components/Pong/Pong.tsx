import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSocketContext } from "../../contexts/socket";
import { connectSocket } from "../../utils/functions/socket";

export default function Pong() {
  const { socket } = useSocketContext();

  useEffect(() => {
    connectSocket();
  }, [])

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ballState, setBallState] = useState({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
  })
  const [leftPaddle, setLeftPaddle] = useState({
    x: 1180,
    y: 300,
    width: 10,
    height: 100,
    dy: 2,
  });
  const [rightPaddle, setRightPaddle] = useState({
    x: 10,
    y: 300,
    width: 10,
    height: 100,
    dy: 2,
  })
  const [scorePlayer1, setScorePlayer1] = useState(0);
  const [scorePlayer2, setScorePlayer2] = useState(0);
  const [playerRole, setPlayerRole] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');

  useEffect(() => {
    if (scorePlayer1 >= 10) {
      setIsGameOver(true);
      setGameOverMessage('Player 1 Wins!');
      // socket.emit('Player 1 Wins');
    } else if (scorePlayer2 >= 10) {
      setIsGameOver(true);
      setGameOverMessage('Player 2 Wins!');
      // socket.emit('Player 2 Wins');
    }
  }, [scorePlayer1, scorePlayer2]);

  function handleReadyClick() {
    socket.emit('playerReady');
  }

  useEffect(() => {
    const onBallState = (receivedBallState: typeof ballState) => {
      setBallState(receivedBallState)
    };
    const onRightPaddleState = (receivedRightPaddleState: typeof rightPaddle) => {
      setRightPaddle(receivedRightPaddleState);
    };
    const onLeftPaddleState = (receivedLeftPaddleState: typeof leftPaddle) => {
      setLeftPaddle(receivedLeftPaddleState);
    };
    const onPlayerRole = (role: number) => {
      setPlayerRole(role);
    };
    const onStartGame = (roomName: string) => {
      console.log("Jeu demarre dans la salle: ", roomName);
    };
    socket.on('ballState', onBallState);
    socket.on('paddleLeft', onLeftPaddleState);
    socket.on('paddleRight', onRightPaddleState);
    socket.on('scorePlayer1', setScorePlayer1);
    socket.on('scorePlayer2', setScorePlayer2);
    socket.on('playerRole', onPlayerRole);
    socket.on('startGame', onStartGame);

    return (() => {
      socket.off('ballState', onBallState);
      socket.off('paddleLeft', onRightPaddleState);
      socket.off('paddleRight', onLeftPaddleState);
      socket.off('scorePlayer1', setScorePlayer1);
      socket.off('scorePlayer2', setScorePlayer2);
      socket.off('playerRole', onPlayerRole);
      socket.off('startGame', onStartGame);
    });
  }, [setBallState, setRightPaddle, setLeftPaddle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    let animationFrameId: number;

    // dessine ligne poitillee au centre
    function drawNet() {
      if (context) {
        const netWidth = 10;
        const netHeight = 10;
        const gap = 18;
        const numberOfDashes = 700 / (netHeight + gap);

        context.fillStyle = "#ffffff";
        for (let i = 0; i < numberOfDashes; i++) {
          context.fillRect(1200 / 2 - netWidth / 2, i * (netHeight + gap), netWidth, netHeight);
        }
      }
    }

    function handleKey(event: KeyboardEvent,) {
      if (playerRole === 2) {
        if (event.code === "ArrowUp") {
          leftPaddle.y -= leftPaddle.dy * 10;
          if (leftPaddle.y < 0) {
            leftPaddle.y = 0;
          }
        } else if (event.code === "ArrowDown") {
          leftPaddle.y += leftPaddle.dy * 10;
          if (leftPaddle.y + leftPaddle.height > 700) {
            leftPaddle.y = 700 - leftPaddle.height;
          }
        }
        console.log(playerRole + " " + event.code);
        socket.emit('paddleMovement2', event.code);
      } else if (playerRole === 1) {
        if (event.code === "ArrowUp") {
          rightPaddle.y -= rightPaddle.dy * 10;
          if (rightPaddle.y < 0) {
            rightPaddle.y = 0;
          }
        } else if (event.code === "ArrowDown") {
          rightPaddle.y += rightPaddle.dy * 10;
          if (rightPaddle.y + rightPaddle.height > 700) {
            rightPaddle.y = 700 - rightPaddle.height;
          }
        }
        console.log(playerRole + " " + event.code);
        socket.emit('paddleMovement1', event.code);
      }
    }

    window.addEventListener("keydown", handleKey);
    function resetCanvas() {
      if (context) {
        context.fillStyle = "#000000";
        context.fillRect(0, 0, 1200, 700);
      }
    }

    //dessine le message de fin de partie
    function drawGameOverMessage(message: string) {
      if (context) {
        context.fillStyle = "#ffffff";
        context.font = "50px Arial";
        context.textAlign = "center";
        context.fillText(message, 1200 / 2, 700 / 2);
      }
    }

    //dessine la raquette 
    function drawPaddle(x: number, y: number) {
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(x, y, 10, 100);
      }
    }

    //dessiner la balle
    function drawBall(x: number, y: number) {
      if (context) {
        context.beginPath();
        context.arc(x, y, 5, 0, Math.PI * 2);
        context.fillStyle = "#ffffff";
        context.fill();
        context.closePath();
      }
    }

    //ligne de touche du haut
    function drawUpperLine() {
      if (context) {
        context.beginPath();
        context.lineWidth = 10;
        context.moveTo(0, 0);
        context.lineTo(1200, 0);
        context.strokeStyle = "#ffffff";
        context.stroke();
      }
    }

    //ligne de touche du bas
    function drawLowerLine() {
      if (context) {
        context.beginPath();
        context.lineWidth = 10;
        context.moveTo(0, 700);
        context.lineTo(1200, 700);
        context.strokeStyle = "#ffffff";
        context.stroke();
      }
    }

    //afficher le score
    function drawScore(scorePlayer1: number, scorePlayer2: number) {
      if (context) {
        context.fillStyle = "#ffffff";
        context.font = "50px Arial";
        context.fillText(String(scorePlayer1), 500, 70);
        context.fillText(String(scorePlayer2), 670, 70);
      }
    }

    function draw() {
      resetCanvas();
      if (isGameOver) {
        drawGameOverMessage(gameOverMessage);
      } else {
        drawScore(scorePlayer1, scorePlayer2);
        drawUpperLine();
        drawLowerLine();
        drawNet();
        drawPaddle(leftPaddle.x, leftPaddle.y);
        drawPaddle(rightPaddle.x, rightPaddle.y);
        drawBall(ballState.x, ballState.y);
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKey);
    };
  }, [ballState, rightPaddle, leftPaddle]);

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      {<button onClick={handleReadyClick} className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Ready</button>}
      <canvas className="flex items-center shadow-lg rounded-lg" ref={canvasRef} width={1200} height={700}></canvas>
    </div>
  );
}

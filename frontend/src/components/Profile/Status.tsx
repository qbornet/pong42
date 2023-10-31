import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  username: string;
  email: string;
  iat: string;
  exp: string;
}

export function Status() {
  const { socket } = useSocketContext();
  const [color, setColor] = useState('bg-red-500');
  const { username: paramName } = useParams();

  useEffect(() => {
    const onConnect = () => {
      if (!paramName) {
        setColor('bg-green-300');
      }
    };

    const onDisconnect = () => {
      if (!paramName) {
        setColor('bg-red-500');
      }
    };

    const onUserConnected = ({
      userID,
      username
    }: {
      userID: string;
      username: string;
    }) => {
      if (username === paramName) {
        setColor('bg-green-300');
      }
    };

    const onUserDisconnected = ({
      userID,
      username
    }: {
      userID: string;
      username: string;
    }) => {
      if (username === paramName) {
        setColor('bg-red-500');
      }
    };

    const onGameStartStatus = ({ username }: { username: string }) => {
      if (username === paramName) {
        setColor('bg-yellow-500');
      }
    };

    const onGameOverStatus = ({ username }: { username: string }) => {
      if (username === paramName) {
        setColor('bg-green-300');
      }
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);
    socket.on('gameStartStatus', onGameStartStatus);
    socket.on('gameOverStatus', onGameOverStatus);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
      socket.off('gameStartStatus', onGameStartStatus);
      socket.off('gameOverStatus', onGameOverStatus);
    };
  }, [socket, paramName]);
  return (
    <div className="flex flex-row items-center gap-5">
      <span className={`h-4 w-4 rounded-full ${color}`} />
    </div>
  );
}

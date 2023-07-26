import { useEffect, useState } from 'react';
import socket from '../socket';
import ConnectionState from './ConnectionState';
import ConnectionManager from './ConnectionManager';

export default function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  return (
    <div>
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
    </div>
  );
}

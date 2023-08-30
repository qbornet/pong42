import { useState } from 'react';
import socket from '../../services/socket';

export function useConnected() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  return [isConnected, setIsConnected];
}

export default {};

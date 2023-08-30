import { useEffect, useState } from 'react';
import socket from '../../services/socket';

export function useConnected(
  setContactList: any,
  setContact: any,
  setMessages: any,
  setContactListOpen: any
) {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  useEffect(() => {
    if (isConnected === false) {
      setContact(undefined);
      setContactList([]);
      setMessages([]);
      setContactListOpen(true);
    }
  }, [
    isConnected,
    setContactListOpen,
    setContact,
    setMessages,
    setContactList
  ]);

  return { isConnected, setIsConnected };
}

export default {};

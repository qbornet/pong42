import { useEffect, useState } from 'react';
import socket from '../../services/socket';

export interface PrivateMessage {
  content: string;
  from: string;
  to: string;
  date: Date;
  messageID: string;
}

function isPrivateMessage(data: any): data is PrivateMessage {
  return (
    data.content !== undefined &&
    data.from !== undefined &&
    data.to !== undefined &&
    data.date !== undefined &&
    data.messageID !== undefined
  );
}

export interface Session {
  sessionID: string;
  userID: string;
}

function isSession(data: any): data is Session {
  return data.sessionID !== undefined && data.userID !== undefined;
}

export interface Contact {
  username: string;
  userID: string;
  messages: PrivateMessage[];
  connected: boolean;
}

function isContact(data: any): data is Contact {
  return (
    data.username !== undefined &&
    data.userID !== undefined &&
    data.messages !== undefined &&
    data.connected !== undefined
  );
}

export type ContactList = Contact[];

function isContactList(data: any): data is ContactList {
  if (Array.isArray(data)) {
    return data.some((d: any) => isContact(d) === false) === false;
  }
  return false;
}

export function useSocket() {
  const [privateMessage, setPrivateMessage] = useState<PrivateMessage>();
  const [contactList, setContactList] = useState<any>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onPrivateMessage = (data: any) => {
      if (isPrivateMessage(data)) {
        setPrivateMessage({
          content: data.content,
          from: data.from,
          to: data.to,
          date: data.date,
          messageID: data.messageID
        });
      }
    };
    const onSession = (data: any) => {
      if (isSession(data)) {
        const { userID, sessionID } = data;
        localStorage.setItem('sessionID', sessionID);
        socket.userID = userID;
      }
    };
    const onUsers = (data: any) => {
      if (isContactList(data)) {
        const listOfContact = data.filter((d) => d.userID !== socket.userID);
        setContactList(listOfContact);
      }
    };
    const onUserDisconnected = () => {};
    const onUserConnected = () => {};

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('private message', onPrivateMessage);
    socket.on('session', onSession);
    socket.on('users', onUsers);
    socket.on('user connected', onUserConnected);
    socket.on('user disconnected', onUserDisconnected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('private message', onPrivateMessage);
      socket.off('session', onSession);
      socket.off('users', onUsers);
      socket.off('user connected', onUserConnected);
      socket.off('user disconnected', onUserDisconnected);
      setPrivateMessage(undefined);
    };
  }, [setPrivateMessage, setContactList, setIsConnected]);

  return [privateMessage, contactList, isConnected];
}

export default {};

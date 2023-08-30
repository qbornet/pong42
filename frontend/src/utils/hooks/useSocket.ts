import { useEffect } from 'react';
import { ChatInfo } from '../../components/ChatFeed/ChatFeed';
import socket from '../../services/socket';
import { formatTimeMessage } from '../functions/parsing';

interface Message {
  content: string;
  messageID: string;
  date: Date;
  from: string;
  to: string;
}

interface Session {
  sessionID: string;
  userID: string;
}

export function useSocket(
  setIsConnected: any,
  setMessages: any,
  setContactList: any
) {
  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => {
      setIsConnected(false);
    };
    const onPrivateMessage = (value: Message) => {
      const chatInfo: ChatInfo = {
        username: 'toto',
        time: formatTimeMessage(value.date),
        message: value.content,
        profilePictureUrl: 'starwatcher.jpg',
        level: 42,
        messageID: value.messageID
      };
      setMessages((previous: any) => [...previous, chatInfo]);
    };

    const onSession = ({ sessionID, userID }: Session) => {
      localStorage.setItem('sessionID', sessionID);
      socket.userID = userID;
    };

    const onUsers = (data: any) => {
      // Narrow data any type to users type here
      setContactList(data);
    };

    const onUserDisconnected = () => {
      // Narrow data any type to { userID }
    };

    const onUserConnected = () => {
      // Narrow data any type here
    };

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
    };
  }, [setContactList, setIsConnected, setMessages]);
}

export default {};

import { useEffect, useState } from 'react';
import ChatFeed, { ChatInfo } from '../ChatFeed/ChatFeed';
import ChatHeader from '../ChatHeader/ChatHeader';
import ChatMessage from '../ChatMessage/ChatMessage';
import SendMessageInput from '../SendMessageInput/SendMessageInput';
import socket from '../../socket';

interface Message {
  content: string;
  messageID: string;
  from: string;
  to: string;
}

interface Session {
  sessionID: string;
  userID: string;
}

function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<ChatInfo[]>([]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onPrivateMessage = (value: Message) => {
      const chatInfo: ChatInfo = {
        username: 'toto',
        time: '14:00pm',
        message: value.content,
        profilePictureUrl: '/startwatcher.jpg',
        level: 42,
        messageID: value.messageID
      };
      setMessages((previous) => [...previous, chatInfo]);
    };
    const onSession = ({ sessionID, userID }: Session) => {
      localStorage.setItem('sessionID', sessionID);
      socket.userID = userID;
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('private message', onPrivateMessage);
    socket.on('session', onSession);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('private message', onPrivateMessage);
      socket.off('session', onSession);
    };
  }, []);

  return (
    <div>
      <div className="hide-scrollbar h-[758px] w-fit shrink-0 flex-col items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300">
        <ChatHeader className="absolute z-30" isConnected={isConnected} />
        <div className="invisible h-24">
          <ChatMessage
            message=""
            time=""
            username=""
            level={0}
            profilePictureUrl=""
          />
        </div>
        <ChatFeed messages={messages} />
      </div>
      <SendMessageInput />
    </div>
  );
}

export default Chat;

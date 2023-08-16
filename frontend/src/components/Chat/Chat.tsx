import { useEffect, useState } from 'react';
import ChatFeed from '../ChatFeed/ChatFeed';
import ChatHeader from '../ChatHeader/ChatHeader';
import ChatMessage from '../ChatMessage/ChatMessage';
import SendMessageInput from '../SendMessageInput/SendMessageInput';
import socket from '../../socket';

const messages = [];

function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
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

import socket from '../../services/socket';
import ArrowToggler from '../ArrowToggler/ArrowToggler';
import Category from '../Category/Category';
import Status from '../Status/Status';

interface ChatHeaderProps {
  className?: string;
  isConnected: boolean;
}

function ChatHeader({ className, isConnected }: ChatHeaderProps) {
  const connect = () => {
    const sessionID = localStorage.getItem('sessionID');
    socket.auth = { username: 'toto', sessionID };
    socket.connect();
  };
  const disconnect = () => socket.disconnect();
  return (
    <div
      className={`${className} flex w-[336px] flex-wrap content-center items-center justify-center gap-x-24 gap-y-1 rounded-t-3xl p-5 shadow-pong shadow-pong-blue-100 backdrop-blur`}
    >
      <Category type="chat" />
      <ArrowToggler onClick={() => undefined} />
      <Status
        position="start"
        severity={isConnected ? 'ok' : 'err'}
        message={isConnected ? 'Connected' : 'Disconnected'}
        onClick={isConnected ? disconnect : connect}
      />
    </div>
  );
}

export default ChatHeader;

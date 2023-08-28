import socket from '../../services/socket';
import ArrowToggler from '../ArrowToggler/ArrowToggler';
import Category from '../Category/Category';
import Status from '../Status/Status';

interface ChatHeaderProps {
  className?: string;
  isConnected: boolean;
  handleClick: () => any;
}

function ChatHeader({ className, isConnected, handleClick }: ChatHeaderProps) {
  const connect = () => {
    const sessionID = localStorage.getItem('sessionID');
    socket.auth = { username: 'toto', sessionID };
    socket.connect();
  };
  const disconnect = () => socket.disconnect();
  return (
    <div
      className={`${className} flex w-[336px] items-center justify-center rounded-3xl rounded-t-3xl shadow-pong shadow-pong-blue-100`}
    >
      <div className="gp-y-1 flex w-1 flex-wrap content-center items-center justify-center gap-x-24 rounded-3xl bg-red-100 py-5 backdrop-blur">
        <Category type="chat" />
        <ArrowToggler onClick={handleClick} />
        <Status
          position="start"
          severity={isConnected ? 'ok' : 'err'}
          message={isConnected ? 'Connected' : 'Disconnected'}
          onClick={isConnected ? disconnect : connect}
        />
      </div>
    </div>
  );
}

export default ChatHeader;

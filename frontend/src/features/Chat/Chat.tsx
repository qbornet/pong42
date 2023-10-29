import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';
import { SocketContextProvider, useSocketContext } from '../../contexts/socket';
import { useSession } from '../../utils/hooks/useSession';
import { PrivateMessage } from '../../components/chat/PrivateMessage/PrivateMessage';
import { Channel } from '../../components/chat/Channel/Channel';
import { StateContextProvider } from '../../contexts/state';
import { Search } from '../../components/chat/Search';
import { Notification } from '../../components/chat/Notification';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import RenderIf from '../../components/chat/RenderIf/RenderIf';
import {
  PongInviteStateContextProvider,
  useInvitePongStateContext
} from '../../contexts/pongInviteState';

interface InviteInterface {
  username: string;
  mode: 'classic' | 'speed';
}

interface InviteProps {
  invite: InviteInterface;
  setInvite: () => void;
}

function Invite({ invite, setInvite }: InviteProps) {
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const { send } = useInvitePongStateContext();

  const handleAccept = () => {
    navigate(`/pong/${invite.username}`);
    if (invite.mode === 'classic') {
      socket.emit('acceptClassicInvite');
      send('CLASSIC_INIT_READY');
    } else if (invite.mode === 'speed') {
      socket.emit('acceptSpeedInvite');
      send('SPEED_INIT_READY');
    }
    setInvite();
  };

  const handleDeny = () => {
    if (invite.mode === 'classic') {
      socket.emit('denyClassiceInvite');
    } else if (invite.mode === 'speed') {
      socket.emit('denySpeedInvite');
    }
    setInvite();
  };

  return (
    <div className="fixed inset-0 z-auto flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-pong-blue-400 p-4 shadow-lg ">
        <p className="font-bold text-pong-white">{`You are invited by ${invite.username} to play ${invite.mode} mode.`}</p>
        <PrimaryButton onClick={handleAccept}>Accept</PrimaryButton>
        <PrimaryButton onClick={handleDeny}>Deny</PrimaryButton>
      </div>
    </div>
  );
}

function ChatWrapped() {
  const { socket } = useSocketContext();

  const [invite, setInvite] = useState<InviteInterface | undefined>(undefined);

  useEffect(() => {
    const onInvite = (i: InviteInterface) => {
      setInvite(i);
    };
    socket.on('invite', onInvite);
    return () => {
      socket.off('invite', onInvite);
    };
  }, [socket]);
  useSession((data) => {
    socket.userID = data.userID;
  });

  useEffect(() => {
    socket.emit('session');
  }, [socket]);

  return (
    <div className="absolute bottom-2 right-2 z-30 overflow-hidden rounded-3xl bg-pong-blue-300">
      <ChatHeader />
      <PrivateMessage />
      <Channel />
      <Search />
      <Notification />
      <MenuSelector />
      <RenderIf some={[invite !== undefined]}>
        <Invite invite={invite!} setInvite={() => setInvite(undefined)} />
      </RenderIf>
    </div>
  );
}

function Chat() {
  return (
    <SocketContextProvider>
      <StateContextProvider>
        <ChatWrapped />
      </StateContextProvider>
    </SocketContextProvider>
  );
}

export default Chat;

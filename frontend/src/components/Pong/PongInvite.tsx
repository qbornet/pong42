import { Outlet } from 'react-router-dom';
import { SocketContextProvider } from '../../contexts/socket';
import { WrappedPong } from './WappedPong';
import { PongInviteStateContextProvider } from '../../contexts/pongInviteState';

export default function PongInvite() {
  return (
    <>
      <SocketContextProvider>
        <PongInviteStateContextProvider>
          <WrappedPong />
        </PongInviteStateContextProvider>
      </SocketContextProvider>
      <Outlet />
    </>
  );
}

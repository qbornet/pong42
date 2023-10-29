import { useEffect } from 'react';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { BluePongButton, RedPongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';
import { useSocketContext } from '../../contexts/socket';

export function InviteWaitingButton() {
  const { socket } = useSocketContext();
  const { isClassicModeWaitingRoom, isSpeedModeWaitingRoom, CHANGE_MODE } =
    useInvitePongStateContext();

  useEffect(() => {
    const onInviteDenied = () => {
      CHANGE_MODE();
    };
    socket.on('inviteDenied', onInviteDenied);
    return () => {
      socket.off('inviteDenied', onInviteDenied);
    };
  }, [socket, CHANGE_MODE]);

  return (
    <RenderIf some={[isClassicModeWaitingRoom, isSpeedModeWaitingRoom]}>
      <PongDiv>
        <BluePongButton>Waiting...</BluePongButton>
        <RedPongButton onClick={CHANGE_MODE}>Change Mode</RedPongButton>
      </PongDiv>
    </RenderIf>
  );
}

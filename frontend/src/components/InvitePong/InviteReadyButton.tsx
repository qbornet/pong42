import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { useSocketContext } from '../../contexts/socket';
import { BluePongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';

export function InviteReadyButton() {
  const { socket } = useSocketContext();
  const { isSpeedNotReady, isClassicNotReady, isClassicReady, isSpeedReady } =
    useInvitePongStateContext();

  return (
    <RenderIf
      some={[isSpeedReady, isClassicReady, isClassicNotReady, isSpeedNotReady]}
    >
      <PongDiv>
        <BluePongButton
          onClick={
            isSpeedReady || isClassicReady
              ? () => socket.emit('playerNotReady')
              : () => socket.emit('playerReady')
          }
        >
          {isSpeedReady || isClassicReady ? 'Not Ready' : 'Ready'}
        </BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}

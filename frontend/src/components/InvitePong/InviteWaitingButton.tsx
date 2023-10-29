import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { BluePongButton, RedPongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';

export function InviteWaitingButton() {
  const { isClassicModeWaitingRoom, isSpeedModeWaitingRoom, CHANGE_MODE } =
    useInvitePongStateContext();

  return (
    <RenderIf some={[isClassicModeWaitingRoom, isSpeedModeWaitingRoom]}>
      <PongDiv>
        <BluePongButton>Waiting...</BluePongButton>
        <RedPongButton onClick={CHANGE_MODE}>Change Mode</RedPongButton>
      </PongDiv>
    </RenderIf>
  );
}

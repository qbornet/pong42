import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { BluePongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';

export function InvitePlayAgainButton() {
  const {
    isClassicMatchModeEnd,
    isSpeedModeMatchEnd,
    PLAY_AGAIN,
    CHANGE_MODE
  } = useInvitePongStateContext();
  return (
    <RenderIf some={[isSpeedModeMatchEnd, isClassicMatchModeEnd]}>
      <PongDiv className="mt-56">
        <BluePongButton onClick={PLAY_AGAIN}>Play again !</BluePongButton>
        <BluePongButton onClick={CHANGE_MODE}>Change Mode ?</BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}

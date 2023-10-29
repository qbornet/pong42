import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { BluePongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';

export function InviteModeButtons() {
  const { CLASSIC_MODE, SPEED_MODE, isChoosingMode } =
    useInvitePongStateContext();
  const text = "Let's Pong";
  return (
    <RenderIf some={[isChoosingMode]}>
      <PongDiv>
        <p className="mb-5 text-3xl font-bold text-pong-white">{text}</p>
        <BluePongButton onClick={CLASSIC_MODE}>Classic mode</BluePongButton>
        <BluePongButton onClick={SPEED_MODE}>Speed mode</BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}

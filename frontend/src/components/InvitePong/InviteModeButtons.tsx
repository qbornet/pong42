import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { BluePongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';
import { useSocketContext } from '../../contexts/socket';
import { Error } from '../Pong/Error';

export function InviteModeButtons() {
  const { socket } = useSocketContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [isErr, setIsErr] = useState(false);
  const { CLASSIC_MODE, SPEED_MODE, isChoosingMode } =
    useInvitePongStateContext();

  const { username } = useParams();

  const speedMode = () => {
    if (username === socket.username) {
      setTimeout(() => {
        setErrorMsg('');
        setIsErr(false);
      }, 3000);
      setIsErr(true);
      setErrorMsg("You can't invite your self");
    } else {
      socket.emit('createSpeedInvite', username);
      SPEED_MODE();
    }
  };
  const classicMode = () => {
    if (username === socket.username) {
      if (isErr === false) {
        setTimeout(() => {
          setErrorMsg('');
          setIsErr(false);
        }, 3000);
      }
      setIsErr(true);
      setErrorMsg("You can't invite your self");
    } else {
      socket.emit('createClassicInvite', username);
      CLASSIC_MODE();
    }
  };
  const text = `Let's Pong with ${username}`;
  return (
    <RenderIf some={[isChoosingMode]}>
      <PongDiv>
        <p className="mb-5 text-3xl font-bold text-pong-white">{text}</p>
        <BluePongButton onClick={classicMode}>Classic mode</BluePongButton>
        <BluePongButton onClick={speedMode}>Speed mode</BluePongButton>
        <Error errorMsg={errorMsg} isErr={isErr} />
      </PongDiv>
    </RenderIf>
  );
}

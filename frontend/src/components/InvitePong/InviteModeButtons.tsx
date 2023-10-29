import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { BluePongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';
import { useSocketContext } from '../../contexts/socket';

export function InviteModeButtons() {
  const { socket } = useSocketContext();
  const [isErr, setIsErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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
      setTimeout(() => {
        setErrorMsg('');
        setIsErr(false);
      }, 3000);
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
        <RenderIf some={[isErr]}>
          <div className="flex flex-grow-0 flex-col items-center justify-center divide-y-[1px] divide-gray-400 rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-2">
            <p className="whitespace-nowrap break-keep pt-[1.5px] font-roboto text-[18px] font-bold text-red-500">
              Oops an error as occurred:
              {errorMsg}
            </p>
          </div>
        </RenderIf>
      </PongDiv>
    </RenderIf>
  );
}

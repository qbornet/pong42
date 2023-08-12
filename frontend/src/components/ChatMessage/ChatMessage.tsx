import ProfilePicture from '../ProfilePicture/ProfilePicture';

function ChatMessage() {
  const message =
    'A long message can be written in here and the content does not broke the component';
  const time = '10:42 pm';
  const username = 'Toto42';
  return (
    <div className="flex w-72 flex-shrink-0 rounded-md bg-pong-blue-400 p-3">
      <div className="min-w-fit">
        <ProfilePicture size="xs" />
      </div>
      <div className="flex-grow px-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-pong-blue-100">{username}</p>
          <p className="text-sm font-bold text-pong-blue-100">{time}</p>
        </div>
        <p className="mt-3 text-base text-pong-white">{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;

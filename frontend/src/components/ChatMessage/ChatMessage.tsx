import ProfilePicture from '../ProfilePicture/ProfilePicture';

/* Change the date type format */
interface ChatMessageProps {
  message: string;
  time: string;
  username: string;
  level: number;
  profilePictureUrl: string;
  noBgColor?: boolean;
}

function ChatMessage({
  message,
  time,
  username,
  level,
  profilePictureUrl,
  noBgColor
}: ChatMessageProps) {
  return (
    <div
      className={`mx-2 mt-1 flex w-80 flex-shrink-0 rounded-lg ${
        noBgColor ? '' : 'bg-pong-blue-400'
      } p-3`}
    >
      <div className="min-w-fit">
        <ProfilePicture size="xs" url={profilePictureUrl} level={level} />
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

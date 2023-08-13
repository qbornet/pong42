import ProfilePicture from '../ProfilePicture/ProfilePicture';

/* Change the date type format */
interface ChatMessageProps {
  message: string;
  time: string;
  username: string;
  profilePictureUrl: string;
}

function ChatMessage({
  message,
  time,
  username,
  profilePictureUrl
}: ChatMessageProps) {
  return (
    <div className="mt-1 flex w-72 flex-shrink-0 rounded-md bg-pong-blue-400 p-3">
      <div className="min-w-fit">
        <ProfilePicture size="xs" url={profilePictureUrl} />
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

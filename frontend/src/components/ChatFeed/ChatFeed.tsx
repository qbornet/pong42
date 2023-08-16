import ChatMessage from '../ChatMessage/ChatMessage';

export interface ChatInfo {
  username: string;
  time: string;
  message: string;
  profilePictureUrl: string;
  level: number;
  messageID: string;
}

interface ChatFeedProps {
  messages: ChatInfo[];
}

function ChatFeed({ messages }: ChatFeedProps) {
  return (
    <div>
      {messages.map((chat: ChatInfo, index: number) => {
        if (index % 2) {
          return (
            <ChatMessage
              key={chat.messageID}
              message={chat.message}
              time={chat.time}
              username={chat.username}
              level={chat.level}
              profilePictureUrl={chat.profilePictureUrl}
              noBgColor
            />
          );
        }
        return (
          <ChatMessage
            key={chat.messageID}
            message={chat.message}
            time={chat.time}
            username={chat.username}
            level={chat.level}
            profilePictureUrl={chat.profilePictureUrl}
          />
        );
      })}
    </div>
  );
}

export default ChatFeed;

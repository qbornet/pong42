import ChatMessage from '../ChatMessage/ChatMessage';

function ChatFeed() {
  const messages = [
    {
      username: 'toto',
      time: '10:42 pm',
      message: 'Hello, how are you ?',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '11:04 pm',
      message: 'Fine and you? :)',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'toto',
      time: '1:05 pm',
      message: 'Everything perfect here. See you soone bro',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '10:42 pm',
      message: 'Bye!',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'toto',
      time: '10:42 pm',
      message: 'Hello, how are you ?',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '11:04 pm',
      message: 'Fine and you? :)',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'toto',
      time: '1:05 pm',
      message: 'Everything perfect here. See you soone bro',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '10:42 pm',
      message: 'Bye!',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'toto',
      time: '10:42 pm',
      message: 'Hello, how are you ?',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '11:04 pm',
      message: 'Fine and you? :)',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'toto',
      time: '1:05 pm',
      message: 'Everything perfect here. See you soone bro',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '10:42 pm',
      message: 'Bye!',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'toto',
      time: '10:42 pm',
      message: 'Hello, how are you ?',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '11:04 pm',
      message: 'Fine and you? :)',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'toto',
      time: '1:05 pm',
      message: 'Everything perfect here. See you soone bro',
      profilePictureUrl: '/starwatcher.jpg'
    },
    {
      username: 'tata',
      time: '10:42 pm',
      message: 'Bye!',
      profilePictureUrl: '/starwatcher.jpg'
    }
  ];

  const chats = messages.map((chat) => (
    <ChatMessage
      message={chat.message}
      time={chat.time}
      username={chat.username}
      profilePictureUrl={chat.profilePictureUrl}
    />
  ));
  return (
    <div className="h-[658px] shrink-0 flex-col items-center justify-end overflow-y-auto bg-pong-blue-100 p-1">
      {chats}
    </div>
  );
}

export default ChatFeed;

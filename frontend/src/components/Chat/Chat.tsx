import ChatFeed from '../ChatFeed/ChatFeed';
import ChatHeader from '../ChatHeader/ChatHeader';
import ChatMessage from '../ChatMessage/ChatMessage';
import SendMessageInput from '../SendMessageInput/SendMessageInput';

let messages = [
  {
    username: 'toto',
    time: '10:42 pm',
    message:
      'Hello, how are you ? This is a very long message to say you nothing about life and everything. You know that 42 is the answer to life, all and everything write ? So here is what I have to say about it : 42.',
    profilePictureUrl: '/luffy.png',
    level: 42,
    messageID: '1'
  },
  {
    username: 'tata',
    time: '11:04 pm',
    message: 'Fine and you? :)',
    profilePictureUrl: '/starwatcher.jpg',
    level: 24,
    messageID: '2'
  },
  {
    username: 'toto',
    time: '1:05 pm',
    message: 'Everything perfect here. See you soone bro',
    profilePictureUrl: '/luffy.png',
    level: 42,
    messageID: '3'
  },
  {
    username: 'tata',
    time: '10:42 pm',
    message: 'Bye!',
    profilePictureUrl: '/starwatcher.jpg',
    level: 24,
    messageID: '4'
  },
  {
    username: 'toto',
    time: '10:42 pm',
    message: 'Hello, how are you ?',
    profilePictureUrl: '/luffy.png',
    level: 42,
    messageID: '5'
  },
  {
    username: 'tata',
    time: '11:04 pm',
    message: 'Fine and you? :)',
    profilePictureUrl: '/starwatcher.jpg',
    level: 24,
    messageID: '6'
  },
  {
    username: 'toto',
    time: '1:05 pm',
    message: 'Everything perfect here. See you soone bro',
    profilePictureUrl: '/luffy.png',
    level: 42,
    messageID: '7'
  },
  {
    username: 'tata',
    time: '10:42 pm',
    message: 'Bye!',
    profilePictureUrl: '/starwatcher.jpg',
    level: 24,
    messageID: '8'
  },
  {
    username: 'toto',
    time: '10:42 pm',
    message: 'Hello, how are you ?',
    profilePictureUrl: '/luffy.png',
    level: 42,
    messageID: '9'
  },
  {
    username: 'tata',
    time: '11:04 pm',
    message: 'Fine and you? :)',
    profilePictureUrl: '/starwatcher.jpg',
    level: 24,
    messageID: '10'
  },
  {
    username: 'toto',
    time: '1:05 pm',
    message: 'Everything perfect here. See you soone bro',
    profilePictureUrl: '/luffy.png',
    level: 42,
    messageID: '11'
  },
  {
    username: 'tata',
    time: '10:42 pm',
    message: 'Bye!',
    profilePictureUrl: '/starwatcher.jpg',
    level: 24,
    messageID: '12'
  }
];

messages = [];

function Chat() {
  return (
    <div>
      <div className="hide-scrollbar h-[758px] w-fit shrink-0 flex-col items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300">
        <ChatHeader className="absolute z-20" />
        <div className="invisible h-24">
          <ChatMessage
            message=""
            time=""
            username=""
            level={0}
            profilePictureUrl=""
          />
        </div>
        <ChatFeed messages={messages} />
      </div>
      <SendMessageInput />
    </div>
  );
}

export default Chat;

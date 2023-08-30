import { useEffect, useState } from 'react';
import socket from '../../services/socket';
import ChatFeed, { ChatInfo } from '../../components/ChatFeed/ChatFeed';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import Hide from '../../components/Hide/Hide';
import SendMessageInput from '../../components/SendMessageInput/SendMessageInput';
import { formatTimeMessage } from '../../utils/functions/parsing';
import { useScroll } from '../../utils/hooks/useScroll';

interface Message {
  content: string;
  messageID: string;
  date: Date;
  from: string;
  to: string;
}

interface Session {
  sessionID: string;
  userID: string;
}

function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<ChatInfo[]>([]);
  const [close, setClose] = useState<boolean>(true);
  const [contactList, setContactList] = useState<any>([]);
  const [contact, setContact] = useState<any>(undefined);
  const [contactListOpen, setContactListOpen] = useState<boolean>(true);

  const messageEndRef = useScroll(messages, close);

  const onConnect = () => setIsConnected(true);
  const onDisconnect = () => {
    setIsConnected(false);
  };
  const onPrivateMessage = (value: Message) => {
    const chatInfo: ChatInfo = {
      username: 'toto',
      time: formatTimeMessage(value.date),
      message: value.content,
      profilePictureUrl: 'starwatcher.jpg',
      level: 42,
      messageID: value.messageID
    };
    setMessages((previous) => [...previous, chatInfo]);
  };

  const onSession = ({ sessionID, userID }: Session) => {
    localStorage.setItem('sessionID', sessionID);
    socket.userID = userID;
  };

  const onUsers = (data: any) => {
    // Narrow data any type to users type here
    setContactList(data);
  };

  const onUserDisconnected = () => {
    // Narrow data any type to { userID }
  };

  const onUserConnected = () => {
    // Narrow data any type here
  };

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('private message', onPrivateMessage);
    socket.on('session', onSession);
    socket.on('users', onUsers);
    socket.on('user connected', onUserConnected);
    socket.on('user disconnected', onUserDisconnected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('private message', onPrivateMessage);
      socket.off('session', onSession);
      socket.off('users', onUsers);
      socket.off('user connected', onUserConnected);
      socket.off('user disconnected', onUserDisconnected);
    };
  }, []);

  useEffect(() => {
    if (isConnected === false) {
      setContact(undefined);
      setContactList([]);
      setMessages([]);
      setContactListOpen(true);
    }
  }, [isConnected]);

  useEffect(() => {
    if (contact === undefined || contact.messages === undefined) {
      return;
    }
    let msgs: any = [];
    contact.messages.map((message: any) => {
      msgs = [
        ...msgs,
        {
          messageID: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.date),
          username: contact.username,
          level: 42,
          profilePictureUrl: 'starwatcher.jpg'
        }
      ];
      return message;
    });
    setMessages((previous) => msgs.concat(previous));
  }, [contactList, contact]);

  return (
    <div className="w-fit overflow-hidden rounded-3xl">
      <div
        className={`hide-scrollbar ${
          close ? '' : 'h-[758px] max-h-[90vh]'
        }  w-fit shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300`}
      >
        <ChatHeader
          className="absolute z-30"
          isConnected={isConnected}
          handleClick={() => setClose(!close)}
        />
        <div className="invisible h-24">
          <ChatMessage
            message=""
            time=""
            username=""
            level={0}
            profilePictureUrl=""
          />
        </div>
        <Hide condition={close}>
          {contactListOpen ? (
            <div>
              <h2>Contact List</h2>
              {contactList.map((user: any) => {
                if (user.userID !== socket.userID) {
                  return (
                    <p key={user.userID}>
                      <button
                        type="button"
                        onClick={() => {
                          setContact(user);
                          setContactListOpen(false);
                        }}
                      >
                        {user.userID}
                      </button>
                    </p>
                  );
                }
                return '';
              })}
            </div>
          ) : (
            <>
              <ChatFeed messages={messages} />
              <div ref={messageEndRef} />
            </>
          )}
        </Hide>
      </div>

      <Hide condition={close}>
        <SendMessageInput to={contact ? contact.userID : ''} />
      </Hide>
    </div>
  );
}

export default Chat;

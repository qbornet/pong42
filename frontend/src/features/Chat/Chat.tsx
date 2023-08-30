import { useState } from 'react';
import socket from '../../services/socket';
import ChatFeed, { ChatInfo } from '../../components/ChatFeed/ChatFeed';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import Hide from '../../components/Hide/Hide';
import SendMessageInput from '../../components/SendMessageInput/SendMessageInput';
import { useScroll } from '../../utils/hooks/useScroll';
import { useSocket } from '../../utils/hooks/useSocket';
import { useConnected } from '../../utils/hooks/useConnected';
import { useContact } from '../../utils/hooks/useContact';

function Chat() {
  const [messages, setMessages] = useState<ChatInfo[]>([]);
  const [contactList, setContactList] = useState<any>([]);
  const [contactListOpen, setContactListOpen] = useState<boolean>(true);
  const { contact, setContact } = useContact(setMessages);
  const { isConnected, setIsConnected } = useConnected(
    setContactList,
    setContact,
    setMessages,
    setContactListOpen
  );
  useSocket(setIsConnected, setMessages, setContactList);
  const { messageEndRef, close, setClose } = useScroll(messages);

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

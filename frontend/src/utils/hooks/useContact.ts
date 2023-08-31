import { useEffect, useState } from 'react';
import { formatTimeMessage } from '../functions/parsing';
import { Contact, PrivateMessage } from './useSocket';
import { ChatInfo } from '../../components/ChatFeed/ChatFeed';

export function useMessages(
  contact: Contact | undefined,
  privateMessage: PrivateMessage
) {
  const [messages, setMessages] = useState<ChatInfo[]>([]);

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
    setMessages((previous: any) => msgs.concat(previous));
  }, [contact]);

  useEffect(() => {
    if (privateMessage) {
      const chatInfo: ChatInfo = {
        username: 'toto',
        time: formatTimeMessage(privateMessage.date),
        message: privateMessage.content,
        profilePictureUrl: 'starwatcher.jpg',
        level: 42,
        messageID: privateMessage.messageID
      };
      setMessages((previous: any) => [...previous, chatInfo]);
    }
  }, [privateMessage]);

  return [messages];
}

export default {};

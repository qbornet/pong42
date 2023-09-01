import { useEffect, useState } from 'react';
import { Contact } from './useSocket';
import { ChatInfo } from './ChatInfo.interfaces';
import { formatTimeMessage } from '../functions/parsing';

export function useMessages(
  contact: Contact | undefined,
  isConnected: boolean
): ChatInfo[] {
  const [messages, setMessages] = useState<ChatInfo[]>([]);

  useEffect(() => {
    if (contact !== undefined && contact.messages !== undefined) {
      const formatedMessages: any = [];
      contact.messages.map((message: any) => {
        formatedMessages.push({
          messageID: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.date),
          username: contact.username,
          level: 42,
          profilePictureUrl: 'starwatcher.jpg'
        });
        return message;
      });
      setMessages(formatedMessages);
    }
    return () => setMessages([]);
  }, [contact, isConnected]);

  return messages;
}

export default {};

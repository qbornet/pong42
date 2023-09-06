import { useEffect, useState } from 'react';
import { Contact } from './useStatus';
import { formatTimeMessage } from '../functions/parsing';

export function useMessageHistory(contact: Contact | undefined) {
  const [messageHistory, setMessageHistory] = useState<any>([]);
  useEffect(() => {
    if (contact !== undefined && contact.messages !== undefined) {
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
      setMessageHistory((previous: any) => msgs.concat(previous));
    }
  }, [contact]);

  return messageHistory;
}

export default {};

import { useEffect, useState } from 'react';
import { formatTimeMessage } from '../functions/parsing';

export function useContact(setMessages: any, contactList: any) {
  const [contact, setContact] = useState<any>(undefined);

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
  }, [contactList, contact, setMessages]);

  return { contact, setContact };
}

export default {};

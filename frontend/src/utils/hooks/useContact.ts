import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Contact, ContactList } from './useStatus';

export function useContact(
  contactList: ContactList,
  isConnected: boolean
): [Contact | undefined, Dispatch<SetStateAction<Contact | undefined>>] {
  const [contact, setContact] = useState<Contact | undefined>();

  useEffect(() => {
    if (isConnected) {
      contactList.forEach((c: Contact) => {
        if (c.userID === contact?.userID) {
          setContact(c);
        }
      });
    }
  }, [contactList, isConnected, contact?.userID]);

  return [contact, setContact];
}

export default {};

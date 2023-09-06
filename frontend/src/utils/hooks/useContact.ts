import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Contact, Status } from './useStatus';

export function useContact(
  status: Status
): [Contact | undefined, Dispatch<SetStateAction<Contact | undefined>>] {
  const [contact, setContact] = useState<Contact | undefined>();

  useEffect(() => {
    if (status.isConnected) {
      status.contactList.forEach((c: Contact) => {
        if (c.userID === contact?.userID) {
          setContact(c);
        }
      });
    }
  }, [status.contactList, status.isConnected, contact?.userID]);

  return [contact, setContact];
}

export default {};

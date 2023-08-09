import { UserID } from '../chat.interface';

export interface Message {
  content: string;
  from: UserID;
  to: UserID;
}

export interface MessageStore {
  saveMessage(message: Message): any;
  findMessageForUser(userID: UserID): any;
}

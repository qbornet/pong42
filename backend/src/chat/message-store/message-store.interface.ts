import { UserID } from '../chat.interface';

export interface MessageStore {
  saveMessage(message: string): any;
  findMessageForUser(userID: string): any;
}

export interface Message {
  content: string;
  from: UserID;
  to: UserID;
}

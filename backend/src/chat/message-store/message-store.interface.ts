import { UserID } from '../chat.interface';
import { MessageDto } from '../dto/MessageDto.dto';

export interface Message {
  content: MessageDto;
  from: UserID;
  to: UserID;
}

export interface MessageStore {
  saveMessage(message: Message): any;
  findMessageForUser(userID: UserID): any;
}

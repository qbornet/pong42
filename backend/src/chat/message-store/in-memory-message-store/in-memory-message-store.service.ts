import { Injectable } from '@nestjs/common';
import { UserID } from '../../chat.interface';
import { Message, MessageStore } from '../message-store.interface';

@Injectable()
export default class InMemoryMessageStoreService implements MessageStore {
  private readonly messages: Message[] = [];

  saveMessage(message: Message) {
    this.messages.push(message);
  }

  findMessageForUser(userID: UserID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

import { Injectable } from '@nestjs/common';
import { MessageStore } from '../message-store.interface';

@Injectable()
export default class InMemoryMessageStoreService implements MessageStore {
  private readonly messages = [];

  saveMessage(message) {
    this.messages.push(message);
  }
}

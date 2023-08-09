import { Module } from '@nestjs/common';
import { InMemoryMessageStoreModule } from './in-memory-message-store/in-memory-message-store.module';

@Module({
  imports: [InMemoryMessageStoreModule],
  exports: [InMemoryMessageStoreModule]
})
export default class MessageStoreModule {}

import { Module } from '@nestjs/common';
import { InMemoryMessageStoreService } from './in-memory-message-store.service';

@Module({
  providers: [InMemoryMessageStoreService],
  exports: [InMemoryMessageStoreService]
})
export default class InMemoryMessageStoreModule {}

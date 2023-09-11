import { Module } from '@nestjs/common';
import InMemorySessionStoreService from './in-memory-session-store.service';

@Module({
  providers: [InMemorySessionStoreService],
  exports: [InMemorySessionStoreService]
})
export default class InMemorySessionStoreModule {}

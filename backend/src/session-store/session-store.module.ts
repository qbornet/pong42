import { Module } from '@nestjs/common';
import InMemorySessionStoreService from './in-memory-session-store/in-memory-session-store.service';

@Module({
  imports: [],
  controllers: [],
  providers: [InMemorySessionStoreService],
  exports: [InMemorySessionStoreService]
})
export default class SessionStoreModule {}

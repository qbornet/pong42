import { Module } from '@nestjs/common';
import InMemorySessionStoreModule from './in-memory-session-store/in-memory-session-store.module';

@Module({
  imports: [InMemorySessionStoreModule],
  controllers: [],
  providers: [],
  exports: [InMemorySessionStoreModule]
})
export default class SessionStoreModule {}

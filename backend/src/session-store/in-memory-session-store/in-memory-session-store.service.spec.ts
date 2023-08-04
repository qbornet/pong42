import { Test, TestingModule } from '@nestjs/testing';
import InMemorySessionStoreService from './in-memory-session-store.service';

describe('InMemorySessionStoreService', () => {
  let service: InMemorySessionStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemorySessionStoreService]
    }).compile();

    service = module.get<InMemorySessionStoreService>(
      InMemorySessionStoreService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

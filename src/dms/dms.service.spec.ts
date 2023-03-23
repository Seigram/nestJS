import { Test, TestingModule } from '@nestjs/testing';
import { DmsService } from './dms.service';

describe('DmsService', () => {
  let service: DmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DmsService],
    }).compile();

    service = module.get<DmsService>(DmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
//SQL 바뀌면 Entity도 바꿔야될때나 롤백할때
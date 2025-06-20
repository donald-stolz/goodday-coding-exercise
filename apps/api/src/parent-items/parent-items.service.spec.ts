import { Test, TestingModule } from '@nestjs/testing';
import { ParentItemsService } from './parent-items.service';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ParentItemsService', () => {
  let service: ParentItemsService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentItemsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ParentItemsService>(ParentItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

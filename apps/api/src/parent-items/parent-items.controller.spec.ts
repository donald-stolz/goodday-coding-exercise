import { Test, TestingModule } from '@nestjs/testing';
import { ParentItemsController } from './parent-items.controller';
import { ParentItemsService } from './parent-items.service';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ParentItemsController', () => {
  let controller: ParentItemsController;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentItemsController],
      providers: [
        ParentItemsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<ParentItemsController>(ParentItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

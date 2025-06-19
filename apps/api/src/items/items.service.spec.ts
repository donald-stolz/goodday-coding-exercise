import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ItemsService', () => {
  let service: ItemsService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of items from prisma', async () => {
    const mockItems = [
      {
        id: 1,
        parent_item_id: 1,
        name: 'Item 1',
        sku: 'SKU1',
        price: 10.5,
        quantity: 5,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-02T00:00:00Z'),
      },
      {
        id: 2,
        parent_item_id: 1,
        name: 'Item 2',
        sku: 'SKU2',
        price: 20.0,
        quantity: 3,
        created_at: new Date('2024-01-03T00:00:00Z'),
        updated_at: new Date('2024-01-04T00:00:00Z'),
      },
    ];
    prismaMock.item.findMany.mockResolvedValue(mockItems as any);
    const result = await service.findAll();
    expect(result).toEqual(mockItems);
    expect(prismaMock.item.findMany).toHaveBeenCalled();
  });
});

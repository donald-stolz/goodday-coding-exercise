import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ItemsController', () => {
  let controller: ItemsController;
  let prismaMock: DeepMockProxy<PrismaService>;
  let module: TestingModule;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    module = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        ItemsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items from the service', async () => {
      const mockItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      // Mock the ItemsService.findAll method
      const itemsService = module.get<ItemsService>(ItemsService);
      jest.spyOn(itemsService, 'findAll').mockResolvedValue(mockItems as any);

      const result = await controller.findAll();
      expect(result).toEqual(mockItems);
      expect(itemsService.findAll).toHaveBeenCalled();
    });
  });
});

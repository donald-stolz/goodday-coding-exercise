import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('PurchaseOrdersService', () => {
  let service: PurchaseOrdersService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrdersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PurchaseOrdersService>(PurchaseOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call prisma.purchaseOrders.create with correct data and return result', async () => {
      const dto = {
        vendor_name: 'Vendor',
        order_date: new Date('2024-01-01'),
        expected_delivery_date: new Date('2024-01-10'),
        purchase_order_line_items: [{ item_id: 1, quantity: 2, unit_cost: 10 }],
      };
      const prismaResult = {
        id: 1,
        ...dto,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
      };
      prismaMock.purchaseOrders.create.mockResolvedValue(prismaResult);
      const result = await service.create(dto as any);
      expect(prismaMock.purchaseOrders.create).toHaveBeenCalledWith({
        data: {
          vendor_name: dto.vendor_name,
          order_date: dto.order_date,
          expected_delivery_date: dto.expected_delivery_date,
          purchase_order_line_items: {
            create: dto.purchase_order_line_items,
          },
        },
      });
      expect(result).toEqual(prismaResult);
    });
  });

  describe('findAll', () => {
    it('should call prisma.purchaseOrders.findMany and return mapped result', async () => {
      const prismaResult = [
        {
          id: 1,
          vendor_name: 'Vendor',
          expected_delivery_date: new Date('2024-01-10'),
          order_date: new Date('2024-01-01'),
          created_at: new Date('2024-01-01T00:00:00Z'),
          updated_at: new Date('2024-01-01T00:00:00Z'),
          purchase_order_line_items: [
            { id: 1, item_id: 1, quantity: 2, unit_cost: 10 },
            { id: 2, item_id: 2, quantity: 3, unit_cost: 20 },
          ],
        },
      ];
      prismaMock.purchaseOrders.findMany.mockResolvedValue(prismaResult as any);
      const result = await service.findAll();
      expect(prismaMock.purchaseOrders.findMany).toHaveBeenCalledWith({
        orderBy: { expected_delivery_date: 'desc' },
        select: {
          id: true,
          vendor_name: true,
          expected_delivery_date: true,
          order_date: true,
          purchase_order_line_items: {
            select: {
              id: true,
              quantity: true,
              unit_cost: true,
              item_id: true,
            },
          },
        },
      });
      expect(result).toEqual([
        {
          ...prismaResult[0],
          total_quantity: 5,
          total_cost: 2 * 10 + 3 * 20,
        },
      ]);
    });
  });

  describe('update', () => {
    it('should call prisma.purchaseOrders.update with correct data and return result', async () => {
      const id = 1;
      const dto = {
        expected_delivery_date: new Date('2024-01-15'),
        purchase_order_line_items: [
          { id: 1, item_id: 1, quantity: 3, unit_cost: 12 },
        ],
      };
      const prismaResult = {
        id,
        ...dto,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-02T00:00:00Z'),
      };
      prismaMock.purchaseOrders.update.mockResolvedValue(prismaResult as any);
      const result = await service.update(id, dto as any);
      expect(prismaMock.purchaseOrders.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          expected_delivery_date: dto.expected_delivery_date,
          purchase_order_line_items: {
            update: dto.purchase_order_line_items.map((item) => ({
              where: { id: item.id },
              data: item,
            })),
          },
        },
      });
      expect(result).toEqual(prismaResult);
    });
  });

  describe('remove', () => {
    it('should call prisma.purchaseOrders.delete with correct id and return result', async () => {
      const id = 1;
      const prismaResult = {
        id,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
      };
      prismaMock.purchaseOrders.delete.mockResolvedValue(prismaResult as any);
      const result = await service.remove(id);
      expect(prismaMock.purchaseOrders.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(prismaResult);
    });
  });
});

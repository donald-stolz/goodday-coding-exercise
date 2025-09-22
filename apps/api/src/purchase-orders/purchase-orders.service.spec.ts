import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

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
      const dto: CreatePurchaseOrderDto = {
        vendor_name: 'Vendor',
        vendor_email: 'vendor@email.com',
        order_date: new Date('2024-01-01'),
        expected_delivery_date: new Date('2024-01-10'),
        purchase_order_line_items: [{ item_id: 1, quantity: 2, unit_cost: 10 }],
      };
      const prismaResult = {
        id: 1,
        ...dto,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        status: 'new',
      };
      prismaMock.purchaseOrders.create.mockResolvedValue(prismaResult);
      const result = await service.create(dto);
      expect(prismaMock.purchaseOrders.create).toHaveBeenCalledWith({
        data: {
          vendor_name: dto.vendor_name,
          vendor_email: dto.vendor_email,
          order_date: dto.order_date,
          expected_delivery_date: dto.expected_delivery_date,
          purchase_order_line_items: {
            create: dto.purchase_order_line_items,
          },
        },
        select: expect.anything(),
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
          vendor_email: 'vendor@email.com',
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
        select: expect.anything(),
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
      const dto: UpdatePurchaseOrderDto = {
        expected_delivery_date: new Date('2024-01-15'),
        purchase_order_line_items: [
          { id: 1, item_id: 1, quantity: 3, unit_cost: 12 },
        ],
      };
      const prismaResult = {
        id,
        ...dto,
        vendor_name: 'Vendor',
        vendor_email: 'vendor@email.com',
        order_date: new Date('2024-01-01'),
        expected_delivery_date: dto.expected_delivery_date,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-02T00:00:00Z'),
        status: 'new',
      };
      prismaMock.purchaseOrders.update.mockResolvedValue(prismaResult);
      const result = await service.update(id, dto);
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
        select: expect.anything(),
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
        purchase_order_line_items: [],
      };
      prismaMock.purchaseOrders.delete.mockResolvedValue(prismaResult as any);
      const result = await service.remove(id);
      expect(prismaMock.purchaseOrders.delete).toHaveBeenCalledWith({
        where: { id },
        include: {
          purchase_order_line_items: true,
        },
      });
      expect(result).toEqual(prismaResult);
    });
  });
});

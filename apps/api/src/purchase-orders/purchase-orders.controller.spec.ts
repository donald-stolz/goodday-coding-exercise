import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('PurchaseOrdersController', () => {
  let controller: PurchaseOrdersController;
  let service: jest.Mocked<PurchaseOrdersService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrdersController],
      providers: [
        {
          provide: PurchaseOrdersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PurchaseOrdersController>(PurchaseOrdersController);
    service = module.get(PurchaseOrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct DTO and return result', async () => {
      const dto: CreatePurchaseOrderDto = {
        vendor_name: 'Vendor',
        order_date: new Date('2024-01-01'),
        expected_delivery_date: new Date('2024-01-10'),
        purchase_order_line_items: [{ item_id: 1, quantity: 2, unit_cost: 10 }],
      };
      const result = {
        id: 1,
        vendor_name: dto.vendor_name,
        order_date: dto.order_date,
        expected_delivery_date: dto.expected_delivery_date,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        purchase_order_line_items: dto.purchase_order_line_items,
      };
      service.create.mockResolvedValue(result);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return result', async () => {
      const result = [
        {
          id: 1,
          vendor_name: 'Vendor',
          order_date: new Date('2024-01-01'),
          expected_delivery_date: new Date('2024-01-10'),
          created_at: new Date('2024-01-01T00:00:00Z'),
          updated_at: new Date('2024-01-01T00:00:00Z'),
          purchase_order_line_items: [
            { id: 1, item_id: 1, quantity: 2, unit_cost: new Decimal(10) },
          ],
          total_quantity: 2,
          total_cost: 20,
        },
      ];
      service.findAll.mockResolvedValue(result);
      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call service.update with correct params and return result', async () => {
      const id = '1';
      const dto: UpdatePurchaseOrderDto = {
        expected_delivery_date: new Date('2024-01-15'),
        purchase_order_line_items: [
          { id: 1, item_id: 1, quantity: 3, unit_cost: 12 },
        ],
      };
      const result = {
        id: 1,
        vendor_name: 'Vendor',
        order_date: new Date('2024-01-01'),
        expected_delivery_date: dto.expected_delivery_date,
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-02T00:00:00Z'),
        purchase_order_line_items: [
          { id: 1, item_id: 1, quantity: 3, unit_cost: new Decimal(12) },
        ],
      };
      service.update.mockResolvedValue(result);
      await expect(controller.update(id, dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith(+id, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id and return result', async () => {
      const id = '1';
      const result = {
        id: 1,
        vendor_name: 'Vendor',
        order_date: new Date('2024-01-01'),
        expected_delivery_date: new Date('2024-01-10'),
        created_at: new Date('2024-01-01T00:00:00Z'),
        updated_at: new Date('2024-01-01T00:00:00Z'),
        purchase_order_line_items: [
          { id: 1, item_id: 1, quantity: 2, unit_cost: new Decimal(10) },
        ],
      };
      console.log('result', result);
      service.remove.mockResolvedValue(result);
      await expect(controller.remove(id)).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});

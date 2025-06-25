import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { ItemsService } from '../items/items.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('NotificationsService', () => {
  let service: NotificationsService;
  let purchaseOrdersServiceMock: DeepMockProxy<PurchaseOrdersService>;
  let itemsServiceMock: DeepMockProxy<ItemsService>;

  beforeEach(async () => {
    purchaseOrdersServiceMock = mockDeep<PurchaseOrdersService>();
    itemsServiceMock = mockDeep<ItemsService>();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PurchaseOrdersService, useValue: purchaseOrdersServiceMock },
        { provide: ItemsService, useValue: itemsServiceMock },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

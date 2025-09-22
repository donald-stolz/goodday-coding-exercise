import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let notificationsServiceMock: DeepMockProxy<NotificationsService>;

  beforeEach(async () => {
    notificationsServiceMock = mockDeep<NotificationsService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: notificationsServiceMock },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

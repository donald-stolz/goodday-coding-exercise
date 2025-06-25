import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { ItemsService } from '../items/items.service';
import { ItemsModule } from '../items/items.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [PurchaseOrdersModule, ItemsModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PurchaseOrdersService,
    ItemsService,
    PrismaService,
  ],
})
export class NotificationsModule {}

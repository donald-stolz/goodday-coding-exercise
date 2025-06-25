import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParentItemsModule } from '../parent-items/parent-items.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { ItemsModule } from '../items/items.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    ParentItemsModule,
    PurchaseOrdersModule,
    ItemsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

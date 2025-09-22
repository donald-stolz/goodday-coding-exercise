import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { GCPubSubContext } from 'nestjs-google-pubsub-microservice';
import { PurchaseOrderWithLineItems } from '../purchase-orders/purchase-orders.constants';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  private successAck(context: GCPubSubContext) {
    const originalMsg = context.getMessage();
    originalMsg.ack();
  }

  @EventPattern('purchase-order-created')
  async handlePurchaseOrderCreated(
    @Payload() id: number,
    @Ctx() context: GCPubSubContext
  ) {
    await this.notificationsService.sendPurchaseOrderCreatedNotification(id);
    this.successAck(context);
  }

  @EventPattern('purchase-order-updated')
  async handlePurchaseOrderUpdated(
    @Payload() id: number,
    @Ctx() context: GCPubSubContext
  ) {
    await this.notificationsService.sendPurchaseOrderUpdatedNotification(id);
    this.successAck(context);
  }
}

import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { GCPubSubContext } from 'nestjs-google-pubsub-microservice';
import { PurchaseOrders } from '@prisma/client';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  private successAck(context: GCPubSubContext) {
    const originalMsg = context.getMessage();
    originalMsg.ack();
  }

  @EventPattern('purchase-order-created')
  async handlePurchaseOrderCreated(
    @Payload() data: PurchaseOrders,
    @Ctx() context: GCPubSubContext
  ) {
    console.log('purchase-orders - pubsub test');
    console.log(data);

    this.successAck(context);
  }

  @EventPattern('purchase-order-updated')
  async handlePurchaseOrderUpdated(
    @Payload() data: PurchaseOrders,
    @Ctx() context: GCPubSubContext
  ) {
    console.log('purchase-orders - pubsub test');
    console.log(data);

    this.successAck(context);
  }
}

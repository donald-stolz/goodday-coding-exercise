import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  purchaseOrderCreatedTemplate,
  purchaseOrderUpdatedTemplate,
} from './notifications.utils';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class NotificationsService {
  private readonly smtpTransporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor(
    private readonly purchaseOrdersService: PurchaseOrdersService,
    private readonly itemsService: ItemsService
  ) {
    this.smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendPurchaseOrderCreatedNotification(purchaseOrderId: number) {
    const purchaseOrder = await this.purchaseOrdersService.findOne(
      purchaseOrderId
    );
    if (!purchaseOrder) {
      throw new Error(`Purchase order with id ${purchaseOrderId} not found`);
    }
    const itemIds = purchaseOrder.purchase_order_line_items.map(
      (li) => li.item_id
    );
    const items = await this.itemsService.findWhereIn(itemIds);
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: purchaseOrder.vendor_email,
      subject: `Purchase Order Created - ${purchaseOrderId}`,
      html: purchaseOrderCreatedTemplate(purchaseOrder, items),
    };
    await this.smtpTransporter.sendMail(mailOptions);
  }

  async sendPurchaseOrderUpdatedNotification(purchaseOrderId: number) {
    const purchaseOrder = await this.purchaseOrdersService.findOne(
      purchaseOrderId
    );
    if (!purchaseOrder) {
      throw new Error(`Purchase order with id ${purchaseOrderId} not found`);
    }
    const itemIds = purchaseOrder.purchase_order_line_items.map(
      (li) => li.item_id
    );
    const items = await this.itemsService.findWhereIn(itemIds);
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: purchaseOrder.vendor_email,
      subject: `Purchase Order Updated - ${purchaseOrder.id}`,
      html: purchaseOrderUpdatedTemplate(purchaseOrder, items),
    };
    await this.smtpTransporter.sendMail(mailOptions);
  }
}

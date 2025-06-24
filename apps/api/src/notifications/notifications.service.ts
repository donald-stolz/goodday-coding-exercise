import { Injectable } from '@nestjs/common';
import { PurchaseOrders } from '@prisma/client';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  purchaseOrderCreatedTemplate,
  purchaseOrderUpdatedTemplate,
} from './notifications.utils';

@Injectable()
export class NotificationsService {
  private readonly smtpTransporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor() {
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

  async sendPurchaseOrderCreatedNotification(purchaseOrder: PurchaseOrders) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: purchaseOrder.vendor_email,
      subject: 'Purchase Order Created',
      html: purchaseOrderCreatedTemplate(purchaseOrder),
    };

    this.smtpTransporter.sendMail(mailOptions);
  }

  async sendPurchaseOrderUpdatedNotification(purchaseOrder: PurchaseOrders) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: purchaseOrder.vendor_email,
      subject: 'Purchase Order Updated',
      html: purchaseOrderUpdatedTemplate(purchaseOrder),
    };

    this.smtpTransporter.sendMail(mailOptions);
  }
}

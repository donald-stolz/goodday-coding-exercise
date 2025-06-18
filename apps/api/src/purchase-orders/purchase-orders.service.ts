import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    const { purchase_order_line_items, ...rest } = createPurchaseOrderDto;
    return this.prisma.purchaseOrders.create({
      data: {
        ...rest,
        purchase_order_line_items: {
          create: purchase_order_line_items,
        },
      },
    });
  }

  async findAll() {
    const purchaseOrders = await this.prisma.purchaseOrders.findMany({
      orderBy: {
        expected_delivery_date: 'desc',
      },
      select: {
        id: true,
        vendor_name: true,
        expected_delivery_date: true,
        order_date: true,
        purchase_order_line_items: {
          select: {
            id: true,
            quantity: true,
            unit_cost: true,
            item_id: true,
          },
        },
      },
    });
    return purchaseOrders.map((purchaseOrder) => {
      const total_quantity = purchaseOrder.purchase_order_line_items.reduce(
        (acc, item) => acc + Number(item.quantity),
        0
      );
      const total_cost = purchaseOrder.purchase_order_line_items.reduce(
        (acc, item) => acc + Number(item.unit_cost) * Number(item.quantity),
        0
      );
      return {
        ...purchaseOrder,
        total_quantity,
        total_cost,
      };
    });
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    const { purchase_order_line_items, ...rest } = updatePurchaseOrderDto;
    return this.prisma.purchaseOrders.update({
      where: { id },
      data: {
        ...rest,
        purchase_order_line_items: {
          update: purchase_order_line_items.map((item) => ({
            where: { id: item.id },
            data: item,
          })),
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.purchaseOrders.delete({
      where: { id },
    });
  }
}

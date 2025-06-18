import { Prisma } from '@prisma/client';
import { IsArray, IsDate, IsString } from 'class-validator';

export class CreatePurchaseOrderDto
  implements Prisma.PurchaseOrdersCreateInput
{
  @IsString()
  vendor_name: string;

  @IsDate()
  order_date: Date;

  @IsDate()
  expected_delivery_date: Date;

  // TODO: Add validation for purchase_order_line_items
  @IsArray()
  purchase_order_line_items: Prisma.PurchaseOrderLineItemsCreateNestedManyWithoutPurchase_orderInput;
}

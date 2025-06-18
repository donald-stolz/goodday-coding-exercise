import { Prisma } from '@prisma/client';
import { IsDateString, IsObject, IsString } from 'class-validator';

export class CreatePurchaseOrderDto
  implements Prisma.PurchaseOrdersCreateInput
{
  @IsString()
  vendor_name: string;

  @IsDateString()
  order_date: Date;

  @IsDateString()
  expected_delivery_date: Date;

  // TODO: Improve validation for create purchase_order_line_items type
  @IsObject()
  purchase_order_line_items: Prisma.PurchaseOrderLineItemsCreateNestedManyWithoutPurchase_orderInput;
}

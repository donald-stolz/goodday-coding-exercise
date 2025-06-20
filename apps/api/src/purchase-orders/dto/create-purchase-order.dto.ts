import { Prisma } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseOrderLineItemDto {
  @IsNumber()
  item_id: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_cost: number;
}
export class CreatePurchaseOrderDto
  implements
    Omit<Prisma.PurchaseOrdersCreateInput, 'purchase_order_line_items'>
{
  @IsString()
  vendor_name: string;

  @IsDateString()
  order_date: Date;

  @IsDateString()
  expected_delivery_date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreatePurchaseOrderLineItemDto)
  purchase_order_line_items: CreatePurchaseOrderLineItemDto[];
}

import { PartialType, PickType } from '@nestjs/mapped-types';
import {
  CreatePurchaseOrderDto,
  CreatePurchaseOrderLineItemDto,
} from './create-purchase-order.dto';
import { IsArray, IsNumber } from 'class-validator';

export class UpdatePurchaseOrderLineItemDto extends CreatePurchaseOrderLineItemDto {
  @IsNumber()
  id: number;
}

export class UpdatePurchaseOrderDto extends PartialType(
  PickType(CreatePurchaseOrderDto, ['expected_delivery_date'])
) {
  @IsArray()
  purchase_order_line_items: UpdatePurchaseOrderLineItemDto[];
}

import { PartialType, PickType } from '@nestjs/mapped-types';
import {
  CreatePurchaseOrderDto,
  CreatePurchaseOrderLineItemDto,
} from './create-purchase-order.dto';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePurchaseOrderLineItemDto extends CreatePurchaseOrderLineItemDto {
  @IsNumber()
  id: number;
}

export class UpdatePurchaseOrderDto extends PartialType(
  PickType(CreatePurchaseOrderDto, ['expected_delivery_date'])
) {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => UpdatePurchaseOrderLineItemDto)
  purchase_order_line_items: UpdatePurchaseOrderLineItemDto[];
}

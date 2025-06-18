import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';

export class UpdatePurchaseOrderDto extends PartialType(
  PickType(CreatePurchaseOrderDto, [
    'expected_delivery_date',
    'purchase_order_line_items',
  ])
) {}

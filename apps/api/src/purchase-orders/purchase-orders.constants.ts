import { PurchaseOrderLineItems, PurchaseOrders } from '@prisma/client';

export enum PurchaseOrderStatus {
  NEW = 'new',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export type PurchaseOrderLineItemSelect = Pick<
  PurchaseOrderLineItems,
  'id' | 'quantity' | 'unit_cost' | 'item_id'
>;

export type PurchaseOrderWithLineItems = Omit<
  PurchaseOrders,
  'created_at' | 'updated_at'
> & {
  purchase_order_line_items: PurchaseOrderLineItemSelect[];
};

export const purchaseOrderSelect: {
  [K in keyof PurchaseOrderWithLineItems]: K extends 'purchase_order_line_items'
    ? {
        select: Record<keyof PurchaseOrderLineItemSelect, boolean>;
      }
    : boolean;
} = {
  id: true,
  vendor_name: true,
  vendor_email: true,
  expected_delivery_date: true,
  order_date: true,
  status: true,
  purchase_order_line_items: {
    select: {
      id: true,
      quantity: true,
      unit_cost: true,
      item_id: true,
    },
  },
};

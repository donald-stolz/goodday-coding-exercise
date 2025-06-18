export interface Item {
  id: number;
  name: string;
  sku: string;
}

export interface ParentItem {
  id: number;
  name: string;
  items: Item[];
}

export interface PurchaseOrderLineItem {
  id: number;
  purchaseOrderId: number;
  itemId: number;
  quantity: number;
  unitCost: number;
}

export type CreatePurchaseOrderLineItem = Omit<PurchaseOrderLineItem, 'id'>;

export interface PurchaseOrder {
  id: number;
  vendorName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  purchaseOrderLineItems: PurchaseOrderLineItem[];
}

export type CreatePurchaseOrder = Omit<
  PurchaseOrder,
  'id' | 'purchaseOrderLineItems'
> & {
  purchaseOrderLineItems: CreatePurchaseOrderLineItem[];
};

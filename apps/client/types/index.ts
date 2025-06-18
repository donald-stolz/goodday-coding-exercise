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

export interface PurchaseOrder {
  id: number;
  vendorName: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  purchaseOrderLineItems: PurchaseOrderLineItem[];
}

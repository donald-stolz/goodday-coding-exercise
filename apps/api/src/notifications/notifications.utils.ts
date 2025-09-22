import { Item } from '@prisma/client';
import {
  PurchaseOrderLineItemSelect,
  PurchaseOrderWithLineItems,
} from '../purchase-orders/purchase-orders.constants';

const calculateTotalCost = (
  purchase_order_line_items: PurchaseOrderWithLineItems['purchase_order_line_items']
) => {
  return purchase_order_line_items.reduce(
    (acc, item) => acc + Number(item.unit_cost) * item.quantity,
    0
  );
};

const calculateTotalQuantity = (
  purchase_order_line_items: PurchaseOrderWithLineItems['purchase_order_line_items']
) => {
  return purchase_order_line_items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatItem = (lineItem: PurchaseOrderLineItemSelect, item: Item) => {
  return `<li>${item.name}: Qty: ${
    lineItem.quantity
  } - Unit Cost: ${formatCurrency(
    Number(lineItem.unit_cost)
  )} - Total Cost: ${formatCurrency(
    Number(lineItem.unit_cost) * lineItem.quantity
  )}</li>`;
};

const formatPurchaseOrder = (
  purchaseOrder: PurchaseOrderWithLineItems,
  items: Item[]
) => {
  return `<p>Order ID: ${purchaseOrder.id}</p>
    <p>Order Date: ${formatDate(purchaseOrder.order_date)}</p>
    <p>Expected Delivery Date: ${formatDate(
      purchaseOrder.expected_delivery_date
    )}</p>
    <p>Line Items:</p>
    <ul>
      ${purchaseOrder.purchase_order_line_items
        .map((item) =>
          formatItem(
            item,
            items.find((i) => i.id === item.item_id)
          )
        )
        .join('')}
      </ul>
    <p><strong>Total Cost:</strong> ${formatCurrency(
      calculateTotalCost(purchaseOrder.purchase_order_line_items)
    )}</p>
    <p><strong>Total Quantity:</strong> ${calculateTotalQuantity(
      purchaseOrder.purchase_order_line_items
    )}</p>`;
};

export const purchaseOrderCreatedTemplate = (
  purchaseOrder: PurchaseOrderWithLineItems,
  items: Item[]
) => {
  return `<p>A new purchase order for <strong>${
    purchaseOrder.vendor_name
  }</strong> has been created:</p>
  ${formatPurchaseOrder(purchaseOrder, items)}
  `;
};

export const purchaseOrderUpdatedTemplate = (
  purchaseOrder: PurchaseOrderWithLineItems,
  items: Item[]
) => {
  return `<p>A purchase order for <strong>${
    purchaseOrder.vendor_name
  }</strong> has been updated:</p>
  ${formatPurchaseOrder(purchaseOrder, items)}
  `;
};

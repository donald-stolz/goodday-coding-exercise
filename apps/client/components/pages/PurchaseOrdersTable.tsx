import type { PurchaseOrder, PurchaseOrderLineItem } from '../../types';
import Table from '../common/Table';

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
}

const columns = [
  {
    header: 'Vendor',
    accessor: 'vendorName',
  },
  {
    header: 'Order Date',
    accessor: 'orderDate',
    render: (po: PurchaseOrder) => new Date(po.orderDate).toLocaleDateString(),
  },
  {
    header: 'Expected Delivery',
    accessor: 'expectedDeliveryDate',
    render: (po: PurchaseOrder) =>
      new Date(po.expectedDeliveryDate).toLocaleDateString(),
  },
  {
    header: 'Line Items',
    accessor: 'purchaseOrderLineItems',
    render: (po: PurchaseOrder) => (
      <ul aria-label="Line Items">
        {po.purchaseOrderLineItems.map((lineItem: PurchaseOrderLineItem) => (
          <li key={lineItem.id} className="mb-1">
            <span className="font-medium">Item ID:</span> {lineItem.itemId},
            <span className="font-medium ml-2">Qty:</span> {lineItem.quantity},
            <span className="font-medium ml-2">Unit Cost:</span> $
            {lineItem.unitCost.toFixed(2)}
          </li>
        ))}
      </ul>
    ),
  },
];

const PurchaseOrdersTable = ({ purchaseOrders }: PurchaseOrdersTableProps) => (
  <Table
    columns={columns}
    data={purchaseOrders}
    tableAriaLabel="Purchase Orders Table"
  />
);

export default PurchaseOrdersTable;

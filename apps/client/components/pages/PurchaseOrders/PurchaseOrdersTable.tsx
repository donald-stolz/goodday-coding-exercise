import type {
  CreatePurchaseOrder,
  PurchaseOrder,
  PurchaseOrderLineItem,
} from '../../../types';
import Table from '../../common/Table';
import { useState } from 'react';
import { FaPencilAlt, FaPlusCircle } from 'react-icons/fa';
import Modal from '../../common/Modal';
import PurchaseOrderForm from './PurchaseOrderForm';
import { usePurchaseOrders } from '../../../hooks/usePurchaseOrders';

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
  {
    header: 'Total Cost',
    accessor: 'totalCost',
    render: (po: PurchaseOrder) => {
      const total = po.purchaseOrderLineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitCost,
        0
      );
      return <span aria-label="Total Cost">${total.toFixed(2)}</span>;
    },
  },
];

const PurchaseOrdersTable = ({ purchaseOrders }: PurchaseOrdersTableProps) => {
  const { createPurchaseOrder, updatePurchaseOrder } = usePurchaseOrders();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<'edit' | 'create' | 'closed'>(
    'closed'
  );
  const [purchaseOrderForm, setPurchaseOrderForm] =
    useState<PurchaseOrder | null>(null);

  const handleEditClick = (po: PurchaseOrder) => {
    setFormState('edit');
    setPurchaseOrderForm(po);
  };

  const handleEditKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    po: PurchaseOrder
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setPurchaseOrderForm(po);
    }
  };

  const handleCreateClick = () => {
    setFormState('create');
    setPurchaseOrderForm(null);
  };

  const handleCreateKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setFormState('create');
      setPurchaseOrderForm(null);
    }
  };

  const handleSubmit = async (data: PurchaseOrder | CreatePurchaseOrder) => {
    setIsLoading(true);
    try {
      if (formState === 'create') {
        await createPurchaseOrder(data as CreatePurchaseOrder);
      } else {
        await updatePurchaseOrder(data as PurchaseOrder);
      }
      setFormState('closed');
      setPurchaseOrderForm(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormState('closed');
    setPurchaseOrderForm(null);
  };

  const columnsWithEdit = [
    ...columns,
    {
      header: 'Edit',
      accessor: 'edit',
      render: (po: PurchaseOrder) => (
        <button
          type="button"
          aria-label={`Edit purchase order from vendor ${po.vendorName}`}
          tabIndex={0}
          className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleEditClick(po)}
          onKeyDown={(e) => handleEditKeyDown(e, po)}
        >
          {/* @ts-expect-error: react-icons typing issue */}
          <FaPencilAlt className="text-gray-600" size={20} />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          aria-label="Create new purchase order"
          tabIndex={0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleCreateClick}
          onKeyDown={handleCreateKeyDown}
        >
          {/* @ts-expect-error: react-icons typing issue */}
          <FaPlusCircle className="text-white" size={18} />
          <span className="font-medium">New Purchase Order</span>
        </button>
      </div>
      <Table
        columns={columnsWithEdit}
        data={purchaseOrders}
        tableAriaLabel="Purchase Orders Table"
      />
      <Modal
        isOpen={formState !== 'closed'}
        onClose={() => setFormState('closed')}
        ariaLabel={
          formState === 'edit'
            ? 'Edit Purchase Order Modal'
            : 'New Purchase Order Modal'
        }
      >
        <PurchaseOrderForm
          mode={formState === 'edit' ? 'edit' : 'new'}
          initialData={
            formState === 'edit' ? purchaseOrderForm || undefined : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </Modal>
    </>
  );
};

export default PurchaseOrdersTable;

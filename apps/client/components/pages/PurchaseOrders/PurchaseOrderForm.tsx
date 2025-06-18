import { useState } from 'react';
import Input from '../../common/Input';
import type {
  CreatePurchaseOrder,
  PurchaseOrder,
  PurchaseOrderLineItem,
} from '../../../types';
import { useItems } from '../../../hooks/useItems';
import Select from '../../common/Select';

interface PurchaseOrderFormProps {
  mode: 'new' | 'edit';
  initialData?: PurchaseOrder;
  onSubmit: (data: PurchaseOrder | CreatePurchaseOrder) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const createEmptyLineItem = (): PurchaseOrderLineItem => ({
  id: Date.now(),
  purchaseOrderId: 0,
  itemId: 0,
  quantity: 1,
  unitCost: 0,
});

const formatDateInput = (date?: Date) =>
  date ? new Date(date).toISOString().slice(0, 10) : '';

const PurchaseOrderForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: PurchaseOrderFormProps) => {
  const isEdit = mode === 'edit';
  const { items, isLoading: isItemsLoading } = useItems();
  const [vendorName, setVendorName] = useState(initialData?.vendorName || '');
  const [orderDate, setOrderDate] = useState(
    formatDateInput(initialData?.orderDate)
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    formatDateInput(initialData?.expectedDeliveryDate)
  );
  const [lineItems, setLineItems] = useState<PurchaseOrderLineItem[]>(
    initialData?.purchaseOrderLineItems?.length
      ? initialData.purchaseOrderLineItems
      : [createEmptyLineItem()]
  );

  const handleLineItemChange = (
    idx: number,
    field: keyof PurchaseOrderLineItem,
    value: number
  ) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [...prev, createEmptyLineItem()]);
  };

  const handleRemoveLineItem = (idx: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !vendorName ||
      !orderDate ||
      !expectedDeliveryDate ||
      lineItems.length === 0
    )
      return;
    onSubmit({
      id: initialData?.id,
      vendorName,
      orderDate: new Date(orderDate),
      expectedDeliveryDate: new Date(expectedDeliveryDate),
      purchaseOrderLineItems: lineItems.map((li) => ({
        ...li,
        itemId: Number(li.itemId),
        quantity: Number(li.quantity),
        unitCost: Number(li.unitCost),
      })),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Purchase Order Form"
    >
      <h2 className="text-xl font-bold mb-2">
        {mode === 'new' ? 'New Purchase Order' : 'Edit Purchase Order'}
      </h2>
      <Input
        id="vendorName"
        label="Vendor Name"
        type="text"
        value={vendorName}
        onChange={(e) => setVendorName(e.target.value)}
        disabled={isLoading || isEdit}
        required
      />
      <div className="flex gap-4">
        <Input
          id="orderDate"
          label="Order Date"
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          containerClassName="flex-1"
          disabled={isLoading || isEdit}
          required
        />
        <Input
          id="expectedDeliveryDate"
          label="Expected Delivery Date"
          type="date"
          value={expectedDeliveryDate}
          onChange={(e) => setExpectedDeliveryDate(e.target.value)}
          containerClassName="flex-1"
          disabled={isLoading}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Line Items</label>
        <ul>
          {lineItems.map((item, idx) => {
            const isFirst = idx === 0;
            const selectOptions = [
              {
                value: '',
                label: isItemsLoading ? 'Loading items...' : 'Select item',
              },
              ...(items
                ? items.map((option) => ({
                    value: option.id,
                    label: `${option.name} (${option.id})`,
                  }))
                : []),
            ];
            return (
              <li key={item.id} className="flex gap-2 items-center mb-2 ">
                <div className="flex-1">
                  <Select
                    id={`itemId-${idx}`}
                    label={isFirst ? 'Item' : ''}
                    value={item.itemId}
                    onChange={(e) =>
                      handleLineItemChange(
                        idx,
                        'itemId',
                        Number(e.target.value)
                      )
                    }
                    options={selectOptions}
                    required
                    disabled={isLoading || isItemsLoading || isEdit}
                  />
                </div>
                <Input
                  id={`quantity-${idx}`}
                  label={isFirst ? 'Quantity' : ''}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleLineItemChange(
                      idx,
                      'quantity',
                      Number(e.target.value)
                    )
                  }
                  required
                  inputClassName="w-20"
                  disabled={isLoading}
                />
                <Input
                  id={`unitCost-${idx}`}
                  label={isFirst ? 'Unit Cost' : ''}
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unitCost}
                  onChange={(e) =>
                    handleLineItemChange(
                      idx,
                      'unitCost',
                      Number(e.target.value)
                    )
                  }
                  required
                  inputClassName="w-28"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleRemoveLineItem(idx)}
                  aria-label="Remove Line Item"
                  tabIndex={0}
                  disabled={isLoading}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleAddLineItem}
          aria-label="Add Line Item"
          tabIndex={0}
          disabled={isLoading}
        >
          Add Line Item
        </button>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={onCancel}
          aria-label="Cancel"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          aria-label={mode === 'new' ? 'Create Purchase Order' : 'Save Changes'}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : mode === 'new' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;

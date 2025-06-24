import { useState, useRef } from 'react';
import Input from '../../common/Input';
import DollarInput from '../../common/DollarInput';
import type {
  CreatePurchaseOrder,
  CreatePurchaseOrderLineItem,
  PurchaseOrder,
  PurchaseOrderLineItem,
} from '../../../types';
import { useItems } from '../../../hooks/useItems';
import Select from '../../common/Select';

interface PurchaseOrderFormProps {
  mode: 'new' | 'edit';
  initialData?: PurchaseOrder;
  onSubmit: (data: Partial<PurchaseOrder> | CreatePurchaseOrder) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const createEmptyLineItem = (): CreatePurchaseOrderLineItem => ({
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
  const [vendorEmail, setVendorEmail] = useState(
    initialData?.vendorEmail || ''
  );
  const [orderDate, setOrderDate] = useState(
    formatDateInput(initialData?.orderDate)
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    formatDateInput(initialData?.expectedDeliveryDate)
  );
  const [lineItems, setLineItems] = useState<
    Array<PurchaseOrderLineItem | CreatePurchaseOrderLineItem>
  >(
    initialData?.purchaseOrderLineItems?.length
      ? initialData.purchaseOrderLineItems
      : [createEmptyLineItem()]
  );
  const [isFormValid, setIsFormValid] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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

  const handleInputChange =
    (handler: (e: any) => void, name: string) => (e: any) => {
      handler(e);
      if (formRef.current) {
        setIsFormValid(formRef.current.checkValidity());
      }
      setTouched((prev) => ({ ...prev, [name]: true }));
    };

  const getInputError = (name: string) => {
    if (!touched[name] || !formRef.current) return '';
    const input = formRef.current.elements.namedItem(
      name
    ) as HTMLInputElement | null;
    if (!input) return '';
    if (input.validity.valid) return '';
    if (input.validity.valueMissing) return 'This field is required.';
    return input.validationMessage;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !vendorName ||
      !orderDate ||
      !expectedDeliveryDate ||
      lineItems.length === 0
    ) {
      return;
    }
    if (isEdit) {
      const submissionData: Partial<PurchaseOrder> = {
        id: initialData?.id,
        expectedDeliveryDate: new Date(expectedDeliveryDate),
        purchaseOrderLineItems: lineItems as PurchaseOrderLineItem[],
      };
      onSubmit(submissionData);
    } else {
      const submissionData: CreatePurchaseOrder = {
        vendorName,
        vendorEmail,
        orderDate: new Date(orderDate),
        expectedDeliveryDate: new Date(expectedDeliveryDate),
        purchaseOrderLineItems: lineItems,
      };
      onSubmit(submissionData);
    }
  };

  return (
    <form
      ref={formRef}
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
        name="vendorName"
        onChange={handleInputChange(
          (e) => setVendorName(e.target.value),
          'vendorName'
        )}
        disabled={isLoading || isEdit}
        required
        error={getInputError('vendorName')}
      />
      <Input
        id="vendorEmail"
        label="Vendor Email"
        type="email"
        value={vendorEmail}
        name="vendorEmail"
        onChange={handleInputChange(
          (e) => setVendorEmail(e.target.value),
          'vendorEmail'
        )}
        disabled={isLoading || isEdit}
        required
        pattern="^[\w-.]+@([\w-]+\.)+[\w-]{2,}$"
        title="Please enter a valid email address."
        error={getInputError('vendorEmail')}
      />
      <div className="flex gap-4">
        <Input
          id="orderDate"
          label="Order Date"
          type="date"
          value={orderDate}
          name="orderDate"
          onChange={handleInputChange(
            (e) => setOrderDate(e.target.value),
            'orderDate'
          )}
          containerClassName="flex-1"
          disabled={isLoading || isEdit}
          required
          error={getInputError('orderDate')}
        />
        <Input
          id="expectedDeliveryDate"
          label="Expected Delivery Date"
          type="date"
          value={expectedDeliveryDate}
          name="expectedDeliveryDate"
          onChange={handleInputChange(
            (e) => setExpectedDeliveryDate(e.target.value),
            'expectedDeliveryDate'
          )}
          containerClassName="flex-1"
          disabled={isLoading}
          required
          error={getInputError('expectedDeliveryDate')}
        />
      </div>
      <div>
        <span className="block font-medium mb-1 ">Line Items</span>
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
              <li key={`item-${idx}`} className="flex gap-2 items-end mb-2 ">
                <Select
                  id={`itemId-${idx}`}
                  label={isFirst ? 'Item' : ''}
                  value={item.itemId}
                  name={`itemId-${idx}`}
                  onChange={handleInputChange(
                    (e) =>
                      handleLineItemChange(
                        idx,
                        'itemId',
                        Number(e.target.value)
                      ),
                    `itemId-${idx}`
                  )}
                  options={selectOptions}
                  required
                  disabled={isLoading || isItemsLoading || isEdit}
                />
                <Input
                  id={`quantity-${idx}`}
                  label={isFirst ? 'Quantity' : ''}
                  type="number"
                  min={1}
                  value={item.quantity}
                  name={`quantity-${idx}`}
                  onChange={handleInputChange(
                    (e) =>
                      handleLineItemChange(
                        idx,
                        'quantity',
                        Number(e.target.value)
                      ),
                    `quantity-${idx}`
                  )}
                  required
                  inputClassName="w-20"
                  disabled={isLoading}
                  error={getInputError(`quantity-${idx}`)}
                />
                <DollarInput
                  id={`unitCost-${idx}`}
                  label={isFirst ? 'Unit Cost' : ''}
                  value={item.unitCost}
                  name={`unitCost-${idx}`}
                  onChange={handleInputChange(
                    (val) =>
                      handleLineItemChange(
                        idx,
                        'unitCost',
                        val === '' ? 0 : val
                      ),
                    `unitCost-${idx}`
                  )}
                  required
                  inputClassName="w-28"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="h-10 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Saving...' : mode === 'new' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;

import useSWR from 'swr';
import { fetcher } from './fetcher';
import { CreatePurchaseOrder, PurchaseOrder } from '../types';
import { useSWRConfig } from 'swr';

export const usePurchaseOrders = () => {
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<PurchaseOrder[]>(
    'purchase-orders',
    fetcher
  );

  const createPurchaseOrder = async (purchaseOrder: CreatePurchaseOrder) => {
    console.log('purchaseOrder', purchaseOrder);
    const response = await fetcher('purchase-orders', {
      method: 'POST',
      body: JSON.stringify(purchaseOrder),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('response', response);
    mutate('purchase-orders');
  };

  const updatePurchaseOrder = async (purchaseOrder: Partial<PurchaseOrder>) => {
    console.log('purchaseOrder', purchaseOrder);
    // Get fields to update
    await fetcher(`purchase-orders/${purchaseOrder.id}`, {
      method: 'PATCH',
      body: JSON.stringify(purchaseOrder),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    mutate('purchase-orders');
  };

  return {
    purchaseOrders: data ?? [],
    error,
    isLoading,
    createPurchaseOrder,
    updatePurchaseOrder,
  };
};

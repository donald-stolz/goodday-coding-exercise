import useSWR from 'swr';
import { fetcher } from './fetcher';
import { PurchaseOrder } from '../types';

export const usePurchaseOrders = () => {
  const { data, error, isLoading } = useSWR<PurchaseOrder[]>(
    'purchase-orders',
    fetcher
  );
  return { purchaseOrders: data, error, isLoading };
};

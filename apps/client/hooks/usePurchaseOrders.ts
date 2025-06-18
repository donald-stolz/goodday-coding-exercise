import useSWR from 'swr';
import { fetcher } from './fetcher';

export const usePurchaseOrders = () => {
  const { data, error, isLoading } = useSWR('purchase-orders', fetcher);
  return { purchaseOrders: data, error, isLoading };
};

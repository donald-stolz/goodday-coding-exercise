import useSWR from 'swr';
import { Item } from '../types';
import { fetcher } from './fetcher';

export const useItems = () => {
  const { data, error, isLoading } = useSWR<Item[]>('items', fetcher);
  return { items: data ?? [], error, isLoading };
};

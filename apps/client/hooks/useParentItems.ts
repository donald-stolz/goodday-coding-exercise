import useSWR from 'swr';
import { fetcher } from './fetcher';
import { ParentItem } from '../types';

export const useParentItems = () => {
  const { data, error, isLoading } = useSWR<ParentItem[]>(
    'parent-items',
    fetcher
  );

  return {
    parentItems: data,
    isLoading,
    error,
  };
};

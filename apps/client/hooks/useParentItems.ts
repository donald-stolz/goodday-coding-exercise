import useSWR from 'swr';
import { fetcher } from './fetcher';

export const useParentItems = () => {
  const { data, error, isLoading } = useSWR('parent-items', fetcher);

  return {
    parentItems: data,
    isLoading,
    error,
  };
};

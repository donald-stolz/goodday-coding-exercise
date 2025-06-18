'use client';
import { useParentItems } from '../../hooks/useParentItems';
import Spinner from '../../components/common/Spinner';
import ParentItemsTable from '../../components/pages/ParentItemsTable';

export default function Index() {
  // TODO: Add error handling
  const { parentItems, isLoading } = useParentItems();

  return (
    <>
      <h1 className="text-2xl">Parent Items</h1>
      {isLoading ? <Spinner /> : <ParentItemsTable parentItems={parentItems} />}
    </>
  );
}

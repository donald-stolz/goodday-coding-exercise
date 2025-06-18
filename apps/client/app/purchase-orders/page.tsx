'use client';
import { usePurchaseOrders } from '../../hooks/usePurchaseOrders';
import PurchaseOrdersTable from '../../components/pages/PurchaseOrders/PurchaseOrdersTable';
import Spinner from '../../components/common/Spinner';

export default function Index() {
  const { purchaseOrders, isLoading } = usePurchaseOrders();

  return (
    <>
      <h1 className="text-2xl">Purchase Orders</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <PurchaseOrdersTable purchaseOrders={purchaseOrders} />
      )}
    </>
  );
}

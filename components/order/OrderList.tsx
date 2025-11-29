"use client";

import { ordersType } from "@/lib/actions/orders";
import ConfirmModal from "../ConfirmModal";
import { useOrdersPagination } from "@/lib/hooks/order/useOrderPagination";
import OrderCard from "./OrderCard";


export function OrdersList({
  initialOrders,
  searchParams,
  userRole,
}: {
  initialOrders: ordersType;
  searchParams: { q?: string; status?: string, fromDate?:string, toDate?:string };
  userRole: "admin" | "user";
}) {
  

  const {actions,hasMore,isLoading,orderToDelete,orders,inViewRef} =useOrdersPagination({initialOrders:initialOrders,currentSearchParams:searchParams})

  return (
    <div className="space-y-2 md:space-y-4 lg:space-y-8">
      {orders.map((order) => {
        const total = order.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        return (
         
          <OrderCard createdAt={order.createdAt} customerName={order.customer.name} items={order.items} orderId={order.id} setOrderToDelete={actions.setOrderToDelete} status={order.status} total={total} userRole={userRole} key={order.id}/>
        );
      })}

      <ConfirmModal
        isOpen={!!orderToDelete}
        title="Delete Order?"
        message="Deleting this order will restore product stock. Are you sure?"
        onCancel={() => actions.setOrderToDelete(null)}
        onConfirm={() => orderToDelete && actions.deleteOrder(orderToDelete)}
      />

      <div ref={inViewRef}>{hasMore ? "loading..." : undefined}</div>

      {orders.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 mt-10">No orders found.</p>
      )}
    </div>
  );
}

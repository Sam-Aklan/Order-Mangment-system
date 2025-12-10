"use client";

import { ordersType } from "@/lib/actions/orders";
import Link from "next/link";
import ConfirmModal from "../ConfirmModal";
import { useOrdersPagination } from "@/lib/hooks/order/useOrderPagination";


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
    <>
      {orders.map((order) => {
        const total = order.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        return (
          <div
            key={order.id}
            className="border rounded p-4 mb-4 shadow-sm bg-white"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Customer: {order.customer.name}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "SHIPPED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.status}
                </span>
                <p className="mt-2 font-bold">Total: ${total.toFixed(2)}</p>
              </div>
            </div>

            <div className={`mt-4 flex justify-between`}>
              <div>
                <p className="font-medium mb-1">Products:</p>
                <ul className="list-disc ml-6 text-sm">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} × {item.quantity} ($
                      {item.product.price.toFixed(2)} each)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-0.5">

              {userRole === "admin" ? (
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-3xl hover:bg-red-600 w-20 h-10"
                  onClick={() => actions.setOrderToDelete(order.id)}
                >
                  Delete
                </button>
              ) : undefined}
              <Link href={`/dashboard/order/${order.id}`} className="bg-blue-500 text-white text-center px-4 py-1 rounded-3xl hover:bg-blue-600 w-20 h-10 flex justify-center items-center">
                <p>View</p>
              </Link>
              </div>
            </div>
          </div>
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
    </>
  );
}

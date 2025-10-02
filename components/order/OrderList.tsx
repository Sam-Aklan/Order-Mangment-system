"use client";

import { ordersType } from "@/lib/actions/orders";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import ConfirmModal from "../ConfirmModal";

// ... other imports

export function OrdersList({
  initialOrders,
  searchParams,
  userRole,
}: {
  initialOrders: ordersType;
  searchParams: { q?: string; status?: string, fromDate?:string, toDate?:string };
  userRole: "admin" | "user";
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialOrders.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(searchParams);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const params = useSearchParams();

  const { ref, inView } = useInView();
  //   Reset state when filters change
  useEffect(() => {
    if (
      params.get("q") !== currentFilters.q ||
      params.get("status") !== currentFilters.status ||
      params.get("fromDate") !== currentFilters.fromDate ||
      params.get("toDate") !== currentFilters.toDate
    ) {
      setOrders(initialOrders);
      setPage(1);
      //   setHasMore(initialOrders.length > 0);
      setCurrentFilters({
        q: params.get("q") || undefined,
        status: params.get("status") || undefined,
        fromDate:params.get("fromDate") || undefined,
        toDate:params.get("toDate") || undefined
      });
    }
  }, [params]);

  const loadMoreOrders = useCallback(async () => {
    // Don't load if already loading or no more data
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const queryParams = new URLSearchParams({
        page: nextPage.toString(),
      });

      if (currentFilters.q) queryParams.set("q", currentFilters.q);
      if (currentFilters.status)
        queryParams.set("status", currentFilters.status);
      if(currentFilters.fromDate) queryParams.set("fromDate",currentFilters.fromDate)
      if(currentFilters.toDate) queryParams.set("toDate",currentFilters.toDate)

      const response = await fetch(`/api/orders?${queryParams.toString()}`);
      const { orders: newOrders, pagination } = await response.json();
      console.log("orders", newOrders, "pagination", pagination);
      setOrders((prev) => [...prev, ...newOrders]);
      setPage(nextPage);
      setHasMore(pagination.hasMore); // Update based on API response
    } catch (error) {
      console.error("Error loading more orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, currentFilters]);

  const deleteAction = useCallback(async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete order");
        return;
      }
      // Optimistic UI update
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setOrderToDelete(null)
    } catch (err) {
      console.error("Delete order failed", err);
    }
  }, []);

  useEffect(() => {
    if (inView) loadMoreOrders();
  }, [inView]);

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
                  onClick={() => setOrderToDelete(order.id)}
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
        onCancel={() => setOrderToDelete(null)}
        onConfirm={() => orderToDelete && deleteAction(orderToDelete)}
      />

      <div ref={ref}>{hasMore ? "loading..." : undefined}</div>

      {orders.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 mt-10">No orders found.</p>
      )}
    </>
  );
}

'use client';

import { ordersType } from "@/lib/actions/orders";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

// ... other imports

export function OrdersList({ initialOrders, searchParams }: { 
  initialOrders: ordersType;
  searchParams: { q?: string; status?: string };
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialOrders.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(searchParams);
  const params = useSearchParams();

  const {ref,inView}= useInView()
//   Reset state when filters change
  useEffect(() => {
    if (params.get('q') !== currentFilters.q || params.get('status') !== currentFilters.status) {
      setOrders(initialOrders);
      setPage(1);
    //   setHasMore(initialOrders.length > 0);
      setCurrentFilters({
        q: params.get('q') || undefined,
        status: params.get('status') || undefined
      });
    }
  }, [ params]);

  const loadMoreOrders = useCallback(async () => {
    // Don't load if already loading or no more data
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const queryParams = new URLSearchParams({
        page: nextPage.toString(),
      });

      if (currentFilters.q) queryParams.set('q', currentFilters.q);
      if (currentFilters.status) queryParams.set('status', currentFilters.status);

      const response = await fetch(`/api/orders?${queryParams.toString()}`);
      const { orders: newOrders, pagination } = await response.json();
      console.log("orders", newOrders, "pagination", pagination)
      setOrders(prev => [...prev, ...newOrders]);
      setPage(nextPage);
      setHasMore(pagination.hasMore); // Update based on API response
      
    } catch (error) {
      console.error('Error loading more orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, currentFilters]);

  useEffect(()=>{
    if(inView)loadMoreOrders()
  },[inView])

  return(
    <>
     {orders.map((order) => {
        const total = order.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        return (
          <Link href={`/dashboard/order/${order.id}`}
          key={order.id}>
          <div
            
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

            <div className="mt-4">
              <p className="font-medium mb-1">Products:</p>
              <ul className="list-disc ml-6 text-sm">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity} (${item.product.price.toFixed(2)} each)
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </Link>
        );
      })}

      {/* {isLoading && (
        <div className="text-center py-4">
          <p>Loading more orders...</p>
        </div>
      )} */}

      <div ref={ref}>
        {hasMore?"loading...":undefined}
      </div>

      {orders.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 mt-10">No orders found.</p>
    )
}
    </>
    )}
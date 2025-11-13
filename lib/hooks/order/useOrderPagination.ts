import { useState, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ordersType } from '@/lib/actions/orders';

interface UseOrdersPaginationProps {
  initialOrders: ordersType;
  currentSearchParams: {
    q?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  };
}

interface UseOrdersPaginationReturn {
  orders: ordersType;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  orderToDelete: string | null;
  inViewRef: (node?: Element | null) => void;
  inView: boolean;
  actions: {
    setOrders: (orders: ordersType) => void;
    setOrderToDelete: (orderId: string | null) => void;
    loadMoreOrders: () => Promise<void>;
    deleteOrder: (orderId: string) => Promise<void>;
    resetPagination: () => void;
  };
}

export function useOrdersPagination({
  initialOrders,
  currentSearchParams
}: UseOrdersPaginationProps):UseOrdersPaginationReturn {
  const [orders, setOrders] = useState<ordersType>(initialOrders);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialOrders.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const { ref: inViewRef, inView } = useInView();

  // Reset pagination when filters change
  const resetPagination = useCallback(() => {
    setOrders(initialOrders);
    setPage(1);
    setHasMore(initialOrders.length > 0);
  }, [initialOrders]);

  useEffect(() => {
    resetPagination();
  }, [currentSearchParams, resetPagination]);

  const loadMoreOrders = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const queryParams = new URLSearchParams({
        page: nextPage.toString(),
      });

      if (currentSearchParams.q) queryParams.set("q", currentSearchParams.q);
      if (currentSearchParams.status) queryParams.set("status", currentSearchParams.status);
      if (currentSearchParams.fromDate) queryParams.set("fromDate", currentSearchParams.fromDate);
      if (currentSearchParams.toDate) queryParams.set("toDate", currentSearchParams.toDate);

      const response = await fetch(`/api/orders?${queryParams.toString()}`);
      const { orders: newOrders, pagination } = await response.json();
      
      setOrders((prev) => [...prev, ...newOrders]);
      setPage(nextPage);
      setHasMore(pagination.hasMore);
    } catch (error) {
      console.error("Error loading more orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, currentSearchParams]);

  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete order");
        return;
      }
      
      // Optimistic UI update
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setOrderToDelete(null);
    } catch (err) {
      console.error("Delete order failed", err);
    }
  }, []);

  // Auto-load when in view
  useEffect(() => {
    if (inView) {
      loadMoreOrders();
    }
  }, [inView, loadMoreOrders]);

  return {
    orders,
    page,
    hasMore,
    isLoading,
    orderToDelete,
    inViewRef,
    inView,
    actions: {
      setOrders,
      setOrderToDelete,
      loadMoreOrders,
      deleteOrder,
      resetPagination,
    },
  };
}
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseDashboardFiltersProps {
  initialFrom?: string;
  initialTo?: string;
  initialGranularity?: "day" | "week" | "month";
  initialStatus?: "PENDING" | "SHIPPED" | "DELIVERED";
  initialCategory?: string;
}

interface UseDashboardFiltersReturn {
  filters: {
    from: string;
    to: string;
    granularity?: "day" | "week" | "month";
    category: string;
    status: string;
  };
  actions: {
    setFrom: (value: string) => void;
    setTo: (value: string) => void;
    setGranularity: (value: "day" | "week" | "month") => void;
    setCategory: (value: string) => void;
    setStatus: (value: string) => void;
    handleApplyFilters: () => void;
  };
}

export function useDashboardFilters({
  initialFrom,
  initialTo,
  initialGranularity,
  initialCategory,
  initialStatus
}: UseDashboardFiltersProps): UseDashboardFiltersReturn {
  const [from, setFrom] = useState(initialFrom || "");
  const [to, setTo] = useState(initialTo || "");
  const [granularity, setGranularity] = useState(initialGranularity);
  const [category, setCategory] = useState(initialCategory || "");
  const [status, setStatus] = useState(initialStatus || "");

  const router = useRouter();

  const handleApplyFilters = useCallback(async () => {
    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    if (granularity) query.set("granularity", granularity);
    if (status) query.set("status", status);
    if (category) query.set("category", category);

    router.push(`/dashboard?${query.toString()}`);
    router.refresh();
  }, [from, to, granularity, status, category, router]);

  return {
    filters: {
      from,
      to,
      granularity,
      category,
      status,
    },
    actions: {
      setFrom,
      setTo,
      setGranularity,
      setCategory,
      setStatus,
      handleApplyFilters,
    },
  };
}
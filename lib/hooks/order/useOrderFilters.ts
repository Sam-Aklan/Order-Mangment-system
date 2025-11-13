import { useState, useCallback, ChangeEvent,} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UseOrderFilterProps{
  query?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

interface UseOrderFilterReturn {
  filters: UseOrderFilterProps;
  actions: {
    setQuery: (e:ChangeEvent<HTMLInputElement>) => void;
    setStatus: (e: ChangeEvent<HTMLSelectElement>) => void;
    setFromDate: (e:ChangeEvent<HTMLInputElement>) => void;
    setToDate: (e:ChangeEvent<HTMLInputElement>) => void;
    submitFilters: (basePath?: string) => void;
    resetFilters: () => void;
  };
  currentSearchParams: UseOrderFilterProps;
}

export function useOrderFilters({
  query: initialQuery = "",
  status: initialStatus = "",
  fromDate: initialFromDate = "",
  toDate: initialToDate = "",
}: UseOrderFilterProps = {}): UseOrderFilterReturn {
  const [filters, setFilters] = useState<UseOrderFilterProps>({
    query: initialQuery,
    status: initialStatus,
    fromDate: initialFromDate,
    toDate: initialToDate,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync with URL search params
  const currentSearchParams = {
    query: searchParams.get('q') || '',
    status: searchParams.get('status') || '',
    fromDate: searchParams.get('fromDate') || '',
    toDate: searchParams.get('toDate') || '',
  };

  // Individual setters
  const setQuery = (e:ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, query: e.target.value}));
  };

  const setStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  const setFromDate = (e:ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, fromDate: e.target.value }));
  };

  const setToDate = (e:ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, toDate: e.target.value }));
  };

  const submitFilters = useCallback((basePath: string = '/dashboard') => {
    const params = new URLSearchParams();
    
    if (filters.query && filters.query.trim() !== "") params.set("q", filters.query);
    if (filters.status && filters.status.trim() !== "") params.set("status", filters.status);
    if (filters.fromDate && filters.fromDate.trim() !== "") params.set("fromDate", filters.fromDate);
    if (filters.toDate && filters.toDate.trim() !== "") params.set("toDate", filters.toDate);

    router.push(`${basePath}?${params.toString()}`);
  }, [filters, router]);

  const resetFilters = useCallback(() => {
    setFilters({
      query: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
    router.push('/dashboard'); // or whatever your base path is
  }, [router]);

  return {
    filters,
    actions: {
      setQuery,
      setStatus,
      setFromDate,
      setToDate,
      submitFilters,
      resetFilters,
    },
    currentSearchParams,
  };
}
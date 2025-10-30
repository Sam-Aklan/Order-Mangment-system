
import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UseCustomerFiltersProps {
  initialQuery?: string;
}

interface UseCustomerFiltersReturn {
  query: string;
  actions: {
    setQuery: (value:string) => void;
    submitFilters: () => void;
    resetFilters: () => void;
    updateQueryFromUrl: () => void;
  };
  currentSearchParams: {
    q: string;
    page: string;
  };
}

export function useCustomerFilters({
  initialQuery = "",
}: UseCustomerFiltersProps = {}): UseCustomerFiltersReturn {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current search params from URL
  const currentSearchParams = {
    q: searchParams.get('q') || '',
    page: searchParams.get('page') || '1',
  };

  // Sync with URL parameters when they change
  useEffect(() => {
    setQuery(currentSearchParams.q);
  }, [currentSearchParams.q]);

  // Manual sync function
  const updateQueryFromUrl = useCallback(() => {
    setQuery(currentSearchParams.q);
  }, [currentSearchParams.q]);

  // Submit filters
  const submitFilters = useCallback(() => {
   

    const params = new URLSearchParams();
    
    if (query.trim() !== "") {
      params.set("q", query.trim());
    }
    
    // Reset to page 1 when filters change (default behavior)
      params.set("page", "1");

    router.push(`/dashboard/customers?${params.toString()}`);
  }, [query, router]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setQuery("");
    router.push('/dashboard/customers?page=1');
  }, [router]);

  return {
    query,
    actions: {
      setQuery,
      submitFilters,
      resetFilters,
      updateQueryFromUrl,
    },
    currentSearchParams,
  };
}
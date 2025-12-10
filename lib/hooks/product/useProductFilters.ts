// hooks/useProductFilters.ts
import { useState, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFilterState {
  name: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface UseProductFiltersProps {
  initialName?: string;
  initialCategory?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  basePath?: string;
}

interface UseProductFiltersReturn {
  filters: ProductFilterState;
  actions: {
    setName: (e:ChangeEvent<HTMLInputElement>) => void;
    setCategory: (e:ChangeEvent<HTMLSelectElement>) => void;
    setMinPrice: (e:ChangeEvent<HTMLInputElement>) => void;
    setMaxPrice: (e:ChangeEvent<HTMLInputElement>) => void;
    submitFilters: () => void;
    resetFilters: () => void;
    updateAllFilters: (filters: Partial<ProductFilterState>) => void;
  };
}

export function useProductFilters({
  initialName = "",
  initialCategory = "",
  initialMinPrice = "",
  initialMaxPrice = "",
  basePath ="/dashboard/products"
}: UseProductFiltersProps = {}): UseProductFiltersReturn {
  const [filters, setFilters] = useState<ProductFilterState>({
    name: initialName,
    category: initialCategory,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
  });

  const router = useRouter();

  // Individual setters
  const setName = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const setCategory = useCallback((e:ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  }, []);

  const setMinPrice = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, minPrice: e.target.value }));
  }, []);

  const setMaxPrice = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
  }, []);

  // Update multiple filters at once
  const updateAllFilters = useCallback((newFilters: Partial<ProductFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Submit filters
  const submitFilters = useCallback(() => {
   

    const params = new URLSearchParams();
    
    if (filters.name.trim() !== "") params.set("q", filters.name.trim());
    if (filters.category.trim() !== "") params.set("category", filters.category);
    if (filters.minPrice.trim() !== "") params.set("minPrice", filters.minPrice);
    if (filters.maxPrice.trim() !== "") params.set("maxPrice", filters.maxPrice);
    
    // Reset to page 1 when filters change (default behavior)
    
      params.set("page", "1");
   
    
    router.push(`${basePath}?${params.toString()}`);
  }, [filters, router]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  }, []);

  return {
    filters,
    actions: {
      setName,
      setCategory,
      setMinPrice,
      setMaxPrice,
      submitFilters,
      resetFilters,
      updateAllFilters,
    },
  };
}
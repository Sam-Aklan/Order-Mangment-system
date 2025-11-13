
import { useState, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

interface ProductListManagementProps {
  searchParams: {
    q?: string;
    page: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  };
  basePath?: string;
}

interface ProductListManagementReturn {
  // State
  isModalOpen: boolean;
  productToDelete: { name: string; id: string } | null;
  isDeleting: boolean;
  
  // Computed values
  currentPage: number;
  pageSize: number;
  
  // Actions
  actions: {
    openModal: () => void;
    closeModal: () => void;
    setProductToDelete: Dispatch<SetStateAction<{
      name:string,
      id:string
    }| null>> 
    handlePageChange: (newPage: number) => void;
    handlePageSizeChange: (newSize: number) => void;
    handleProductDelete: (id: string) => Promise<void>;
    refreshPage: () => void;
    updateUrlParams: (updates: { page?: number; limit?: number }) => string;
  };
}

export function useProductListManagement({
  searchParams,
  basePath = '/dashboard/products',
}: ProductListManagementProps): ProductListManagementReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ name: string; id: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const router = useRouter();

  // Computed values
  const currentPage = useMemo(() => searchParams.page || 1, [searchParams.page]);
  const pageSize = useMemo(() => searchParams.limit || 10, [searchParams.limit]);

  // URL builder utility
  const updateUrlParams = useCallback((updates: { page?: number; limit?: number } = {}) => {
    const params = new URLSearchParams();
    
    // Preserve all existing filters
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.minPrice) params.set("minPrice", String(searchParams.minPrice));
    if (searchParams.maxPrice) params.set("maxPrice", String(searchParams.maxPrice));
    
    // Apply updates
    const page = updates.page ?? currentPage;
    const limit = updates.limit ?? pageSize;
    
    params.set("page", String(page));
    if (limit !== 10) { // Only include limit if it's not default
      params.set("limit", String(limit));
    }
    
    return `${basePath}?${params.toString()}`;
  }, [searchParams, currentPage, pageSize, basePath]);

  // Modal actions
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Pagination handlers
  const handlePageChange = useCallback((newPage: number) => {
    const url = updateUrlParams({ page: newPage });
    router.push(url);
  }, [updateUrlParams, router]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    const url = updateUrlParams({ page: 1, limit: newSize });
    router.push(url);
  }, [updateUrlParams, router]);

  // Product deletion
  const handleProductDelete = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/product/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id })
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete product");

      router.refresh();
      setProductToDelete(null); // Close confirmation modal
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  }, [router]);

  // Refresh page
  const refreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  return {
    isModalOpen,
    productToDelete,
    isDeleting,
    currentPage,
    pageSize,
    actions: {
      openModal,
      closeModal,
      setProductToDelete,
      handlePageChange,
      handlePageSizeChange,
      handleProductDelete,
      refreshPage,
      updateUrlParams,
    },
  };
}
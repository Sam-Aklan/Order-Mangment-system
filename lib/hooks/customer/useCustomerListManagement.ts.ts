
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CustomerListManagementProps {
  searchParams: { 
    q?: string; 
    page: number; 
    pageSize: number;
  };
  basePath?: string;
}

interface CustomerListManagementReturn {
  // State
  isModalOpen: boolean;
  
  // Actions
  actions: {
    openModal: () => void;
    closeModal: () => void;
    handlePageChange: (newPage: number) => void;
    handlePageSizeChange: (newSize: number) => void;
    refreshPage: () => void;
    updateCustomerUrl: (updates: { page?: number; pageSize?: number }) => string;
  };
  
  // Computed values
  currentPage: number;
  currentPageSize: number;
}

export function useCustomerListManagement({
  searchParams,
  basePath = '/dashboard/customers',
}: CustomerListManagementProps): CustomerListManagementReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Computed values
  const currentPage = searchParams.page || 1;
  const currentPageSize = searchParams.pageSize || 10;

  // Modal actions
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // URL builder utility
  const updateCustomerUrl = useCallback((updates: { page?: number; pageSize?: number } = {}) => {
    const params = new URLSearchParams();
    
    // Preserve search query
    if (searchParams.q) {
      params.set("q", searchParams.q);
    }
    
    // Apply updates
    const page = updates.page ?? currentPage;
    const pageSize = updates.pageSize ?? currentPageSize;
      params.set("page",String(page))
          params.set("limit", String(pageSize));
    
    
    return `${basePath}?${params.toString()}`;
  }, [searchParams.q, currentPage, currentPageSize, basePath]);

  // Pagination handlers
  const handlePageChange = useCallback((newPage: number) => {
    const url = updateCustomerUrl({ page: newPage });
    router.push(url);
  }, [updateCustomerUrl, router]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    const url = updateCustomerUrl({ page: 1, pageSize: newSize });
    router.push(url);
  }, [updateCustomerUrl, router]);

  // Refresh page
  const refreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  return {
    isModalOpen,
    actions: {
      openModal,
      closeModal,
      handlePageChange,
      handlePageSizeChange,
      refreshPage,
      updateCustomerUrl,
    },
    currentPage,
    currentPageSize,
  };
}
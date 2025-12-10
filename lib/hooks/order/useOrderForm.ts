
import { useMemo, useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { customerType } from '@/lib/actions/customers';
import { productType } from '@/lib/actions/products';
import { createOrder } from '@/lib/actions/orders';
import { ItemSelection, useOrderStore } from '@/lib/store/OrderStore';
import { orderSchema } from '@/lib/validations/orderValidation';

interface UseOrderFormProps {
  products: productType[];
  customers: customerType[];
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    limit?:number;
  };
  page: number;
  totalPages: number;
}

interface UseOrderFormReturn {
  // State
  previewOpen: boolean;
  isPending: boolean;
  error: string | null;
  
  // Store state
  selectedItems: Record<string, ItemSelection>;
  total: number;
  isEmpty: boolean;
  
  // Actions
  actions: {
    setPreviewOpen: (open: boolean) => void;
    setError: (error: string | null) => void;
    setCustomer: (id: string) => void;
    clearOrder: () => void;
    handleQuantityChange: (productId: string, quantity: number, stock: number, price: number, name: string, category: string) => void;
    handlePageChange: (newPage: number) => void;
    handlePageSizeChange: (newSize: number) => void
    handleSubmission: () => void;
    clearError: () => void;
    validateOrder: () => boolean;
    removeProduct: (id: string) => void;
  };
}

export function useOrderForm({
  products,
  customers,
  searchParams,
  page,
  totalPages
}: UseOrderFormProps): UseOrderFormReturn {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Order store
  const {
    selectedItems,
    setProductQuantity,
    removeProduct,
    clearOrder,
    setCustomer,
    getOrderPayload,
    totalPrice,
  } = useOrderStore();

  // Computed values
  const total = useMemo(() => totalPrice(), [selectedItems, totalPrice]);
  const isEmpty = Object.keys(selectedItems).length === 0;

  // Quantity change handler
  const handleQuantityChange = useCallback((
    productId: string, 
    quantity: number, 
    stock: number, 
    price: number, 
    name: string, 
    category: string
  ) => {
    if (quantity > stock) quantity = stock;
    
    if (quantity < 1) {
      removeProduct(productId);
      return;
    }

    setProductQuantity(productId, quantity, price, name, stock, category, true);
  }, [setProductQuantity, removeProduct]);

  // URL builder for product pagination
  const buildProductUrl = useCallback(({newPage,pageSize}:{newPage?: number,pageSize?:number}) => {
    const params = new URLSearchParams();

    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
    const page = newPage ?? 1
    const limit = pageSize ?? 5
    params.set("page", String(page));

    limit !==5 ? params.set("limit",String(limit)):undefined
    
    return `/dashboard/order/new?${params.toString()}`;
  }, [searchParams]);

  // Pagination handler
  const handlePageChange = useCallback((newPage: number) => {
   const path = buildProductUrl({newPage})
   router.push(path)
  }, [buildProductUrl]);

  const handlePageSizeChange = useCallback((newSize:number)=>{

    const path = buildProductUrl({pageSize:newSize})
    router.push(path)
  },[buildProductUrl, router])


  // Order validation
  const validateOrder = useCallback((): boolean => {
    const payload = getOrderPayload();
    const result = orderSchema.safeParse(payload);
    
    if (!result.success) {
      const firstError = result.error.issues[0];
      setError(`${firstError.message} *** ${firstError.path.join('.')}`);
      return false;
    }
    
    setError(null);
    return true;
  }, [getOrderPayload]);

  // Order submission
  const handleSubmission = useCallback(() => {
    setError(null);

    if (!validateOrder()) {
      return;
    }

    const payload = getOrderPayload();
    const result = orderSchema.safeParse(payload);
    
    if (!result.success) {
      return; // validation already failed above
    }

    try {

    //   startTransition(async () => {
      
    //     await createOrder({
    //       customerId: result.data.customerId,
    //       products: result.data.products,
    //       total: result.data.total,
    //     });
     
    // });
       clearOrder();
       router.push('/dashboard/order')
    } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to create order');
       clearOrder()
    }

    
  }, [validateOrder, getOrderPayload, clearOrder]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    previewOpen,
    isPending,
    error,
    selectedItems,
    total,
    isEmpty,
    actions: {
      setPreviewOpen,
      setError,
      setCustomer,
      handleQuantityChange,
      handlePageChange,
      handlePageSizeChange,
      handleSubmission,
      clearError,
      clearOrder,
      validateOrder,
      removeProduct
    },
  };
}
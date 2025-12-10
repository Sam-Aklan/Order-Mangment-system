
import { useEffect, useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { orderType, statusType, updateOrder } from '@/lib/actions/orders';
import { useOrderStore } from '@/lib/store/OrderStore';

interface UseEditOrderFormProps {
  order: orderType;
}

interface UseEditOrderFormReturn {
  // State
  status: statusType;
  showModal: boolean;
  isPending: boolean;
  
  // Store state
  selectedItems: Record<string, any>;
  total: number;
  
  // Actions
  actions: {
    setStatus: (status: statusType) => void;
    setShowModal: (show: boolean) => void;
    setCustomer: (id: string) => void;
    handleQuantityChange: (productId: string, quantity: number, stock: number, price: number, name: string, category: string) => void;
    removeProduct: (productId: string) => void;
    setProductQuantity:(id: string, quantity: number, price: number, itemName: string, stock: number, category: string, isNew?: boolean | undefined) => void;
    handleSubmit: (formData: FormData) => Promise<void>;
    initializeOrder: () => void;
    getOrderPayload: () => any;
    validateOrder: () => boolean;
  };
}

export function useEditOrderForm({
  order,
}: UseEditOrderFormProps): UseEditOrderFormReturn {
  const router = useRouter();
  const [status, setStatus] = useState<statusType>(order.status);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTranstion] = useTransition()

  // Order store
  const {
    selectedItems,
    setProductQuantity,
    removeProduct: removeStoreProduct,
    totalPrice,
    setCustomer,
    initializeOrder: initializeStoreOrder,
    getOrderPayload: getStorePayload,
  } = useOrderStore();

  // Computed total
  const total = totalPrice();

  // Initialize order from props
  const initializeOrder = useCallback(() => {
    initializeStoreOrder(
      order.customer.id,
      order.items.map((item) => ({
        id: item.product.id,
        itemName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        category: item.product.category,
        stock: item.product.stock,
        isNew: false,
      }))
    );
  }, [order, initializeStoreOrder]);

  // Load initial order into store on mount
  useEffect(() => {
    initializeOrder();
  }, [initializeOrder]);

  // Product quantity change handler
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
      removeStoreProduct(productId);
      return;
    }

    setProductQuantity(productId, quantity, price, name, stock, category, false);
  }, [setProductQuantity, removeStoreProduct]);

  // Remove product from order
  const removeProduct = useCallback((productId: string) => {
    removeStoreProduct(productId);
  }, [removeStoreProduct]);


  // Get order payload for submission
  const getOrderPayload = useCallback(() => {
    return getStorePayload();
  }, [getStorePayload]);

  // Validate order before submission
  const validateOrder = useCallback((): boolean => {
    const payload = getOrderPayload();
    
    if (!payload.customerId) {
      alert("Please select a customer");
      return false;
    }
    
    if (payload.products.length === 0) {
      alert("Please add at least one product to the order");
      return false;
    }
    
    return true;
  }, [getOrderPayload]);

  // Form submission
  const handleSubmit = useCallback(async (formData: FormData) => {
    
    if (!validateOrder()) {
      return;
    }

   
    
    try {
      const payload = getOrderPayload();
      startTranstion(async()=>{

        const result = await updateOrder({
          orderId: order.id,
          customerId: payload.customerId!,
          status,
          items: payload.products.map(p => ({ 
            productId: p.id, 
            quantity: p.quantity 
          })),
        });
  
        if (result.success) {
          router.push("/dashboard/order");
         
        } else {
          alert("Failed to update order");
        }
      })
    } catch (error) {
      console.error("Error updating order:", error);
      alert("An error occurred while updating the order");
    } 
  }, [validateOrder, getOrderPayload, order.id, status, router]);

  return {
    status,
    showModal,
    isPending,
    selectedItems,
    total,
    actions: {
      setStatus,
      setCustomer,
      setShowModal,
      handleQuantityChange,
      removeProduct,
      setProductQuantity,
      handleSubmit,
      initializeOrder,
      getOrderPayload,
      validateOrder,
    },
  };
}
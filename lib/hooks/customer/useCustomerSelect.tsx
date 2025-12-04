
import { useEffect, useRef, useState, useCallback, Dispatch, SetStateAction } from 'react';

interface Customer {
  id: string;
  name: string;
  imageUrl?:string;
}

interface UseCustomerSelectProps {
  previousCustomer?: Customer;
  onChange: (id: string) => void;
  clearErrors?:()=>void
}

interface UseCustomerSelectReturn {
  // State
  selectedCustomer: { id: string; name: string,image?:string } | undefined;
  customers: Customer[];
  search: string;
  open: boolean;
  loading: boolean;
  hasMore: boolean;
  
  // Refs
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  
  // Actions
  actions: {
    setSearch: (search: string) => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleCustomerSelect: (customer: Customer) => void;
    fetchCustomers: (reset?: boolean) => Promise<void>;
    handleScroll: () => void;
    clearSelection: () => void;
  };
}

export function useCustomerSelect({
  previousCustomer,
  onChange,
  clearErrors
}: UseCustomerSelectProps): UseCustomerSelectReturn {
  const [selectedCustomer, setSelectedCustomer] = useState(previousCustomer);
  const [customers, setCustomers] = useState<Customer[]>( 
    previousCustomer ? [previousCustomer] :[]
  );
  const [search, setSearch] = useState("");
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch customers from API
  const fetchCustomers = useCallback(async (reset = false) => {
    if (!hasMore && !reset) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `/api/customers?q=${encodeURIComponent(search)}&limit=5${
          reset ? "" : `&cursor=${pageCursor}`
        }`
      );
      
      if (!res.ok) throw new Error('Failed to fetch customers');
      
      const data = await res.json();
      console.log("initial customers", customers)
      setCustomers((prev) =>{
        let allcustomers:Customer[] =[]

        if(reset && selectedCustomer){
          allcustomers =reset ? [ selectedCustomer,...data.customers] : [...prev, ...data.customers]
        } else allcustomers = [...prev, ...data.customers]

        const customersMap =  new Map<string,Customer>();
        if(!allcustomers) return []
        
        for (const customer of allcustomers) {
          customersMap.set(customer.id,customer)
          
        }
        return Array.from(customersMap.values())
      }
      );
      setPageCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, [search, pageCursor, hasMore,]);

  // Debounced search effect
  useEffect(() => {
    
    const timeout = setTimeout(() => {
      setPageCursor(null);
      setHasMore(true);
      fetchCustomers(true);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [ search]);

  // Fetch customers when dropdown opens
  useEffect(() => {
    console.log("api fetch")
    if(customers.length > 1) return
    if (open) {
      fetchCustomers(true);
    }
  }, [open, fetchCustomers,]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    console.log("handle scroll")
    const el = listRef.current;
    if (!el || loading || !hasMore) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      fetchCustomers();
    }
  }, [loading, hasMore, fetchCustomers]);

  // Handle customer selection
  const handleCustomerSelect = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    onChange(customer.id);
    setOpen(false);
    clearErrors?clearErrors():undefined
    
  }, [onChange]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedCustomer(undefined);
    onChange('');
  }, [onChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    selectedCustomer,
    customers,
    search,
    open,
    loading,
    hasMore,
    dropdownRef,
    listRef,
    actions: {
      setSearch,
      setOpen,
      handleCustomerSelect,
      fetchCustomers,
      handleScroll,
      clearSelection,
    },
  };
}
import {   useMemo,} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderFiltersSchema, OrderFiltersSchemaType } from '@/lib/validations/orderValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { validDateString } from '@/lib/utils';

interface UseOrderFilterProps{
  query?: string;
  status?: "PENDING"| "SHIPPED"| "DELIVERED";
  fromDate?: string;
  toDate?: string;
}


export function useOrderFilters({
  query: initialQuery ,
  status: initialStatus ,
  fromDate: initialFromDate ,
  toDate: initialToDate ,
}: UseOrderFilterProps = {}){
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync with URL search params
  const currentSearchParams =useMemo(()=>{return{
    query: searchParams.get('q') || undefined,
    status: searchParams.get('status') || undefined ,
    fromDate: searchParams.get('fromDate') || undefined,
    toDate: searchParams.get('toDate') || undefined,
  }},[searchParams]) 

  const form = useForm <OrderFiltersSchemaType> ({
      resolver: zodResolver(OrderFiltersSchema),
      defaultValues: {
        from: validDateString(initialFromDate),
        to: validDateString(initialToDate),
        query:initialQuery,
        status:initialStatus,
      },
    })

 

  function onSubmitFilters(values: OrderFiltersSchemaType ) {
      try {
        const isFiltersUpdated = values === form.formState.defaultValues
        if(isFiltersUpdated) return
       const params = new URLSearchParams();
       const {from,query,status,to} = values
    
    if (query && query.trim() !== "") params.set("q", query);
    if (status && status.trim() !== "") params.set("status", status);
    if (from) params.set("fromDate", from.toDateString());
    if (to ) params.set("toDate", to.toDateString());

    router.push(`/dashboard/order?${params.toString()}`)
        
      } catch (error) {
        console.error("Form submission error", error);
        
      }
    }



  return {
    form, onSubmitFilters
  };
}
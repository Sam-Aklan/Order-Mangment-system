"use client"
import { useRouter } from 'next/navigation';
import { formFiltersSchema, formFiltersSchemaType } from '@/lib/validations/productValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryType } from '@/lib/actions/products';


interface UseProductFiltersProps {
  initialQuery?: string;
  initialCategory?: categoryType;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  basePath?: string;
}



export function useProductFilters({
  initialQuery,
  initialCategory,
  initialMinPrice,
  initialMaxPrice,
  basePath ="/dashboard/order/new"
}: UseProductFiltersProps = {}){
  
     const router = useRouter()
        const form = useForm < formFiltersSchemaType> ({
        resolver: zodResolver(formFiltersSchema),
        defaultValues:{
            category:initialCategory,
            maxPrice:initialMaxPrice || '0',
            minPrice:initialMinPrice || '0',
            query:initialQuery || ''
        }
      })
    
      function onSubmitHandler(values: formFiltersSchemaType ) {
        try {
            const {category,maxPrice,minPrice,query} = values
          const params = new URLSearchParams();
        
        if (query  && query.trim()!=='') params.set("q", query.trim());
        if (category) params.set("category", category);
        if (minPrice && minPrice.trim() !=='0' ) params.set("minPrice", minPrice.trim());
        if (maxPrice && maxPrice.trim() !=='0') params.set("maxPrice", maxPrice.trim());
        
        // Reset to page 1 when filters change (default behavior)
        
          params.set("page", "1");
       
        
        router.push(`${basePath}?${params.toString()}`);
    
         
        } catch (error) {
          console.error("Form submission error", error);
        }
      }

  return {
    form, onSubmitHandler
  };
}
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { filtersSchema,filtersSchemaType } from "@/lib/validations/dashbaordVaildation";
import { useRouter } from "next/navigation";
import { validDateString } from "../utils";

interface UseDashboardFiltersProps {
  initialFrom?: string;
  initialTo?: string;
  initialGranularity?: "day" | "week" | "month";
  initialStatus?: "PENDING" | "SHIPPED" | "DELIVERED";
  initialCategory?: "ELECTRONICS" | "CLOTHING" | "FOOD" | "BOOKS" | "FURNITURE" | "OTHER";
}

export function useDashboardFilters({
    initialCategory,
    initialFrom,
    initialGranularity,
    initialStatus,
    initialTo
}:UseDashboardFiltersProps){
    const router = useRouter()

   

    const form = useForm <filtersSchemaType > ({
        resolver: zodResolver(filtersSchema),
        defaultValues: {
          "from": validDateString(initialFrom),
          "to": validDateString(initialTo),
          "status":initialStatus,
          "category":initialCategory,
          "granularity":initialGranularity
        },
      })
    
      function onSubmitFilters(values: filtersSchemaType ) {
        const {category,from,granularity,status,to} = values
        try {
          const query = new URLSearchParams();
        if (from) query.set("from", from.toDateString());
        if (to) query.set("to", to.toDateString());
        if (granularity) query.set("granularity", granularity);
        if (status) query.set("status", status);
        if (category) query.set("category", category);
    
        router.push(`/dashboard?${query.toString()}`);
        router.refresh();
        } catch (error) {
          console.error("Form submission error", error);
        
        }
      }

      return {form,onSubmitFilters}


}
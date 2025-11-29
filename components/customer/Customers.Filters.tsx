"use client";

import { useCustomerFilters } from "@/lib/hooks/customer/useCustomersFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CustomerFilter = ({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) => {
 

  const {query,actions} = useCustomerFilters({initialQuery:searchParams.q})

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search by name or email..."
        className="border p-2 rounded w-full"
        value={query}
        onChange={(e) => actions.setQuery(e.target.value)}
      />
      <Button
        className="px-2 py-1"
        onClick={()=> actions.submitFilters()}
      >
        Search
      </Button>
    </div>
  );
};

export default CustomerFilter;

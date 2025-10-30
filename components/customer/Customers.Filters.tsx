"use client";

import { useCustomerFilters } from "@/lib/hooks/useCustomersFilters";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerFilter = ({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) => {
  // const [q, setQ] = useState(searchParams.q || "");
  // const router = useRouter();

  // useEffect(() => {
  //   setQ(searchParams.q || "");
  // }, [searchParams]);

  // const submitFilters = () => {
  //   const params = new URLSearchParams();
  //   if (q.trim() !== "") params.set("q", q.trim());

  //   // Always reset to page 1 when filters change
  //   params.set("page", "1");
  //   router.push(`/dashboard/customers?${params.toString()}`);
  // };

  const {query,actions} = useCustomerFilters({initialQuery:searchParams.q})

  return (
    <div className="flex gap-2">
      <input
        placeholder="Search by name or email..."
        className="border p-2 rounded w-full"
        value={query}
        onChange={(e) => actions.setQuery(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={()=> actions.submitFilters()}
      >
        Search
      </button>
    </div>
  );
};

export default CustomerFilter;

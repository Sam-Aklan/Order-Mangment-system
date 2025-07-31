"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

export function OrderFilters({
  initialQuery,
  initialStatus,
}: {
  initialQuery: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);

  const submitFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    router.push(`/orders?${params.toString()}`);
  };

 const searchHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    setQuery(e.target.value)
 } 

const statusHandler = (e: ChangeEvent<HTMLSelectElement>)=>{
    setStatus(e.target.value)
} 

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <input
        type="text"
        placeholder="Search by product or customer"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-64"
      />

      <select
        value={status}
        onChange={statusHandler}
        className="p-2 border rounded"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
      </select>

      <button
        type="button"
        onClick={submitFilters}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  );
}

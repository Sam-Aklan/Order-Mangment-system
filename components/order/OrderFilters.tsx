"use client";

import {  useOrderFilters } from "@/lib/hooks/order/useOrderFilters";
import { useEffect } from "react";

export function OrderFilters({
  initialQuery,
  initialStatus,
  initialFromDate,
  initialToDate
}: {
  initialQuery?: string;
  initialStatus?: string;
  initialFromDate?: string;
  initialToDate?: string;
}) {
  const {actions,filters,} =useOrderFilters({query:initialQuery,fromDate:initialFromDate,status:initialStatus,toDate:initialToDate})
 
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <input
        type="text"
        placeholder="Search by product or customer"
        value={filters.query}
        onChange={actions.setQuery}
        className="p-2 border rounded w-64"
      />

      <select
        value={filters.status}
        onChange={actions.setStatus}
        className="p-2 border rounded"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
      </select>

        <input
        type="date"
        value={filters.fromDate}
        onChange={ actions.setFromDate}
        className="p-2 border rounded"
      />

      <input
        type="date"
        value={filters.toDate}
        onChange={ actions.setToDate}
        className="p-2 border rounded"
      />

      <button
        type="button"
        onClick={()=>actions.submitFilters('/dashboard/order')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  );
}

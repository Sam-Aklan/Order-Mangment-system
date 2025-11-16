"use client";


import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters";

interface DashboardFiltersProps {
  initialFrom?: string;
  initialTo?: string;
  initialGranularity?: "day" | "week" | "month";
  initialStatus?: "PENDING" | "SHIPPED" | "DELIVERED";
  initialCategory?: string;
}

export default function DashboardFilters({
  initialFrom,
  initialTo,
  initialGranularity,
  initialCategory,
  initialStatus
}: DashboardFiltersProps) {
  
  const {actions,filters} =useDashboardFilters({initialCategory,initialFrom,initialGranularity,initialStatus,initialTo})

  
  return (
    <div className="flex flex-wrap items-end gap-4 bg-white border p-4 rounded-md shadow-sm ">
      {/* From date */}
      <div className="flex flex-col">
        <label className=" text-xs md:text-sm text-gray-600">From</label>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => actions.setFrom(e.target.value)}
          className="border rounded p-2 w-48"
        />
      </div>

      {/* To date */}
      <div className="flex flex-col">
        <label className=" text-xs md:text-sm text-gray-600">To</label>
        <input
          type="date"
          value={filters.to}
          onChange={(e) => actions.setTo(e.target.value)}
          className="border rounded p-2 w-48"
        />
      </div>

      {/* Granularity */}
      <div className="flex flex-col">
        <label className=" text-xs md:text-sm text-gray-600">Granularity</label>
        <select
          value={filters.granularity}
          onChange={(e) => actions.setGranularity(e.target.value as "day" | "week" | "month")}
          className="border rounded p-2 text-xs"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      {/* Status */}
      <div className="flex flex-col">
        <label className=" text-xs md:text-sm text-gray-600">Order Status</label>
        <select
          value={filters.status}
          onChange={(e) => actions.setStatus(e.target.value as "PENDING" | "SHIPPED" | "DELIVERED" | "")}
          className="border rounded p-2 text-xs md:text-sm"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className=" text-xs md:text-sm text-gray-600">Category</label>
        <select
          value={filters.category}
          onChange={(e) => actions.setCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          <option value="ELECTRONICS">Electronics</option>
          <option value="CLOTHING">Clothing</option>
          <option value="FOOD">Food</option>
          <option value="BOOKS">Books</option>
          <option value="FURNITURE">Furniture</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={actions.handleApplyFilters}
      
        className={`px-4 py-2 rounded text-white font-medium bg-primary `}
      >
        Apply
      </button>
    </div>
  );
}

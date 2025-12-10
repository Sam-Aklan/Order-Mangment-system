"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [from, setFrom] = useState(initialFrom || "");
  const [to, setTo] = useState(initialTo || "");
  const [granularity, setGranularity] = useState(initialGranularity);
  const [category, setCategory] = useState(initialCategory || "")
  const [status, setStatus] = useState(initialStatus || "")

  const router = useRouter()

  const handleApplyFilters = async () => {
   const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    if (granularity) query.set("granularity", granularity);
    if (status) query.set("status", status);
    if (category) query.set("category", category);

    router.push(`/dashboard?${query.toString()}`);
    router.refresh()
    
  };
  return (
    <div className="flex flex-wrap items-end gap-4 bg-white border p-4 rounded-md shadow-sm ">
      {/* From date */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded p-2 w-48"
        />
      </div>

      {/* To date */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded p-2 w-48"
        />
      </div>

      {/* Granularity */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Granularity</label>
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as "day" | "week" | "month")}
          className="border rounded p-2"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      {/* Status */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Order Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "PENDING" | "SHIPPED" | "DELIVERED" | "")}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
        onClick={handleApplyFilters}
      
        className={`px-4 py-2 rounded text-white font-medium bg-primary `}
      >
        Apply
      </button>
    </div>
  );
}

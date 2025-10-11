"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardFiltersProps {
  initialFrom?: string;
  initialTo?: string;
  initialGranularity?: "day" | "week" | "month";
  onApply?: (filters: { from?: string; to?: string; granularity: "day" | "week" | "month" }) => void;
  loading?: boolean;
}

export default function DashboardFilters({
  initialFrom,
  initialTo,
  initialGranularity,
  onApply,
  loading,
}: DashboardFiltersProps) {
  const [from, setFrom] = useState(initialFrom || "");
  const [to, setTo] = useState(initialTo || "");
  const [granularity, setGranularity] = useState(initialGranularity);

  const router = useRouter()

  const handleApplyFilters = async () => {
    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    if(granularity)query.set("granularity", granularity);

    router.push(`/dashboard?${query.toString()}`);
    router.refresh()
    // setLoading(true);
    // try {
    //   const res = await fetch(`/api/dashboard/insights?${query.toString()}`);
    //   const newData = await res.json();
    //   setData(newData);
    // } finally {
    //   setLoading(false);
    // }
  };
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-end bg-white p-4 rounded-xl shadow-sm border">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">From</label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded p-2 w-44"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">To</label>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded p-2 w-44"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Granularity</label>
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as "day" | "week" | "month")}
          className="border rounded p-2 w-40"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      <button
        onClick={handleApplyFilters}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Apply Filters"}
      </button>
    </div>
  );
}

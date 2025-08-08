"use client";

import { useEffect, useRef, useState } from "react";

interface Customer {
  id: string;
  name: string;
}

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function CustomerSelect({ value, onChange }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async (reset = false) => {
    if (!hasMore && !reset) return;
    setLoading(true);
    const res = await fetch(
      `/api/customers?q=${encodeURIComponent(search)}&limit=2${
        reset ? "" : `&cursor=${pageCursor}`
      }`
    );
    const data = await res.json();

    setCustomers((prev) =>
      reset ? data.customers : [...prev, ...data.customers]
    );
    setPageCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageCursor(null);
      setHasMore(true);
      fetchCustomers(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loading || !hasMore) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      fetchCustomers();
    }
  };

  useEffect(() => {
    if (open) fetchCustomers(true);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <input type="hidden" name="customerId" value={value} />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border rounded px-3 py-2 text-left"
      >
        {customers.find((c) => c.id === value)?.name || "Select Customer"}
      </button>

      {open && (
        <div className="absolute z-10 bg-white border rounded w-full mt-2 shadow">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full px-3 py-2 border-b"
          />
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto"
          >
            {customers.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onChange(c.id);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  c.id === value ? "bg-blue-100" : ""
                }`}
              >
                {c.name}
              </div>
            ))}
            {loading && (
              <div className="p-2 text-sm text-gray-500">Loading...</div>
            )}
            {!loading && customers.length === 0 && (
              <div className="p-2 text-sm text-gray-500">No results.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

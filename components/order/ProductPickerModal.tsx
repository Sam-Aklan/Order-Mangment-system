"use client";

import { productType } from "@/lib/actions/products";
import { useEffect, useState } from "react";

interface Props {
  onAdd: (product: productType,productQuantity:number) => void;
  onClose: () => void;
}

export default function ProductPickerModal({ onAdd, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<productType[]>([]);
  const [selected, setSelected] = useState<productType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchProducts = async () => {
    const res = await fetch(
      `/api/product?q=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
    );
    const data = await res.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <div className="max-h-48 overflow-y-auto border rounded mb-4">
          {products.length === 0 && (
            <div className="p-2 text-gray-500 text-sm">No products found.</div>
          )}
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selected?.id === p.id ? "bg-blue-100" : ""
              }`}
            >
              {p.name} — ${p.price.toFixed(2)}
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {selected && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Quantity for <strong>{selected.name}</strong>
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="border px-3 py-1 rounded w-24"
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={() => {
              if (selected) onAdd(selected,quantity);
              onClose();
            }}
            className={`px-4 py-2 rounded text-white ${
              selected
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

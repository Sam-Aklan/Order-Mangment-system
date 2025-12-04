"use client";

import { useCallback, useEffect, useState } from "react";
import { productType } from "@/lib/actions/products";
import { useOrderStore } from "@/lib/store/OrderStore";
import ProductCard from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";

interface Props {
  onClose: () => void;
}

export default function ProductPickerModal({ onClose }: Props) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<productType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const { selectedItems, setProductQuantity } = useOrderStore();

  const fetchProducts = useCallback (async () => {
    try {
      const res = await fetch(
      `/api/product?q=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
    );
    
    const data = await res.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
    } catch (err:any) {
      console.log("error",err.message,"code",err.code)
    }
    
  }, [search, page])

  useEffect(() => {
    const debounceFetch = setTimeout(()=>fetchProducts(),300);
    return ()=> clearTimeout(debounceFetch)
  }, [search, page]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-sm md:text-xl font-semibold mb-4">Add Products</h2>

        {/* Search */}
        <Input
         
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full border px-3 py-2 rounded my-4 text-sm"
        />

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-70 h-70 max-h-100 md:h-75  overflow-y-scroll mb-4">
          {products.length === 0 && (
            <div className="p-2 text-gray-500 text-sm">No products found.</div>
          )}
          {products.map((p) => {
            const qty = selectedItems[p.id]?.quantity || 0;
            return (
              <ProductCard
                key={p.id}
                product={p}
                quantity={qty}
                onIncrease={() =>
                  setProductQuantity(p.id, qty + 1, p.price, p.name, p.stock,p.category,true)
                }
                onDecrease={() =>
                  setProductQuantity(p.id, qty - 1, p.price, p.name, p.stock,p.category,true)
                }
              />
            );
          })}
        </div>

        {/* Pagination */}
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

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

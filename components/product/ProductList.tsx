"use client";

import Link from "next/link";
import { productType } from "@/lib/actions/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductForm from "./ProductForm";
import Modal from "../Modal";

interface productsListProps {
  products: productType[];
  searchParams: {
    q?: string;
    page: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  };
  totalPages: number;
}

export default function ProductList({
  products,
  searchParams,
  totalPages,
}: productsListProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    
    // Preserve all existing filters
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.minPrice) params.set("minPrice", String(searchParams.minPrice));
    if (searchParams.maxPrice) params.set("maxPrice", String(searchParams.maxPrice));
    params.set("page", String(newPage));
    
    router.push(`/dashboard/products?${params.toString()}
`);
  };

  return (
    <div className="p-6 space-y-4 w-full">
      <div className="flex justify-between items-center">

      <h1 className="text-2xl font-bold">Product List</h1>
      <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>


      {isModalOpen&& (
        <Modal
        isOpen={isModalOpen}
        onClose={()=> setIsModalOpen(false)}
        title="Create New Product">

          <ProductForm 
            onClose={() => setIsModalOpen(false)} 
            searchParams={searchParams}
          />
        </Modal>
      )}

      <div className="border rounded p-4 space-y-2">
        {products.length === 0 && (
          <p className="text-gray-500">No products found.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="p-2 border rounded hover:bg-gray-50 flex justify-between">
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-600">
                {product.category} — ${product.price.toFixed(2)}
              </div>
            </div>
            <Link
              href={`/dashboard/products/${product.id}`}
              className="text-blue-600 hover:underline text-sm self-center"
            >
              View
            </Link>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => handlePageChange(searchParams.page - 1)}
          disabled={searchParams.page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-sm">
          Page {searchParams.page} of {totalPages}
        </div>
        <button
          onClick={() => handlePageChange(searchParams.page + 1)}
          disabled={searchParams.page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
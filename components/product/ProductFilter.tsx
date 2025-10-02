"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ProductFilter = ({ currentPage, searchParams }: {
  currentPage: number;
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}) => {
  const [name, setName] = useState(searchParams.q || "");
  const [category, setCategory] = useState(searchParams.category || "");
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "");
  const router = useRouter();


  const submitFilters = () => {
    const params = new URLSearchParams();
    
    if (name.trim() !== "") params.set("q", name.trim());
    if (category.trim() !== "") params.set("category", category);
    if (minPrice.trim() !== "") params.set("minPrice", minPrice);
    if (maxPrice.trim() !== "") params.set("maxPrice", maxPrice);
    
    // Always reset to page 1 when filters change
    params.set("page", "1");
    
    router.push(`/dashboard/products?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search name..."
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="ELECTRONICS">ELECTRONICS</option>
          <option value="FOOD">Food</option>
          <option value="BOOKS">Books</option>
          <option value="FURNITURE">Furniture</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          placeholder="Min price"
          type="number"
          className="border p-2 rounded"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          placeholder="Max price"
          type="number"
          className="border p-2 rounded"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <button 
        className="px-2 py-1 w-fit min-w-20 bg-blue-400"
        onClick={submitFilters}
      >
        Search
      </button>
    </div>
  );
};

export default ProductFilter;
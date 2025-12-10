"use client"

import { useProductFilters } from "@/lib/hooks/product/useProductFilters";

const ProductFilter = ({ currentPage, searchParams, basePath }: {
  currentPage: number;
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
  basePath?:string;
}) => {
  // const [name, setName] = useState(searchParams.q || "");
  // const [category, setCategory] = useState(searchParams.category || "");
  // const [minPrice, setMinPrice] = useState(searchParams.minPrice || "");
  // const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "");
  // const router = useRouter();


  // const submitFilters = () => {
  //   const params = new URLSearchParams();
    
  //   if (name.trim() !== "") params.set("q", name.trim());
  //   if (category.trim() !== "") params.set("category", category);
  //   if (minPrice.trim() !== "") params.set("minPrice", minPrice);
  //   if (maxPrice.trim() !== "") params.set("maxPrice", maxPrice);
    
  //   // Always reset to page 1 when filters change
  //   params.set("page", "1");
    
  //   router.push(`/dashboard/products?${params.toString()}`);
  // };
 const {filters,actions} = useProductFilters({basePath,initialName:searchParams.q,initialCategory:searchParams.category, initialMaxPrice:searchParams.maxPrice,initialMinPrice:searchParams.minPrice})

  return (
    <div className="flex gap-2">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search name..."
          className="border p-2 rounded"
          value={filters.name}
          onChange={actions.setName}
        />
        <select
          value={filters.category}
          onChange={actions.setCategory}
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
          value={filters.minPrice}
          onChange={actions.setMinPrice}
        />
        <input
          placeholder="Max price"
          type="number"
          className="border p-2 rounded"
          value={filters.maxPrice}
          onChange={actions.setMaxPrice}
        />
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={actions.resetFilters}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={actions.submitFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
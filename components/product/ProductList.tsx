"use client";

import { productType } from "@/lib/actions/products";
import ProductForm from "./ProductForm";
import Modal from "../Modal";
import ProductView from "./ProductView";
import ConfirmModal from "../ConfirmModal";
import Pagination from "../Pagination";
import { useProductListManagement } from "@/lib/hooks/useProductsListManagement.ts";

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

//   const router = useRouter();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<{name:string,id:string}|null>(null)

//   const handlePageChange = (newPage: number) => {
//     const params = new URLSearchParams();
    
//     // Preserve all existing filters
//     if (searchParams.q) params.set("q", searchParams.q);
//     if (searchParams.category) params.set("category", searchParams.category);
//     if (searchParams.minPrice) params.set("minPrice", String(searchParams.minPrice));
//     if (searchParams.maxPrice) params.set("maxPrice", String(searchParams.maxPrice));
//     params.set("page", String(newPage));
    
//     router.push(`/dashboard/products?${params.toString()}
// `);
//   };

//   const handlePageSizeChange = (newSize: number) => {
//     const params = new URLSearchParams();

//     // Reset to first page when changing size
//     if (searchParams.q) params.set("q", searchParams.q);
//     if (searchParams.category) params.set("category", searchParams.category);
//     if (searchParams.minPrice) params.set("minPrice", String(searchParams.minPrice));
//     if (searchParams.maxPrice) params.set("maxPrice", String(searchParams.maxPrice));

//     params.set("page", "1");
//     params.set("limit", String(newSize));

//     router.push(`/dashboard/products?${params.toString()}`);
//   };

//  const handleProductDelete = useCallback(async (id:string) => {
 
//      try {
//        const res = await fetch(`/api/product/`, {
//          method: "DELETE",
//          headers: { "Content-Type": "application/json" },
//          body:JSON.stringify({productId:id})
//        });
//        const data = await res.json();
 
//        if (!res.ok) throw new Error(data.error || "Failed to delete product");
 
//        router.refresh();
//      } catch (err) {
//        console.error("Delete failed:", err);
//        alert("Failed to delete product.");
//      }
//    },[]) 

const {actions,currentPage,isDeleting,isModalOpen,pageSize,productToDelete} =useProductListManagement({searchParams})

  return (
    <div className="p-6 space-y-4 w-full">
      <div className="flex justify-between items-center">

      <h1 className="text-2xl font-bold">Product List</h1>
      <button
          onClick={() => actions.openModal()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>


      {isModalOpen&& (
        <Modal
        isOpen={isModalOpen}
        onClose={()=> actions.closeModal()}
        title="Create New Product">

          <ProductForm 
            onClose={() => actions.openModal()} 
            // searchParams={searchParams}
          />
        </Modal>
      )}

      <div className="border rounded p-4 space-y-2">
        {products.length === 0 && (
          <p className="text-gray-500">No products found.</p>
        )}
        {products.map((product) => (
         <ProductView key={product.id} product={product} setToDelete={actions.setProductToDelete}/>
        ))}
      </div>

      
       {/* Pagination */}
      <Pagination
        currentPage={searchParams.page}
        totalPages={totalPages}
        pageSize={searchParams.limit || 5}
        onPageChange={actions.handlePageChange}
        onPageSizeChange={actions.handlePageSizeChange}
      />
      <ConfirmModal
      isOpen={!!productToDelete}
      onCancel={()=>actions.setProductToDelete(null)}
      onConfirm={()=>productToDelete && actions.handleProductDelete(productToDelete.id)}
      title="Product Deletion Warring"
      message={`You are about deleting ${productToDelete?.name}`}
      />
    </div>
  );
}
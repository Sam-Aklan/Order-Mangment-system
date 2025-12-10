"use client";

import { productType } from "@/lib/actions/products";
import ProductForm from "./ProductForm";
import Modal from "../Modal";
import ProductView from "./ProductView";
import ConfirmModal from "../ConfirmModal";
import Pagination from "../Pagination";
import { useProductListManagement } from "@/lib/hooks/product/useProductsListManagement.ts";
import { Button } from "../ui/button";

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



const {actions,isModalOpen,productToDelete} =useProductListManagement({searchParams})

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">

      <h1 className="text-sm md:tex-lg lg:text-2xl font-bold">Product List</h1>
      <Button
          onClick={() => actions.openModal()}
          className="px-2 py-1 w-fit text-xs"
        >
          Add Product
        </Button>
      </div>


      {isModalOpen&& (
        <Modal
        isOpen={isModalOpen}
        onClose={()=> actions.closeModal()}
        title="Create New Product">

          <ProductForm onClose={actions.closeModal}/>
        </Modal>
      )}

      <div className="border rounded w-full p-2 space-y-2">
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
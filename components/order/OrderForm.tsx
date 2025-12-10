"use client"
import { customerType } from "@/lib/actions/customers";
import { productType } from "@/lib/actions/products";
import Modal from "../Modal";
import { useOrderForm } from "@/lib/hooks/order/useOrderForm";
import Pagination from "../Pagination";
import ProductCard from "@/components/product/ProductCard";
import CustomerSelect from "./CustomerSelect";
import { Button } from "../ui/button";

type createOrderType = {
    products: productType[],
    customers: customerType[],
    page:number,
    totalPages:number,
    searchParams: {
      q?: string;
      category?: string;
      minPrice?: string;
      maxPrice?: string;
      limit?:number;
    };
}

function ClientOrderForm({ products, customers,searchParams,page,totalPages}: createOrderType) {
  
  const {selectedItems,previewOpen,error,isPending,isEmpty,total,actions} = useOrderForm({products,customers,searchParams,page,totalPages})

  const {handleSubmission,setPreviewOpen,handlePageChange,handleQuantityChange,setCustomer,clearOrder,handlePageSizeChange, removeProduct } = actions
    return (
      <>
      <div className="space-y-4 max-w-6xl mx-auto mt-10 px-4 md:px-0">

        <CustomerSelect onChange={setCustomer} />
  
        {/* <div>
          <label className="block font-medium mb-1">Customer</label>
          <select name="customerId" className="w-full border rounded p-2"
          onChange={(e)=>setCustomer(e.target.value)}>
            <option value="">Select customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div> */}
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => {
          const qty = selectedItems[product.id]?.quantity || 0;

          return (
          
            <ProductCard product={product} 
            onDecrease={() => handleQuantityChange(product.id,qty-1,product.stock,product.price,product.name,product.category)}
            onIncrease={()=>handleQuantityChange(product.id,qty+1,product.stock,product.price,product.name,product.category)}
            onRemove={()=>removeProduct(product.id)}
            quantity={qty}
            disableStockCheck={qty > product.stock} 
            key={product.id}/>
          );
        })}
      </div>

      {/* Footer: total + buttons */}
      <div className="flex justify-between items-center pt-4 border-t gap-4">
        <span className="text-lg font-semibold">
          Total: ${total.toFixed(2)}
        </span>

        <div className="flex gap-2">
          <Button
            variant={`secondary`}
            onClick={()=>clearOrder()}
            disabled={isEmpty}
            className="w-fit p-2"
          >
            Clear Order
          </Button>

          <Button
            onClick={() => setPreviewOpen(true)}
            disabled={isEmpty}
            className="w-fit p-2"
          >
            Preview & Submit
          </Button>
        </div>
      </div>

{/* Modal: Preview Order */}
<Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Order Preview"
      >
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          {
            Object.entries(selectedItems).map(([id,{quantity,itemName,price}])=>    <div key={id} className="flex justify-between text-sm">
            <span>
              {itemName} × {quantity}
            </span>
            <span>${(price * quantity).toFixed(2)}</span>
          </div>)
         
          }
        </div>

        <div className="mt-4 border-t pt-2 flex justify-between items-center text-sm">
          <strong>Total:</strong>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => setPreviewOpen(false)}
              className="px-3 py-1 w-fit"
              variant={`outline`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmission}
              disabled={isPending}
              className="px-3 py-1 w-fit disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Confirm Order"}
            </Button>
          </div>
      </Modal>
      </div>
      <div className="my-8">

      <Pagination
      currentPage={page}
      onPageChange={handlePageChange}
      totalPages={totalPages}
      onPageSizeChange={handlePageSizeChange}
      pageSize={searchParams.limit || 5}
      />
      </div>
      </>

      
    );
  }

  export default ClientOrderForm
"use client"
import { customerType } from "@/lib/actions/customers";
import { createOrder } from "@/lib/actions/orders";
import { productType } from "@/lib/actions/products";
import { useMemo, useState, useTransition } from "react";
import Modal from "../Modal";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/lib/store/OrderStore";

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
    };
}

function ClientOrderForm({ products, customers,searchParams,page,totalPages}: createOrderType) {
  const router = useRouter();useState<Record<string, number>>({});

  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    selectedItems,
    setProductQuantity,
    removeProduct,
    clearOrder,
    setCustomer,
    totalPrice,
  getOrderPayload
  }=useOrderStore()

  const handleQuantityChange = (productId: string, quantity: number, stock: number, price: number,name:string) => {
    if (quantity > stock) quantity = stock;
    if (quantity < 1) {
      removeProduct(productId)
      return
    }

    setProductQuantity(productId, quantity, price,name);
  };

  const total = useMemo(() => {
    return Object.entries(selectedItems).reduce((sum, [id,{quantity,price,}]) => {
      
      return  sum + price * quantity ;
    }, 0);
  }, [selectedItems, products]);

  const isEmpty = Object.keys(selectedItems).length === 0;



  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();

    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
    params.set("page", String(newPage));

    router.push(`/dashboard/order/new?${params.toString()}`);
  };
  
  const handleSubmission = ()=>{
    const {customerId,products,total}=getOrderPayload()
    startTransition(async () => {
      await createOrder({
        customerId:customerId,
        products: products,
        total,
      });
      clearOrder();
    });
  }
    return (
      <>
      <form action={createOrder} className="space-y-4 max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold">Create Order</h2>
  
        <div>
          <label className="block font-medium mb-1">Customer</label>
          <select name="customerId" className="w-full border rounded p-2"
          onChange={(e)=>setCustomer(e.target.value,e.target.name)}>
            <option value="">Select customer...</option>
            {customers.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => {
          const qty = selectedItems[product.id]?.quantity || 0;

          return (
            <div
              key={product.id}
              className="border rounded p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  ${product.price.toFixed(2)} — {product.stock} in stock
                </p>
                <p className="text-sm text-gray-600">
                  {product.category}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id,qty - 1,product.stock,product.price,product.name)}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                  disabled={qty === 0}
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, qty + 1, product.stock, product.price,product.name)}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                  disabled={qty >= product.stock}
                >
                  +
                </button>
              </div>

              {/* Hidden inputs for form submission */}
              {qty > 0 && (
                <>
                  <input type="hidden" name="productIds" value={product.id} />
                  <input type="hidden" name="quantities" value={qty} />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: total + buttons */}
      <div className="flex justify-between items-center pt-4 border-t gap-4">
        <span className="text-lg font-semibold">
          Total: ${total.toFixed(2)}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={()=>clearOrder()}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            disabled={isEmpty}
          >
            Clear Order
          </button>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={isEmpty}
          >
            Preview & Submit
          </button>
        </div>
      </div>

{/* Modal: Preview Order */}
<Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Order Preview"
      >
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
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

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Order
        </button>
      </Modal>
      </form>
      <div className="flex justify-between pt-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-sm">
          Page {page} of {totalPages}
        </div>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      </>

      
    );
  }

  export default ClientOrderForm
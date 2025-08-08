"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { productType } from "@/lib/actions/products";
import { customerType } from "@/lib/actions/customers";
import { orderType, statusType, updateOrder } from "@/lib/actions/orders";
import ProductPickerModal from "./ProductPickerModal";
import CustomerSelect from "./CustomerSelect";

interface Props {
  order: orderType,
  customers: customerType[];
  products: productType[];
}

export default function EditOrderForm({ order, customers, products }: Props) {
  const router = useRouter();

  const [customerId, setCustomerId] = useState(order.customer.id);
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState(
    products.map((p) => {
      const existing = order.items.find((i) => i.product.id=== p.id);
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: existing?.quantity || 0,
        isNew: false,
      };
    })
  );

  const [showModal, setShowModal] = useState(false);


  const addProduct = (product:productType,productQuantity:number)=>{
    setItems((prev)=>{
     const existing = prev.find(prd=>prd.productId ===product.id)
     if(existing)return [...prev]
    
      return [...prev,{quantity:productQuantity,isNew:true,productId:product.id,name:product.name,price:product.price}]
    }
    )
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: 0 } : item
      )
    );
  };

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);


  const handleSubmit = async (formData: FormData) => {
    const result = await updateOrder(formData);

    if (result.success) {
      router.push("/dashboard/order");
    } else {
      alert("Failed to update order");
    }
  };
  
  // useEffect(()=>{
  //   console.log("items")
  //   console.table(items)
  // },[items])

  return (
    <>
    
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="orderId" value={order.id} />

<CustomerSelect value={customerId} onChange={setCustomerId}/>
      {/* <div>
        <label className="block font-medium mb-1">Customer</label>
        <select
          name="customerId"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div> */}

      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as statusType )}
          className="w-full border rounded px-3 py-2"
        >
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

    {/* Current Order Items */}
    <div>
        <label className="block font-medium mb-2">Products in Order</label>
        <div className="space-y-3">
          {items.map((item) =>
            item.quantity === 0 ? null : (
              <div key={item.productId} className="flex items-center gap-4">
                <input
                  type="hidden"
                  name={`quantity-${item.productId}`}
                  value={item.quantity}
                />
                <span className="w-40">{item.name}</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, parseInt(e.target.value))
                  }
                  className="w-20 px-2 py-1 border rounded"
                />
                <span className="text-sm text-gray-500">${item.price.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Add Product Trigger */}
      <div>
        <button
          type="button"
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          onClick={() => setShowModal(true)}
        >
          + Add Product
        </button>
      </div>

      {/* Total */}
      <div className="text-right pt-4 font-semibold text-lg">
        Total: ${total.toFixed(2)}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Order
      </button>
    </form>
    {showModal && (
  <ProductPickerModal
    onAdd={addProduct}
    onClose={() => setShowModal(false)}
  />
)}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { productType } from "@/lib/actions/products";
import { customerType } from "@/lib/actions/customers";
import { orderType, statusType, updateOrder } from "@/lib/actions/orders";
import ProductPickerModal from "./ProductPickerModal";
import CustomerSelect from "./CustomerSelect";
import ProductCard from "../product/ProductCard";
import { useOrderStore } from "@/lib/store/OrderStore";
import { useEditOrderForm } from "@/lib/hooks/order/useEditOrderForm";

interface Props {
  order: orderType,
  customers: customerType[];
  products: productType[];
}

export default function EditOrderForm({ order }: Props) {
  // const router = useRouter();

  // const [customerId, setCustomerId] = useState(order.customer.id);
  // const [status, setStatus] = useState(order.status);

  // const [items, setItems] = useState(
  //   products.map((p) => {
  //     const existing = order.items.find((i) => i.product.id=== p.id);
  //     return {
  //       productId: p.id,
  //       name: p.name,
  //       price: p.price,
  //       quantity: existing?.quantity || 0,
  //       isNew: false,
  //       stock:p.stock,
  //       category:p.category
  //     };
  //   })
  // );


  // const {
  //   selectedItems,
  //   setProductQuantity,
  //   removeProduct,
  //   totalPrice,
  //   setCustomer,
  //   initializeOrder,
  //   getOrderPayload,
  // } = useOrderStore();

  // // Load initial order into store
  // useEffect(() => {
  //   initializeOrder(
  //     order.customer.id,
  //     order.items.map((item) => ({
  //       id: item.product.id,
  //       itemName: item.product.name,
  //       price: item.product.price,
  //       quantity: item.quantity,
  //       category:item.product.category,
  //       stock:item.product.stock,
  //       isNew: false,
  //     }))
  //   );
  // }, []);
  
 
  // const [showModal, setShowModal] = useState(false);


  // const addProducts = (newProducts: { product: productType; quantity: number }[]) => {
  //   setItems((prev) => {
  //     const map = new Map(prev.map((i) => [i.productId, { ...i }]));
  
  //     newProducts.forEach(({ product, quantity }) => {
  //       if (map.has(product.id)) {
  //         // Create new object instead of mutating
  //         const existing = map.get(product.id)!;
  //         map.set(product.id, {
  //           ...existing,
  //           quantity: existing.quantity + quantity,
  //         });
  //       } else {
  //         map.set(product.id, {
  //           productId: product.id,
  //           name: product.name,
  //           price: product.price,
  //           quantity,
  //           isNew: true,
  //           stock: product.stock,
  //           category:product.category
  //         });
  //       }
  //     });
  
  //     return Array.from(map.values());
  //   });
  // };
  
  // useEffect(()=>{
  //   console.log("items", items)
  // },[])

  // const updateQuantity = (productId: string, quantity: number) => {
  //   setItems((prev) =>
  //     prev.flatMap((item) => {
  //       if (item.productId !== productId) return [item];
  
  //       // If it's a new product and quantity goes to 0 → remove from state
  //       if (item.isNew && quantity <= 0) {
  //         return [];
  //       }
  
  //       // Otherwise just update its quantity
  //       return [{ ...item, quantity }];
  //     })
  //   );
  // };
  
  // const removeItem = (productId: string) => {
  //   setItems((prev) =>
  //     prev.flatMap((item) => {
  //       if (item.productId !== productId) return [item];
  
  //       // If it was newly added, remove it entirely
  //       if (item.isNew) {
  //         return [];
  //       }
  
  //       // Otherwise set quantity to 0 (keeps in DB for delete logic)
  //       return [{ ...item, quantity: 0 }];
  //     })
  //   );
  // };

  // const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);


//  const handleSubmit = async (formData: FormData) => {
//     const payload = getOrderPayload();

//     const result = await updateOrder({
//       orderId: order.id,
//       customerId: payload.customerId!,
//       status,
//       items: payload.products.map(p=>({productId:p.id,quantity:p.quantity})),
//     });

//     if (result.success) {
//       router.push("/dashboard/order");
//     } else {
//       alert("Failed to update order");
//     }
//   };

const {actions,isSubmitting,selectedItems,showModal,status,total} = useEditOrderForm({order})
const {removeProduct,handleSubmit,getOrderPayload,setStatus,setShowModal,setCustomer,setProductQuantity} = actions

console.log("order details", getOrderPayload())
  return (
    <>
    
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="orderId" value={order.id} />

<CustomerSelect prevousiCustomer={order.customer} onChange={setCustomer}/>
     
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
          {Object.values(selectedItems).map((item) =>
            item.quantity === 0 ? null : (
              <div key={item.id} className="flex items-center gap-4">
              
                <ProductCard
        key={item.id}
        product={{ id: item.id, name: item.itemName, price: item.price, stock: item.stock, category: item.category,imageUrl:item.imageUrl }} // adapt as needed
        quantity={item.quantity}
                  onIncrease={() =>
                    setProductQuantity(
                      item.id,
                      item.quantity + 1,
                      item.price,
                      item.itemName,
                      item.stock,
                      item.category,
                      item.isNew
                    )
                  }
                  onDecrease={() =>
                    setProductQuantity(
                      item.id,
                      item.quantity - 1,
                      item.price,
                      item.itemName,
                      item.stock,
                      item.category,
                      item.isNew
                    )
                  }
                  onRemove={() => removeProduct(item.id)}
        disableStockCheck
      />
                {/* <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button> */}
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
        Total: ${total}
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
    onClose={() => setShowModal(false)}
  />
)}
    </>
  );
}

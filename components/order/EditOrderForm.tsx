"use client";

import { productType } from "@/lib/actions/products";
import { customerType } from "@/lib/actions/customers";
import { orderType, statusType, updateOrder } from "@/lib/actions/orders";
import ProductPickerModal from "./ProductPickerModal";
import CustomerSelect from "./CustomerSelect";
import ProductCard from "../product/ProductCard";;
import { useEditOrderForm } from "@/lib/hooks/order/useEditOrderForm";
import { Button } from "@/components/ui/button";
import PendingStatus from "./PendingStatus";

interface Props {
  order: orderType,
  customers: customerType[];
  products: productType[];
}

export default function EditOrderForm({ order }: Props) {
 

const {actions,isSubmitting,selectedItems,showModal,status,total} = useEditOrderForm({order})
const {removeProduct,handleSubmit,getOrderPayload,setStatus,setShowModal,setCustomer,setProductQuantity} = actions

console.log("order details", getOrderPayload())
  return (
    <>
    
    <form action={handleSubmit} className="space-y-6 px-2 md:px-0">
      <input type="hidden" name="orderId" value={order.id} />

<CustomerSelect previousCustomer={order.customer} onChange={setCustomer}/>
     
     
      <PendingStatus status={status} setStatus={setStatus}/>

    <div>
        <label className="block font-medium mb-2">Products in Order</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-2 md:gap-4">
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
              </div>
            )
          )}
        </div>
      </div>

     
      <div>
        <Button
          type="button"
          className="w-fit px-2 py-1"
          onClick={() => setShowModal(true)}
          variant={`outline`}
        >
          + Add Product
        </Button>
      </div>

      {/* Total */}
      <div className="text-right pt-4 font-semibold text-lg">
        Total: ${total}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className=" w-fit px-4 py-2 mb-4"
      >
        Save Order
      </Button>
    </form>
    {showModal && (
  <ProductPickerModal
    onClose={() => setShowModal(false)}
  />
)}
    </>
  );
}

"use client"
import { customerType } from "@/lib/actions/customers";
import { createOrder } from "@/lib/actions/orders";
import { productType } from "@/lib/actions/products";
import { useState } from "react";

type createOrderType = {
    products: productType[],
    customers: customerType[]
}

function ClientOrderForm({ products, customers}: createOrderType) {
    const [productRows, setProductRows] = useState([{ productId: "", quantity: 1 }]);
  
    const addProductRow = () => {
      setProductRows([...productRows, { productId: "", quantity: 1 }]);
    };
  
    const updateRow = (index: number, key: "productId"|"quantity", value: string | number) => {
      const updated = [...productRows];
      if(typeof value === "number") {
        updated[index]["quantity"] = value
    }else updated[index]["productId"] = value
      setProductRows(updated);
    };
  
    return (
      <form action={createOrder} className="space-y-4 max-w-xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold">Create Order</h2>
  
        <div>
          <label className="block font-medium mb-1">Customer</label>
          <select name="customerId" className="w-full border rounded p-2">
            {customers.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>
  
        <div className="space-y-4">
          {productRows.map((row, index) => (
            <div key={index} className="flex items-center gap-4">
              <select
                name="productIds"
                className="border p-2 rounded flex-1"
                required
                onChange={(e) => updateRow(index, "productId", e.target.value)}
              >
                <option value="">Select product</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
  
              <input
                type="number"
                name="quantities"
                min={1}
                className="border p-2 w-24 rounded"
                value={row.quantity}
                onChange={(e) => updateRow(index, "quantity", e.target.valueAsNumber)}
              />
            </div>
          ))}
        </div>
  
        <button
          type="button"
          onClick={addProductRow}
          className="text-blue-600 hover:underline text-sm"
        >
          + Add Product
        </button>
  
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Order
        </button>
      </form>
    );
  }

  export default ClientOrderForm
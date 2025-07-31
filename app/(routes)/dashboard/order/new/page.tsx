
import ClientOrderForm from "@/components/order/OrderForm";
import { getCustomers } from "@/lib/actions/customers";
import { getProducts } from "@/lib/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "create new order",
    description: "full stack order mangment app",
  };


export default async function CreateOrder() {
 const products = await getProducts()
 const customers = await getCustomers()

    return (
      <ClientOrderForm products={products} customers={customers}/>
    )
}
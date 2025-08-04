// app/orders/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditOrderForm from "@/components/order/EditOrderForm";
import { getOrder } from "@/lib/actions/orders";
import { getCustomers } from "@/lib/actions/customers";
import { getProducts, productType } from "@/lib/actions/products";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params
   const order = await getOrder(id)

  if (!order) return notFound();

  const customers = await getCustomers()
  const products:productType[] = order.items.map(item=>item.product)

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Order</h1>
      <EditOrderForm
        order={order}
        customers={customers}
        products={products}
      />
    </div>
  );
}

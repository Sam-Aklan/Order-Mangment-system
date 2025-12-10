import { notFound } from "next/navigation";
import EditOrderForm from "@/components/order/EditOrderForm";
import { getOrder } from "@/lib/actions/orders";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params
   const order = await getOrder(id)

  if (!order) return notFound();

  
  return (
    <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Order</h1>
      <EditOrderForm
        order={order}
      />
    </div>
  );
}

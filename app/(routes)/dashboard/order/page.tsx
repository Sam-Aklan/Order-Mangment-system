import { OrderFilters } from "@/components/order/OrderFilters";
import { OrdersList } from "@/components/order/OrderList";
import { getOrders } from "@/lib/actions/orders";
import { auth } from "@/lib/auth";

import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Orders List",
    description: "full stack order mangment app",
  };

  interface OrdersPageProps {
    searchParams:Promise <{
      q?: string;
      status?: string;
      toDate?:string;
      fromDate?:string;
    }>;
  }

export default async function OrdersPage({searchParams}:OrdersPageProps) {
 const session= await auth.api.getSession({headers:await headers()})
if(!session?.user) {
  await auth.api.signOut({headers:await headers()})
  return redirect('/sign-in');
}

const {q,status,fromDate,toDate} = await searchParams

const {orders,} = await getOrders("ADMIN", session?.user.id,1,3,status as "PENDING"|"DELIVERED"|"SHIPPED"|undefined,q,fromDate,toDate)
 return (
  <div className="max-w-4xl mx-auto mt-10">
    <OrderFilters initialQuery={q ||""} initialStatus={status||""} initialFromDate={fromDate || ""} initialToDate={toDate || ""}/>
    <div className="flex justify-between">
    <h1 className="text-2xl font-bold mb-6">Orders</h1>
  <Link href={'/dashboard/order/new'} className="w-fit h-fit px-4 py-2 text-white bg-black rounded-2xl transition-transform duration-200 hover:scale-95" type="button">
  place order
  </Link>
    </div>
      <OrdersList initialOrders={orders} searchParams={{q,status,fromDate,toDate}} userRole={session.user.role as "admin"|"user"}/>
    
    </div>
);
}
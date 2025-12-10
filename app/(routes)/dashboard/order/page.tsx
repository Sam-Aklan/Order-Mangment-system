
import { OrdersList } from "@/components/order/OrderList";
import OrderFilters from "@/components/order/OrderFilters";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/actions/orders";
import { auth } from "@/lib/auth";
import { PlusIcon } from "lucide-react";

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

const {orders,} = await getOrders(session?.user.role ||'user', session?.user.id,1,3,status as "PENDING"|"DELIVERED"|"SHIPPED"|undefined,q,fromDate,toDate)
 return (
  <div className="max-w-7xl mx-auto mt-10 p-2 md:p-4 relative">
    <div className=" flex justify-between md:hidden">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
       <OrderFilters initialQuery={q ||""} initialStatus={status as "PENDING"| "SHIPPED"| "DELIVERED"|undefined} initialFromDate={fromDate || ""} initialToDate={toDate || ""}/>

    </div>
    <div className="hidden md:block">

    <OrderFilters initialQuery={q ||""} initialStatus={status as "PENDING"| "SHIPPED"| "DELIVERED"|undefined} initialFromDate={fromDate || ""} initialToDate={toDate || ""}/>
    </div>

    <div className="flex justify-between">
    <h1 className="text-2xl font-bold mb-6 hidden md:block">Orders</h1>

  <Link href={'/dashboard/order/new'} className="hidden md:block">
  <Button variant={`default`} >
    place order
  </Button>
  </Link>

    </div>

    <Link href={'/dashboard/order/new'} className="block md:hidden fixed bottom-2 right-2">
  <Button variant={`default`} size={`icon`} className="rounded-full" >
   <PlusIcon/>
  </Button>
  </Link>
      <OrdersList initialOrders={orders} searchParams={{q,status,fromDate,toDate}} userRole={session.user.role as "admin"|"user"}/>
    
    </div>
);
}
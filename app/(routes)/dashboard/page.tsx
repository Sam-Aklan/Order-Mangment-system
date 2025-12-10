
import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import { InsightResponse } from "@/lib/actions/dashboard";
import { statusType } from "@/lib/actions/orders";
import { categoryType } from "@/lib/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "dashboard",
    description: "KPIS, charts, statistics, and inshights",
  };

  interface DashboardPageProps {
    searchParams:Promise<{
      from?: string;
       to?: string;
      granularity?: "day" | "week" | "month",
      status?: statusType;
    category?: categoryType;
    }>
  }

export default async function DashboardPage({searchParams}:DashboardPageProps){
  const params = await searchParams

  const {from,granularity,to,category,status} =  params

  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  if (granularity) query.set("granularity", granularity);
  if(status) query.set("status",status)
  if(category) query.set("category",category)

   const res = await fetch(`${process.env.NODE_ENV ==="development" ?"http://localhost:3000":process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/insights?${query.toString()}`, {
      next: { revalidate: 600,tags:[`insights${from?`_from:${from}`:undefined}${to?`_to:${to}`:undefined}${granularity?`_granularity:${granularity}`:undefined}`], // ISR: Regenerate every 10mins
    },
    });
    if (!res.ok) throw new Error("Failed to load dashboard insights");
   
    const data: InsightResponse = await res.json()
    console.warn("data")
    console.table(data.kpis)

    console.log("query parameters", from,to,granularity)
   
    return (
        <main className="w-full  flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DashboardFilters initialFrom={from} initialTo={to} initialGranularity={granularity}/>
        <DashboardClient initailData={data} />
      </main>
      );
}
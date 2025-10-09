
import DashboardClient from "@/components/dashboard/DashboardClient";
import { InsightResponse } from "@/lib/actions/dashboard";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: "dashboard",
    description: "KPIS, charts, statistics, and inshights",
  };

export default async function DashboardPage(){

   const res = await fetch(`${process.env.NODE_ENV ==="development" ?"http://localhost:3000":process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/insights`, {
      next: { revalidate: 600,tags:["insights"]}, // ISR: Regenerate every 10mins
    });
    if (!res.ok) throw new Error("Failed to load dashboard insights");
   
    const data: InsightResponse = await res.json()
   
    return (
        <main className="w-full  flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DashboardClient data={data}/>
      </main>
      );
}
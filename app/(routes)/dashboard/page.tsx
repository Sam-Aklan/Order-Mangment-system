
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: "dashboard",
    description: "full stack order mangment app",
  };

export default async function DashboardPage(){
   
    return (
        <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
      </main>
      );
}
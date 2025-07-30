
import AdminForm from "@/components/auth/AdminForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin",
    description: "full stack order mangment app",
  };



export default function AdminPage() {
 

  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold text-black">Admin</h1>

     <AdminForm/>
    </main>
  );
}
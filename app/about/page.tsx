
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "about",
    description: "full stack order mangment app",
  };

export default async function DashboardPage(){
  // const cookie = (await (headers())).get('gg')
    return (
        <main className="max-w-md mx-auto p-6 space-y-4 text-black">
          <h1 className="text-2xl font-bold">about</h1>
  
        </main>
      );
}
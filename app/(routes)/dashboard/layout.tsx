
import { signOutAction } from "@/lib/actions/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  

  if (!session) {
    redirect("/sign-in"); 
  }


  return <>
   <main className="max-w-md  flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">

    <p className="text-black">Welcome, {session.user.name || "User"}!</p>
    <p className="text-black">Email: {session.user.email}</p>
    {/* <SignOutBtn/> */}
    <form action={signOutAction}>

    <button
    className="w-full bg-white text-black font-medium rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-200">
      Sign out
    </button>
    </form>
        
   </main>
  {children}
  </>;
}


import Navbar from "@/components/Navbar";
import { signOutAction } from "@/lib/actions/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// import '@/app/globals.css'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  

  if (!session) {
    redirect("/sign-in"); 
  }

const {email,name} = session.user
  return <>
   <Navbar userEmail={email} userName={name}>

  {children}
   </Navbar>
  </>;
}

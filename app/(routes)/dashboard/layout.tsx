
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { signOutAction } from "@/lib/actions/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";
// import '@/app/globals.css'

type userType = {
  email:string,
  name:string
}|undefined

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user:userType =undefined
  try {
    const session = await auth.api.getSession({
    headers: await headers()
  });

    if(!session) {
    redirect("/sign-in"); 
  }

  user = {name:session.user.name,email:session.user.email}

  } catch (error) {
    throw new Error("not athurized")
  }
  
  
  if(user !==undefined){
    return <>
    <Navbar userEmail={user.email} userName={user.name}>

   </Navbar>
   <div className=" w-full">

  {children}
   </div>
   <Footer/>
    </>
  }else return <p>not authorized</p>
}

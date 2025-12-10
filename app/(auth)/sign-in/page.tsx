import { LoginForm } from "@/components/auth/LoginForm";
import GeometryPattern from "@/components/layout/GeometryPattern";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "login page",
    description: "full stack order mangment app",
  };



export default async function SignInPage() {
 
  return (
    <main className="h-screen flex items-center justify-center flex-col mx-auto space-y-4 text-white w-full">
      

      {/* <SignInForm/> */}
      <GeometryPattern>

      <LoginForm className="w-full max-w-75 md:max-w-100 absolute top-1/2 left-1/2 -translate-1/2"/>
      </GeometryPattern>
      
    </main>
  );
}
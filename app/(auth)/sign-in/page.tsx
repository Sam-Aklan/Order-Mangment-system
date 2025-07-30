import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import type { Metadata } from "next";
import { headers } from "next/headers";


export const metadata: Metadata = {
    title: "sign in",
    description: "full stack order mangment app",
  };



export default function SignInPage() {
 

  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold text-black">Sign In</h1>

      <SignInForm/>
      
    </main>
  );
}
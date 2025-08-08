import SignUpForm from "@/components/auth/SignUpForm";
import type { Metadata } from "next";
import { headers } from "next/headers";


export const metadata: Metadata = {
    title: "sign up",
    description: "full stack order mangment app",
  };

export default async function SignUpPage(){
  // const cookie = (await (headers())).get('gg')
    return (
        <main className="max-w-md mx-auto p-6 space-y-4 text-black">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <SignUpForm/>
        </main>
      );
}
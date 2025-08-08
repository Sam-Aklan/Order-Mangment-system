"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { admin } from "@/lib/auth-client";
//add-next-lin

export default function AdminForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    // formData.entries().forEach(en=> console.log("0",en[0],"1",en[1]))
    console.log("name", formData.get('name'))
    console.log("email", formData.get('email'))
    console.log("password", formData.get('password'))

    const {error} = await admin.createUser({
    
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            name: formData.get("name") as string,
            role: "admin",

    });
    
    if (error) {
      setError(error.message ||"Something went wrong.");
    } 
    else {
      router.push("/dashboard");
    }
  }

  return (
   
    <>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-white text-black font-medium rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-200"
        >
          Create Admin
        </button>
      </form>
    </>
  
  );
}
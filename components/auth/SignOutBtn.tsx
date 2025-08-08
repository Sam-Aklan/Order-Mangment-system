"use client"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation";

const SignOutBtn = () => {
    const router = useRouter()
  return (
    <button
    onClick={() => signOut({
        fetchOptions:{
            onSuccess: ()=>{
                router.push("/sign-in");
            }
        }
    })}
    className="w-full bg-white text-black font-medium rounded-md px-4 py-2 transition-colors duration-300 hover:bg-gray-200"
  >
    Sign Out
  </button>
  )
}

export default SignOutBtn
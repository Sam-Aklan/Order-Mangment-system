import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const signOutAction = async()=>{
    "use server"
    await auth.api.signOut({headers: await headers()})
  }
import { NextResponse } from "next/server";
import { cloudinaryInst } from "@/lib/config";



export async function DELETE(request: Request, {params}:{params:Promise<{id:string}>}) {
  try {
   const {id}=await params
   console.log("id",id)
   await cloudinaryInst.uploader.destroy(id)
   return NextResponse.json({data:id},{status:200})
  } catch (error) {
    console.error("Failed to delete old image:", error);
    return NextResponse.json({sucess:false},{status:500})
  }
}

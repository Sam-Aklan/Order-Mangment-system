
import { createCustomer, deleteCustomer, getCustomersCursor, updateCustomer } from "@/lib/actions/customers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "2");
  const cursor = searchParams.get("cursor") || undefined; // customerId

 const customers = await getCustomersCursor(limit,cursor,q)

  const hasMore = customers.length > limit;
  if (hasMore) customers.pop();

  return NextResponse.json({
    customers,
    nextCursor: hasMore ? customers[customers.length - 1].id : null,
  });
}

export async function POST(req: Request) {
  try {
    
    const body = await req.json()
    
    await createCustomer({data:body})
    return NextResponse.json({success:true},{status:201})
  } catch (error) {
    if( error ) console.error("error",error)
    return NextResponse.json({success:false},{status:500})
  }
}

export async function PUT(req: Request) {
  try {
    
    const body = await req.json()
    
    await updateCustomer(body.id,{
      name:body.name,
      email:body.email,
      imageUrl:body.imageUrl,
      imagePublicId:body.imagePublicId,
      deleteOldImage:body.deleteOldImage,
    })
    return NextResponse.json({success:true},{status:201})
  } catch (error) {
    if( error ) console.error("error",error)
    return NextResponse.json({success:false},{status:500})
  }
}

export async function DELETE(req: Request) {
  try {
    
    const body = await req.json()
    const result = await deleteCustomer(body.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete customer" },
        { status: 400 }
      );
    }
  
    return NextResponse.json({success:true},{status:201})
  } catch (error) {
    if( error ) console.error("error",error)
    return NextResponse.json({success:false},{status:500})
  }
}

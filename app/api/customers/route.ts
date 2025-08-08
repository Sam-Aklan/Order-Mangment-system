
import { getCustomersCursor } from "@/lib/actions/customers";
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

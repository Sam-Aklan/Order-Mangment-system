import { getProductsQuery } from "@/lib/actions/products";
import { NextResponse,NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
  const search = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "2");

 const {products,count:total}= await getProductsQuery(page,limit,search)

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

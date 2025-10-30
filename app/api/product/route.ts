import { categoryType, createProduct, deleteProduct, getProductsQuery, updateProduct } from "@/lib/actions/products";
import { auth } from "@/lib/auth";
import { NextResponse,NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const lowerPrice= searchParams.get("minPrice")
    const higherPrice = searchParams.get("maxPrice")
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") as categoryType || undefined;
  const minPrice = lowerPrice ? parseFloat(lowerPrice):undefined;
  const maxPrice = higherPrice?parseFloat(higherPrice):undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");

 const {products,count:total}= await getProductsQuery(page,limit,search,minPrice,maxPrice,category)

 console.log("total pages",Math.ceil(total / limit))
  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await createProduct({...body,price:parseFloat(body.price),stock:parseInt(body.stock)});
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  try {
    const body = await request.json();
   
    const result = await updateProduct(body.id, {
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      stock: parseInt(body.stock),
      imageUrl: body.imageUrl ?? null,
      imagePublicId: body.imagePublicId ?? null,
      deleteOldImage: body.deleteOldImage ?? false,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true,},{status:201});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
) {
  const body = await req.json()

  const session =await auth.api.getSession({
    headers: req.headers
  })

  if(!session) return NextResponse.json({success:false,error:"not authorized"},{status:403})
    const {user} = session

  const result = await deleteProduct(body.productId,user.role as "admin"|"user");

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}



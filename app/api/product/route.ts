import { categoryType, createProduct, getProductsQuery, updateProduct } from "@/lib/actions/products";
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
  const limit = parseInt(searchParams.get("limit") || "2");

 const {products,count:total}= await getProductsQuery(page,limit,search,minPrice,maxPrice,category)

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
    const product = await createProduct({...body,stock:parseInt(body.stock)});
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request,{params}:{params:Promise<{id:string}>}) {
  try {
    const body = await request.json();
    const {id} = await params
    const result = await updateProduct(id, {
      name: body.name,
      price: body.price,
      category: body.category,
      stock: body.stock,
      imageUrl: body.imageUrl ?? null,
      imagePublicId: body.imagePublicId ?? null,
      deleteOldImage: body.deleteOldImage ?? false,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



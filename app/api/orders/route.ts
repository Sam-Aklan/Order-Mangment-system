import { NextResponse } from 'next/server';
import { deleteOrder, getOrders } from '@/lib/actions/orders';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || undefined;
  const status = searchParams.get('status') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const fromDate = searchParams.get("fromDate") || undefined
  const toDate =searchParams.get("toDate") || undefined
  const limit = parseInt(searchParams.get("offset") || '3')
  
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pagin = await getOrders(
      "ADMIN",
      session.user.id,
      page,
      limit,
      status as "PENDING" | "DELIVERED" | "SHIPPED" | undefined,
      q,
      fromDate,
      toDate
    );
    const {orders,count:totalCount} = pagin
    
    return NextResponse.json({orders,pagination:{
        currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page < Math.ceil(totalCount / limit)
    }});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}



export async function DELETE(request: Request) {
  try {

     const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
   const {orderId}=await request.json()
    const {user} = session

    const result = await deleteOrder(orderId, user.id, user.role as "admin"|"user");

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API order DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

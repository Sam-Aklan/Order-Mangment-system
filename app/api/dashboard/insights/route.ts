import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { statusType } from "@/lib/actions/orders";
import { getInsights } from "@/lib/actions/dashboard";



export async function GET(request: Request) {
  const url = new URL(request.url);

  const from = url.searchParams.get("from") || undefined;
  const to = url.searchParams.get("to") || undefined;
  const granularity = url.searchParams.get("granularity") as "day"|"week"|"month" || "day";
  const status = url.searchParams.get("status") as statusType || undefined;
  const category = url.searchParams.get("category") || undefined;

  try {
    
      const {averageOrderValue,lowStockProducts,newCustomers,totalOrders,totalCustomers,totalRevenue,byStatus,lowStockProductsList,recentOrders,timeseries,topCustomers,topProducts,topProductsByCategory} =await getInsights(granularity,from,to,status,category)

       return NextResponse.json({
      kpis:{
        totalOrders,
        averageOrderValue,
        lowStockProducts,
        newCustomers,
        totalCustomers,
        totalRevenue
      },
      byStatus,
      timeseries,
      topProducts,
      topProductsByCategory,
      topCustomers,
      lowStockProductsList,
      recentOrders
    },{status:200});
  } catch (error:any) {
    console.log("error message",error.message)
    return NextResponse.json({ error: error.message }, { status: 400 });
  }


  
}

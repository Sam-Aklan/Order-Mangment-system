"use server";

import prisma from "@/lib/prisma";
import { statusType } from "../orders";
import { categoryType } from "../products";

function parseRange(from?: string, to?: string) {
  const start = from ? new Date(from) : undefined;
  const end = to ? new Date(to) : undefined;
  if (end) end.setHours(23, 59, 59, 999);
  return { start, end };
}

export const getInsights = async (
  granularity: "day" | "week" | "month" = "day",
  from?: string,
  to?: string,
  status?: statusType,
  category?: categoryType
) => {
  const { start, end } = parseRange(from, to);

  // ------------------------------
  // KPI: total orders
  // ------------------------------

 const orderWhere = {
  ...(status ? { status: status } : {}),
  ...(start || end
    ? {
        createdAt: { ...(start && { gte: start }), ...(end && { lte: end }) },
      }
    : {}),
  ...(category ? { items: { some: { product: { category: category } } } } : {}),
};


  const totalOrders = await prisma.order.count({ where: orderWhere });

  // ------------------------------
  // KPI: customers
  // ------------------------------
  const totalCustomers = await prisma.customer.count();
  const newCustomers = await prisma.customer.count({
    where: {
      ...(start && { createdAt: { gte: start } }),
      ...(end && { createdAt: { lte: end } }),
    },
  });

  // ------------------------------
  // Orders with items + product (for revenue, top products, timeseries)
  // ------------------------------
  const orders = await prisma.order.findMany({
    where: orderWhere ,
    include: {
      customer: true,
      items: { include: { product: true, } },
    },
    orderBy: { createdAt: "asc" },
  });

  let totalRevenue = 0;
  const orderTotals: { id: string; createdAt: Date; total: number }[] = [];

  for (const o of orders) {
    const orderTotal = o.items.reduce(
      (s, it) => s + it.quantity * (it.product.price ?? 0),
      0
    );
    totalRevenue += orderTotal;
    orderTotals.push({ id: o.id, createdAt: o.createdAt, total: orderTotal });
  }

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lt: 5 } },
    orderBy: { stock: "asc" },
    take: 10,
  });

  // ------------------------------
  // Orders by status
  // ------------------------------
  const byStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
    where: orderWhere,
  });

  // ------------------------------
  // Top products (by quantity)
  // ------------------------------
  const productMap = new Map<
    string,
    { id: string; name: string; qty: number; revenue: number, category:categoryType }
  >();
  for (const o of orders) {
    for (const it of o.items) {
      const key = it.product.id;
      if (!productMap.has(key)) {
        productMap.set(key, {
          id: key,
          name: it.product.name,
          qty: 0,
          revenue: 0,
          category: it.product.category
        });
      }
      const v = productMap.get(key)!;
      v.qty += it.quantity;
      v.revenue += it.quantity * (it.product.price ?? 0);
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  const categories: categoryType[] = [
    "ELECTRONICS",
    "CLOTHING",
    "FOOD",
    "BOOKS",
    "FURNITURE",
    "OTHER",
  ];

  const allProducts = Array.from(topProducts.values())

  const topProductsByCategory: Record<
    string,
    { id: string; name: string; qty: number; revenue: number }[]
  > = {};

  for (const category of categories) {
    const inCategory = allProducts
      .filter((p) => p.category === category)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    topProductsByCategory[category] = inCategory;
  }

  // ------------------------------
  // Top customers
  // ------------------------------
  const customerMap = new Map<
    string,
    { id: string; name: string; orders: number; revenue: number }
  >();
  for (const o of orders) {
    if (!customerMap.has(o.customer.id)) {
      customerMap.set(o.customer.id, {
        id: o.customer.id,
        name: o.customer.name,
        orders: 0,
        revenue: 0,
      });
    }
    const v = customerMap.get(o.customer.id)!;
    v.orders += 1;
    const orderTotal = o.items.reduce(
      (s, it) => s + it.quantity * (it.product.price ?? 0),
      0
    );
    v.revenue += orderTotal;
  }
  const topCustomers = Array.from(customerMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // ------------------------------
  // Timeseries aggregation
  // ------------------------------
  const timeseriesMap = new Map<string, { revenue: number; orders: number }>();
  const fmt = (date: Date) => {
    if (granularity === "day") {
      return date.toISOString().slice(0, 10); // YYYY-MM-DD
    }
    if (granularity === "month") {
      return date.toISOString().slice(0, 7); // YYYY-MM
    }
    // week: ISO week number
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
  };

  for (const o of orderTotals) {
    const key = fmt(o.createdAt);
    if (!timeseriesMap.has(key)) {
      timeseriesMap.set(key, { revenue: 0, orders: 0 });
    }
    const v = timeseriesMap.get(key)!;
    v.revenue += o.total;
    v.orders += 1;
  }

  const timeseries = Array.from(timeseriesMap.entries())
    .map(([label, val]) => ({ label, ...val }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // ------------------------------
  // Recent orders
  // ------------------------------
  const recentOrders = orders
    .slice()
    .reverse()
    .slice(0, 20)
    .map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,
      customer: { id: o.customer.id, name: o.customer.name },
      total: o.items.reduce(
        (s, it) => s + it.quantity * (it.product.price ?? 0),
        0
      ),
    }));
  return {
    
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalCustomers,
      newCustomers,
      lowStockProducts: lowStockProducts.length,
    
    timeseries,
    byStatus,
    topProducts,
    topProductsByCategory,
    topCustomers,
    lowStockProductsList: lowStockProducts,
    recentOrders,
  };
};

export type InsightResponse = {
  kpis: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalCustomers: number;
    lowStockProducts: number;
    newCustomers:number
  };
  byStatus: { status: string; _count: { status: number } }[];
  timeseries: { label: string; revenue: number; orders: number }[];
  topProducts: { id: string; name: string; qty: number; revenue: number }[];
  topCustomers: { id: string; name: string; orders: number; revenue: number }[];
  topProductsByCategory: Record<
    string,
    { id: string; name: string; qty: number; revenue: number }[]
  >;
};
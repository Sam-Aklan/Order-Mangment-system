"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { categoryType } from "../products";
import {updateOrderSchema} from '@/lib/validations/orderValidation'

type CreateOrderPayload = {
  customerId: string;
  products: { id: string; quantity: number; price: number }[];
  total: number;
};

export async function createOrder(payload: CreateOrderPayload) {
  const user = await auth.api.getSession({ headers: await headers() });

  if (!payload.customerId || !payload.products.length || !user?.user) {
    throw new Error("Missing required fields.");
  }

  // Validate product stock before proceeding
  const productRecords = await prisma.product.findMany({
    where: { id: { in: payload.products.map((p) => p.id) } },
    select: { id: true, stock: true },
  });

  const stockMap = Object.fromEntries(
    productRecords.map((p) => [p.id, p.stock])
  );

  for (const item of payload.products) {
    if (item.quantity > (stockMap[item.id] ?? 0)) {
      throw new Error(`Insufficient stock for product ID ${item.id}`);
    }
  }

  // Transaction: create order + deduct stock
  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        status: "PENDING",
        customerId: payload.customerId,
        userId: user.user.id,
        items: {
          create: payload.products.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            
          })),
        },
        
      },
    });

    // Deduct stock for each product
    for (const item of payload.products) {
      await tx.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
  });

  redirect("/dashboard/order");
}

export async function getOrders(
  role:string,
  userId:string, 
  page?:number,
  limit?:number,
  status?:statusType,
  q?:string,
):Promise<{orders:ordersType,count:number}>{
  const currentPage = page?page:1
  const take = limit?limit:3

   const ordersData = await prisma.order.findMany({
   where: {...(role !=="ADMIN" && {userId:userId}),
          ...(status?{status}:{}),
        ...(q&&{
          OR:[
            {customer:{name:{contains:q,}}},
            {items:{some:{product:{name:{contains:q,}}}}}
          ]
        }),
        },
    select:{
      id:true,
      createdAt:true,
      status:true,
      customer:{select:{name:true,id:true}},
      items:{select:
        {
        id:true,
        quantity:true,
        product:{select:{id:true,name:true,price:true,stock:true,category:true}}
      }}
    },
    orderBy:{createdAt:"desc"},
    skip:(currentPage - 1) * take,
    take:limit,
    
});

// count of orders for specific filters
const ordersCount = await prisma.order.count({
  where: {...(role !=="ADMIN" && {userId:userId}),
  ...(status?{status}:{}),
...(q&&{
  OR:[
    {customer:{name:{contains:q,}}},
    {items:{some:{product:{name:{contains:q,}}}}}
  ]
})
},}
)
  return {orders:ordersData,count:ordersCount}
}

export async function getOrder(orderId:string):Promise<orderType|null> {
  return await prisma.order.findUnique({
   where:{id:orderId},
   select:{
    id:true,
    createdAt:true,
    status:true,
    customer:{select:{name:true,id:true}},
    items:{select:
      {
      id:true,
      quantity:true,
      product:{select:{id:true,name:true,price:true,stock:true,category:true}}
    }}
  },
  })
  
}

type UpdateOrderInput = {
  orderId: string;
  customerId: string;
  status: string;
  items: { productId: string; quantity: number }[];
};

export async function updateOrder(data: UpdateOrderInput) {
  const { items } = data;
 // Extract quantities from form
 const quantities = Object.fromEntries(
  items.map((i) => [i.productId, i.quantity])
);

 const payload = {
  orderId:data.orderId,
  customerId:data.customerId,
  status:data.status,
  quantities,
};

const result = updateOrderSchema.safeParse(payload);
if (!result.success) {
  console.error(result.error.format());
  return { success: false, error: "unprocessable input" };
}

const { orderId, customerId, status } = result.data;

  
   // Get existing order items

   const existingItems = await prisma.orderItem.findMany({
    where:{order:{id:orderId}}
   })

   const existingMap = Object.fromEntries(
    existingItems.map(item=> [item.productId,item.quantity])
   )

   const toCreate: {productId:string,quantity:number}[]=[]
   const toUpdate:{productId:string, quantity:number}[]=[]
   const toDelete: string[] = []

 
   for(const [productId, newQty] of Object.entries(quantities)){
    const existingQty = existingMap[productId];
    if(newQty === 0 && existingQty !==undefined){
      toDelete.push(productId);
    } else if(existingQty === undefined && newQty > 0){
      toCreate.push({productId,quantity: newQty})
    } else if(existingQty !==undefined && newQty !== existingQty){
      toUpdate.push({ productId, quantity: newQty })
    }
   }

   // Check for removed products (not present in form anymore)

   for (const existingProductId of Object.keys(existingMap)) {
    if (!(existingProductId in quantities)) {
      toDelete.push(existingProductId);
    }
  }

  const tx = [];

  // Update order's base fields
  tx.push(
    prisma.order.update({
      where: { id: orderId },
      data: {
        customerId,
        status: status as statusType,
      },
    })
  );

  // Handle deletes (and restore stock)
  for (const productId of toDelete) {
    const deletedQty = existingMap[productId] || 0;

    tx.push(
      prisma.orderItem.delete({
        where: {
          order_product_unique: { orderId, productId },
        },
      })
    );

    if (deletedQty > 0) {
      tx.push(
        prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: deletedQty } },
        })
      );
    }
  }

  // Handle updates (and adjust stock diff)
  for (const { productId, quantity } of toUpdate) {
    const oldQty = existingMap[productId] || 0;
    const diff = quantity - oldQty;

    tx.push(
      prisma.orderItem.update({
        where: {
          order_product_unique: { orderId, productId },
        },
        data: { quantity },
      })
    );

    if (diff !== 0) {
      tx.push(
        prisma.product.update({
          where: { id: productId },
          data: { stock: { decrement: diff } },
        })
      );
    }
  }

  // Handle creates (and deduct stock)
  for (const { productId, quantity } of toCreate) {
    tx.push(
      prisma.orderItem.create({
        data: { orderId, productId, quantity },
      })
    );

    tx.push(
      prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      })
    );
  }

  await prisma.$transaction(tx);

  return { success: true };
}

export type orderType = {
  id: string;
  createdAt:Date,
  status:"PENDING"|
  "SHIPPED"|
  "DELIVERED",
    customer: {
        name: string;
        id: string;
    };
    items: {
        product: {
            name: string;
            id: string;
            price: number;
            stock:number;
            category:categoryType
        };
        quantity: number;
        id:string
      }[],
}

export type ordersType = orderType[]

export type statusType = "PENDING"|"SHIPPED"|"DELIVERED"
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const user =await auth.api.getSession({headers: await headers()})
  const productIds = formData.getAll("productIds") as string[];
  const quantities = formData.getAll("quantities") as string[];
  const customerId = formData.get("customerId") as string;

  if (!productIds.length || !customerId || !user?.user) {
    throw new Error("Missing required fields.");
  }

  const items = productIds.map((productId, index) => ({
    productId,
    quantity: parseInt(quantities[index], 10) || 1,
  }));

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      customerId,
      userId: user.user.id,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });
  redirect('/dashboard/order')
}

export async function getOrders(role:string,userId:string):Promise<ordersType> {
   const orders = await prisma.order.findMany({
   where: role ==='ADMIN'?{}:{userId:userId},
    select:{
      id:true,
      createdAt:true,
      status:true,
      customer:{select:{name:true,id:true}},
      items:{select:
        {
        id:true,
        quantity:true,
        product:{select:{id:true,name:true,price:true}}
      }}
    },
    orderBy:{createdAt:"desc"},
    take:10
});

return orders
}

type orderType = {
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
        };
        quantity: number;
        id:string
      }[],
}

type ordersType =orderType[]
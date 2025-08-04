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
        })
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
        product:{select:{id:true,name:true,price:true,stock:true}}
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
      product:{select:{id:true,name:true,price:true,stock:true}}
    }}
  },
  })
  
}

export async function updateOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const customerId = formData.get("customerId") as string;
  const status = formData.get("status") as string;

   // Extract quantities from form
   const quantities: Record<string,number> = {};
   for(const [key, value] of formData.entries()){
    if(key.startsWith("quantity-")){
      const productId = key.replace("quantity-","")
      const quantity = parseInt(value as string);
      if(!isNaN(quantity)){
        quantities[productId] = quantity
      }
    }
   }
  
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

   // Determine what to do with each submitted product

  //  console.log("old and new products")
  //  console.log("order id", orderId)
  //  console.table(quantities)
  //  console.log(existingMap)
  //  console.log(existingItems)
   
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

  // Delete
  if (toDelete.length > 0) {
    tx.push(
      prisma.orderItem.deleteMany({
        where: {
          orderId,
          productId: { in: toDelete },
        },
      })
    );
  }

  // Update quantities
  for (const item of toUpdate) {
    tx.push(
      prisma.orderItem.update({
        where: {
          order_product_unique:{
            orderId:orderId,
            productId:item.productId
          }
        },
        data: {
          quantity: item.quantity,
        },
      })
    );
  }

  console.log("to create",toCreate)

  // Create new
  if (toCreate.length > 0) {
    tx.push(
      prisma.orderItem.createMany({
        data: toCreate.map((item) => ({
          orderId,
          ...item,
        })),
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
            stock:number
        };
        quantity: number;
        id:string
      }[],
}

export type ordersType = orderType[]

export type statusType = "PENDING"|"SHIPPED"|"DELIVERED"
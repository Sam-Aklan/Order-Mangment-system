"use server"

import prisma from "@/lib/prisma"

export const getUserCustomers = async(email:string):Promise<customerType[]>=>{

   return await prisma.customer.findMany({
        where:{email:email},
        take:10
    })

}
export const getCustomers = async():Promise<customerType[]>=>{

  return  await prisma.customer.findMany({
        take:10
    })

}

export const getCustomersCursor = async(limit:number,cursor?:string,q?:string):Promise<customerType[]>=>{
    

  const where = q
  ? { name: { contains: q} }
  : undefined;

const customers = await prisma.customer.findMany({
  where,
  take: limit + 1,
  skip: cursor ? 1 : 0,
  cursor: cursor ? { id: cursor } : undefined,
  orderBy: { name: "asc" },
});
return customers
}

export type customerType ={
    name: string;
    id: string;
    email: string;
}



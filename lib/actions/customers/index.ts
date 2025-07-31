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

export type customerType ={
    name: string;
    id: string;
    email: string;
}



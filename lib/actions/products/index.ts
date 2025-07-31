"use server"

import prisma from "@/lib/prisma"

export const getProducts = async():Promise<productType[]>=>{
   const products = await prisma.product.findMany({
        take:10
    })

    return products
}

export type productType = {
    name: string;
    id: string;
    price: number;
    stock: number;
}


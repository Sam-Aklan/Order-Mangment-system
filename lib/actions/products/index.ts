"use server"

import prisma from "@/lib/prisma"

export const getProducts = async():Promise<productType[]>=>{
   const products = await prisma.product.findMany({
        take:10
    })

    return products
}

export const getProductsQuery = async(
    page:number,
    limit:number,
    search?:string,
):Promise<{products:productType[],count:number}>=>{


const whereStatement = search?{
    name:{contains:search}
}:undefined;

const [products,count]=await Promise.all([
    
    prisma.product.findMany({
       where:whereStatement,
        select:{
            id:true,
            name:true,
            price:true,
            stock:true
        },
        skip:(page -1 )* limit,
        take:limit,
        orderBy:{name:"asc"}
    }),
    prisma.product.count({
        where:whereStatement
    })
    
])
return {products,count}
}

export type productType = {
    name: string;
    id: string;
    price: number;
    stock: number;
}


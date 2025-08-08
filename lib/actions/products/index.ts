"use server"

import prisma from "@/lib/prisma"

export const getProducts = async():Promise<productType[]>=>{
   const products = await prisma.product.findMany({
        take:10,
        orderBy:{name:"asc"}
    })

    return products
}

export const getProductsQuery = async(
    page:number,
    limit:number,
    search?:string,
    minPrice?:number,
    maxPrice?:number,
    category?:categoryType,
):Promise<{products:productType[],count:number}>=>{


    const whereStatement= {
        name: { contains: search,  },
        ...(category ? { category } : {}),
        price: { gte: minPrice, lte: maxPrice },
      };

const [products,count]=await Promise.all([
    
    prisma.product.findMany({
       where:whereStatement,
        select:{
            id:true,
            name:true,
            price:true,
            stock:true,
            category:true
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


export async function createProduct(productData: {
    name: string;
    price: number;
    category: categoryType;
    stock: number;
  }) {
    
   await prisma.product.create({
    data:productData
   })
    
    return {success:true}
  }

export type productType = {
    name: string;
    id: string;
    price: number;
    stock: number;
    category:string
}

export type categoryType= "ELECTRONICS"|
"CLOTHING"|
"FOOD"|
"BOOKS"|
"FURNITURE"|
"OTHER"
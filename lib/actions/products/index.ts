"use server"

import { cloudinaryInst } from "@/lib/config"
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
            category:true,
            imageUrl:true,
            imagePublicId:true,
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
    imageUrl?:string,
    imagePublicId?:string;
  }) {
    
   await prisma.product.create({
    data:productData
   })
    
    return {success:true}
  }

  
  export async function updateProduct(productId: string, productData: {
    name: string;
    price: number;
    category: categoryType;
    stock: number;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    deleteOldImage?: boolean;
  }) {
    try {
      // 1. Fetch existing product
      const existing = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!existing) {
        throw new Error("Product not found");
      }
  
      let imageUrl = existing.imageUrl;
      let imagePublicId = existing.imagePublicId;
  
      // 2. Handle deletion of old image (case 1 and case 2)
      if (productData.deleteOldImage && existing.imagePublicId) {
        try {
          await cloudinaryInst.uploader.destroy(existing.imagePublicId);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
        imageUrl = null;
        imagePublicId = null;
      }
  
      // 3. Handle replacement with a new uploaded image (case 2)
      if (productData.imageUrl && productData.imagePublicId) {
        imageUrl = productData.imageUrl;
        imagePublicId = productData.imagePublicId;
      }
  
      // 4. Update DB
      await prisma.product.update({
        where: { id: productId },
        data: {
          name: productData.name,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          imageUrl,
          imagePublicId,
        },
      });
  
      return { success: true };
    } catch (err) {
      console.error("Error updating product:", err);
      return { success: false, error: "Failed to update product" };
    }
  }


export type productType = {
    name: string;
    id: string;
    price: number;
    stock: number;
    category:string;
    imageUrl:string|null;
    imagePublicId:string|null;
}

export type categoryType= "ELECTRONICS"|
"CLOTHING"|
"FOOD"|
"BOOKS"|
"FURNITURE"|
"OTHER"
"use server"

import { cloudinaryInst } from "@/lib/config"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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

export const getCustomersQuery = async ({
  q,
  page = 1,
  limit = 5,
}: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<{ customers: customerType[]; totalPages: number }> => {
  const where = q
    ? {
        OR: [
          { name: { contains: q, } },
          { email: { contains: q, } },
        ],
      }
    : {};

  const total = await prisma.customer.count({ where });

  const customers = await prisma.customer.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { name: "asc" },
  });

  return {
    customers,
    totalPages: Math.ceil(total / limit),
  };
};

export const createCustomer = async({data}:{data:Omit<customerType,"id">})=>{

    await prisma.customer.create({
      data:{
        name:data.name,
        email:data.email,
        imageUrl:data.imageUrl,
        imagePublicId:data.imagePublicId
      }
    })

  
}

export const getCustomer = async(customerId:string):Promise<customerType|null>=>{
  return await prisma.customer.findUnique({
    where:{id:customerId}
})
}

export async function updateCustomer(customerId: string, customerData: {
  name: string;
  email: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  deleteOldImage?:boolean;
}) {
 const existing = await prisma.customer.findUnique({
    where:{id:customerId}
})
if (!existing) {
  throw new Error("Customer not found");
}

let imageUrl = existing.imageUrl;
let imagePublicId = existing.imagePublicId;

// 2. Handle deletion of old image (case 1 and case 2)
      if (customerData.deleteOldImage && existing.imagePublicId) {
        try {
          await cloudinaryInst.uploader.destroy(existing.imagePublicId);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
        imageUrl = null;
        imagePublicId = null;
      }

      // 3. Handle replacement with a new uploaded image (case 2)
      if (customerData.imageUrl && customerData.imagePublicId) {
        imageUrl = customerData.imageUrl;
        imagePublicId = customerData.imagePublicId;
      }
  

  await prisma.customer.update({
    where: { id: customerId },
    data:{
      name:customerData.name,
      email:customerData.email,
      imageUrl:customerData.imageUrl,
      imagePublicId:customerData.imagePublicId
    },
  });

  return { success: true };
}


export async function deleteCustomer(customerId: string) {
  try {
    // Find customer to check for image
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return { success: false, error: "Customer not found." };
    }

    // Delete image from Cloudinary if exists
    if (customer.imagePublicId) {
      try {
        await cloudinaryInst.uploader.destroy(customer.imagePublicId);
      } catch (err) {
        console.error("Cloudinary deletion error:", err);
        // We don’t throw here, because we still want to delete the DB record
      }
    }

    // Delete customer record
    await prisma.customer.delete({
      where: { id: customerId },
    });

    revalidatePath("/dashboard/customers");

    return { success: true };
  } catch (error) {
    console.error("Delete customer error:", error);
    return { success: false, error: "Failed to delete customer." };
  }
}


export type customerType ={
    name: string;
    id: string;
    email: string;
    imageUrl:string|null,
    imagePublicId:string|null,
}

export type CustomerEditType = customerType &{
  image?:File
}


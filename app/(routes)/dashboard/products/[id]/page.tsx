
import ProductEditForm from "@/components/product/ProductEditForm";
import {  getProduct, ProductEditType } from "@/lib/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Product",
    description: "full stack order mangment app",
  };

export default async function EditProductPage({params}:{params:Promise<{id:string}>}){
   const {id} = await params
   let product:ProductEditType|null = await getProduct(id)
   try {
    
     if(product?.imageUrl){
      
       const fileName = product.imageUrl.split('/').pop() ||"product_image.jpg"
       const  file = new File([],fileName,
         {
            type: 'image/jpeg',
        lastModified: Date.now()
         }
       )
      //  console.log("image file", file)
      //  console.log("image file", file.name)
      product.image = file
     }
   } catch (error:any) {
    console.error(error.message)
   }

    return (
        <main className="max-w-6xl flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
      { product? <>
        <h1 className="text-2xl font-bold">Product</h1>
         
          <ProductEditForm product={product}/>
          {/* {JSON.stringify(product.imageUrl?.split('/').pop())} */}
      </>
        :<p> no product found</p>
        }
      </main>
      );
}
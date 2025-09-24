
import ProductEditForm from "@/components/product/ProductEditForm";
import {  getProduct } from "@/lib/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Product",
    description: "full stack order mangment app",
  };

export default async function EditProductPage({params}:{params:Promise<{id:string}>}){
   const {id} = await params
   const product = await getProduct(id)

    return (
        <main className="max-w-6xl flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
      { product? <>
        <h1 className="text-2xl font-bold">Product</h1>
         
          <ProductEditForm product={product}/>
      </>
        :<p> no product found</p>}
      </main>
      );
}

import ProductFilter from "@/components/product/ProductFilter";
import ProductList from "@/components/product/ProductList";
import { categoryType, getProductsQuery } from "@/lib/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Product list",
    description: "full stack order mangment app",
  };


  interface ProductsPageProps {
    searchParams:Promise <{
      q?: string;
      page?:string;
      limit?:string;
      minPrice?:string;
      maxPrice?:string;
      category?:string;
    }>;}

export default async function ProductsPage({searchParams}:ProductsPageProps){
    const {q,category,limit,maxPrice,minPrice,page:currentPage} = await searchParams
    const page = currentPage?parseInt(currentPage) : 1;
    const offset = limit?parseInt(limit): 5;
    const higherPrice = maxPrice? parseFloat(maxPrice):undefined
    const lowerPrice = minPrice? parseFloat(minPrice):undefined

   const {products,count} = await getProductsQuery(page,offset,q,lowerPrice,higherPrice,category as categoryType);
   const totalPages = Math.max(1, Math.ceil( count / offset));
  
    return (
        <main className="max-w-6xl flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
        <h1 className="text-2xl font-bold">Products</h1>
        <ProductFilter currentPage={page} searchParams={{q,category,maxPrice,minPrice}} />
        <ProductList products={products} searchParams={{q,category,limit:offset,maxPrice:higherPrice,minPrice:lowerPrice,page}} totalPages={totalPages}/>
        
      </main>
      );
}
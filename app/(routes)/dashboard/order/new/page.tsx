import ClientOrderForm from "@/components/order/OrderForm";
import ProductFilter from "@/components/product/ProductFilter";
import { categoryType,getProductsQuery } from "@/lib/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "create new order",
    description: "full stack order mangment app",
  };


  interface ordersPageProps {
    searchParams:Promise <{
      q?: string;
      page?:string;
      limit?:string;
      minPrice?:string;
      maxPrice?:string;
      category?:string;
    }>;}

export default async function CreateOrder({searchParams}:ordersPageProps) {
 const {q,category,limit,maxPrice,minPrice,page:currentPage} = await searchParams
     const page = currentPage?parseInt(currentPage) : 1;
     const offset = limit?parseInt(limit): 5;
     const higherPrice = maxPrice? parseFloat(maxPrice):undefined
     const lowerPrice = minPrice? parseFloat(minPrice):undefined
 
    const {products,count} = await getProductsQuery(page,offset,q,lowerPrice,higherPrice,category as categoryType);
    const totalPages = Math.max(1, Math.ceil( count / offset));
  
    return (
      <>
    
      <div className="flex justify-between items-center md:hidden px-4 md:px-0">
      <h2 className="text-sm font-semibold">Create Order</h2>
      <ProductFilter searchParams={{category:category as categoryType,maxPrice,minPrice,q}}/>
      </div>
      {/* desktop view */}
      <div className=" hidden md:block px-4">
       <h2 className="text-2xl font-semibold px-4 my-4">Create Order</h2>
      <ProductFilter searchParams={{category:category as categoryType,maxPrice,minPrice,q}}/>
      </div>
     
      <ClientOrderForm products={products} searchParams={{q,category,maxPrice,minPrice,limit:offset}} page={page} totalPages={totalPages}/>
      </>
    )
}
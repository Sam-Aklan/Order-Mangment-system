
import NewOrderFilters from "@/components/order/NewOrderFilters";
import ClientOrderForm from "@/components/order/OrderForm";
import ProductFilter from "@/components/product/ProductFilter";
import { getCustomers } from "@/lib/actions/customers";
import { categoryType, getProducts, getProductsQuery } from "@/lib/actions/products";
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
 
 const customers = await getCustomers()
 const {q,category,limit,maxPrice,minPrice,page:currentPage} = await searchParams
     const page = currentPage?parseInt(currentPage) : 1;
     const offset = limit?parseInt(limit): 5;
     const higherPrice = maxPrice? parseFloat(maxPrice):undefined
     const lowerPrice = minPrice? parseFloat(minPrice):undefined
 
    const {products,count} = await getProductsQuery(page,offset,q,lowerPrice,higherPrice,category as categoryType);
    const totalPages = Math.max(1, Math.ceil( count / offset));

    return (
      <>
      <NewOrderFilters searchParams={{q,category,maxPrice,minPrice}} currentPage={page}/>
      <ClientOrderForm products={products} customers={customers}  searchParams={{q,category,maxPrice,minPrice}} page={page} totalPages={totalPages}/>
      </>
    )
}
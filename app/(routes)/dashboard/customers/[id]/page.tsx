
import CustomerEditForm from "@/components/customer/EditCustomer";
import { getCustomer,customerType } from "@/lib/actions/customers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Customer",
    description: "full stack order mangment app",
  };

export default async function EditCustomerPage({params}:{params:Promise<{id:string}>}){
   const {id} = await params
   let customer:customerType|null = await getCustomer(id)
   
    return (
        <main className="max-w-6xl flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
      { customer? <>
        <h1 className="text-sm md:text-2xl font-bold">Customer @{customer.name}</h1>
         
          <CustomerEditForm customer={customer} />
      </>
        :<p> no Customer Found</p>}
      </main>
      );
}
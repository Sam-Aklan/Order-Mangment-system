
import CustomerEditForm from "@/components/customer/EditCustomer";
import { CustomerEditType, getCustomer } from "@/lib/actions/customers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Customer",
    description: "full stack order mangment app",
  };

export default async function EditCustomerPage({params}:{params:Promise<{id:string}>}){
   const {id} = await params
   let customer:CustomerEditType|null = await getCustomer(id)
    if(customer?.imageUrl){

      try {
        
         const fileName = customer.imageUrl.split('/').pop() ||"customer_image.jpg"
       const  file = new File([],fileName,
         {
            type: 'image/jpeg',
        lastModified: Date.now()
         }
       )
    
      customer.image = file

      } catch (error) {
        
      }
    }
    return (
        <main className="max-w-6xl flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-black">
      { customer? <>
        <h1 className="text-2xl font-bold">Customer @{customer.name}</h1>
         
          <CustomerEditForm customer={customer} />
      </>
        :<p> no Customer Found</p>}
      </main>
      );
}
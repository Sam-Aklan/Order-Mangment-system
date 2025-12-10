"use client";

import { customerType } from "@/lib/actions/customers";
import Modal from "../Modal";
import CustomerView from "@/components/customer/CustomerView";
import CustomerForm from "@/components/customer/CustomerForm";
import Pagination from "../Pagination";
import { useCustomerListManagement } from "@/lib/hooks/customer/useCustomerListManagement.ts";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import useWindowSize from "@/lib/hooks/useWindowSize";

interface CustomerListProps {
  customers: customerType[];
  searchParams: { q?: string; page: number,pageSize:number };
  totalPages: number;
}

export default function CustomerList({
  customers,
  searchParams,
  totalPages,
}: CustomerListProps) {
 
  const {actions, isModalOpen, currentPage,currentPageSize} =useCustomerListManagement({searchParams})
  const {isMobile} = useWindowSize()

  return (
    <div className="space-y-4 w-full relative">
      <div className="flex justify-between items-center mt-2">
        <h1 className="text-sm md:text-2xl font-bold">Customer List</h1>
        <Button
          onClick={() => actions.openModal()}
          className="px-2 py-1 rounded-full fixed bottom-1/2 right-2 -translate-y-1/2 md:static md:translate-none md:w-fit md:px-2 md:py-1 md:rounded-sm"
          size={`icon-sm`}
        >
         {isMobile?<Plus/>:'Add Customer'}
        </Button>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => actions.closeModal()}
          title="Create New Customer"
        >
         
          <CustomerForm onClose={()=> actions.closeModal()}/>
        </Modal>
      )}

      <div className="border rounded space-y-2">
        {customers.length === 0 && (
          <p className="text-gray-500">No customers found.</p>
        )}
        {customers.map((customer) => (
          <CustomerView key={customer.id} customer={customer} />
        ))}
      </div>

     
      <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={currentPageSize||5}
      onPageChange={actions.handlePageChange}
      onPageSizeChange={actions.handlePageSizeChange}/>
    </div>
  );
}

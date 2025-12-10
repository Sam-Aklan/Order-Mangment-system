"use client";

import { customerType } from "@/lib/actions/customers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../Modal";
import CustomerView from "./CustomerView";
import CustomerForm from "./CustomerForm";
import Pagination from "../Pagination";
import { useCustomerListManagement } from "@/lib/hooks/customer/useCustomerListManagement.ts";

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
  // const router = useRouter();
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handlePageChange = (newPage: number) => {
  //   const params = new URLSearchParams();
  //   if (searchParams.q) params.set("q", searchParams.q);
  //   params.set("page", String(newPage));

  //   router.push(`/dashboard/customers?${params.toString()}`);
  // };
  // const handlePageSizeChange = (newSize: number) => {
  //   const params = new URLSearchParams();
  //   if (searchParams.q) params.set("q", searchParams.q);
  //   params.set("page","1");
  //   params.set("limit",String(newSize))
  //   router.push(`/dashboard/customers?${params.toString()}`);
  // };

  const {actions, isModalOpen, currentPage,currentPageSize} =useCustomerListManagement({searchParams})

  return (
    <div className="p-6 space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <button
          onClick={() => actions.openModal()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Customer
        </button>
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

      <div className="border rounded p-4 space-y-2">
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

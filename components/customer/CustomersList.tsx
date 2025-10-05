"use client";

import { customerType } from "@/lib/actions/customers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../Modal";
import CustomerView from "./CustomerView";
import CustomerForm from "./CustomerForm";
import Pagination from "../Pagination";

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
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    params.set("page", String(newPage));

    router.push(`/dashboard/customers?${params.toString()}`);
  };
  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    params.set("page","1");
    params.set("limit",String(newSize))
    router.push(`/dashboard/customers?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Customer
        </button>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Customer"
        >
          {/* 🔹 Replace with a <CustomerForm /> like ProductForm if you have it */}
          <CustomerForm onClose={()=>setIsModalOpen(false)}/>
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
      currentPage={searchParams.page}
      totalPages={totalPages}
      pageSize={searchParams.pageSize||5}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}/>
    </div>
  );
}

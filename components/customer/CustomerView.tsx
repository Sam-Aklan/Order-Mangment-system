"use client";

import { customerType } from "@/lib/actions/customers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomerView({ customer }: { customer: customerType }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/`, {
        method: "DELETE",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({
          id:customer.id
        })
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      router.refresh();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Something went wrong while deleting the customer.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 transition">
      {/* Customer Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border">
          {customer.imageUrl ? (
            <Image
              src={customer.imageUrl}
              alt={customer.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
        <div>
          <div className="font-medium text-lg">{customer.name}</div>
          <div className="text-sm text-gray-600">{customer.email}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/customers/${customer.id}`}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:underline text-sm disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-2 right-4 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

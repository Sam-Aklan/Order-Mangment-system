"use client";

import { productType } from "@/lib/actions/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export default function ProductView({ product,setToDelete }: { product: productType,setToDelete:Dispatch<SetStateAction<{
  name:string,
  id:string
}| null>> }) {
  

  
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition bg-white flex gap-4">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border bg-gray-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
            No image
          </div>
        )}
      </div>

        <div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="font-medium text-lg">{product.name}</div>
          <div className="text-sm text-gray-600">
            {product.category} • ${product.price.toFixed(2)}
          </div>
          <div
            className={`text-xs mt-1 ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </div>
        </div>
        
            {/* actions */}
            <div className="flex gap-2 items-center mt-2">

        <Link
          href={`/dashboard/products/${product.id}`}
          className="text-blue-600 hover:underline text-sm self-start"
        >
          View
        </Link>

         <button
          onClick={()=>setToDelete({name:product.name,id:product.id})}
          className="bg-red-600 hover:bg-red-800 text-sm text-white w-15"
        >
          Delete
        </button>
            </div>
        
        </div>

      </div>
    </div>
  );
}

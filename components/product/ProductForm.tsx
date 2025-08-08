
"use client";

import { ChangeEvent, useRef, useState } from "react";
import { categoryType } from "@/lib/actions/products";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductForm({ 
  onClose,
  searchParams 
}: {
  onClose: () => void;
  searchParams: {
    q?: string;
    page: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "" as categoryType,
    stock: "",
    image:null as File | null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({...formData, image: file});
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: formData.stock
        }),
      });

      if (!response.ok) throw new Error('Failed to create product');
      
      const params = new URLSearchParams();
      params.set("q", formData.name);
      params.set("category", formData.category);
      params.set("minPrice", String(formData.price));
   
      params.set("page", "1");
      
      router.push(`/dashboard/products?${params.toString()}`);
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded p-4 mb-4 bg-gray-50">
      <h3 className="font-medium mb-2">Add New Product</h3>
      <form onSubmit={handleSubmit}>
       {/* Image Upload Section */}
       <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 border rounded overflow-hidden bg-gray-100">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
            >
              {formData.image ? "Change Image" : "Upload Image"}
            </button>
            {formData.image && (
              <button
                type="button"
                onClick={() => {
                  setFormData({...formData, image: null});
                  setPreviewImage(null);
                }}
                className="ml-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG or WEBP (Max. 5MB)
        </p>
      </div>

      {/* Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as categoryType})}
              required
            >
              <option value="">Select Category</option>
              <option value="ELECTRONICS">ELECTRONICS</option>
              <option value="FOOD">Food</option>
              <option value="BOOKS">Books</option>
              <option value="FURNITURE">Furniture</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">stock</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.stock}
              type="number"
              step={1}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
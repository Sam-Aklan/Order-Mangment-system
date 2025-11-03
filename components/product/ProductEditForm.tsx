"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categoryType, ProductEditType, productType } from "@/lib/actions/products";
import { productSchema,ProductInput } from "@/lib/validations/productValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import {  SubmitHandler, useForm } from "react-hook-form";
import { useProductForm } from "@/lib/hooks/useProductForm";

export default function ProductEditForm({
  product,
  // onClose,
}: {
  product: ProductEditType;
  // onClose: () => void;
}) {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const router = useRouter();

  // const [previewImage, setPreviewImage] = useState<string | null>(
  //   product.imageUrl || null
  // );
  // const [deleteOldImage, setDeleteOldImage] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors,isSubmitting,defaultValues },
  //   setValue,
  //   watch,
  //   trigger,
    
  // } = useForm<ProductInput>({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: {
  //     name: product.name,
  //     price: String(product.price),
  //     category: product.category as categoryType,
  //     stock: String(product.stock),
  //     image: null
  //   }
  // });

  // // Watch form values
  // const formValues = watch();

  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setValue("image", file);
      
  //     if (previewImage !==product.image?.name ) setDeleteOldImage(true); // Mark old image for deletion

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setPreviewImage(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
      
  //     // Trigger validation for image field
  //     trigger("image");
  //   }
  // };

  // const removeImage = () => {
  //   setValue("image", null);
  //   setPreviewImage(null);
  //   setDeleteOldImage(true);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  // const uploadToCloudinary = async (file: File): Promise<{url: string, publicId: string}> => {
  //   const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  //   const data = new FormData();
  //   data.append("file", file);
  //   data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

  //   const res = await fetch(url, {
  //     method: "POST",
  //     body: data,
  //   });

    
  //   if (!res.ok) throw new Error("Cloudinary upload failed");
  //   const result = await res.json();
  // return {
  //   url: result.secure_url as string,
  //   publicId: result.public_id as string,
  // };
  // };


  // const deleteFromCloudinary = async (publicId: string) => {
  //   await fetch(`/api/cloudinary/${publicId}`, {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     // body: JSON.stringify({ publicId }),
  //   });
  // };

  // const onSubmit:SubmitHandler<ProductInput> = async (data) => {
   
  //   if(JSON.stringify(data) === JSON.stringify(defaultValues)){
  //       console.log("not submitted")
  //     return
  //   }
    
  //   let uploaded: {url: string, publicId: string} | null = null;
  //   try {
  //     // Upload image if replaced
  //     if (previewImage && deleteOldImage && data.image) {
  //       uploaded=  await uploadToCloudinary(data.image)
       
  //     }

  //     // Update DB
  //     const response = await fetch(`/api/product/`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         id:product.id,
  //         name: data.name,
  //         price: data.price,
  //         category: data.category,
  //         stock: data.stock,
  //         imageUrl:uploaded?.url||null,
  //         imagePublicId:uploaded?.publicId ||null,
  //         deleteOldImage

  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to update product");

  //     router.refresh();
  //     // onClose();
  //   } catch (err) {
  //     console.error("Error updating product:", err);
  //     // if new upload succeeded but DB update failed → delete Cloudinary image here
  //     if(uploaded?.publicId) await deleteFromCloudinary(uploaded.publicId);
  //   } finally {
    
  //   }
  // };

  const {actions,fileInputRef,formMethods,previewImage,uploadProgress,formValues,router} =useProductForm({product,mode:"edit"})
  const {onSubmit,handleImageChange,removeImage,} = actions
  const {register,handleSubmit,formState:{errors,isSubmitting,}} = formMethods

  return (
     <div className="border rounded p-4 mb-4 bg-gray-50 w-3xl">
      <h3 className="font-medium mb-2">Edit Product</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Image Upload */}
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
                {formValues.image ? "Change Image" : "Upload New Image"}
              </button>
              {previewImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="ml-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {errors.image && (
            <p className="mt-1 text-xs text-red-600">{errors.image.message as string}</p>
          )}
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

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border rounded"
              {...register("price")}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded"
              {...register("category")}
            >
              <option value="">Select Category</option>
              <option value="ELECTRONICS">ELECTRONICS</option>
              <option value="FOOD">Food</option>
              <option value="BOOKS">Books</option>
              <option value="FURNITURE">Furniture</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Stock Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              step={1}
              className="w-full p-2 border rounded"
              {...register("stock")}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
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
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

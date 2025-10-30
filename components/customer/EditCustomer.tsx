"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { customerSchema, CustomerInput } from "@/lib/validations/customerValidation";
import { CustomerEditType } from "@/lib/actions/customers";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CustomerEditForm({
  customer,
  
}: {
  customer: CustomerEditType;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(
    customer.imageUrl || null
  );

  const [deleteImage, setDeleteImage] = useState(false);

   const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting,defaultValues },
    setValue,
    watch,
    trigger,
    setError: setFormError,
    clearErrors
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      image:  null,
    }
  });
  // Watch form values
  const formValues = watch();

  // Handle file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("image", file);
      clearErrors("image");

      if (previewImage && previewImage !== customer.image?.name) {
        setDeleteImage(true);
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Trigger validation for image field
      trigger("image");
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setPreviewImage(null);
    setDeleteImage(true);
    clearErrors("image");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadToCloudinary = async (file: File): Promise<{url: string, publicId: string}> => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_CUSTOMER || "");

    const res = await fetch(url, {
      method: "POST",
      body: data,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const result = await res.json();
  return {
    url: result.secure_url as string,
    publicId: result.public_id as string,
  };
  };

  
  const onSubmit:SubmitHandler<CustomerInput>= async (data) => {
   
   
  if(JSON.stringify(data) === JSON.stringify(defaultValues)) return
    let uploadedImageUrl: string | null = customer.imageUrl;
    let uploadedImagePublicId: string | null = customer.imagePublicId;

    try {
     

      // Case 2: user uploaded a new image
      if (data.image) {
        
       const {url,publicId}= await uploadToCloudinary(data.image)
       uploadedImageUrl =url
       uploadedImagePublicId = publicId
      
      }

      // Update DB
      const response = await fetch(`/api/customers/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:customer.id,
          name: data.name,
          email: data.email,
          imageUrl: uploadedImageUrl,
          imagePublicId: uploadedImagePublicId,
          deleteOldImage:deleteImage
        }),
      });

      if (!response.ok) throw new Error("Failed to update customer");

      router.push("/dashboard/customers?page=1");
      router.refresh();
     
    } catch (err) {
      console.error("Error updating customer:", err);
    } 
  };

  return (
    <div className="border rounded p-4 mb-4 bg-gray-50">
      <h3 className="font-medium mb-2">Edit Customer</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
      

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Image
          </label>
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
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
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
            JPEG, PNG, WEBP (Max. 1MB)
          </p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
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
            {isSubmitting ? "Updating..." : "Update Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}

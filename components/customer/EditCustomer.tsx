"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { customerSchema, CustomerInput } from "@/lib/validations/customerValidation";
import { customerType } from "@/lib/actions/customers";

export default function CustomerEditForm({
  customer,
  
}: {
  customer: customerType;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CustomerInput>({
    name: customer.name,
    email: customer.email,
    image: null, // for new file uploads
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    customer.imageUrl || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);

  // ✅ Handle file change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      if(previewImage) setDeleteImage(true);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  // ✅ Submit with Cloudinary & API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate with Zod
    const result = customerSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues.map(i=>i.message).join(", "));
      setIsSubmitting(false);
      return;
    }

    let uploadedImageUrl: string | null = customer.imageUrl;
    let uploadedImagePublicId: string | null = customer.imagePublicId;

    try {
     

      // Case 2: user uploaded a new image
      if (formData.image) {
        
       const {url,publicId}= await uploadToCloudinary(formData.image)
       uploadedImageUrl =url
       uploadedImagePublicId = publicId
      
      }

      // Update DB
      const response = await fetch(`/api/customers/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:customer.id,
          name: formData.name,
          email: formData.email,
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
      setError("Something went wrong while updating the customer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded p-4 mb-4 bg-gray-50">
      <h3 className="font-medium mb-2">Edit Customer</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Profile Image</label>
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
                {formData.image ? "Change Image" : "Upload New Image"}
              </button>
              {(previewImage || formData.image) && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, image: null });
                    setPreviewImage(null);
                    setDeleteImage(true);
                  }}
                  className="ml-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            JPEG, PNG, WEBP (Max. 1MB)
          </p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            // onClick={onClose}
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

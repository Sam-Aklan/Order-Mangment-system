"use client";


import { useCustomerForm } from "@/lib/hooks/customer/useCustomerForm";
import Image from "next/image";

export default function CustomerForm({
  onClose,
}: {
  onClose: () => void;
}) {
  // const router = useRouter();
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const [previewImage, setPreviewImage] = useState<string | null>(null);
  // const [uploadProgress, setUploadProgress] = useState(0);

  //  const {
  //   register,
  //   handleSubmit,
  //   formState: { errors,isSubmitting },
  //   setValue,
  //   watch,
  //   trigger,
  //   clearErrors
  // } = useForm<CustomerInput>({
  //   resolver: zodResolver(customerSchema),
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     image: null
  //   }
  // });

  // // Watch form values
  // const formValues = watch();

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setValue("image", file);
  //     clearErrors("image");

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
  //   clearErrors("image");
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };


  // const uploadToCloudinary = async (file: File): Promise<{url: string, publicId: string}> => {
  //   const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  //   const data = new FormData();
  //   data.append("file", file);
  //   data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_CUSTOMER || "");

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

  // // ✅ Handle file change
  

  // // ✅ Submit form
  // const onSubmit:SubmitHandler<CustomerInput> = async (data) => {
  


  //   let uploadedImageUrl: string | null = null;
  //   let uploadedImagePublicId: string | null = null;
   
  //   try {
  //     // If image selected → upload to Cloudinary
  //     if (data.image) {
  //      const{url,publicId}= await uploadToCloudinary(data.image)
  //      uploadedImageUrl =url;
  //      uploadedImagePublicId = publicId;
  //       const imageData = new FormData();
  //       imageData.append("file", data.image);
  //       imageData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  //       const res = await fetch(
  //         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
  //         {
  //           method: "POST",
  //           body: imageData,
  //         }
  //       );

  //       const uploadResult = await res.json();
  //       uploadedImageUrl = uploadResult.secure_url;
  //       uploadedImagePublicId = uploadResult.public_id;
  //     }

  //     // Call your API to save customer

  //     const response = await fetch("/api/customers", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: data.name,
  //         email: data.email,
  //         imageUrl: uploadedImageUrl,
  //         imagePublicId: uploadedImagePublicId,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to create customer");

  //     router.push("/dashboard/customers?page=1");
  //     router.refresh();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error creating customer:", error);

  //     // Rollback uploaded image if DB failed
  //     if (uploadedImagePublicId) {
  //       await fetch(`/api/cloudinary/${uploadedImagePublicId}`, {
  //         method: "DELETE",
  //       });
  //     }
  //   } 
  // };
  const {actions,formMethods,formValues,fileInputRef,isSubmitting,previewImage,uploadProgress, errors}=useCustomerForm({onClose,mode:"create"})
  const {register,handleSubmit,} = formMethods
  const {onSubmit,removeImage,handleImageChange} = actions

  return (
      <div className="border rounded p-4 mb-4 bg-gray-50">
      <h3 className="font-medium mb-2">Add New Customer</h3>
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
                {formValues.image ? "Change Image" : "Upload Image"}
              </button>
              {formValues.image && (
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

        {/* Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

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
            {isSubmitting ? "Creating..." : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}

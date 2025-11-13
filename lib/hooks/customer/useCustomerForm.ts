
import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerInput, customerSchema } from '@/lib/validations/customerValidation';
import { CustomerEditType } from '@/lib/actions/customers';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface UseCustomerFormProps {
  onClose?: () => void;
  customer?: CustomerEditType | null;
  mode?: 'create' | 'edit';
}

interface UseCustomerFormReturn {
  // Refs
  fileInputRef: React.RefObject<HTMLInputElement|null>;
  
  // State
  previewImage: string | null;
  uploadProgress: number;
  isSubmitting: boolean;
  hasChanges: boolean;
  router: AppRouterInstance
  
  // Form
  formMethods: ReturnType<typeof useForm<CustomerInput>>;
  formValues: CustomerInput;
  errors:FieldErrors<CustomerInput>
  
  // Actions
  actions: {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: () => void;
    onSubmit: SubmitHandler<CustomerInput>;
   
    resetForm: () => void;
  };
  
  // Computed
  isEditMode: boolean;
}

export function useCustomerForm({ 
  onClose, 
  customer, 
  mode = 'create' 
}: UseCustomerFormProps): UseCustomerFormReturn {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isEditMode = mode === 'edit';

  // Default values based on mode
  const defaultFormValues: CustomerInput = {
    name: customer?.name || "",
    email: customer?.email || "",
    image: null
  };

  // React Hook Form
  const formMethods = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultFormValues
  });

  const {
    
    formState: { errors:formErrors, isSubmitting: formIsSubmitting, },
    setValue,
    watch,
    trigger,
    clearErrors,
    reset
  } = formMethods;

  const formValues = watch();

  // Set initial preview image for edit mode
  useEffect(() => {
    if (isEditMode && customer?.imageUrl) {
      setPreviewImage(customer.imageUrl);
    }
  }, [isEditMode, customer]);

  // Check for form changes
  useEffect(() => {
    const hasFormChanged = 
      formValues.name !== defaultFormValues.name ||
      formValues.email !== defaultFormValues.email ||
      formValues.image !== null ||
      deleteImage;

    setHasChanges(hasFormChanged);
  }, [formValues, defaultFormValues, deleteImage]);

  // Image handling
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("image", file);
      clearErrors("image");

      // For edit mode, mark old image for deletion if replacing
      if (isEditMode && previewImage && previewImage !== customer?.imageUrl) {
        setDeleteImage(true);
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      trigger("image");
    }
  }, [setValue, clearErrors, trigger, isEditMode, previewImage, customer]);

  const removeImage = useCallback(() => {
    setValue("image", null);
    setPreviewImage(null);
    
    if (isEditMode) {
      setDeleteImage(true);
    }
    
    clearErrors("image");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setValue, clearErrors, isEditMode]);

  // Cloudinary upload
  const uploadToCloudinary = useCallback(async (file: File): Promise<{ url: string; publicId: string }> => {
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
  }, []);

  // Rollback uploaded image (for create mode failures)
  const rollbackImage = useCallback(async (publicId: string) => {
    try {
      await fetch(`/api/cloudinary/${publicId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to rollback image:", error);
    }
  }, []);

  // Delete old image (for edit mode)
  const deleteOldImage = useCallback(async (publicId: string) => {
    try {
      await fetch(`/api/cloudinary/${publicId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete old image:", error);
    }
  }, []);

  // API calls
  const createCustomer = useCallback(async (
    data: CustomerInput, 
    imageData?: { url: string; publicId: string }
  ) => {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        imageUrl: imageData?.url || null,
        imagePublicId: imageData?.publicId || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create customer");
    }

    return response.json();
  }, []);

  const updateCustomer = useCallback(async (
    data: CustomerInput, 
    imageData?: { url: string; publicId: string }
  ) => {
    if (!customer) throw new Error("Customer ID is required for update");

    const response = await fetch(`/api/customers/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: customer.id,
        name: data.name,
        email: data.email,
        imageUrl: imageData?.url || customer.imageUrl,
        imagePublicId: imageData?.publicId || customer.imagePublicId,
        deleteOldImage: deleteImage
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update customer");
    }

    return response.json();
  }, [customer, deleteImage]);

  // Form submission
  const onSubmit: SubmitHandler<CustomerInput> = useCallback(async (data) => {
    // For edit mode, check if there are changes
    if (isEditMode && !hasChanges) {
      return; // No changes, don't submit
    }

    setIsSubmitting(true);
    
    let uploadedImageUrl: string | null = isEditMode ? customer?.imageUrl || null : null;
    let uploadedImagePublicId: string | null = isEditMode ? customer?.imagePublicId || null : null;
    let oldImagePublicId: string | null = isEditMode ? customer?.imagePublicId || null : null;

    try {
      // Upload new image if present
      if (data.image) {
        const imageResult = await uploadToCloudinary(data.image);
        uploadedImageUrl = imageResult.url;
        uploadedImagePublicId = imageResult.publicId;
      }

      // Create or update customer
      if (isEditMode) {
        await updateCustomer(data, { 
          url: uploadedImageUrl!, 
          publicId: uploadedImagePublicId! 
        });

        // Delete old image if requested and new image was uploaded
        if (deleteImage && oldImagePublicId && data.image) {
          await deleteOldImage(oldImagePublicId);
        }
      } else {
        await createCustomer(data, { 
          url: uploadedImageUrl!, 
          publicId: uploadedImagePublicId! 
        });
      }

      // Success actions
      router.push("/dashboard/customers?page=1");
      router.refresh();
      onClose?.();

    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} customer:`, error);

      // Rollback uploaded image if operation failed
      if (uploadedImagePublicId && !isEditMode) {
        await rollbackImage(uploadedImagePublicId);
      }

      // Show error to user
      alert(error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} customer`);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isEditMode,
    hasChanges,
    customer,
    deleteImage,
    router,
    onClose
  ]);

  // Reset form
  const resetForm = useCallback(() => {
    reset(defaultFormValues);
    setPreviewImage(isEditMode ? customer?.imageUrl || null : null);
    setDeleteImage(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [reset, defaultFormValues, isEditMode, customer]);

  return {
    fileInputRef,
    previewImage,
    uploadProgress,
    router,
    isSubmitting: isSubmitting || formIsSubmitting,
    hasChanges,
    formMethods,
    formValues,
    errors:formErrors,
    actions: {
      handleImageChange,
      removeImage,
      onSubmit,
      resetForm,
    },
    isEditMode,
  };
}
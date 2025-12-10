
import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput } from '@/lib/validations/productValidation';
import { categoryType, productType } from '@/lib/actions/products';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface UseProductFormProps {
  onClose?: () => void;
  product?: productType | null;
  mode?: 'create' | 'edit';
}

interface UseProductFormReturn {
  // Refs
  fileInputRef: React.RefObject<HTMLInputElement|null>;
  
  // State
  previewImage: string | null;
  uploadProgress: number;
  router:AppRouterInstance,
  
  // Form
  formMethods: ReturnType<typeof useForm<ProductInput>>;
  formValues: ProductInput;
  
  // Actions
  actions: {
    handleImageChange: (files:File[]) => void;
    removeImage: () => void;
    onSubmit: SubmitHandler<ProductInput>;
    uploadToCloudinary: (file: File) => Promise<{ url: string; publicId: string }>;
    deleteFromCloudinary: (publicId: string) => Promise<void>;
    createProduct: (data: ProductInput, imageData?: { url: string; publicId: string }) => Promise<void>;
    updateProduct: (data: ProductInput, imageData?: { url: string; publicId: string }) => Promise<void>;
    resetForm: () => void;
  };
  
  // Computed
  isEditMode: boolean;
}

export function useProductForm({ 
  onClose, 
  product, 
  mode = 'create' 
}: UseProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteImage, setDeleteImage] = useState(false)
  const [hasChanged, sethasChanged] = useState(false);

  const isEditMode = mode === 'edit';

  // Set initial preview image for edit mode
  useEffect(() => {
    if (isEditMode && product?.imageUrl) {
      setPreviewImage(product.imageUrl);
    }
  }, [isEditMode, product]);

  // React Hook Form
  const formMethods = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price?.toString() || "0",
      category: (product?.category as categoryType) || "" as categoryType,
      stock: product?.stock?.toString() || "0",
      image: null
    }
  });

  const {
    
    setValue,
    formState: { isSubmitting: formIsSubmitting},
    watch,
    trigger,
    reset,
    clearErrors
  } = formMethods;

  const formValues = watch();

  // Check for form changes (for edit mode)
  useEffect(() => {
    if (isEditMode) {
      const changed = 
        formValues.name !== product?.name ||
        formValues.price !== product?.price?.toString() ||
        formValues.category !== product?.category ||
        formValues.stock !== product?.stock?.toString() ||
        previewImage !== product.imageUrl;
      
      sethasChanged(changed);
    }
  }, [formValues, product, isEditMode]);

  // Image handling and other methods remain similar to basic version
 const handleImageChange = useCallback((files: File[]) => {
    if (files && files[0]) {
      const file = files[0];
      setValue("image", file);
      clearErrors("image");

      // For edit mode, mark old image for deletion if replacing
      if (isEditMode && previewImage && previewImage !== product?.imageUrl) {
        setDeleteImage(true);
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      trigger("image");
    } else{
        setValue('image',undefined)
        clearErrors('image')
    }
  }, [setValue, clearErrors, trigger, isEditMode, previewImage, product?.imageUrl]);

  const removeImage = useCallback(() => {
    setValue("image", null);
    setPreviewImage(null);
    setDeleteImage(true)
   
  }, []);

  // Cloudinary methods remain the same
  const uploadToCloudinary = useCallback(async (file: File): Promise<{ url: string; publicId: string }> => {
   const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

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

  const deleteFromCloudinary = useCallback(async (publicId: string) => {
     await fetch(`/api/cloudinary/${publicId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ publicId }),
    });
  }, []);

  // Create and update product methods
  const createProduct = useCallback(async (data: ProductInput, imageData?: { url: string; publicId: string }) => {
       setUploadProgress(0)

    let uploaded: {url: string, publicId: string} | null = null;

    try {
     
      if (data.image) {
        uploaded = await uploadToCloudinary(data.image);
        // console.table(uploaded)
      }
  
      // throw new Error("test delete")

      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          price: data.price,
          category: data.category,
          stock: data.stock,
          imageUrl: uploaded?.url || null,
          imagePublicId: uploaded?.publicId || null, 
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create product in DB");
      }
  
     
      // Redirect with filters
      const params = new URLSearchParams();
      params.set("q", data.name);
      params.set("category", data.category);
      params.set("minPrice", String(data.price));
      params.set("page", "1");

      router.push(`/dashboard/products?${params.toString()}`);
      router.refresh();
    if(onClose) onClose()
  
    } catch (err) {
      console.error("Error creating product:", err);
  
      // ❌ cleanup orphaned Cloudinary upload
      if (uploaded?.publicId) {
        await deleteFromCloudinary(uploaded.publicId);
      }

      // await deleteFromCloudinary("hello-there")
    } 
  }, []);

  const updateProduct = useCallback(async (data: ProductInput, imageData?: { url: string; publicId: string }) => {

    
    if (!product) throw new Error("Product ID is required for update");

    const response = await fetch(`/api/product/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: product.id,
        name: data.name,
        price: parseFloat(data.price),
        category: data.category,
        stock: parseInt(data.stock),
        imageUrl: imageData?.url ,
        imagePublicId: imageData?.publicId ,
        deleteOldImage:deleteImage
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update product");
    }

    return response.json();
  }, [product,deleteImage]);

  // Form submission
  const onSubmit: SubmitHandler<ProductInput> = useCallback(async (data) => {
    // For edit mode, check if there are changes
    if (isEditMode && !hasChanged) {
      
      return;
    }

    
    setUploadProgress(0);

    let uploaded: { url: string; publicId: string } | null = null;

    try {
      // Upload image if present
      if (data.image) {
        uploaded = await uploadToCloudinary(data.image);
      }

      // Create or update product
      if (isEditMode) {
        uploaded? await updateProduct(data, uploaded) : await updateProduct(data);
      } else {
        uploaded?await createProduct(data, uploaded):createProduct(data);
      }

      // Success actions
      const params = new URLSearchParams();
      params.set("q", data.name);
      params.set("category", data.category);
      params.set("minPrice", data.price);
      params.set("page", "1");

      router.push(`/dashboard/products?${params.toString()}`);
      router.refresh();
      if(onClose)onClose();

    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);

      // Cleanup orphaned Cloudinary upload
      if (uploaded?.publicId) {
        await deleteFromCloudinary(uploaded.publicId);
      }

      alert(error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } 
  }, [
    isEditMode,
    hasChanged,
    uploadToCloudinary,
    updateProduct,
    createProduct,
    deleteFromCloudinary,
    router,
    onClose
  ]);

  const resetForm = useCallback(() => {
    reset();
    removeImage();
    setUploadProgress(0);
  }, [reset, removeImage]);

  return {
    fileInputRef,
    previewImage,
    uploadProgress,
    formMethods,
    formValues,
    router,
    actions: {
      handleImageChange,
      removeImage,
      onSubmit,
      uploadToCloudinary,
      deleteFromCloudinary,
      createProduct,
      updateProduct,
      resetForm,
    },
    isEditMode,
  };
}
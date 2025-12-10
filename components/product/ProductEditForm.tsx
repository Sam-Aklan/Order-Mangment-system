"use client"

import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  CloudUpload,
  X
} from "lucide-react"

import {
  Input
} from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { FileUpload, FileUploadDropzone, FileUploadTrigger } from "@/components/ui/file-upload"
import { useProductForm } from "@/lib/hooks/product/useProductForm"
import { ProductEditType } from "@/lib/actions/products"
import Image from "next/image"



export default function ProductEditForm(
  { 

 product
}: {

  product:ProductEditType
}
) {

  
  const {formMethods:form, actions,previewImage} =useProductForm({mode:'edit',product})
  const {handleImageChange,onSubmit,removeImage} = actions

  console.log("product",product)
 
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto py-2 md:py-10 h-full md:h-80 lg:h-full md:overflow-y-auto">
        
            <FormField
  control={form.control}
  name="image"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select an Image</FormLabel>
      <FormControl>

        <div className="space-y-4">

          {/* Existing Image Preview (edit mode only) */}
          {previewImage &&  (
            <div>
              <p className="text-sm text-muted-foreground">Current Image</p>
              <div className="w-40 h-40 relative">
                <Button 
                variant={`destructive`} 
                size={`icon-sm`} 
                className="absolute right-2 top-2 p-0  z-5 w-5 h-5 rounded-full" 
                type="button"
                onClick={removeImage}>
                  <X width={10} height={10} />
                </Button>
              <Image
                src={previewImage}
                alt="Current Product"
                className="rounded-md border  w-full object-cover"
                sizes="(max-width:768px) 10rem,"
                fill
              />
              </div>
            </div>
          )}

          {/* File Upload */}
          <FileUpload
            value={field.value ? [field.value] : undefined}
            onValueChange={handleImageChange}
            accept="image/*"
            multiple={false}
          >
            <FileUploadDropzone className="flex-row flex-wrap border-dotted text-center">
              <CloudUpload className="size-4" />
              Drag and drop or
              <FileUploadTrigger asChild>
                <Button variant="link" size="sm" className="p-0">
                  choose files
                </Button>
              </FileUploadTrigger>
              to upload
            </FileUploadDropzone>

          </FileUpload>

        </div>

      </FormControl>

      <FormDescription>Select an image to upload.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                placeholder="shadcn"
                
                type=""
                {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                placeholder="shadcn"
                
                type=""
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input 
                placeholder="shadcn"
                
                type=""
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   <SelectItem value="ELECTRONICS">ELECTRONICS</SelectItem>
              <SelectItem value="FOOD">Food</SelectItem>
              <SelectItem value="BOOKS">Books</SelectItem>
              <SelectItem value="CLOTHING">Clothing</SelectItem>
              <SelectItem value="FURNITURE">Furniture</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
                
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}


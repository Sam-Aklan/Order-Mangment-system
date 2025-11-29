"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from '@/components/ui/file-upload'
import { CloudUpload, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCustomerForm } from '@/lib/hooks/customer/useCustomerForm'
import Image from 'next/image'
import { customerType } from '@/lib/actions/customers'

const TestEditForm = ({customer}:{customer:customerType}) => {
   const {formMethods:form,actions, previewImage}= useCustomerForm({mode:'edit',customer})
   const {onSubmit, handleImageChange, removeImage} = actions
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full lg:max-w-7xl mx-auto py-2 md:py-10 h-fit md:max-w-3xl lg:h-full overflow-y-auto">
        
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
            
                        <FileUploadList>
                          {field.value && (
                            <FileUploadItem value={field.value}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                >
                                  <X />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          )}
                        </FileUploadList>
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
                placeholder="customer name"
                
                type=""
                {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                placeholder="enter your email"
                
                type=""
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default TestEditForm
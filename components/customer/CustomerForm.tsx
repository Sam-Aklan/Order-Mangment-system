import React from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from '../ui/file-upload'
import { CloudUpload, X } from 'lucide-react'
import { Input } from '../ui/input'
import { useCustomerForm } from '@/lib/hooks/customer/useCustomerForm'

const CustomerForm = ({onClose}:{onClose:()=> void}) => {
   const {formMethods:form,actions}= useCustomerForm({onClose,mode:'create'})
   const {onSubmit, handleImageChange} = actions
  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl mx-auto py-2 md:py-10 h-75 md:h-100 lg:h-full overflow-y-auto">
        
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select an Image</FormLabel>
                  <FormControl>
                    <FileUpload
                  value={field.value?[field.value]:undefined}
                  onValueChange={handleImageChange}
                  accept="image/*"
                  onAccept={(e)=>{}}
                  
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
                    
                     { field.value?<FileUploadItem value={field.value}>
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
                    :undefined}
                  </FileUploadList>
                </FileUpload>
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

export default CustomerForm
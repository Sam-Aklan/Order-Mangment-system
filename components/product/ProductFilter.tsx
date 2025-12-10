"use client"

import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import useWindowSize from "@/lib/hooks/useWindowSize"
import FiltersDrawerMobile from "@/components/FiltersDrawerMobile"
import { useProductFilters } from "@/lib/hooks/product/useProductFilters"
import { categoryType } from "@/lib/actions/products"

interface ProductFiltersProps{
  
  searchParams: {
    q?: string;
    category?: categoryType;
    minPrice?: string;
    maxPrice?: string;
  };
  basePath?:string;
}

export default function ProductFilters({searchParams,basePath}:ProductFiltersProps) {

  const {isMobile} = useWindowSize()

  return (
    <div className="">
      {
        isMobile?<FiltersDrawerMobile drawerTitle=" ">
            <FiltersForm searchParams={searchParams} basePath={basePath}/>
        </FiltersDrawerMobile>:<FiltersForm searchParams={searchParams} basePath={basePath} />
      }
    </div>
  )
}

const FiltersForm = ({searchParams, basePath}:ProductFiltersProps)=>{
   const {form,onSubmitHandler} =useProductFilters({basePath,initialCategory:searchParams.category,initialMaxPrice:searchParams.maxPrice, initialMinPrice:searchParams.minPrice,initialQuery:searchParams.q})

    return(
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="w-full min-w-75 px-8 flex flex-col gap-2">
        <div className="grid lg:grid-cols-4  md:grid-cols-2 grid-col-1 md:gap-y-4 gap-y-2 md:gap-x-1 lg:gap-x-4">

        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product name</FormLabel>
              <FormControl>
                <Input 
                placeholder="product name"
                
                type=""
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="minPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Price</FormLabel>
              <FormControl>
                <Input 
                placeholder="min price"
                
                type=""
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="maxPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Price</FormLabel>
              <FormControl>
                <Input 
                placeholder="max price"
                
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
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ELECTRONICS">ELECTRONICS</SelectItem>
          <SelectItem value="FOOD">Food</SelectItem>
          <SelectItem value="BOOKS">Books</SelectItem>
          <SelectItem value="FURNITURE">Furniture</SelectItem>
          <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div>
          <div className=" w-full flex flex-col justify-center items-center md:flex-row gap-2">
        <Button 
        type="submit"
        className="w-full md:w-fit"
        >
          Apply
        </Button>
          <Button 
          variant={`secondary`}
          onClick={()=> form.reset()}
          className="w-full md:w-fit"
          >
            Rest
          </Button>
          </div>
        </div>
      </form>
    </Form>
    )
}
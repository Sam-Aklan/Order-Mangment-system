"use client"

import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  format
} from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Calendar
} from "@/components/ui/calendar"
import {
  Calendar as CalendarIcon
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import useWindowSize from "@/lib/hooks/useWindowSize"
import FiltersDrawerMobile from "@/components/FiltersDrawerMobile"
import { useDashboardFilters } from "@/lib/hooks/useDashboardFilters"

interface DashboardFiltersProps {
  initialFrom?: string;
  initialTo?: string;
  initialGranularity?: "day" | "week" | "month";
  initialStatus?: "PENDING" | "SHIPPED" | "DELIVERED";
  initialCategory?: "ELECTRONICS" | "CLOTHING" | "FOOD" | "BOOKS" | "FURNITURE" | "OTHER";
}

export default function DashboardFilters({initialCategory,initialFrom,initialGranularity,initialStatus,initialTo}:DashboardFiltersProps) {

const {isMobile} = useWindowSize()

  return (
    <div className="md:w-full h-fit">
      {
        isMobile?<FiltersDrawerMobile drawerTitle="Dashboard filters">
          <FormFilters initialCategory={initialCategory} initialFrom={initialFrom} initialGranularity={initialGranularity} initialStatus={initialStatus} initialTo={initialTo}/>
        </FiltersDrawerMobile>
        :<FormFilters initialCategory={initialCategory} initialFrom={initialFrom} initialGranularity={initialGranularity} initialStatus={initialStatus} initialTo={initialTo}/>
      }
   
    </div>
  )
}

const FormFilters = ({initialCategory,initialFrom,initialGranularity,initialStatus,initialTo}:DashboardFiltersProps)=> {

  const{form,onSubmitFilters}=useDashboardFilters({initialCategory,initialFrom,initialGranularity,initialStatus,initialTo})

return (<Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmitFilters)} className=" filters-form flex flex-col">

        <div className="filters__wraper">
      <FormField
      control={form.control}
      name="from"
      render={({ field }) => (
        <FormItem className="flex flex-col ">
          <FormLabel>From</FormLabel>
          <Popover>
            <PopoverTrigger asChild className="w-full max-w-150 min-w-60">
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
        
      <FormField
      control={form.control}
      name="to"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>To</FormLabel>
          <Popover>
            <PopoverTrigger asChild className="w-full max-w-150 min-w-60">
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
        
        <FormField
          control={form.control}
          name="granularity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Granularity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-150 min-w-60">
                    <SelectValue placeholder="Select a granularity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                   <SelectItem value="day">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectTrigger className="w-full max-w-150 min-w-60">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                 {/* <SelectItem value="">All Categories</SelectItem> */}
          <SelectItem value="ELECTRONICS">Electronics</SelectItem>
          <SelectItem value="CLOTHING">Clothing</SelectItem>
          <SelectItem value="FOOD">Food</SelectItem>
          <SelectItem value="BOOKS">Books</SelectItem>
          <SelectItem value="FURNITURE">Furniture</SelectItem>
          <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem  >
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <FormControl>
                  <SelectTrigger className="w-full max-w-150 min-w-60">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* <SelectItem value="">All</SelectItem> */}
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="SHIPPED">Shipped</SelectItem>
          <SelectItem value="DELIVERED">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        </div>

        <div>
        <Button type="submit">Apply</Button>
        </div>

      </form>
    </Form>)}
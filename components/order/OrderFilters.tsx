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
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
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
import { useOrderFilters } from "@/lib/hooks/order/useOrderFilters"
import useWindowSize from "@/lib/hooks/useWindowSize"
import FiltersDrawerMobile from "../FiltersDrawerMobile"

interface OrderFiltersProps {
   initialQuery?: string;
  initialStatus?:"PENDING"| "SHIPPED"| "DELIVERED";
  initialFromDate?: string;
  initialToDate?: string;
}

const TestFilters = ({initialQuery,initialFromDate,initialStatus,initialToDate}:OrderFiltersProps) => {
  const {isMobile}=useWindowSize()
  return (
    <div className="">
      {
        isMobile?<FiltersDrawerMobile drawerTitle=" ">
            <FiltersForm initialFromDate={initialFromDate} initialQuery={initialQuery} initialStatus={initialStatus} initialToDate={initialToDate}/>
        </FiltersDrawerMobile>:<FiltersForm initialFromDate={initialFromDate} initialQuery={initialQuery} initialStatus={initialStatus} initialToDate={initialToDate}/>
      }
    </div>
  )
}




 function FiltersForm({initialFromDate,initialQuery,initialStatus,initialToDate}:OrderFiltersProps) {

  const {form, onSubmitFilters} = useOrderFilters({fromDate:initialFromDate,query:initialQuery,status:initialStatus,toDate:initialToDate})

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitFilters)} className="w-full min-w-75 px-8 flex flex-col gap-2">
        <div className="grid lg:grid-cols-4  md:grid-cols-2 grid-col-1 md:gap-y-4 gap-y-2 md:gap-x-1 lg:gap-x-4">

        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product / Customer</FormLabel>
              <FormControl>
                <Input 
                placeholder="search by product or customer"
                className="w-full max-w-150 min-w-60 lg:min-w-55 xl:w-full"
                type=""
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
      <FormField
      control={form.control}
      name="from"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>From</FormLabel>
          <Popover>
            <PopoverTrigger asChild className="w-full max-w-150 min-w-65 md:min-w-full ">
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] md:max-w-full pl-3 text-left font-normal",
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
          <FormMessage />
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
            <PopoverTrigger asChild className="w-full max-w-150 min-w-65 md:min-w-full">
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] md:max-w-full pl-3 text-left font-normal",
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
          <FormMessage />
        </FormItem>
      )}
    />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-150 min-w-60">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="SHIPPED">Shipped</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <div>

        <Button type="submit">Apply</Button>
        </div>
      </form>
    </Form>
  )
}

export default TestFilters
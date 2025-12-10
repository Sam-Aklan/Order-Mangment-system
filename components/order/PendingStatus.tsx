"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import { PopoverTrigger,Popover, PopoverContent } from "../ui/popover"
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command"
import { statusType } from "@/lib/actions/orders"
import { cn } from "@/lib/utils"

const statuses:statusType[]=['DELIVERED','PENDING','SHIPPED']

const PendingStatus = ({status,setStatus}:{
    setStatus:(value: statusType) => void,
    status?:statusType
}) => {
   
  return (
    <div className="w-full">
         <Popover >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {status?status : "Select Status"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full md:min-w-100 md:max-w-150 lg:min-w-200 lg:max-w-250 p-0">
          <Command>
            

            <CommandList >
              
              <CommandGroup>
                {statuses.map((stat) => (
                  <CommandItem
                    key={stat}
                    value={stat}
                    onSelect={(value) => setStatus(value as statusType) }
                    className="cursor-pointer flex items-center gap-3"
                  >
                    {stat}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        stat === status
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    </CommandItem>
                ))
                }
                    
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default PendingStatus
"use client";

import { useCustomerSelect } from "@/lib/hooks/customer/useCustomerSelect";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput, CommandEmpty, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  previousCustomer?: { id: string; name: string; image?: string };
  onChange: (id: string) => void;
  clearError?:()=>void
}

export default function CustomerSelect({ previousCustomer, onChange,clearError }: Props) {
  const {
    actions,
    customers,
    dropdownRef,
    selectedCustomer,
    loading,
    listRef,
    search,
    open,
  } = useCustomerSelect({ previousCustomer, onChange,clearErrors:clearError });

  const { handleScroll, setOpen, setSearch, handleCustomerSelect } = actions;
  return (
    <div ref={dropdownRef} className="w-full">
      {selectedCustomer && (
        <input type="hidden" name="customerId" value={selectedCustomer.id} />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCustomer
              ? customers.find((c) => c.id === selectedCustomer.id)?.name
              : "Select Customer"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full md:min-w-100 md:max-w-150 lg:min-w-200 lg:max-w-250 p-0">
          <Command>
            <CommandInput
              placeholder="Search customers..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            />

            <CommandList ref={listRef} onScroll={handleScroll}>
              {loading && (
                <div className="p-3 text-sm text-muted-foreground">
                  Loading...
                </div>
              )}

              {!loading && customers.length === 0 && (
                <CommandEmpty>No customers found.</CommandEmpty>
              )}

              <CommandGroup>
                {customers.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={c.name}
                    onSelect={() => handleCustomerSelect(c)}
                    className="cursor-pointer flex items-center gap-3"
                  >
                    <Avatar>
                      <AvatarImage src={c.imageUrl || ""} />
                      <AvatarFallback>{c.name[0]}</AvatarFallback>
                    </Avatar>

                    <span>{c.name}</span>

                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        c.id === selectedCustomer?.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

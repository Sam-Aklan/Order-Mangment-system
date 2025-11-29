import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

  export function validDateString(dateString?: string): Date|undefined {

   if(!dateString) return undefined
   if(isNaN(new Date(dateString).getDate())) return
   return new Date(dateString);
}

  export function validNumberString(dateString?: string): number|undefined {

   if(!dateString) return undefined
   if(isNaN(Number(dateString))) return
   return Number(dateString);
}
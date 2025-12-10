'use client' // Error boundaries must be Client Components
 
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    
    console.error(error)
  }, [error])

 const [isPending, startTranstion]=useTransition()
 const handleRest = ()=>{
    startTranstion(async()=>{
       await Promise.resolve(()=>{
        setTimeout(() => {
            return 1
        }, 500);
       })
    })
 }
 
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-2'>
      <h2>Something went wrong!</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        disabled={isPending}
      >
        <RefreshCw/> try again
      </Button>
    </div>
  )
}
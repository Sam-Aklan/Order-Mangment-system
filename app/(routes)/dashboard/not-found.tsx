import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-full h-screen relative'>
   

      <div className='absolute top-1/2 left-1/2 -translate-1/2'>

      <Link href="/dashboard" >
        <Button>
            <Home/> home
        </Button>
      </Link>
      </div>
    </div>
  )
}
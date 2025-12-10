
import {Drawer,DrawerTrigger,DrawerTitle,DrawerContent,DrawerHeader,DrawerClose, DrawerFooter} from '@/components/ui/drawer'
import { Button } from './ui/button'
import { ListFilter } from 'lucide-react'

const FiltersDrawerMobile = ({drawerTitle,children}:{drawerTitle?:string,children:React.ReactNode}) => {
  return (
    <Drawer >
      <DrawerTrigger asChild>
        <Button variant="ghost" size={`icon-sm`}>
         <ListFilter/> 
          </Button>
      </DrawerTrigger>
      <DrawerContent >
        <div className="mx-auto w-full max-w-sm h-full mt-0 overflow-y-scroll">
         {drawerTitle? <DrawerHeader>
            <DrawerTitle>{drawerTitle}</DrawerTitle>
            
          </DrawerHeader>:undefined}
          
            {children}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default FiltersDrawerMobile
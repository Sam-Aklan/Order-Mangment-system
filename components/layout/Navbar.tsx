"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Avatar,AvatarFallback} from "../ui/avatar"
import useWindowSize from "@/lib/hooks/useWindowSize"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet,SheetContent,SheetFooter, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboardIcon, LogOutIcon, Menu, Package2, ShoppingCart, User } from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const navigationLinks = [
    {
        title:"Dashboard",
        href:"/dashboard",
        icon:<LayoutDashboardIcon/>,
    },
    {
        title:"Orders",
        href:"/dashboard/order",
        icon:<ShoppingCart/>,
    },
    {
        title:"Products",
        href:"/dashboard/products",
        icon:<Package2/>,
    },
    {
        title:"Customers",
        href:"/dashboard/customers",
        icon:<User/>,
    },
]

const Navbar = ({userName,userEmail,}:{userName:string,userEmail:string,}) => {
   const {isMobile} = useWindowSize()
   const router= useRouter()
   
   const handleSigOut = async()=>{
    await signOut()
    router.push('/sign-in')
   }
  
   return(
   <>
   {isMobile?<div className=" w-full flex flex-row-reverse justify-between overflow-x-hidden ">
     <div className="logo-space w-fit p-2">
            <Avatar>
                <AvatarFallback>LO</AvatarFallback>
            </Avatar>
        </div>
    <div className="">
        {/* Mobile sidbar navigation menu */}
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon-lg">
                    <Menu/>
                </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-full max-w-65">
                <SheetTitle></SheetTitle>
                <div className="flex gap-1 flex-col mt-8 mx-2">

                <Avatar className="outline-1">
                        <AvatarFallback  >
                           {userName.slice(0,2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <span>Name</span> : <span>{userName}</span>
                    </div>
                    <div className="text-sm">
                        <span>Email</span> : <span>{userEmail}</span>
                    </div>
                </div>
            <div className="grid gap-2 my-8 mx-1">
                {navigationLinks.map((navigation,i)=> <Link
                key={i}
            href={navigation.href}
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"

          >
            {navigation.icon}
            {navigation.title}
          </Link>)}
            </div>
            
                <Button variant={`ghost`} size={`icon-lg`} className="mx-2 w-fit px-1.5" onClick={handleSigOut}>
                    <LogOutIcon/> logout
                </Button>
            
            </SheetContent>
        </Sheet>
       
    </div>
    </div>
    :<div className="w-full mt-4 overflow-hidden">
        {/* Desktop Navigation bar */}

        <div className="w-full flex justify-evenly items-center">

        <div className="profile-icon">

        <DropdownMenu>
            <DropdownMenuTrigger className="hover:outline-0 focus:outline-0">
                {/* <Button variant="outline" className="rounded-full"> */}
                    <Avatar className="outline-1">
                        <AvatarFallback  >
                           {userName.slice(0,2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                {/* </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>user</DropdownMenuLabel>
                <DropdownMenuItem>{userName}</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuLabel>email</DropdownMenuLabel>
                <DropdownMenuItem>{userEmail}</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <Button variant="secondary" onClick={handleSigOut}>logout</Button>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>

        <div className="naigation-menu ">
            <NavigationMenu>
                <NavigationMenuList>

                    {navigationLinks.map((item,i)=><NavigationMenuItem key={i}>
                        <NavigationMenuLink asChild>
                            <Link href={item.href}>{item.title}</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>)}
                </NavigationMenuList>
                
            </NavigationMenu>
        </div>
        <div className="logo-space">
            <Avatar>
                <AvatarFallback>LO</AvatarFallback>
            </Avatar>
        </div>
        </div>
      
    </div>}
   </>) 
   
  
}

export default Navbar
"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { Menu, User } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useAuth, UserButton } from '@clerk/clerk-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
type Props = {}

const LandingPageNavbar = (props: Props) => {
    const { user } = useUser();
  return (
    <div className='w-full bg-gray-200 flex justify-between items-center px-5 md:px-10 py-1'>        
        <h1 className='px-2 bg-gray-100 rounded-lg font-semibold flex gap-2 '> 
             Opal 
        </h1>
        <div className='flex gap-2 sm:gap-5 items-center'>
            <div className='hidden sm:flex gap-2 text-blue-800'>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/about'}> About </Link>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/home'}> Home </Link>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/dashboard'}> Dashboard </Link>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/pricing'}> Pricing </Link>
            </div>
            <div className='sm:hidden border-2 grid place-items-center'>
                <Sheet>
                  <SheetTrigger><Menu className='' /></SheetTrigger>
                  <SheetContent side={"left"}>
                    <SheetHeader>
                      <SheetTitle>Main Links</SheetTitle>
                        <div className='flex flex-col gap-2 justify-start'>
                            <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/about'}> About </Link>
                            <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/home'}> Home </Link>
                            <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/dashboard'}> Dashboard </Link>
                            <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/pricing'}> Pricing </Link>
                        </div>
                      {/* <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </SheetDescription> */}
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
            </div>            
            {
                user ? 
                <UserButton /> : 
                <Link href={'/auth/sign-in'}>                
                    <Button > <User /> Login </Button>
                </Link>
            }
        </div>
    </div>
  )
}

export default LandingPageNavbar
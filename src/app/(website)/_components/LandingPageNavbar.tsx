import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { Menu, User } from 'lucide-react'

type Props = {}

const LandingPageNavbar = (props: Props) => {
  return (
    <div className='w-full bg-gray-200 flex justify-between items-center px-5 md:px-10 py-1'>        
        <h1 className='px-2 bg-gray-100 rounded-lg font-semibold flex gap-2 '> 
            <Menu className=''/> Opal 
        </h1>
        <div className='flex gap-2 sm:gap-5 items-center'>
            <div className='flex gap-2 text-blue-800'>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/about'}> About </Link>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/about'}> Home </Link>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/about'}> Dashboard </Link>
                <Link className='hover:bg-gray-100 rounded-lg px-1' href={'/about'}> About </Link>
            </div>
            <Link href={'/auth/sign-in'}>                
                <Button > <User /> Login </Button>
            </Link>
        </div>
    </div>
  )
}

export default LandingPageNavbar
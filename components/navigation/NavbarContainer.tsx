'use client'

import { usePathname } from 'next/navigation'
import { IoNotificationsOutline } from 'react-icons/io5'
import { FaUser } from 'react-icons/fa'
import { RxExit } from 'react-icons/rx'
import { capitalize } from 'lodash'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutButton } from '../auth/LogoutButton'

const NavbarContainer = () => {
  const pathName = usePathname()
  const user = useCurrentUser()

  return (
    <div className='w-full h-20 bg-white p-4 flex justify-between items-center'>
      <p className='text-lg font-medium ml-10 lg:ml-0'>
        {pathName === '/' ? 'Dashboard' : capitalize(pathName.split('/')[1])}
      </p>
      <div className='flex items-center gap-5'>
        <IoNotificationsOutline size={25} />
        <DropdownMenu>
          <DropdownMenuTrigger className='flex items-center gap-2 outline-none'>
            <>
              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback className='bg-primary'>
                  <FaUser className='text-white' />
                </AvatarFallback>
              </Avatar>
              <div className='hidden md:flex flex-col items-start'>
                <p>Wade Warren</p>
                <p className='text-xs'>{user?.email}</p>
              </div>
            </>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40' align='end'>
            <LogoutButton>
              <DropdownMenuItem>
                <RxExit className='h-4 w-4 mr-2' />
                Logout
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default NavbarContainer

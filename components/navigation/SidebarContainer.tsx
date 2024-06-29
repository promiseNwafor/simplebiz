'use client'

import { LuChevronsUpDown } from 'react-icons/lu'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RxExit } from 'react-icons/rx'
import { HiOutlineMenuAlt1 } from 'react-icons/hi'

import { sideBarItems } from '@/constants'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutButton } from '../auth/LogoutButton'

const SidebarContainer = () => {
  const pathName = usePathname()
  const user = useCurrentUser()

  return (
    <div className='bg-white fixed top-0 bottom-0'>
      <div className='absolute left-0 h-20 p-4 flex items-center lg:hidden'>
        <HiOutlineMenuAlt1 size={20} />
      </div>
      <div className='w-60 h-screen hidden lg:block p-4'>
        <div className='h-20'>
          <Link href='/'>
            <Image
              src='/images/logo-colored.svg'
              alt='logo'
              width={200}
              height={200}
            />
          </Link>
        </div>
        <div className='flex flex-col gap-4'>
          {sideBarItems.map((item) => {
            const isActive = item.path === pathName

            return (
              <Link
                key={item.displayName}
                href={item.path}
                className={cn(
                  'flex items-center gap-2 p-4 py-3 text-sm text-black font-medium rounded-lg hover:bg-primary/20 hover:text-primary',
                  isActive && 'bg-primary/20 text-primary'
                )}
              >
                <item.Icon size={20} />
                <span>{item.displayName}</span>
              </Link>
            )
          })}
        </div>
        <div className='absolute bottom-5 w-52 p-3 rounded-lg shadow-lg flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/logo-icon.svg'
              alt='logo'
              width={25}
              height={25}
            />
            <div className='flex flex-col items-start'>
              <p className='text-sm font-medium'>Simple Biz</p>
              <p className='text-xs truncate w-32'>{user?.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center justify-between outline-none'>
              <>
                <div className='w-4 p-0'>
                  <LuChevronsUpDown className='h-4 w-4' />
                  <span className='sr-only'>Toggle</span>
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
    </div>
  )
}

export default SidebarContainer

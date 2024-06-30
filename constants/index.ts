import { RxDashboard } from 'react-icons/rx'
import { PiUsersThreeBold } from 'react-icons/pi'
import { CiShop } from 'react-icons/ci'
import { TbReceipt } from 'react-icons/tb'
import { LuWallet } from 'react-icons/lu'
import { IoSettingsOutline } from 'react-icons/io5'
import { IconType } from 'react-icons/lib'

type ISideBarItems = {
  displayName: string
  path: string
  Icon: IconType
}

export const sideBarItems: ISideBarItems[] = [
  {
    displayName: 'Dashboard',
    path: '/',
    Icon: RxDashboard,
  },
  {
    displayName: 'Clients',
    path: '/clients',
    Icon: PiUsersThreeBold,
  },
  {
    displayName: 'Catalogue',
    path: '/catalogue',
    Icon: CiShop,
  },
  {
    displayName: 'Invoices',
    path: '/invoices',
    Icon: TbReceipt,
  },
  {
    displayName: 'Payments',
    path: '/payments',
    Icon: LuWallet,
  },
  {
    displayName: 'Settings',
    path: '/settings',
    Icon: IoSettingsOutline,
  },
]

export const trendData = [
  {
    name: 'Page A',
    uv: 1000,
  },
  {
    name: 'Page B',
    uv: 3000,
  },
  {
    name: 'Page C',
    uv: 2000,
  },
  {
    name: 'Page D',
    uv: 2780,
  },
  {
    name: 'Page E',
    uv: 1890,
  },
  {
    name: 'Page F',
    uv: 2390,
  },
  {
    name: 'Page G',
    uv: 3490,
  },
]

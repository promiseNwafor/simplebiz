import { RxDashboard } from 'react-icons/rx'
import { PiUsersThreeBold } from 'react-icons/pi'
import { CiShop } from 'react-icons/ci'
import { TbReceipt } from 'react-icons/tb'
import { LuWallet } from 'react-icons/lu'
import { IoSettingsOutline } from 'react-icons/io5'
import { IconType } from 'react-icons/lib'

export const CLIENTS_PER_PAGE = 5
export const PRODUCTS_PER_PAGE = 4
export const INVOICES_PER_PAGE = 5
export const PAYMENT_PER_PAGE = 5

export enum SalesDataRange {
  ALL_TIME = 'all-time',
  LAST_7_DAYS = 'last-7-days',
  LAST_MONTH = 'last-month',
  THIS_MONTH = 'this-month',
  THIS_YEAR = 'this-year',
  LAST_YEAR = 'last-year',
}

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

export const userDetailsTitles = [
  {
    name: 'name',
    label: 'Full name',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'phone',
    label: 'Phone number',
  },
  {
    name: 'address',
    label: 'Address',
  },
]

export const businessDetailsTitles = [
  {
    name: 'name',
    label: 'Business name',
  },
  {
    name: 'address',
    label: 'Address',
  },
  {
    name: 'registrationNumber',
    label: 'RC number',
  },
  {
    name: 'description',
    label: 'Business description',
  },
  {
    name: 'industry',
    label: 'Industry',
  },
]

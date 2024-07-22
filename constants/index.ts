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
export const tableData = [
  {
    id: 'clxwf4zsb0002127bux5hndfa',
    clientName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 123-456-7890',
    noInvoices: 5,
    billingAddress: '123 Main St, Springfield, IL, 62701',
  },
  {
    id: 'clxwf4zsb0003127bux5hndfb',
    clientName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+1 987-654-3210',
    noInvoices: 3,
    billingAddress: '456 Elm St, Metropolis, IL, 62960',
  },
  {
    id: 'clxwf4zsb0004127bux5hndfc',
    clientName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phoneNumber: '+1 555-234-5678',
    noInvoices: 7,
    billingAddress: '789 Oak St, Smallville, IL, 62801',
  },
  {
    id: 'clxwf4zsb0005127bux5hndfd',
    clientName: 'Bob Brown',
    email: 'bob.brown@example.com',
    phoneNumber: '+1 444-123-4567',
    noInvoices: 2,
    billingAddress: '101 Maple St, Gotham, IL, 62703',
  },
  {
    id: 'clxwf4zsb0006127bux5hndfe',
    clientName: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    phoneNumber: '+1 333-678-9101',
    noInvoices: 8,
    billingAddress: '202 Pine St, Star City, IL, 62970',
  },
  {
    id: 'clxwf4zsb0007127bux5hndff',
    clientName: 'Diana White',
    email: 'diana.white@example.com',
    phoneNumber: '+1 222-345-6789',
    noInvoices: 4,
    billingAddress: '303 Cedar St, Central City, IL, 62702',
  },
  {
    id: 'clxwf4zsb0008127bux5hndfg',
    clientName: 'Ethan Green',
    email: 'ethan.green@example.com',
    phoneNumber: '+1 111-987-6543',
    noInvoices: 6,
    billingAddress: '404 Birch St, Coast City, IL, 62980',
  },
  {
    id: 'clxwf4zsb0009127bux5hndfh',
    clientName: 'Fiona Black',
    email: 'fiona.black@example.com',
    phoneNumber: '+1 999-456-1234',
    noInvoices: 1,
    billingAddress: '505 Willow St, Hub City, IL, 62704',
  },
]

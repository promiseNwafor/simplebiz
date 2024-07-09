import { ProductType } from '@prisma/client'

export type ClientProps = {
  id: string
  name: string
  email: string
  billingAddress: string
  phone: string
  businessName: string | null
  image: string | null
  invoiceCount: number
  serialNumber: number
}

export type DataCountReturn<T> = {
  count: number
  data: T
}

export type PostResponse =
  | {
      success?: never
      error: string
    }
  | {
      success: string
      error?: never
    }

export type GetResponse<T = unknown> =
  | {
      data?: never
      success: boolean
      error: string
    }
  | {
      success: boolean
      data: DataCountReturn<T>
      error?: never
    }

export type Product = {
  id: string
  name: string
  description: string
  price: number
  type: ProductType
  available: boolean
  imageURL: string
  quantity: number
}

export type ActionMenuProps = {
  [key: string]: {
    onClick: () => void
    Content?: JSX.Element
    title?: string
  }
}

import { Invoice } from '@prisma/client'

export type ClientProps = {
  id: string
  name: string
  email: string
  billingAddress: string
  phone: string
  businessName: string | null
  image: string | null
  invoiceCount: number
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
      data: T
      error?: never
    }

'use server'

import { PRODUCTS_PER_PAGE } from '@/constants'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetResponse, Product } from '@/types'
import { InvoiceStatus } from '@prisma/client'

type GetProducts = (page: number) => Promise<GetResponse<Product[]>>

export const getAllProducts: () => Promise<
  GetResponse<Product[]>
> = async () => {
  try {
    const user = await currentUser()

    const count = await db.product.count({
      where: {
        userId: user?.id,
      },
    })

    const data = await db.product.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: { updatedAt: 'desc' },
    })

    return { data: { data, count }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting products', success: false }
  }
}

export const getProducts: GetProducts = async (page) => {
  try {
    const user = await currentUser()

    const itemsPerPage = PRODUCTS_PER_PAGE
    const offset = (page - 1) * itemsPerPage

    const count = await db.product.count({
      where: {
        userId: user?.id,
      },
    })

    const data = await db.product.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: itemsPerPage,
    })

    return { data: { data, count }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting products', success: false }
  }
}

export const getProduct = async (id: string): Promise<GetResponse<Product>> => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const data = await db.product.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!data) {
      return { error: 'Product not found', success: false }
    }

    return { data: { data, count: 1 }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting product', success: false }
  }
}

export type GetProductDetailReturn = Product & {
  totalPayments: number
  allInvoiceCount: number
  completedInvoiceCount: number
  pendingInvoiceCount: number
}

export const getProductDetail = async (productId: string) => {
  try {
    const allCount = await db.invoiceProduct.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        productId,
      },
    })

    const pendingCount = await db.invoiceProduct.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        productId,
        invoice: {
          status: InvoiceStatus.UNPAID,
        },
      },
    })

    const expiredCount = await db.invoiceProduct.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        productId,
        invoice: {
          status: InvoiceStatus.OVERDUE,
        },
      },
    })

    const totalEarning = await db.invoiceProduct.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        productId,
        invoice: {
          status: InvoiceStatus.PAID,
        },
      },
    })

    const data = {
      allCount: allCount._sum.quantity || 0,
      pendingCount: pendingCount._sum.quantity || 0,
      expiredCount: expiredCount._sum.quantity || 0,
      totalEarning: totalEarning._sum.amount || 0,
    }

    return { data, success: true }
  } catch (error) {
    console.error(error)
    return {
      error: `${error || 'Error getting client details'}`,
      success: false,
    }
  }
}

export const getProductInvoices = async (productId: string) => {
  try {
    const invoiceProducts = await db.invoiceProduct.findMany({
      where: {
        productId: productId,
      },
      include: {
        invoice: true,
      },
    })

    return {
      data: invoiceProducts,
    }
  } catch (error) {
    console.error(error)
    return {
      error: `${error || 'Error getting client details'}`,
      success: false,
    }
  }
}

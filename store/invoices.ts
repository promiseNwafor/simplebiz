'use server'

import { Invoice, InvoiceStatus } from '@prisma/client'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetResponse } from '@/types'
import { INVOICES_PER_PAGE } from '@/constants'
import { getInvoiceByRef } from '@/data/invoices'

type GetInvoices = (page: number) => Promise<GetResponse<Invoice[]>>

export const getInvoices: GetInvoices = async (page) => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const itemsPerPage = INVOICES_PER_PAGE
    const offset = (page - 1) * itemsPerPage

    // check if some invoices are overdue and set status to OVERDUE
    await db.invoice.updateMany({
      where: {
        userId,
        dueDate: {
          lt: new Date(),
        },
        status: InvoiceStatus.UNPAID,
      },
      data: {
        status: InvoiceStatus.OVERDUE,
      },
    })

    const count = await db.invoice.count({
      where: {
        userId,
      },
    })

    const data = await db.invoice.findMany({
      where: {
        userId,
      },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: itemsPerPage,
    })

    return { data: { data, count }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting invoices', success: false }
  }
}

export const getInvoiceById = async (
  id: string
): Promise<GetResponse<Invoice>> => {
  try {
    const data = await db.invoice.findUnique({
      where: {
        id,
      },
    })

    if (!data) {
      return { error: 'Invoice not found', success: false }
    }

    return { data: { data, count: 1 }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting invoice', success: false }
  }
}

export const getInvoiceByToken = async (
  token: string
): Promise<GetResponse<Invoice>> => {
  try {
    const data = await db.paymentToken.findUnique({
      where: {
        token,
      },
    })

    if (!data) {
      return { error: 'Token not found', success: false }
    }

    if (new Date(data.expires) < new Date()) {
      throw new Error('Token expired! Please contact support')
    }

    const invoice = await getInvoiceByRef(data.ref)

    return { data: { data: invoice as Invoice, count: 1 }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting invoice', success: false }
  }
}

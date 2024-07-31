'use server'

import { CLIENTS_PER_PAGE } from '@/constants'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  ClientNameAndBiz,
  ClientProps,
  GetResponse,
  GetSingleRes,
} from '@/types'
import { Client, InvoiceStatus, Payment } from '@prisma/client'

type GetClients = (page: number) => Promise<GetResponse<ClientProps[]>>

export const getClients: GetClients = async (page) => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const itemsPerPage = CLIENTS_PER_PAGE
    const offset = (page - 1) * itemsPerPage

    // Get the total count of clients for the user
    const count = await db.client.count({
      where: {
        userId,
      },
    })

    const data = await db.client.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        billingAddress: true,
        businessName: true,
        image: true,
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: itemsPerPage,
    })

    const transformedData = data.map((item, index) => {
      const { _count, ...rest } = item
      return {
        ...rest,
        invoiceCount: _count.invoices,
        serialNumber: (page - 1) * itemsPerPage + index + 1,
      }
    })
    return { data: { data: transformedData, count }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting clients', success: false }
  }
}

export const getClientsNameAndBiz = async (): Promise<
  GetResponse<ClientNameAndBiz[]>
> => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const data = await db.client.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        businessName: true,
      },
    })

    return { data: { data, count: data.length }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting clients', success: false }
  }
}

export const getClient = async (id: string): Promise<GetResponse<Client>> => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const data = await db.client.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!data) {
      return { error: 'Client not found', success: false }
    }

    return { data: { data, count: 1 }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting client', success: false }
  }
}

export type GetClientDetailsReturn = Client & {
  totalPayments: number
  allInvoiceCount: number
  completedInvoiceCount: number
  pendingInvoiceCount: number
}

type GetClientDetails = (
  clientId: string
) => Promise<GetSingleRes<GetClientDetailsReturn>>

export const getClientDetails: GetClientDetails = async (clientId: string) => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const clientDetails = await db.client.findFirst({
      where: {
        id: clientId,
        userId,
      },
    })

    // get total amount of payment completed by the client and number of completed transactions
    const payments = await db.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId,
        clientId,
      },
    })

    const allInvoiceCount = await db.invoice.count({
      where: {
        userId,
        clientId,
      },
    })

    const completedInvoiceCount = await db.invoice.count({
      where: {
        userId,
        clientId,
        status: InvoiceStatus.PAID,
      },
    })

    const pendingInvoiceCount = await db.invoice.count({
      where: {
        userId,
        clientId,
        status: InvoiceStatus.UNPAID,
      },
    })

    const data = {
      ...clientDetails,
      totalPayments: payments._sum.amount || 0,
      allInvoiceCount,
      completedInvoiceCount,
      pendingInvoiceCount,
    } as GetClientDetailsReturn

    return { data, success: true }
  } catch (error) {
    console.error(error)
    return {
      error: `${error || 'Error getting client details'}`,
      success: false,
    }
  }
}

export const getClientPayments = async (
  clientId: string
): Promise<GetResponse<Payment[]>> => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const count = await db.payment.count({
      where: {
        userId,
        clientId,
      },
    })

    const data = await db.payment.findMany({
      where: {
        userId,
        clientId,
      },
    })

    return { data: { data, count }, success: true }
  } catch (error) {
    console.error(error)
    return {
      error: `${error || 'Error getting client details'}`,
      success: false,
    }
  }
}

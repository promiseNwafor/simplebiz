'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ClientProps, GetResponse } from '@/types'
import { Client } from '@prisma/client'

type GetClients = (
  page: number,
  itemsPerPage: number
) => Promise<GetResponse<ClientProps[]>>

export const getClients: GetClients = async (page, itemsPerPage) => {
  try {
    const user = await currentUser()
    const userId = user?.id

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

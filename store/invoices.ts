'use server'

import { Invoice } from '@prisma/client'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetResponse } from '@/types'
import { INVOICES_PER_PAGE } from '@/constants'

type GetInvoices = (page: number) => Promise<GetResponse<Invoice[]>>

export const getInvoices: GetInvoices = async (page) => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const itemsPerPage = INVOICES_PER_PAGE
    const offset = (page - 1) * itemsPerPage

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

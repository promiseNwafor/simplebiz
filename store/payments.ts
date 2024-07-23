'use server'

import { Payment } from '@prisma/client'
import { PAYMENT_PER_PAGE } from '@/constants'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetResponse } from '@/types'

type GetPayments = (page: number) => Promise<GetResponse<Payment[]>>

export const getPayments: GetPayments = async (page) => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const itemsPerPage = PAYMENT_PER_PAGE
    const offset = (page - 1) * itemsPerPage

    const count = await db.payment.count({
      where: {
        userId,
      },
    })

    const data = await db.payment.findMany({
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
    return { error: 'Error getting payments', success: false }
  }
}

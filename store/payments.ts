'use server'

import { Payment, PaymentDetail } from '@prisma/client'
import { PAYMENT_PER_PAGE } from '@/constants'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { GetResponse, Wallet } from '@/types'

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

type GetWalletDetails = () => Promise<GetResponse<Wallet>>

export const getWalletDetails: GetWalletDetails = async () => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const data = (await db.wallet.findUnique({
      where: {
        userId,
      },
    })) as Wallet

    return { data: { data, count: 1 }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting wallet details', success: false }
  }
}

type GetPaymentDetails = () => Promise<GetResponse<PaymentDetail>>

export const getPaymentDetails: GetPaymentDetails = async () => {
  try {
    const user = await currentUser()
    const userId = user?.id

    const data = (await db.paymentDetail.findUnique({
      where: {
        userId,
      },
    })) as PaymentDetail

    return { data: { data, count: 1 }, success: true }
  } catch (error) {
    console.error(error)
    return { error: 'Error getting payment details', success: false }
  }
}

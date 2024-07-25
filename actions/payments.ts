'use server'

import { InvoiceStatus, WithdrawalStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { Payment } from '@/types'
import {
  PaymentAccountSchema,
  PaymentAccountSchemaValues,
  PaymentWithdrawalSchema,
  PaymentWithdrawalSchemaValues,
} from '@/schemas'
import { currentUser } from '@/lib/auth'
import { generateWithdrawalReference } from '@/lib'
import { sendWithdrawalEmail } from '@/lib/mail'

export const addPayment = async (values: Payment) => {
  try {
    const { id, amount, clientName, invoiceRef, token } = values

    await db.payment.create({
      data: {
        userId: id,
        amount,
        clientName,
        invoiceRef,
      },
    })

    // update invoice status
    await db.invoice.update({
      where: { invoiceRef },
      data: { status: InvoiceStatus.PAID },
    })

    // create or update wallet
    await db.wallet.upsert({
      where: {
        userId: id,
      },
      create: {
        userId: id,
        balance: amount,
      },
      update: {
        balance: {
          increment: amount,
        },
      },
    })

    // delete payment token
    await db.paymentToken.delete({
      where: { token },
    })

    return { success: 'Payment added successfully' }
  } catch (error) {
    console.error(error)

    return { error: 'Could not add payment! Please reach out to support' }
  }
}

export const addPaymentDetails = async (values: PaymentAccountSchemaValues) => {
  try {
    const validatedFields = PaymentAccountSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { accountName, accountNumber, bankName } = validatedFields.data
    const user = await currentUser()

    let wallet = await db.wallet.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId: user.id,
        },
      })
    }

    await db.paymentDetail.create({
      data: {
        userId: user.id,
        walletId: wallet.id,
        accountName,
        accountNumber,
        bankName,
      },
    })

    return { success: 'Payment details added successfully' }
  } catch (error) {
    console.error(error)

    return {
      error: `Could not add payment details! ${(error as Error).message}`,
    }
  }
}

export const editPaymentDetails = async (
  values: PaymentAccountSchemaValues
) => {
  try {
    const validatedFields = PaymentAccountSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { accountName, accountNumber, bankName } = validatedFields.data
    const user = await currentUser()

    const wallet = await db.wallet.findUnique({
      where: {
        userId: user.id,
      },
    })

    await db.paymentDetail.create({
      data: {
        userId: user.id,
        walletId: wallet?.id as string,
        accountName,
        accountNumber,
        bankName,
      },
    })

    return { success: 'Payment details added successfully' }
  } catch (error) {
    console.error(error)

    return {
      error: `Could not add payment details! ${(error as Error).message}`,
    }
  }
}

export const requestWithdrawal = async (
  values: PaymentWithdrawalSchemaValues,
  balance: number
) => {
  try {
    const validatedFields = PaymentWithdrawalSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { amount, paymentDetailId } = validatedFields.data

    if (amount > balance) {
      return { error: 'Amount exceeds wallet balance!' }
    }

    const user = await currentUser()
    const ref = generateWithdrawalReference()

    const paymentDetail = await db.paymentDetail.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (!paymentDetail) {
      return { error: 'Payment detail not found!' }
    }

    const withdrawalRes = await db.withdrawal.create({
      data: {
        userId: user.id,
        paymentDetailId,
        amount,
        withdrawalRef: ref,
      },
    })

    await sendWithdrawalEmail({
      withdrawalId: withdrawalRes.id,
      email: 'promisenwafor955@gmail.com',
      name: user.name,
      amount,
      accountName: paymentDetail.accountName,
      accountNumber: paymentDetail.accountNumber,
      bankName: paymentDetail.bankName,
    })

    return { success: 'Withdrawal requested successfully' }
  } catch (error) {
    console.error(error)

    return {
      error: `Something went wrong! ${(error as Error).message}`,
    }
  }
}

export const updateWithdrawalStatus = async (id: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return {
        error:
          'User not found! You have to be logged in to complete this action.',
      }
    }

    const withdrawalRes = await db.withdrawal.update({
      where: {
        id,
      },
      data: {
        status: WithdrawalStatus.COMPLETED,
      },
    })

    console.log('++++++++++++++', withdrawalRes)

    await db.wallet.update({
      where: {
        userId: user.id,
      },
      data: {
        balance: {
          decrement: withdrawalRes.amount,
        },
      },
    })

    return { success: 'Status updated!' }
  } catch (error) {
    console.error(error)

    return {
      error: `Something went wrong! ${(error as Error).message}`,
    }
  }
}

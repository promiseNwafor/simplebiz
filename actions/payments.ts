'use server'

import { InvoiceStatus } from '@prisma/client'
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
  values: PaymentWithdrawalSchemaValues
) => {
  try {
    const validatedFields = PaymentWithdrawalSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { amount, paymentDetailId } = validatedFields.data

    const user = await currentUser()
    const ref = generateWithdrawalReference()

    await db.withdrawal.create({
      data: {
        userId: user.id,
        paymentDetailId: paymentDetailId,
        amount: Number(amount),
        withdrawalRef: ref,
      },
    })

    const paymentDetail = await db.paymentDetail.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (!paymentDetail) {
      return { error: 'Payment detail not found!' }
    }

    await sendWithdrawalEmail({
      email: 'promisenwafor955@gmail.com',
      name: user.name,
      amount: Number(amount),
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

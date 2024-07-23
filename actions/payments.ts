'use server'

import { InvoiceStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { Payment } from '@/types'

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

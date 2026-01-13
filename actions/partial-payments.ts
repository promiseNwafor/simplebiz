'use server'

import { db } from '@/lib/db'
import { InvoiceStatus } from '@prisma/client'
import { PartialPaymentSchema, PartialPaymentSchemaValues } from '@/schemas'
import { currentUser } from '@/lib/auth'

/**
 * Add a partial payment to an invoice
 * This function handles partial payments and updates invoice status accordingly
 */
export const addPartialPayment = async (values: PartialPaymentSchemaValues) => {
  try {
    const validatedFields = PartialPaymentSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!', details: validatedFields.error.errors }
    }

    const { invoiceId, amount, paymentMethod, notes } = validatedFields.data
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Get the invoice
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true },
    })

    if (!invoice) {
      return { error: 'Invoice not found' }
    }

    // Verify invoice belongs to user
    if (invoice.userId !== user.id) {
      return { error: 'Unauthorized access to invoice' }
    }

    const currentPaidAmount = invoice.paidAmount || 0
    const newPaidAmount = currentPaidAmount + amount
    const outstandingBalance = invoice.amount - newPaidAmount

    // Validate payment amount doesn't exceed invoice amount
    if (newPaidAmount > invoice.amount) {
      return {
        error: `Payment amount exceeds invoice total. Maximum payment allowed: ${invoice.amount - currentPaidAmount}`,
      }
    }

    // Determine new invoice status
    let newStatus: InvoiceStatus = invoice.status
    if (outstandingBalance <= 0) {
      newStatus = InvoiceStatus.PAID
    } else if (newPaidAmount > 0 && newPaidAmount < invoice.amount) {
      newStatus = InvoiceStatus.PARTIALLY_PAID
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        amount,
        clientName: invoice.issuedTo,
        clientId: invoice.clientId,
        invoiceRef: invoice.invoiceRef,
      },
    })

    // Create payment record link
    await db.paymentRecord.create({
      data: {
        invoiceId: invoice.id,
        paymentId: payment.id,
        amount,
        paymentMethod: paymentMethod || 'ONLINE',
        notes: notes || null,
      },
    })

    // Update invoice with new paid amount and status
    await db.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        outstandingBalance,
        status: newStatus,
      },
    })

    // Update wallet balance
    await db.wallet.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        balance: amount,
      },
      update: {
        balance: {
          increment: amount,
        },
      },
    })

    return {
      success: 'Partial payment added successfully',
      data: {
        paidAmount: newPaidAmount,
        outstandingBalance,
        status: newStatus,
      },
    }
  } catch (error) {
    console.error('Error adding partial payment:', error)
    return {
      error: `Could not add partial payment! ${(error as Error).message}`,
    }
  }
}

/**
 * Get payment history for an invoice
 */
export const getInvoicePaymentHistory = async (invoiceId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Verify invoice belongs to user
    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice || invoice.userId !== user.id) {
      return { error: 'Invoice not found or unauthorized' }
    }

    // Get all payment records for this invoice
    const paymentRecords = await db.paymentRecord.findMany({
      where: { invoiceId },
      include: {
        payment: {
          select: {
            id: true,
            amount: true,
            paymentDate: true,
            transactionNo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      data: paymentRecords,
    }
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return {
      error: `Could not fetch payment history! ${(error as Error).message}`,
    }
  }
}

/**
 * Get invoice with payment details
 */
export const getInvoiceWithPayments = async (invoiceId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    const invoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!invoice || invoice.userId !== user.id) {
      return { error: 'Invoice not found or unauthorized' }
    }

    const paymentHistory = await getInvoicePaymentHistory(invoiceId)

    return {
      success: true,
      data: {
        invoice,
        paymentHistory: paymentHistory.data || [],
        paidAmount: invoice.paidAmount || 0,
        outstandingBalance: invoice.outstandingBalance || invoice.amount,
      },
    }
  } catch (error) {
    console.error('Error fetching invoice with payments:', error)
    return {
      error: `Could not fetch invoice! ${(error as Error).message}`,
    }
  }
}

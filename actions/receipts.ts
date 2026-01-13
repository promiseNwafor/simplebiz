'use server'

import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { generateReceipt } from '@/lib/receipts'
import { sendReceiptEmail } from '@/lib/mail'

/**
 * Generate and download a receipt for a payment
 */
export const downloadReceipt = async (paymentId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated', success: false }
    }

    // Get payment with related data
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true,
      },
    })

    if (!payment) {
      return { error: 'Payment not found', success: false }
    }

    // Verify payment belongs to user
    if (payment.userId !== user.id) {
      return { error: 'Unauthorized access to payment', success: false }
    }

    // Get invoice details
    const invoice = await db.invoice.findUnique({
      where: { invoiceRef: payment.invoiceRef },
      include: {
        client: true,
      },
    })

    if (!invoice) {
      return { error: 'Invoice not found', success: false }
    }

    // Get payment record for payment method
    const paymentRecord = await db.paymentRecord.findFirst({
      where: { paymentId },
    })

    // Generate receipt PDF
    const receiptBase64 = await generateReceipt({
      payment: {
        ...payment,
        client: invoice.client,
      },
      invoiceRef: payment.invoiceRef,
      invoiceAmount: invoice.amount,
      paidAmount: invoice.paidAmount || payment.amount,
      outstandingBalance: invoice.outstandingBalance,
      paymentMethod: paymentRecord?.paymentMethod || 'ONLINE',
    })

    return {
      data: {
        pdfBase64: receiptBase64,
        fileName: `Receipt-${payment.transactionNo}-${payment.invoiceRef}.pdf`,
      },
      success: 'Receipt generated successfully',
    }
  } catch (error) {
    console.error('Error generating receipt:', error)
    return {
      error: `Error generating receipt: ${(error as Error).message}`,
      success: false,
    }
  }
}

/**
 * Send receipt via email
 */
export const sendReceipt = async (paymentId: string, email?: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'User not authenticated' }
    }

    // Get payment with related data
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      return { error: 'Payment not found' }
    }

    // Verify payment belongs to user
    if (payment.userId !== user.id) {
      return { error: 'Unauthorized access to payment' }
    }

    // Get invoice and client details
    const invoice = await db.invoice.findUnique({
      where: { invoiceRef: payment.invoiceRef },
      include: {
        client: true,
      },
    })

    if (!invoice || !invoice.client) {
      return { error: 'Invoice or client not found' }
    }

    // Get payment record for payment method
    const paymentRecord = await db.paymentRecord.findFirst({
      where: { paymentId },
    })

    // Generate receipt PDF
    const receiptBase64 = await generateReceipt({
      payment: {
        ...payment,
        client: invoice.client,
      },
      invoiceRef: payment.invoiceRef,
      invoiceAmount: invoice.amount,
      paidAmount: invoice.paidAmount || payment.amount,
      outstandingBalance: invoice.outstandingBalance,
      paymentMethod: paymentRecord?.paymentMethod || 'ONLINE',
    })

    // Send email
    const recipientEmail = email || invoice.client.email
    const emailResult = await sendReceiptEmail(
      recipientEmail,
      receiptBase64,
      payment.transactionNo,
      payment.invoiceRef
    )

    if (emailResult?.error) {
      return { error: 'Failed to send receipt email' }
    }

    return { success: 'Receipt sent successfully' }
  } catch (error) {
    console.error('Error sending receipt:', error)
    return {
      error: `Error sending receipt: ${(error as Error).message}`,
    }
  }
}

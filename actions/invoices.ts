'use server'

import fs from 'fs/promises'
import { InvoiceSchema, InvoiceSchemaValues } from '@/schemas'
import { getClient } from '@/store/clients'
import { sendInvoiceEmail, sendInvoiceReminderEmail } from '@/lib/mail'
import { generateInvoice, generateInvoiceReference } from '@/lib'
import { db } from '@/lib/db'
import { generatePaymentToken } from '@/lib/tokens'
import { currentUser } from '@/lib/auth'
import { getRemindersSettings } from '@/store/settings'
import { InvoiceStatus } from '@prisma/client'

export const readImageFile = async (filePath: string) => {
  const data = await fs.readFile(filePath)
  return data.buffer
}

export const sendInvoice = async (values: InvoiceSchemaValues) => {
  try {
    const validatedFields = InvoiceSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { client, selectedProducts, dueDate } = validatedFields.data

    const clientRes = await getClient(client)
    const selectedClient = clientRes?.data?.data

    if (!selectedClient) {
      return { error: 'Client not found!' }
    }

    // Compute total amount
    const totalAmount = selectedProducts.reduce(
      (acc, product) => acc + product.total,
      0
    )

    const ref = generateInvoiceReference()
    const issueDate = new Date().toISOString()
    const due = new Date(dueDate).toISOString()

    // Generate invoice
    const invoiceContent = await generateInvoice({
      client: selectedClient,
      products: selectedProducts,
      totalAmount,
      date: { due, issued: issueDate },
      ref,
    })

    // Add invoice to the database
    const dbRes = await db.invoice.create({
      data: {
        userId: selectedClient.userId,
        clientId: selectedClient.id,
        issuedTo: selectedClient.name,
        dueDate: due,
        amount: totalAmount,
        issueDate,
        invoiceRef: ref,
        products: {
          create: selectedProducts.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
            amount: product.total,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!dbRes) {
      return { error: 'Error occurred while saving invoice!' }
    }

    const paymentToken = await generatePaymentToken(ref, due)

    if (!paymentToken) {
      return { error: 'Error occurred!' }
    }

    // Send email
    const emailRes = await sendInvoiceEmail(
      paymentToken.token,
      selectedClient.email,
      invoiceContent
    )

    if (!emailRes || emailRes.error) {
      db.invoice.delete({
        where: {
          id: dbRes.id,
        },
      })

      return { error: 'Error occurred while sending email!' }
    }

    return {
      success: 'Invoice sent successfully!',
      data: invoiceContent,
    }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}

export const downloadInvoice = async (id: string) => {
  try {
    const user = await currentUser()

    const invoice = await db.invoice.findUnique({
      where: { id, userId: user.id },
      include: {
        client: true,
        user: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!invoice) {
      return { error: 'Invoice not found', success: false }
    }

    const products = invoice.products.map((p) => ({
      id: p.product.id,
      name: p.product.name,
      quantity: p.quantity,
      price: p.product.price,
      total: p.quantity * p.product.price,
    }))

    const pdfBase64 = await generateInvoice({
      client: invoice.client,
      products,
      totalAmount: invoice.amount,
      date: {
        issued: new Date(invoice.issueDate).toISOString(),
        due: new Date(invoice.dueDate).toISOString(),
      },
      ref: invoice.invoiceRef,
      status: invoice.status,
    })

    return {
      data: { pdfBase64, fileName: `Invoice-${invoice.invoiceRef}.pdf` },
      success: 'Invoice generated successfully',
    }
  } catch (error) {
    console.error(error)
    return { error: `${error || 'Error generating invoice'}`, success: false }
  }
}

export const sendInvoiceReminders = async () => {
  try {
    const user = await currentUser()

    // check that the user has enabled reminders
    const remindersSettings = await getRemindersSettings()

    if (!remindersSettings.data?.enableReminders) {
      return
    }

    // get all unpaid invoices
    const unpaidInvoiceDetails = await db.invoice.findMany({
      where: {
        userId: user.id,
        status: InvoiceStatus.UNPAID,
      },
      include: {
        client: true,
      },
    })

    // send invoice reminders to all involved clients
    for (const unpaidInvoice of unpaidInvoiceDetails) {
      await sendInvoiceReminderEmail(
        unpaidInvoice.id,
        unpaidInvoice.client.email
      )
    }

    console.log('Invoice reminders sent successfully')
  } catch (error) {
    console.error('Error sending invoice reminders:', error)
  }
}

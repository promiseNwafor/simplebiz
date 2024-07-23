'use server'

import fs from 'fs/promises'
import { InvoiceSchema, InvoiceSchemaValues } from '@/schemas'
import { getClient } from '@/store/clients'
import { sendInvoiceEmail } from '@/lib/mail'
import { generateInvoice, generateInvoiceReference } from '@/lib'
import { db } from '@/lib/db'
import { generatePaymentToken } from '@/lib/tokens'

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
      'promisenwafor955@gmail.com',
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

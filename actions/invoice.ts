'use server'

import { InvoiceSchema, InvoiceSchemaValues } from '@/schemas'
import { getClient } from '@/store/clients'
import { sendInvoiceEmail } from '@/lib/mail'
import { generateInvoice } from '@/lib'
import { db } from '@/lib/db'

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

    // Generate invoice
    const invoiceContent = await generateInvoice(
      selectedClient,
      selectedProducts,
      totalAmount
    )

    // Send email and add invoice to the database concurrently
    await Promise.all([
      sendInvoiceEmail('promisenwafor955@gmail.com', invoiceContent),
      db.invoice.create({
        data: {
          userId: selectedClient.userId,
          clientId: selectedClient.id,
          issuedTo: selectedClient.name,
          dueDate: new Date(dueDate).toISOString(),
          amount: totalAmount,
        },
      }),
    ])

    return {
      success: 'Invoice sent successfully!',
      data: invoiceContent,
    }
  } catch (error) {
    console.error(error)
    return { error: 'Something went wrong!' }
  }
}

import { db } from '@/lib/db'

export const getInvoiceByRef = async (ref: string) => {
  try {
    const data = await db.invoice.findUnique({
      where: {
        invoiceRef: ref,
      },
    })

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

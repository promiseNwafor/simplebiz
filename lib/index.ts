import { SelectedProducts } from '@/components/invoices/InvoiceForm'
import { Client } from '@prisma/client'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export const ngnFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  // minimumFractionDigits: 0,
  // maximumFractionDigits: 0,
})

export const generateInvoice = async (
  client: Client,
  products: SelectedProducts[],
  totalAmount: number
) => {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 800])

  const { height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText('Invoice', {
    x: 50,
    y: height - 50,
    size: 25,
    font,
    color: rgb(0, 0, 0),
  })

  page.drawText(`Client: ${client.name}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  })

  page.drawText(`Email: ${client.email}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  })

  let yPosition = height - 160
  products.forEach((product) => {
    page.drawText(
      `${product.name} - ${product.quantity} x ${product.price} = ${product.total}`,
      {
        x: 50,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      }
    )
    yPosition -= 20
  })

  page.drawText(`Total: ${totalAmount}`, {
    x: 50,
    y: yPosition - 20,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()
  const base64String = Buffer.from(pdfBytes).toString('base64')
  return base64String
}

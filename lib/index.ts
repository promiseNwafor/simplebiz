import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import path from 'path'
import { Client } from '@prisma/client'
import { SelectedProducts } from '@/components/invoices/InvoiceForm'
import { getBusinessDetail } from '@/data/account'
import { readImageFile } from '@/actions/invoices'

export const ngnFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  // minimumFractionDigits: 0,
  // maximumFractionDigits: 0,
})

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export const generateInvoiceReference = () => {
  const timestamp = Date.now()
  return `INV-${timestamp}`
}

export const generateWithdrawalReference = () => {
  const timestamp = Date.now()
  return `WD-${timestamp}`
}

type GenerateInvoice = {
  client: Client
  products: SelectedProducts[]
  totalAmount: number
  date: {
    due: string
    issued: string
  }
  ref: string
}

export const generateInvoice: (
  props: GenerateInvoice
) => Promise<string> = async ({ client, products, totalAmount, date, ref }) => {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89])

  const business = await getBusinessDetail(client.userId)

  const invoiceCol1 = [
    `Payable: NGN ${totalAmount}`,
    `Due: ${formatDate(new Date(date.due))}`,
    `Issued: ${formatDate(new Date(date.issued))}`,
    `Ref: ${ref}`,
  ]

  const invoiceCol2 = [
    'Billed to',
    client.businessName || client.name,
    client.billingAddress,
    client.email,
  ]

  const invoiceCol3 = [
    'From',
    business?.name || '',
    business?.address || '',
    `Reg: ${business?.registrationNumber}`,
  ]

  const logoPath = path.resolve('public/images/logo-colored.png')
  const logoBytes = await readImageFile(logoPath)
  const logoImage = await pdfDoc.embedPng(logoBytes)

  const { width: logoWidth, height: logoHeight } = logoImage.scale(0.6)

  const { height } = page.getSize()
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const x = 30
  const size = 10
  const color = rgb(0, 0, 0)

  page.drawText('Invoice', {
    x,
    y: height - 50,
    size: 25,
    font: boldFont,
    color,
  })

  page.drawImage(logoImage, {
    x: 450,
    y: height - 50,
    width: logoWidth,
    height: logoHeight,
  })

  invoiceCol1.forEach((row, i) => {
    const col2Item = invoiceCol2[i]
    const col3Item = invoiceCol3[i]
    const y = height - (80 + (i + 1) * 15)
    const opacity = i === 0 ? 1 : 0.7

    page.drawText(row, {
      x,
      y,
      size,
      font,
      color,
      opacity,
    })
    page.drawText(col2Item, {
      x: 250,
      y,
      size,
      font,
      color,
      opacity,
    })
    page.drawText(col3Item, {
      x: 450,
      y,
      size,
      font,
      color,
      opacity,
    })
  })

  page.drawLine({
    start: {
      x: x * 3,
      y: height - 190,
    },
    end: {
      x: x * 3,
      y: height - (245 + products.length * 20),
    },
    thickness: 2,
    color: rgb(0 / 255, 134 / 255, 120 / 255),
  })

  page.drawText('ITEM DESCRIPTION', {
    x: x * 3 + 10,
    y: height - 200,
    size: 8,
    font,
    color,
    opacity: 0.7,
  })
  page.drawText('QTY', {
    x: x * 3 + 200,
    y: height - 200,
    size: 8,
    font,
    color,
    opacity: 0.7,
  })
  page.drawText('RATE (NGN)', {
    x: x * 3 + 250,
    y: height - 200,
    size: 8,
    font,
    color,
    opacity: 0.7,
  })
  page.drawText('AMOUNT (NGN)', {
    x: x * 3 + 350,
    y: height - 200,
    size: 8,
    font,
    color,
    opacity: 0.7,
  })

  products.forEach((product, i) => {
    const y = height - (200 + (i + 1) * 20)
    const xPos = x * 3

    page.drawText(product.name, {
      x: xPos + 10,
      y,
      size,
      font,
      color,
    })
    page.drawText(`${product.quantity}`, {
      x: xPos + 200,
      y,
      size,
      font,
      color,
    })
    page.drawText(`${product.price}`, {
      x: xPos + 250,
      y,
      size,
      font,
      color,
    })
    page.drawText(`${product.total}`, {
      x: xPos + 350,
      y,
      size,
      font,
      color,
    })

    i === products.length - 1 &&
      page.drawLine({
        start: { x: xPos + 10, y: y - 15 },
        end: { x: xPos + 450, y: y - 15 },
        thickness: 0.7,
        color: rgb(0, 0, 0),
        opacity: 0.7,
      })
  })

  page.drawText('Total (NGN)', {
    x: x * 3 + 10,
    y: height - (240 + products.length * 20),
    size,
    font: boldFont,
    color,
  })

  page.drawText(`${totalAmount}`, {
    x: x * 3 + 350,
    y: height - (240 + products.length * 20),
    size,
    font: boldFont,
    color: rgb(0 / 255, 134 / 255, 120 / 255),
  })

  const pdfBytes = await pdfDoc.save()
  const base64String = Buffer.from(pdfBytes).toString('base64')
  return base64String
}

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import path from 'path'
import { Client, Payment } from '@prisma/client'
import { getBusinessDetail } from '@/data/account'
import { readImageFile } from '@/actions/invoices'
import { formatDate, ngnFormatter } from '.'

type GenerateReceiptProps = {
  payment: Payment & {
    client?: Client
  }
  invoiceRef: string
  invoiceAmount: number
  paidAmount?: number
  outstandingBalance?: number
  paymentMethod?: string
}

/**
 * Generate a PDF receipt for a payment
 */
export const generateReceipt = async (
  props: GenerateReceiptProps
): Promise<string> => {
  const { payment, invoiceRef, invoiceAmount, paidAmount, outstandingBalance, paymentMethod } = props

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89])

  // Get business details
  const business = await getBusinessDetail(payment.userId)

  const receiptCol1 = [
    `Amount Paid: ${ngnFormatter.format(payment.amount)}`,
    `Payment Date: ${formatDate(new Date(payment.paymentDate))}`,
    `Transaction No: #${payment.transactionNo}`,
    `Invoice Ref: ${invoiceRef}`,
  ]

  const receiptCol2 = [
    'Paid by',
    payment.clientName,
    payment.client?.email || '',
    payment.client?.billingAddress || '',
  ]

  const receiptCol3 = [
    'From',
    business?.name || '',
    business?.address || '',
    `Reg: ${business?.registrationNumber || 'N/A'}`,
  ]

  // Load logo
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

  // Title
  page.drawText('Payment Receipt', {
    x,
    y: height - 50,
    size: 25,
    font: boldFont,
    color,
  })

  // Logo
  page.drawImage(logoImage, {
    x: 450,
    y: height - 50,
    width: logoWidth,
    height: logoHeight,
  })

  // Receipt details
  receiptCol1.forEach((row, i) => {
    const col2Item = receiptCol2[i] || ''
    const col3Item = receiptCol3[i] || ''
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

  // Payment method
  if (paymentMethod) {
    page.drawText(`Payment Method: ${paymentMethod}`, {
      x,
      y: height - 160,
      size,
      font,
      color,
    })
  }

  // Invoice details section
  page.drawLine({
    start: { x: x * 3, y: height - 200 },
    end: { x: x * 3, y: height - 280 },
    thickness: 2,
    color: rgb(0 / 255, 134 / 255, 120 / 255),
  })

  page.drawText('INVOICE DETAILS', {
    x: x * 3 + 10,
    y: height - 210,
    size: 8,
    font: boldFont,
    color,
    opacity: 0.7,
  })

  const invoiceDetails = [
    `Invoice Amount: ${ngnFormatter.format(invoiceAmount)}`,
    paidAmount ? `Total Paid: ${ngnFormatter.format(paidAmount)}` : '',
    outstandingBalance !== undefined && outstandingBalance > 0
      ? `Outstanding Balance: ${ngnFormatter.format(outstandingBalance)}`
      : '',
  ].filter(Boolean)

  invoiceDetails.forEach((detail, i) => {
    page.drawText(detail, {
      x: x * 3 + 10,
      y: height - (230 + i * 15),
      size,
      font,
      color,
    })
  })

  // Total section
  page.drawLine({
    start: { x: x * 3 + 10, y: height - 300 },
    end: { x: x * 3 + 450, y: height - 300 },
    thickness: 0.7,
    color: rgb(0, 0, 0),
    opacity: 0.7,
  })

  page.drawText('Amount Received (NGN)', {
    x: x * 3 + 10,
    y: height - 320,
    size: 12,
    font: boldFont,
    color,
  })

  page.drawText(`${payment.amount}`, {
    x: x * 3 + 350,
    y: height - 320,
    size: 12,
    font: boldFont,
    color: rgb(0 / 255, 134 / 255, 120 / 255),
  })

  // Footer
  page.drawText('Thank you for your payment!', {
    x: x * 3 + 10,
    y: height - 360,
    size: 10,
    font: font,
    color,
    opacity: 0.7,
  })

  const pdfBytes = await pdfDoc.save()
  const base64String = Buffer.from(pdfBytes).toString('base64')
  return base64String
}

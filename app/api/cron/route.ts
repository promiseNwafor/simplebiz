import { sendInvoiceReminders } from '@/actions/invoices'

export async function GET() {
  try {
    await sendInvoiceReminders()

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false })
  }
}

import { sendInvoiceReminders } from '@/actions/invoices'

export async function GET(_req: Request, _res: Response) {
  try {
    await sendInvoiceReminders()

    return Response.json({ success: true, status: 200 })
  } catch (error) {
    return Response.json({ success: false, status: 500 })
  }
}

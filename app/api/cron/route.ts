import { NextApiRequest, NextApiResponse } from 'next'
import { sendInvoiceReminders } from '@/actions/invoices'

export async function GET(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await sendInvoiceReminders()

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error })
  }
}

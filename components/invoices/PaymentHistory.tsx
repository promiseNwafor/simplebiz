'use client'

import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { getInvoicePaymentHistory } from '@/actions/partial-payments'
import { ngnFormatter, formatDate } from '@/lib'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ReceiptDownloadButton from './ReceiptDownloadButton'

type PaymentRecord = {
  id: string
  amount: number
  paymentMethod: string | null
  notes: string | null
  createdAt: Date
  payment: {
    id: string
    amount: number
    paymentDate: Date
    transactionNo: number
  }
}

type PaymentHistoryProps = {
  invoiceId: string
  clientEmail?: string
}

export default function PaymentHistory({
  invoiceId,
  clientEmail,
}: PaymentHistoryProps) {
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getInvoicePaymentHistory(invoiceId)
        if (result.error) {
          setError(result.error)
        } else if (result.data) {
          setPaymentHistory(result.data as PaymentRecord[])
        }
      } catch (err) {
        setError('Failed to load payment history')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentHistory()
  }, [invoiceId])

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <BeatLoader color='#008678' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-8 text-destructive'>
        <p>{error}</p>
      </div>
    )
  }

  if (paymentHistory.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <p>No payment history available</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Payment History</h3>
      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Transaction No.</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {formatDate(new Date(record.payment.paymentDate))}
                </TableCell>
                <TableCell className='font-semibold'>
                  {ngnFormatter.format(record.amount)}
                </TableCell>
                <TableCell>
                  {record.paymentMethod || 'N/A'}
                </TableCell>
                <TableCell>#{record.payment.transactionNo}</TableCell>
                <TableCell className='text-muted-foreground'>
                  {record.notes || '-'}
                </TableCell>
                <TableCell>
                  <ReceiptDownloadButton
                    paymentId={record.payment.id}
                    clientEmail={clientEmail}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

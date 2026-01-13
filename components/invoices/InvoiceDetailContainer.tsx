'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BeatLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'
import { useGetInvoice } from '@/store/useStoreData'
import { Invoice } from '@/types'
import { ngnFormatter, formatDate } from '@/lib'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Modal from '@/components/reusables/Modal'
import PartialPaymentForm from './PartialPaymentForm'
import PaymentHistory from './PaymentHistory'
import InvoiceTable from './InvoiceTable'

type InvoiceDetailContainerProps = {
  invoiceId: string
}

const statusColor = {
  UNPAID: '#FFC107',
  PAID: '#19C98A',
  OVERDUE: '#F44336',
  PARTIALLY_PAID: '#FF9800',
}

const statusBgColor = {
  UNPAID: '#FFF6DA',
  PAID: '#DCF7ED',
  OVERDUE: '#FDE3E1',
  PARTIALLY_PAID: '#FFF3E0',
}

export default function InvoiceDetailContainer({
  invoiceId,
}: InvoiceDetailContainerProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()
  const { data, isPending, error } = useQuery(useGetInvoice(invoiceId))

  const invoice = data?.data?.data as Invoice & { client?: { email: string } }

  const toggleModal = () => {
    setModalOpen((prev) => !prev)
  }

  const handlePaymentSuccess = () => {
    toggleModal()
    // Refetch invoice data
    window.location.reload()
  }

  if (isPending) {
    return (
      <div className='flex justify-center py-12'>
        <BeatLoader color='#008678' />
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className='text-center py-12'>
        <p className='text-destructive'>
          {error || 'Invoice not found'}
        </p>
        <Button
          variant='outline'
          onClick={() => router.push('/invoices')}
          className='mt-4'
        >
          Back to Invoices
        </Button>
      </div>
    )
  }

  const colorStatus = statusColor[invoice.status] || statusColor.UNPAID
  const bgColorStatus = statusBgColor[invoice.status] || statusBgColor.UNPAID
  const paidAmount = invoice.paidAmount || 0
  const outstandingBalance =
    invoice.outstandingBalance !== undefined
      ? invoice.outstandingBalance
      : invoice.amount - paidAmount
  const canMakePayment =
    invoice.status === 'UNPAID' ||
    invoice.status === 'PARTIALLY_PAID' ||
    invoice.status === 'OVERDUE'

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push('/invoices')}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>Invoice #{invoice.invoiceNo}</h1>
            <p className='text-sm text-muted-foreground'>
              {invoice.invoiceRef}
            </p>
          </div>
        </div>
        <Badge
          variant='outline'
          style={{
            borderColor: colorStatus,
            color: colorStatus,
            backgroundColor: bgColorStatus,
          }}
        >
          {invoice.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg p-6 space-y-4'>
          <h2 className='text-lg font-semibold'>Invoice Details</h2>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Issued Date:</span>
              <span className='font-medium'>{formatDate(invoice.issueDate)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Due Date:</span>
              <span className='font-medium'>{formatDate(invoice.dueDate)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Issued To:</span>
              <span className='font-medium'>{invoice.issuedTo}</span>
            </div>
            <div className='flex justify-between border-t pt-2'>
              <span className='text-muted-foreground'>Total Amount:</span>
              <span className='font-semibold text-lg'>
                {ngnFormatter.format(invoice.amount)}
              </span>
            </div>
            {paidAmount > 0 && (
              <>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Amount Paid:</span>
                  <span className='font-medium text-green-600'>
                    {ngnFormatter.format(paidAmount)}
                  </span>
                </div>
                <div className='flex justify-between border-t pt-2'>
                  <span className='text-muted-foreground'>Outstanding Balance:</span>
                  <span className='font-semibold text-lg text-orange-600'>
                    {ngnFormatter.format(outstandingBalance)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className='bg-white rounded-lg p-6 space-y-4'>
          <h2 className='text-lg font-semibold'>Payment Actions</h2>
          {canMakePayment ? (
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground'>
                {invoice.status === 'PARTIALLY_PAID'
                  ? 'Make an additional payment to this invoice'
                  : 'Make a payment to this invoice'}
              </p>
              <Button onClick={toggleModal} className='w-full'>
                {invoice.status === 'PARTIALLY_PAID'
                  ? 'Add Payment'
                  : 'Make Payment'}
              </Button>
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>Invoice is fully paid</p>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue='products' className='w-full'>
        <TabsList>
          <TabsTrigger value='products'>Products</TabsTrigger>
          <TabsTrigger value='payments'>Payment History</TabsTrigger>
        </TabsList>
        <TabsContent value='products' className='bg-white rounded-lg p-6'>
          <InvoiceTable
            data={{ data: { data: [invoice], count: 1 }, success: true }}
            isPending={false}
            invoices={[invoice]}
          />
        </TabsContent>
        <TabsContent value='payments' className='bg-white rounded-lg p-6'>
          <PaymentHistory
            invoiceId={invoice.id}
            clientEmail={invoice.client?.email}
          />
        </TabsContent>
      </Tabs>

      <Modal
        open={modalOpen}
        onClose={toggleModal}
        title={
          invoice.status === 'PARTIALLY_PAID'
            ? 'Add Partial Payment'
            : 'Make Payment'
        }
        content={
          <PartialPaymentForm
            invoiceId={invoice.id}
            invoiceAmount={invoice.amount}
            currentPaidAmount={paidAmount}
            onSuccess={handlePaymentSuccess}
          />
        }
      />
    </div>
  )
}

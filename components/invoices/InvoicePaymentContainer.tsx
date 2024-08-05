'use client'

import { PaystackButton } from 'react-paystack'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Client } from '@prisma/client'
import { useAddPayment } from '@/store/useStoreData'
import { ngnFormatter } from '@/lib'
import { Invoice } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type InvoicePaymentContainerProps = {
  client: Client
  invoice: Invoice
  id: string
}

const InvoicePaymentContainer: React.FC<InvoicePaymentContainerProps> = ({
  client,
  invoice,
  id,
}) => {
  const { mutateAsync: addPayment } = useAddPayment()

  const router = useRouter()

  const componentProps = {
    email: client.email,
    amount: invoice.amount * 100, // amount from kobo to naira
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || '',
    text: 'Pay Now',
    reference: invoice.invoiceRef,
    onSuccess: () => {
      addPayment({
        id: client.userId,
        amount: invoice.amount,
        clientName: client.name,
        clientId: client.id,
        invoiceRef: invoice.invoiceRef,
        token: id,
      }).then((response) => {
        if (response.error) {
          return toast.error(response.error)
        }

        toast.success(response.success)
        return router.replace('/invoices')
      })
    },
    onClose: () => {},
  }

  return (
    <div className='space-y-6'>
      <div>
        <Label htmlFor='email'>Email address</Label>
        <Input
          id='email'
          placeholder='Email'
          className='mt-1 disabled:bg-secondary'
          value={client.email}
          disabled
        />
      </div>
      <div>
        <Label htmlFor='amount'>Amount</Label>
        <Input
          id='amount'
          placeholder='6800'
          className='mt-1 disabled:bg-secondary'
          value={ngnFormatter.format(invoice.amount)}
          disabled
        />
      </div>
      <Button asChild>
        <PaystackButton {...componentProps} />
      </Button>
    </div>
  )
}

export default InvoicePaymentContainer

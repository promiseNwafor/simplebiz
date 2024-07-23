import Image from 'next/image'
import { Client } from '@prisma/client'
import { getClient } from '@/store/clients'
import { getInvoiceByToken } from '@/store/invoices'
import InvoicePaymentContainer from '@/components/invoices/InvoicePaymentContainer'
import { Card } from '@/components/ui/card'

const InvoicePage = async ({ params }: { params: { id: string } }) => {
  const invoiceData = await getInvoiceByToken(params.id)

  if (invoiceData.error || !invoiceData.data) {
    return (
      <div className='w-screen h-screen centered text-2xl'>
        Invoice not found
      </div>
    )
  }

  const invoice = invoiceData.data.data

  const clientData = await getClient(invoice?.clientId as string)

  const client = clientData.data?.data as Client

  if (!clientData || clientData.error) {
    return (
      <div className='w-screen h-screen centered text-2xl'>
        Client not found
      </div>
    )
  }

  return (
    <div className='min-h-screen w-screen  bg-white centered'>
      <div className='space-y-8 w-full centered flex-col'>
        <Image
          src='/images/logo-colored.svg'
          alt='logo'
          width={208}
          height={32}
        />
        <Card className='w-full max-w-[428px] p-4 lg:px-6 lg:py-4 shadow-md mx-auto space-y-6'>
          <p className='text-xl font-semibold text-center'>Payment detail</p>
          <InvoicePaymentContainer
            client={client}
            invoice={invoice}
            id={params.id}
          />
        </Card>
      </div>
    </div>
  )
}

export default InvoicePage

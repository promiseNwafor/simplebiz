import { db } from '@/lib/db'

const InvoicePage = async ({ params }: { params: { id: string } }) => {
  const invoice = await db.invoice.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!invoice) {
    return <div>Invoice not found</div>
  }

  return <div>Invoice</div>
}

export default InvoicePage

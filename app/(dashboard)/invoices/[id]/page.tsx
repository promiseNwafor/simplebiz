import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetInvoice } from '@/store/useStoreData'
import InvoiceDetailContainer from '@/components/invoices/InvoiceDetailContainer'

const InvoiceDetailPage = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetInvoice(params.id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InvoiceDetailContainer invoiceId={params.id} />
    </HydrationBoundary>
  )
}

export default InvoiceDetailPage

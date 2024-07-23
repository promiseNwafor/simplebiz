import { QueryClient } from '@tanstack/react-query'
import { useGetInvoices } from '@/store/useStoreData'
import InvoicesContainer from '@/components/invoices/InvoicesContainer'

const InvoicesPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetInvoices(1))

  return <InvoicesContainer />
}

export default InvoicesPage

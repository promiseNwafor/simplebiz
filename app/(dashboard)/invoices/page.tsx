import InvoicesContainer from '@/components/invoices/InvoicesContainer'
import { useGetProducts } from '@/store/useStoreData'
import { QueryClient } from '@tanstack/react-query'

const InvoicesPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetProducts(1))

  return <InvoicesContainer />
}

export default InvoicesPage

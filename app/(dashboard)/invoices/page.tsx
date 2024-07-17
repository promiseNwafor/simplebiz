import { QueryClient } from '@tanstack/react-query'
import { useGetProducts } from '@/store/useStoreData'
import InvoicesContainer from '@/components/invoices/InvoicesContainer'

const InvoicesPage = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetProducts(1))

  return <InvoicesContainer />
}

export default InvoicesPage

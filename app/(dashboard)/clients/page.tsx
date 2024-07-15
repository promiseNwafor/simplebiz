import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getClients } from '@/store/clients'
import { productsQueryKeys, useGetClients } from '@/store/useStoreData'
import ClientsContainer from '@/components/clients/ClientsContainer'

interface IClientsPage {
  searchParams: { page: string }
}

const itemsPerPage = 5

const ClientsPage: React.FC<IClientsPage> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetClients(page, itemsPerPage))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientsContainer itemsPerPage={itemsPerPage} />
    </HydrationBoundary>
  )
}

export default ClientsPage

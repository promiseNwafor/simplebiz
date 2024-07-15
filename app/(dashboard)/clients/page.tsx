import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetClients } from '@/store/useStoreData'
import ClientsContainer from '@/components/clients/ClientsContainer'

interface IClientsPage {
  searchParams: { page: string }
}

const ClientsPage: React.FC<IClientsPage> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetClients(page))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientsContainer />
    </HydrationBoundary>
  )
}

export default ClientsPage

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { useGetClientDetails, useGetClientPayments } from '@/store/useStoreData'
import ClientContainer from '@/components/clients/ClientContainer'

const ClientPage = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetClientDetails(params.id))
  await queryClient.prefetchQuery(useGetClientPayments(params.id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientContainer id={params.id} />
    </HydrationBoundary>
  )
}

export default ClientPage

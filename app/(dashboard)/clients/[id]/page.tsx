import { QueryClient } from '@tanstack/react-query'
import { useGetClient } from '@/store/useStoreData'
import ClientContainer from '@/components/clients/ClientContainer'

const ClientPage = async ({ params }: { params: { id: string } }) => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(useGetClient(params.id))

  return <ClientContainer id={params.id} />
}

export default ClientPage

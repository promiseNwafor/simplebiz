import ClientContainer from '@/components/clients/ClientContainer'
import { getClient } from '@/store/clients'

const ClientPage = async ({ params }: { params: { id: string } }) => {
  const data = await getClient(params.id)

  return <ClientContainer data={data} />
}

export default ClientPage

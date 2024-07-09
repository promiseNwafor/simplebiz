import { getClients } from '@/store/clients'
import { ClientProps, GetResponse } from '@/types'
import ClientsContainer from '@/components/clients/ClientsContainer'

interface IClientsPage {
  searchParams: { page: string }
}

const itemsPerPage = 5

const ClientsPage: React.FC<IClientsPage> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1

  const resData = await getClients(page, itemsPerPage)

  return (
    <ClientsContainer
      resData={resData as GetResponse<ClientProps[]>}
      itemsPerPage={itemsPerPage}
    />
  )
}

export default ClientsPage

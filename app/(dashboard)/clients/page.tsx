import { getClients } from '@/store/clients'
import { ClientProps, DataCountReturn } from '@/types'
import ClientsContainer from '@/components/clients/ClientsContainer'

interface IClientsPage {
  searchParams: { page: string }
}

const itemsPerPage = 5

const ClientsPage: React.FC<IClientsPage> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page) || 1

  const { data, success, error } = await getClients(page, itemsPerPage)

  if (!success) {
    return (
      <div className='bg-white w-full h-[400px] rounded-lg py-5 centered'>
        <h4>{error}</h4>
      </div>
    )
  }

  return (
    <ClientsContainer
      allData={data as DataCountReturn<ClientProps[]>}
      currentPage={page}
      itemsPerPage={itemsPerPage}
    />
  )
}

export default ClientsPage

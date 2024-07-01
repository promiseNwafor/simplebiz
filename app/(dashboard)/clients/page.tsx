import { getClients } from '@/store/clients'
import ClientsContainer from '@/components/clients/ClientsContainer'
import { ClientProps } from '@/types'

const ClientsPage = async () => {
  const { data, success, error } = await getClients()

  if (!success) {
    return (
      <div className='bg-white w-full h-[400px] rounded-lg py-5 centered'>
        <h4>{error}</h4>
      </div>
    )
  }

  return <ClientsContainer clients={data as ClientProps[]} />
}

export default ClientsPage

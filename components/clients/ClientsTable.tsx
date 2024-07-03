import { ClientProps } from '@/types'
import ClientRow from './ClientRow'

type ClientsTableProps = {
  clients: ClientProps[]
  pageNumber: number
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, pageNumber }) => {
  return (
    <div className='min-w-[900px]'>
      {/* Thead */}
      <div className='bg-secondary grid grid-cols-12 text-xs font-semibold p-4 border-b border-gray-200'>
        <div>#</div>
        <div className='col-span-2'>Client name</div>
        <div className='col-span-2'>Email</div>
        <div className='col-span-2'>Phone number</div>
        <div>No. Invoices</div>
        <div className='col-span-3'>Billing Address</div>
        <div></div>
      </div>

      {/* Tbody */}
      <div className='min-h-[280px]'>
        {clients.map((client) => {
          return <ClientRow key={client.email} client={client} />
        })}
      </div>
    </div>
  )
}

export default ClientsTable

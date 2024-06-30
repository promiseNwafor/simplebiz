'use client'

import { useEffect, useState, useTransition } from 'react'
import { BeatLoader } from 'react-spinners'
import AddButton from '../AddButton'
import Modal from '../Modal'
import ClientRow from './ClientRow'
import AddClientForm from './AddClientForm'
import { Client } from '@prisma/client'
import { addClient, getClients } from '@/store/clients'

interface IClientsContainer {}

const ClientsContainer: React.FC<IClientsContainer> = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [clients, setClients] = useState<Client[] | null>(null)
  const [isPending, startTransition] = useTransition()

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  useEffect(() => {
    startTransition(() => {
      getClients().then((res) => {
        setClients(res.clients)
      })
    })
  }, [])

  return isPending || !clients ? (
    <div className='h-20 w-full centered'>
      <BeatLoader />
    </div>
  ) : (
    <div className='space-y-8'>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        content={
          <AddClientForm toggleModal={toggleModal} submitHandler={addClient} />
        }
        title='Add new client'
      />
      <div className='flex items-center justify-end'>
        <AddButton onClick={toggleModal}>Add new client</AddButton>
      </div>

      {!clients.length ? (
        <div className='bg-white w-full h-[400px] rounded-lg py-5 centered'>
          <h4>No clients available</h4>
        </div>
      ) : (
        <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
          <div className='p-5 pt-0'>
            <h4>Client</h4>
          </div>
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
            <div>
              {clients.map((client, i) => {
                return (
                  <ClientRow key={client.email} client={client} index={i} />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsContainer

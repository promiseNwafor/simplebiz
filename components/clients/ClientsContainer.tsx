'use client'

import { useState } from 'react'
import AddButton from '../reusables/AddButton'
import { addClient } from '@/actions/clients'
import { ClientProps } from '@/types'
import ClientForm from './ClientForm'
import ClientsTable from './ClientsTable'
import Modal from '../reusables/Modal'

interface IClientsContainer {
  clients: ClientProps[]
}

const ClientsContainer: React.FC<IClientsContainer> = ({ clients }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  return (
    <div className='space-y-8'>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        content={
          <ClientForm toggleModal={toggleModal} submitHandler={addClient} />
        }
        title='Add new client'
      />
      <div className='flex items-center justify-end'>
        <AddButton onClick={toggleModal}>Add new client</AddButton>
      </div>

      {!clients || !clients.length ? (
        <div className='bg-white w-full h-[400px] rounded-lg py-5 centered'>
          <h4>No clients available</h4>
        </div>
      ) : (
        <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
          <div className='p-5 pt-0'>
            <h4>Client</h4>
          </div>
          <ClientsTable clients={clients} />
        </div>
      )}
    </div>
  )
}

export default ClientsContainer

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { addClient, getClientsAction } from '@/actions/clients'
import { ClientProps, DataCountReturn } from '@/types'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import ClientForm from './ClientForm'
import ClientsTable from './ClientsTable'
import PaginationContainer from '../reusables/PaginationContainer'

interface IClientsContainer {
  allData: DataCountReturn<ClientProps[]>
  currentPage: number
  itemsPerPage: number
}

const ClientsContainer: React.FC<IClientsContainer> = ({
  allData,
  currentPage,
  itemsPerPage,
}) => {
  const { data: clients, count } = allData
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(currentPage)
  const [clientsData, setClientsData] = useState(clients)

  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  const handlePageChange = async (pageNumber: number) => {
    const response = await getClientsAction(pageNumber, itemsPerPage)
    console.log('++++++++++++++', 'response', { response, pageNumber })

    if (response.success) {
      setClientsData(response.data?.data as ClientProps[])

      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('page', pageNumber.toString())

      router.push(`?${newSearchParams.toString()}`)
      setPage(pageNumber)
    }
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

      {!clientsData || !clientsData.length ? (
        <div className='bg-white w-full h-[400px] rounded-lg py-5 centered'>
          <h4>No clients available</h4>
        </div>
      ) : (
        <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
          <div className='p-5 pt-0'>
            <h4>Client</h4>
          </div>
          <ClientsTable clients={clientsData} pageNumber={page} />

          <div className='p-5 pb-0'>
            <PaginationContainer
              itemsCount={count}
              itemsPerPage={itemsPerPage}
              page={page}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsContainer

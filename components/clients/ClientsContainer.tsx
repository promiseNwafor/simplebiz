'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { addClient, getClientsAction } from '@/actions/clients'
import { ClientProps, DataCountReturn } from '@/types'

import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import ClientForm from './ClientForm'
import ClientsTable from './ClientsTable'

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

  const handlePageClick = async (selectedPage: { selected: number }) => {
    const pageNumber = selectedPage.selected + 1
    const response = await getClientsAction(pageNumber, itemsPerPage)

    if (response.success) {
      setClientsData(response.data?.data as ClientProps[])

      const newSearchParams = new URLSearchParams()
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

          <div className='p-5 pb-0 centered gap-1'>
            {/* <Button
              variant='ghost'
              disabled={page === 1}
              onClick={async () => await handlePageClick({ selected: 0 })}
            >
              <ChevronFirst />
            </Button> */}
            <ReactPaginate
              pageCount={Math.ceil(count / itemsPerPage)}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              previousLabel={
                <ChevronLeft size={20} className='text-black/70' />
              }
              nextLabel={<ChevronRight size={20} className='text-black/70' />}
              breakLabel={<MoreHorizontal className='h-4 w-4' />}
              breakClassName='break-me'
              onPageChange={handlePageClick}
              containerClassName='pagination-container'
              activeClassName='active'
              previousClassName='action-button'
              nextClassName='action-button'
              disabledClassName='disabled-page-button'
            />
            {/* <Button
              variant='ghost'
              disabled={page === Math.ceil(count / itemsPerPage)}
              onClick={async () =>
                await handlePageClick({
                  selected: Math.ceil(count / itemsPerPage) - 1,
                })
              }
            >
              <ChevronLast />
            </Button> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsContainer

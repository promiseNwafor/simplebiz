'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { BeatLoader } from 'react-spinners'
import { useAddClient, useGetClients } from '@/store/useStoreData'

import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import ClientForm from './ClientForm'
import ClientsTable from './ClientsTable'
import { CLIENTS_PER_PAGE } from '@/constants'

const ClientsContainer: React.FC = () => {
  const [page, setPage] = useState(1)
  const { data, isPlaceholderData } = useQuery(useGetClients(page))
  const [modalOpen, setModalOpen] = useState(false)

  const router = useRouter()
  const { mutateAsync: addClient } = useAddClient()

  const count = data?.data?.count as number

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  const handlePageClick = (selectedPage: { selected: number }) => {
    if (!isPlaceholderData) {
      const pageNumber = selectedPage.selected + 1

      const params = new URLSearchParams()
      params.set('page', pageNumber.toString())

      setPage(pageNumber)
      router.push(`?${params.toString()}`)
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
        title='Add a new client'
      />
      <div className='flex items-center justify-end'>
        <AddButton onClick={toggleModal}>Add a new client</AddButton>
      </div>

      <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
        <div className='p-5 pt-0'>
          <h4>Client</h4>
        </div>

        {/* Table */}
        {!data?.data || !data?.data?.data.length ? (
          <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
            <p>No clients available</p>
          </div>
        ) : (
          <div className='w-[360px] min-w-full'>
            <Suspense
              fallback={
                <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
                  <BeatLoader color='#008678' />
                </div>
              }
            >
              <ClientsTable clients={data?.data?.data} />
            </Suspense>

            <div className='p-5 pb-0 centered gap-1'>
              <ReactPaginate
                pageCount={Math.ceil(count / CLIENTS_PER_PAGE)}
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientsContainer

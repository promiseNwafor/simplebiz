'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { addClient, getClientsAction } from '@/actions/clients'
import { ClientProps, GetResponse } from '@/types'

import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import ClientForm from './ClientForm'
import ClientsTable from './ClientsTable'

interface IClientsContainer {
  resData: GetResponse<ClientProps[]>
  currentPage: number
  itemsPerPage: number
}

const ClientsContainer: React.FC<IClientsContainer> = ({
  resData,
  currentPage,
  itemsPerPage,
}) => {
  const { data: allData, error, success } = resData || {}
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(currentPage)
  const [clientsData, setClientsData] = useState(allData?.data)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const count = allData?.count as number

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  const handlePageClick = async (selectedPage: { selected: number }) => {
    const pageNumber = selectedPage.selected + 1

    startTransition(async () => {
      await getClientsAction(pageNumber, itemsPerPage)
        .then((response) => {
          if (response.success) {
            setClientsData(response.data?.data as ClientProps[])

            const newSearchParams = new URLSearchParams()
            newSearchParams.set('page', pageNumber.toString())

            router.push(`?${newSearchParams.toString()}`)
            !isPending && setPage(pageNumber)
            return
          }

          toast.error(response?.error || 'Something went wrong!')
          return
        })
        .catch(() => {
          toast.error('Something went wrong!')
        })
    })
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

        {!success ? (
          <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
            <h4>{error}</h4>
          </div>
        ) : (
          <>
            {/* Table */}
            {!clientsData || !clientsData.length ? (
              <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
                <h4>No clients available</h4>
              </div>
            ) : (
              <div className='w-[567px] min-w-full'>
                <ClientsTable clients={clientsData} />

                <div className='p-5 pb-0 centered gap-1'>
                  <ReactPaginate
                    pageCount={Math.ceil(count / itemsPerPage)}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    previousLabel={
                      <ChevronLeft size={20} className='text-black/70' />
                    }
                    nextLabel={
                      <ChevronRight size={20} className='text-black/70' />
                    }
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
          </>
        )}
      </div>
    </div>
  )
}

export default ClientsContainer

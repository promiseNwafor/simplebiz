'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Invoice } from '@prisma/client'

import { GetResponse } from '@/types'
import { useGetInvoices } from '@/store/useStoreData'
import { INVOICES_PER_PAGE } from '@/constants'
import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import InvoiceForm from './InvoiceForm'
import InvoiceTable from './InvoiceTable'

const InvoicesContainer = () => {
  const searchParams = useSearchParams()
  const defaultPage = parseInt(searchParams.get('page')?.toString() || '1')

  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(defaultPage)
  const { data, isPlaceholderData, isPending } = useQuery(useGetInvoices(page))

  const router = useRouter()

  const invoices = data?.data?.data
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
    <div className='space-y-6'>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        content={<InvoiceForm toggleModal={toggleModal} />}
        title='Generate Invoice'
      />
      <div className='flex items-center justify-end'>
        <AddButton onClick={toggleModal}>Generate Invoice</AddButton>
      </div>
      <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
        <div className='p-5 pt-0'>
          <h4>Invoice</h4>
        </div>
        <div className='min-w-[900px]'>
          <div className='bg-secondary grid grid-cols-12 text-xs font-semibold p-4 border-b border-gray-200'>
            <div></div>
            <div className='col-span-2'>Issued Date</div>
            <div className='col-span-2'>Due Date</div>
            <div>Invoice No.</div>
            <div className='col-span-2'>Issued to</div>
            <div className='col-span-2'>Amount</div>
            <div>Status</div>
            <div></div>
          </div>

          <InvoiceTable
            data={data as GetResponse<Invoice[]>}
            isPending={isPending}
            invoices={invoices as Invoice[]}
          />
          <div className='p-5 pb-0 centered gap-1'>
            <ReactPaginate
              pageCount={Math.ceil(count / INVOICES_PER_PAGE)}
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
      </div>
    </div>
  )
}

export default InvoicesContainer

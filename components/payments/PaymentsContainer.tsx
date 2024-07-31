'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Payment } from '@prisma/client'
import { GetResponse } from '@/types'
import { useGetPayments } from '@/store/useStoreData'
import { PAYMENT_PER_PAGE } from '@/constants'
import PaymentDetails from './PaymentDetails'
import PaymentsTable from './PaymentsTable'

const PaymentsContainer = () => {
  const [page, setPage] = useState(1)
  const { data, isPlaceholderData, isPending } = useQuery(useGetPayments(page))

  const router = useRouter()

  const count = data?.data?.count as number
  const payments = data?.data?.data

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
      <PaymentDetails />

      <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
        <div className='p-5 pt-0'>
          <h4>Payments</h4>
        </div>
        <div className='min-w-[900px]'>
          <div className='bg-secondary grid grid-cols-12 text-xs font-semibold p-4 border-b border-gray-200'>
            <div></div>
            <div className='col-span-2'>Transaction No</div>
            <div className='col-span-2'>Payment Date</div>
            <div className='col-span-2'>Amount</div>
            <div className='col-span-2'>Invoice Ref</div>
            <div className='col-span-2'>Billed to</div>
            <div></div>
          </div>

          <PaymentsTable
            data={data as GetResponse<Payment[]>}
            isPending={isPending}
            payments={payments as Payment[]}
          />

          <div className='p-5 pb-0 centered gap-1'>
            <ReactPaginate
              pageCount={Math.ceil(count / PAYMENT_PER_PAGE)}
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

export default PaymentsContainer

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BeatLoader } from 'react-spinners'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useGetPayments } from '@/store/useStoreData'
import { PAYMENT_PER_PAGE } from '@/constants'
import { Button } from '@/components/ui/button'
import PaymentsRow from './InvoicesRow'

const accountInfoTitles = ['Bank', 'Account number', 'Account name']
const accountInfoValues = ['Access Bank plc', '1234567890', 'John Doe']

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
    <div className='space-y-8'>
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='bg-primary text-white flex flex-col justify-between rounded-lg p-5 h-52'>
          <p className='font-medium'>Wallet balance</p>
          <p className='text-3xl font-semibold'>N200,000</p>
          <Button
            size='full'
            className='bg-white text-primary hover:bg-white hover:opacity-90'
          >
            Withdraw
          </Button>
        </div>
        <div className='bg-white flex flex-col justify-between rounded-lg p-5 h-52'>
          <p className='font-medium'>Account information</p>
          <div className='flex justify-between'>
            {accountInfoTitles.map((title, index) => (
              <div key={index}>
                <small className='opacity-50'>{title}</small>
                <p>{accountInfoValues[index]}</p>
              </div>
            ))}
          </div>
          <Button
            size='full'
            variant='outline'
            className='border-primary text-primary hover:text-primary hover:opacity-90'
          >
            Withdraw
          </Button>
        </div>
      </div>

      <div className='bg-white rounded-lg py-5 overflow-x-scroll'>
        <div className='p-5 pt-0'>
          <h4>Payments</h4>
        </div>
        <div className='min-w-[900px]'>
          <div className='bg-secondary grid grid-cols-12 text-xs font-semibold p-4 border-b border-gray-200'>
            <div></div>
            <div className='col-span-2'>Transaction No.</div>
            <div className='col-span-2'>Payment Date</div>
            <div className='col-span-2'>Amount</div>
            <div className='col-span-2'>Invoice Ref.</div>
            <div className='col-span-2'>Billed to</div>
            <div></div>
          </div>

          <div className='min-h-[280px]'>
            {isPending ? (
              <BeatLoader color='#008678' className='text-center mt-6' />
            ) : (
              <>
                {data?.error || !payments || !payments.length ? (
                  <div className='bg-white w-full h-[280px] py-5 centered border-t border-gray-200'>
                    <p>No payment available</p>
                  </div>
                ) : (
                  <>
                    {payments.map((payment) => {
                      return <PaymentsRow key={payment.id} payment={payment} />
                    })}
                  </>
                )}
              </>
            )}
          </div>
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

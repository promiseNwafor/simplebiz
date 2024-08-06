'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { Payment } from '@prisma/client'

import useClientMenus, { ClientMenuActions } from '@/hooks/useClientMenus'
import { ngnFormatter } from '@/lib'
import { useGetClientDetails, useGetClientPayments } from '@/store/useStoreData'
import { GetClientDetailsReturn } from '@/store/clients'
import { GetResponse } from '@/types'
import { Button } from '@/components/ui/button'
import OverviewCard from '@/components/reusables/OverviewCard'
import Modal from '@/components/reusables/Modal'
import PaymentsTable from '@/components/payments/PaymentsTable'

const orders = [
  { label: 'All Orders', key: 'allInvoiceCount' },
  { label: 'Completed Orders', key: 'completedInvoiceCount' },
  { label: 'Pending Orders', key: 'pendingInvoiceCount' },
]

interface IClientContainer {
  id: string
}

const ClientContainer: React.FC<IClientContainer> = ({ id }) => {
  const { data: clientData, error } = useQuery(useGetClientDetails(id))
  const { data: paymentsData, isPending: isPendingPayments } = useQuery(
    useGetClientPayments(id)
  )

  const client = clientData?.data
  const payments = paymentsData?.data?.data

  const { modalAction, setModalAction, actionMenus } = useClientMenus(
    client as GetClientDetailsReturn
  )

  if (error) {
    toast.error('Something went wrong!')
    return
  }

  return (
    <div className='space-y-6'>
      <Modal
        open={!!modalAction}
        onClose={() => setModalAction(null)}
        content={modalAction && actionMenus[modalAction]?.Content}
        title={(modalAction && actionMenus[modalAction]?.title) || ''}
      />
      <div className='flex items-center justify-end gap-4'>
        <Button
          onClick={() => setModalAction(ClientMenuActions.DELETE)}
          variant='destructive-outline'
          size='sm'
          className='py-5'
        >
          <Trash2 />
        </Button>
        <Button onClick={() => setModalAction(ClientMenuActions.EDIT)}>
          Edit client info
        </Button>
      </div>
      <div className='bg-white rounded-lg p-5 flex flex-col md:flex-row gap-4 lg:gap-8 md:h-auto'>
        <div className='flex flex-col lg:flex-row gap-4 justify-between w-full h-full'>
          <div className='space-y-1'>
            <h2>{client?.name}</h2>
            <p className='text-base font-medium flex gap-5 w-full'>
              <span>{client?.email}</span>
              <span>{client?.phone}</span>
            </p>
            <p className='text-base font-medium flex gap-5 w-full'>
              {client?.businessName && (
                <>
                  <span>Business name:</span>
                  <span>{client?.businessName}</span>
                </>
              )}
            </p>
            <p className='text-base font-medium flex gap-5 w-full'>
              <span>Business address:</span>
              <span>{client?.billingAddress}</span>
            </p>
          </div>
          <div className='sm:w-[300px]'>
            <OverviewCard
              label='All time payments'
              title={ngnFormatter.format(client?.totalPayments || 0)}
              className='bg-primary-light pl-4 h-[120px]'
              labelClassName='text-black'
            />
          </div>
        </div>
      </div>

      <div className='grid sm:grid-cols-3 gap-4 lg:gap-8'>
        {orders.map((order) => {
          const { label, key } = order
          return (
            <OverviewCard
              key={key}
              label={label}
              title={(client as any)[key]}
            />
          )
        })}
      </div>

      <div className='bg-white rounded-lg py-5'>
        <div className='p-5 pt-0'>
          <h4>Payment History</h4>
        </div>
        <div className='overflow-x-scroll'>
          <div className='w-[360px] min-w-full'>
            <div className='min-w-[600px]'>
              <div className='bg-secondary grid grid-cols-12 text-xs font-semibold p-4 border-b border-gray-200'>
                <div className='col-span-3'>Transaction Number</div>
                <div className='col-span-3'>Payment Date</div>
                <div className='col-span-3'>Amount</div>
                <div className='col-span-3'>Invoice Ref</div>
              </div>
              <PaymentsTable
                data={paymentsData as GetResponse<Payment[]>}
                isPending={isPendingPayments}
                payments={payments as Payment[]}
                isDetailPage
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientContainer

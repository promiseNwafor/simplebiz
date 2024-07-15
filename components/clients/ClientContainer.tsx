'use client'

import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { Client } from '@prisma/client'

import useClientMenus, { ClientMenuActions } from '@/hooks/useClientMenus'
import { useGetClient } from '@/store/useStoreData'
import { Button } from '@/components/ui/button'
import OverviewCard from '@/components/reusables/OverviewCard'
import Modal from '@/components/reusables/Modal'

const orders = [
  { label: 'All Orders', title: '15' },
  { label: 'Completed Orders', title: '12' },
  { label: 'Pending Orders', title: '3' },
]

interface IClientContainer {
  id: string
}

const ClientContainer: React.FC<IClientContainer> = ({ id }) => {
  const { data: clientData, error } = useQuery(useGetClient(id))
  const client = clientData?.data?.data

  const { modalAction, setModalAction, actionMenus } = useClientMenus(
    client as Client
  )

  if (error) {
    toast.error('Something went wrong!')
    return
  }

  return (
    <div className='space-y-8'>
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
        <div className='w-full md:w-[320px]'>
          <Image
            src='/images/placeholder.png'
            alt='Image'
            width={320}
            height={320}
            className='rounded-md object-cover'
          />
        </div>
        <div className='flex flex-col gap-4 justify-between h-full'>
          <div className='space-y-1'>
            <h2>{client?.name}</h2>
            <p className='text-base font-medium flex flex-col md:flex-row md:gap-5 w-full'>
              <span>{client?.email}</span>
              <span>{client?.phone}</span>
            </p>
          </div>
          <div className='sm:w-[300px]'>
            <OverviewCard
              label='All time payments'
              title='₦248,054'
              className='bg-primary-light pl-4 h-[120px]'
              labelClassName='text-black'
            />
          </div>
        </div>
      </div>

      <div className='grid sm:grid-cols-3 gap-4 lg:gap-8'>
        {orders.map((order) => {
          const { label, title } = order
          return <OverviewCard key={label} label={label} title={title} />
        })}
      </div>
    </div>
  )
}

export default ClientContainer

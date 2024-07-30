'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import capitalize from 'lodash/capitalize'

import useProductMenus, { ProductMenuActions } from '@/hooks/useProductMenus'
import { ngnFormatter } from '@/lib'
import { cn } from '@/lib/utils'
import { Product } from '@/types'
import { useGetProduct } from '@/store/useStoreData'
import { Button } from '@/components/ui/button'
import OverviewCard from '@/components/reusables/OverviewCard'
import Modal from '@/components/reusables/Modal'
import { bgColor } from './ProductCard'

const orders = [
  { label: 'All Orders', title: '158' },
  { label: 'Open Orders', title: '27' },
  { label: 'In Stock', title: '98' },
]

interface IProductContainer {
  id: string
}

const ProductContainer: React.FC<IProductContainer> = ({ id }) => {
  const { data: productData, error } = useQuery(useGetProduct(id))
  const product = productData?.data?.data

  const { modalAction, setModalAction, actionMenus } = useProductMenus(
    product as Product
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
          onClick={() => setModalAction(ProductMenuActions.DELETE)}
          variant='destructive-outline'
          size='sm'
          className='py-5'
        >
          <Trash2 />
        </Button>
        <Button onClick={() => setModalAction(ProductMenuActions.EDIT)}>
          Edit product info
        </Button>
      </div>
      <div className='bg-white rounded-lg p-5 flex flex-col md:flex-row gap-8 md:h-[360px]'>
        <div
          className={cn(
            'w-full rounded-sm bg-primary-light',
            bgColor[product?.type as keyof typeof bgColor]
          )}
        >
          <div
            className='centered h-[260px] md:h-full'
            style={
              product?.imageURL
                ? {
                    background: `url(${product?.imageURL}) no-repeat center center/cover`,
                  }
                : {}
            }
            aria-label='product image'
          >
            {!product?.imageURL && (
              <p className='text-6xl opacity-65 font-mono'>
                {capitalize(product?.name.split('')[0])}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-5 justify-between h-full'>
          <div className='space-y-1'>
            <h2>{product?.name}</h2>
            <p className='text-base font-medium'>
              {ngnFormatter.format(product?.price as number)}
            </p>
            <p className='text-xs font-medium pt-3'>Description</p>
            <p className='text-base'>{product?.description}</p>
          </div>
          <div className='sm:w-[300px]'>
            <OverviewCard
              label='Total Earnings'
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

export default ProductContainer

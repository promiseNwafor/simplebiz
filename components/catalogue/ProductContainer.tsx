'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import capitalize from 'lodash/capitalize'
import { BeatLoader } from 'react-spinners'

import useProductMenus, { ProductMenuActions } from '@/hooks/useProductMenus'
import { ngnFormatter } from '@/lib'
import { cn } from '@/lib/utils'
import { Product } from '@/types'
import {
  useGetProduct,
  useGetProductDetail,
  useGetProductInvoices,
} from '@/store/useStoreData'
import { Button } from '@/components/ui/button'
import OverviewCard from '@/components/reusables/OverviewCard'
import Modal from '@/components/reusables/Modal'
import InvoicesRow from '@/components/invoices/InvoicesRow'
import { bgColor } from './ProductCard'

const orders = [
  { label: 'All Invoices', key: 'allCount' },
  { label: 'Open Invoices', key: 'pendingCount' },
  { label: 'Expired Invoices', key: 'expiredCount' },
]

interface IProductContainer {
  id: string
}

const ProductContainer: React.FC<IProductContainer> = ({ id }) => {
  const { data: productData, error } = useQuery(useGetProduct(id))
  const { data: invoiceData, isPending: isInvoicePending } = useQuery(
    useGetProductInvoices(id)
  )
  const { data: productDetailData } = useQuery(useGetProductDetail(id))

  const product = productData?.data?.data
  const invoices = invoiceData?.data
  const productDetail = productDetailData?.data

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
                    background: `url(${product?.imageURL}) no-repeat center center/contain`,
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
              title={ngnFormatter.format(productDetail?.totalEarning || 0)}
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
              key={label}
              label={label}
              title={(productDetail as any)[key]}
            />
          )
        })}
      </div>

      <div className='bg-white rounded-lg py-5'>
        <div className='p-5 pt-0'>
          <h4>Invoice History</h4>
        </div>
        <div className='overflow-x-scroll'>
          <div className='w-[360px] min-w-full'>
            <div className='min-w-[900px]'>
              <div className='bg-secondary grid grid-cols-12 text-xs font-semibold p-4 border-b border-gray-200'>
                <div></div>
                <div className='col-span-2'>Issued Date</div>
                <div className='col-span-2'>Due Date</div>
                <div>Invoice No.</div>
                <div className='col-span-2'>Issued to</div>
                <div className='col-span-2'>Amount</div>
                <div>Status</div>
                <div className='flex justify-center'>Quantity</div>
              </div>

              <div className='min-h-[280px]'>
                {isInvoicePending ? (
                  <BeatLoader color='#008678' className='text-center mt-6' />
                ) : (
                  <>
                    {invoiceData?.error || !invoices || !invoices.length ? (
                      <div className='bg-white w-full h-[280px] py-5 centered border-t border-gray-200'>
                        <p>{invoiceData?.error || 'No invoice available'}</p>
                      </div>
                    ) : (
                      <>
                        {invoices.map((item) => {
                          return (
                            <InvoicesRow
                              key={item.invoiceId}
                              invoice={item.invoice as any}
                              quantity={item.quantity}
                              isDetailPage
                            />
                          )
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductContainer

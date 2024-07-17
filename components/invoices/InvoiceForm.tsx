'use client'

import capitalize from 'lodash/capitalize'
import { Minus, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { BeatLoader } from 'react-spinners'

import { useGetProducts } from '@/store/useStoreData'
import { cn } from '@/lib/utils'
import { ngnFormatter } from '@/lib'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { bgColor } from '@/components/catalogue/ProductCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'

type SelectedProduct = {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

type InvoiceFormProps = {
  toggleModal: () => void
  // submitHandler: (values: ClientSchemaValues) => Promise<PostResponse | void>
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ toggleModal }) => {
  // const [isPending, startTransition] = useTransition()

  const { data, isPending } = useQuery(useGetProducts(1))

  const products = data?.data?.data

  const form = useForm({
    defaultValues: {
      selectedProducts: [] as SelectedProduct[],
    },
  })

  const { handleSubmit, setValue, getValues } = form

  const selectedProducts = getValues('selectedProducts')

  const disableMinus = (id: string) => {
    const index = selectedProducts?.findIndex(
      (selectedProduct) => selectedProduct.id === id
    )

    return !index || selectedProducts[index]?.quantity === 0
  }

  const onSubmit = async () => {}

  console.log('++++++++++++++', { values: getValues('selectedProducts') })

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {isPending ? (
            <div className='min-h-[400px]'>
              <BeatLoader className='centered w-20 h-20' />
            </div>
          ) : (
            <>
              {data?.error || !products ? (
                <div className='min-h-[400px]'>
                  <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
                    <p>{data?.error || 'Something went wrong'}</p>
                  </div>
                </div>
              ) : (
                <ScrollArea className='h-[calc(100vh-260px)] w-full'>
                  {products.map((product) => {
                    const {
                      id,
                      name,
                      price,
                      quantity: productQuantity,
                    } = product

                    return (
                      <div
                        key={product.id}
                        className='w-full flex justify-between items-center py-4'
                      >
                        <div className='flex items-center gap-4 w-full'>
                          <Checkbox
                            id={product.id}
                            checked={selectedProducts.some(
                              (selectedProduct) => selectedProduct.id === id
                            )}
                            onClick={() => {
                              setValue('selectedProducts', [
                                ...selectedProducts,
                                {
                                  id,
                                  name,
                                  price,
                                  quantity: 1,
                                  total: price,
                                },
                              ])
                            }}
                          />
                          <div className='flex gap-4'>
                            <div
                              className={cn(
                                'w-16 rounded-sm bg-primary-light',
                                bgColor[product?.type as keyof typeof bgColor]
                              )}
                            >
                              <div
                                className='centered h-full w-full'
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
                                  <p className='opacity-65'>
                                    {capitalize(product?.name.split('')[0])}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className='space-y-1'>
                              <p className='text-xs'>{product?.name}</p>
                              <p className='font-medium text-xs'>
                                {ngnFormatter.format(product?.price as number)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center'>
                          <Button
                            variant='ghost'
                            className='hover:bg-transparent'
                            disabled={disableMinus(id)}
                            onClick={() => {
                              console.log('++++++++++++++', selectedProducts)

                              const newProducts = getValues(
                                'selectedProducts'
                              ).map((product) => {
                                if (product.id === id) {
                                  return {
                                    ...product,
                                    quantity: product.quantity - 1,
                                    total:
                                      product.price * (product.quantity - 1),
                                  }
                                }
                                return product
                              })

                              setValue('selectedProducts', newProducts)
                            }}
                          >
                            <Minus size={15} />
                          </Button>
                          <Input
                            placeholder='0'
                            className='w-12 cursor-not-allowed text-center'
                            value={
                              selectedProducts.find(
                                (selectedProduct) => selectedProduct.id === id
                              )?.quantity || 0
                            }
                            // onChange={(e) => {
                            //   const updatedQuantity = parseInt(e.target.value)

                            //   const item = selectedProducts.find(
                            //     (product) => product.id === id
                            //   )

                            //   if (item) {
                            //     const newProducts = getValues(
                            //       'selectedProducts'
                            //     ).map((product) => {
                            //       if (product.id === id) {
                            //         return {
                            //           ...product,
                            //           quantity: updatedQuantity,
                            //           total: product.price * updatedQuantity,
                            //         }
                            //       }
                            //       return product
                            //     })

                            //     return setValue('selectedProducts', newProducts)
                            //   }

                            //   setValue('selectedProducts', [
                            //     ...selectedProducts,
                            //     {
                            //       id,
                            //       name,
                            //       price,
                            //       quantity: updatedQuantity,
                            //       total: price * updatedQuantity,
                            //     },
                            //   ])
                            // }}
                          />
                          <Button
                            variant='ghost'
                            className='hover:bg-transparent'
                            disabled={
                              selectedProducts.find(
                                (selectedProduct) => selectedProduct.id === id
                              )?.quantity === productQuantity
                            }
                            onClick={() => {
                              console.log('++++++++++++++', selectedProducts)
                              const item = selectedProducts.find(
                                (product) => product.id === id
                              )

                              if (item) {
                                const newProducts = getValues(
                                  'selectedProducts'
                                ).map((product) => {
                                  if (product.id === id) {
                                    return {
                                      ...product,
                                      quantity: product.quantity + 1,
                                      total:
                                        product.price * (product.quantity + 1),
                                    }
                                  }
                                  return product
                                })

                                return setValue('selectedProducts', newProducts)
                              }

                              setValue('selectedProducts', [
                                ...selectedProducts,
                                {
                                  id,
                                  name,
                                  price,
                                  quantity: 1,
                                  total: price,
                                },
                              ])
                            }}
                          >
                            <Plus size={15} />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              )}
            </>
          )}
          <Button type='submit' size='full' disabled={isPending}>
            Next
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default InvoiceForm

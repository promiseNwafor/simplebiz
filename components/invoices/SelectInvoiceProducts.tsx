import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import capitalize from 'lodash/capitalize'
import { Minus, Plus } from 'lucide-react'
import { BeatLoader } from 'react-spinners'
import { UseFormReturn } from 'react-hook-form'

import { useGetProducts } from '@/store/useStoreData'
import { cn } from '@/lib/utils'
import { ngnFormatter } from '@/lib'
import { Product } from '@/types'
import { InvoiceSchemaValues } from '@/schemas'
import { bgColor } from '@/components/catalogue/ProductCard'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

type SelectProductsProps = {
  form: UseFormReturn<InvoiceSchemaValues>
  handleNextClick: (screen: number) => void
}

const SelectInvoiceProducts: React.FC<SelectProductsProps> = ({
  form,
  handleNextClick,
}) => {
  const { data, isPending } = useQuery(useGetProducts(1))

  const products = data?.data?.data as Product[]

  const { setValue, getValues, watch } = form

  useEffect(() => {
    watch('selectedProducts')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedProducts = getValues('selectedProducts')

  const getProduct = (id: string) =>
    selectedProducts?.find((selectedProduct) => selectedProduct.id === id)

  const disableMinus = (id: string) => {
    const product = getProduct(id)

    return !product || product?.quantity === 0
  }

  const addProduct = (product: Product, quantity = 1) => {
    const { id, name, price } = product

    setValue('selectedProducts', [
      ...selectedProducts,
      {
        id,
        name,
        price,
        quantity,
        total: price * quantity,
      },
    ])
  }

  const updateQuantity = (product: Product, quantity?: number) => {
    const foundProduct = getProduct(product.id)

    if (foundProduct) {
      const newProducts = getValues('selectedProducts').map((newProduct) => {
        const newQuantity = quantity || newProduct.quantity + 1

        if (newProduct.id === product.id) {
          return {
            ...newProduct,
            quantity: newQuantity,
            total: newProduct.price * newQuantity,
          }
        }
        return newProduct
      })

      return setValue('selectedProducts', newProducts)
    }

    addProduct(product, quantity)
  }

  const removeProduct = (product: Product) => {
    const newProducts = getValues('selectedProducts').filter(
      (selectedProduct) => selectedProduct.id !== product.id
    )

    setValue('selectedProducts', newProducts)
  }

  const decreaseQuantity = (product: Product) => {
    const foundProduct = getProduct(product.id)

    if (foundProduct?.quantity === 1) {
      return removeProduct(product)
    }

    const newProducts = getValues('selectedProducts').map((selectedProduct) => {
      if (selectedProduct.id === product.id) {
        return {
          ...selectedProduct,
          quantity: selectedProduct.quantity - 1,
          total: selectedProduct.price * (selectedProduct.quantity - 1),
        }
      }
      return selectedProduct
    })

    setValue('selectedProducts', newProducts)
  }

  return (
    <>
      <ScrollArea className='h-[calc(100vh-260px)] w-full'>
        {isPending ? (
          <BeatLoader
            color='#008678'
            className='text-center w-full m-auto mt-6 text-primary'
          />
        ) : (
          <>
            {data?.error || !products ? (
              <div className='w-full h-full centered'>
                <p>{data?.error || 'Something went wrong'}</p>
              </div>
            ) : (
              <>
                {products.map((product) => {
                  const { id, quantity: productQuantity } = product

                  return (
                    <div
                      key={id}
                      className='w-full flex justify-between items-center py-4'
                    >
                      <div className='flex items-center gap-4 w-full'>
                        <Checkbox
                          id={id}
                          checked={selectedProducts?.some(
                            (selectedProduct) => selectedProduct.id === id
                          )}
                          onClick={() => {
                            const selected = getProduct(id)
                            if (selected) {
                              removeProduct(product)
                            } else {
                              updateQuantity(product)
                            }
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
                          onClick={() => decreaseQuantity(product)}
                        >
                          <Minus size={15} />
                        </Button>
                        <Input
                          placeholder='0'
                          className='w-12 text-center'
                          min={0}
                          max={productQuantity}
                          disabled
                          value={getProduct(id)?.quantity || 0}
                          onChange={(e) =>
                            updateQuantity(product, parseInt(e.target.value))
                          }
                        />
                        <Button
                          variant='ghost'
                          className='hover:bg-transparent'
                          disabled={
                            productQuantity <= (getProduct(id)?.quantity || 0)
                          }
                          onClick={() => updateQuantity(product)}
                        >
                          <Plus size={15} />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </>
        )}
      </ScrollArea>
      <Button
        type='button'
        disabled={!selectedProducts?.length}
        onClick={() => handleNextClick(2)}
      >
        Next
      </Button>
    </>
  )
}

export default SelectInvoiceProducts

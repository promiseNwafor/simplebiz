'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { capitalize } from 'lodash'

import { cn } from '@/lib/utils'
import { ClientSchema, ClientSchemaValues } from '@/schemas'
import { ClientProps, Product } from '@/types'
import { ngnFormatter } from '@/lib'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { bgColor } from '@/components/catalogue/ProductCard'
import { ScrollArea } from '@/components/ui/scroll-area'

type InvoiceFormProps = {
  toggleModal: () => void
  client?: ClientProps
  // submitHandler: (values: ClientSchemaValues) => Promise<PostResponse | void>
  products: Product[]
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  toggleModal,
  client,
  products,
  // submitHandler,
}) => {
  const [isPending, startTransition] = useTransition()

  const { name, email, phone, billingAddress, businessName } = client || {}

  const form = useForm<ClientSchemaValues>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: name || undefined,
      email: email || undefined,
      phoneNumber: phone || undefined,
      billingAddress: billingAddress || undefined,
      businessName: businessName || undefined,
    },
  })

  const { handleSubmit } = form

  const onSubmit = async (values: ClientSchemaValues) => {
    startTransition(async () => {
      // await submitHandler(values)
      //   .then((res) => {
      //     if (res?.success) {
      //       toast.success(res?.success)
      //       toggleModal()
      //       return
      //     }
      //     toast.error(res?.error || 'Something went wrong!')
      //     return
      //   })
      //   .catch(() => {
      //     toast.error('Something went wrong!')
      //   })
    })
  }

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <ScrollArea className='h-[calc(100vh-260px)] w-full'>
            {products.map((product) => {
              return (
                <div
                  key={product.id}
                  className='w-full flex justify-between items-center py-4'
                >
                  <div className='flex items-center gap-4 w-full'>
                    <Checkbox id={product.id} />
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
                        <p>{product?.name}</p>
                        <p className='font-medium'>
                          {ngnFormatter.format(product?.price as number)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </ScrollArea>
          <Button type='submit' size='full' disabled={isPending}>
            Next
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default InvoiceForm

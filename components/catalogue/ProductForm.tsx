'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ProductSchema, ProductSchemaValues } from '@/schemas'
import { PostResponse, Product } from '@/types'

import { Form } from '@/components/ui/form'
import ProductFormDetails from './ProductFormDetails'
import ProductFormFileUpload from './ProductFormFileUpload'
import { toast } from 'sonner'
import { ProductType } from '@/enums'

type ProductFormProps = {
  toggleModal: () => void
  product?: Product
  submitHandler: (values: ProductSchemaValues) => Promise<PostResponse | void>
}

const ProductForm: React.FC<ProductFormProps> = ({
  toggleModal,
  product,
  submitHandler,
}) => {
  const [isPending, startTransition] = useTransition()
  const [screen, setScreen] = useState(1)

  const { name, price, type, imageURL, quantity, description } = product || {}

  const form = useForm<ProductSchemaValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: name || undefined,
      price: price || undefined,
      type: (type || undefined) as ProductType,
      description: description || undefined,
      imageURL: imageURL || undefined,
      quantity: quantity || undefined,
    },
  })

  const { handleSubmit, control, trigger } = form

  const onSubmit = async (values: ProductSchemaValues) => {
    console.log('++++++++++++++', { values })
    // const imageURL = values.imageURL[0]
    // const cleanedValues = {
    // ...values,
    // imageURL: values.imageURL[0],
    // imageURL: pick(values.imageURL[0], [
    //   'name',
    //   'size',
    //   'type',
    //   'lastModified',
    //   'webkitRelativePath',
    //   'lastModifiedDate',
    // ]),
    // }

    // console.log('++++++++++++++', { cleanedValues })

    startTransition(async () => {
      try {
        const res = await submitHandler(values)
        if (res?.success) {
          toast.success(res?.success)
          // toggleModal()
          return
        }
        toast.error(res?.error || 'Something went wrong!')
        return
      } catch (err) {
        console.error(err)
        toast.error('Something went wrong!')
      }
    })
  }

  const handleSave = async () => {
    const isValid = await trigger([
      'name',
      'type',
      'description',
      'price',
      'quantity',
    ])

    if (!isValid) return

    setScreen(2)
  }

  return (
    <div className='w-full'>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete='off'
          className='space-y-6'
        >
          {screen === 1 ? (
            <ProductFormDetails control={control} onSubmit={handleSave} />
          ) : (
            <ProductFormFileUpload control={control} />
          )}
        </form>
      </Form>
    </div>
  )
}

export default ProductForm

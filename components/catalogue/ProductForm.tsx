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
    const imageFile = values.imageURL
    let imageURL

    startTransition(async () => {
      try {
        if (!imageFile) {
          throw new Error('No image selected')
        }

        if (
          typeof imageFile === 'string' &&
          imageFile.includes(process.env.NEXT_PUBLIC_VERCEL_BLOB_URL as string) // image coming from vercel blob
        ) {
          imageURL = { url: imageFile }
        } else {
          const formData = new FormData()
          formData.append('file', imageFile)

          const data = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          imageURL = await data.json()
        }

        const res = await submitHandler({ ...values, imageURL: imageURL.url })
        if (res?.success) {
          toast.success(res?.success)
          toggleModal()
          return
        }

        toast.error(res?.error || 'Something went wrong!')
        // TODO: Delete product image from vercel blob storage
        return
      } catch (err) {
        console.error(err)
        // TODO: Delete product image from vercel blob storage
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
            <ProductFormFileUpload control={control} isPending={isPending} />
          )}
        </form>
      </Form>
    </div>
  )
}

export default ProductForm

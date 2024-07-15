'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { ClientSchema, ClientSchemaValues } from '@/schemas'
import { ClientProps, PostResponse } from '@/types'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'

type InvoiceFormProps = {
  toggleModal: () => void
  client?: ClientProps
  submitHandler: (values: ClientSchemaValues) => Promise<PostResponse | void>
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  toggleModal,
  client,
  submitHandler,
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

  const { handleSubmit, control } = form

  const onSubmit = async (values: ClientSchemaValues) => {
    startTransition(async () => {
      await submitHandler(values)
        .then((res) => {
          if (res?.success) {
            toast.success(res?.success)
            toggleModal()
            return
          }
          toast.error(res?.error || 'Something went wrong!')
          return
        })
        .catch(() => {
          toast.error('Something went wrong!')
        })
    })
  }

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' size='full' disabled={isPending}>
              Next
            </Button>
          </>
        </form>
      </Form>
    </div>
  )
}

export default InvoiceForm

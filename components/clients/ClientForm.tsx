'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { ClientSchema, ClientSchemaValues } from '@/schemas'
import { ClientProps, PostResponse } from '@/types'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'
import { AuthError } from '@/components/auth/AuthError'
import { AuthSuccess } from '@/components/auth/AuthSuccess'

type ClientFormProps = {
  toggleModal: () => void
  client?: ClientProps
  submitHandler: (values: ClientSchemaValues) => Promise<PostResponse | void>
}

const ClientForm: React.FC<ClientFormProps> = ({
  toggleModal,
  client,
  submitHandler,
}) => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
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
    setError('')
    setSuccess('')

    startTransition(async () => {
      await submitHandler(values)
        .then((res) => {
          if (res?.success) {
            setSuccess(res?.success)
            toast.success(res?.success)
            toggleModal()
            return
          }
          setError(res?.error)
          toast.error(res?.error || 'Something went wrong!')
          return
        })
        .catch(() => {
          setError('Something went wrong!')
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
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input placeholder='Phone number' type='tel' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='billingAddress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Address</FormLabel>
                  <FormControl>
                    <Input placeholder='Address' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='businessName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <Input placeholder='Business name' {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <AuthError message={error} />}
            {success && <AuthSuccess message={success} />}
            <Button type='submit' size='full' disabled={isPending}>
              Save
            </Button>
          </>
        </form>
      </Form>
    </div>
  )
}

export default ClientForm

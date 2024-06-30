'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { AddClientSchema, AddClientSchemaValues } from '@/schemas'
import { addClient } from '@/store/clients'

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
import { AuthError } from '../auth/AuthError'
import { AuthSuccess } from '../auth/AuthSuccess'
import { Client } from '@prisma/client'

type AddClientFormProps = {
  toggleModal?: () => void
  client?: Client
  submitHandler: (
    values: AddClientSchemaValues
  ) => Promise<{ error?: string; success?: string }>
}

const AddClientForm: React.FC<AddClientFormProps> = ({
  toggleModal,
  client,
  submitHandler,
}) => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const { name, email, phone, billingAddress, businessName } = client || {}

  const form = useForm<AddClientSchemaValues>({
    resolver: zodResolver(AddClientSchema),
    defaultValues: {
      name: name || undefined,
      email: email || undefined,
      phoneNumber: phone || undefined,
      billingAddress: billingAddress || undefined,
      businessName: businessName || undefined,
    },
  })

  const { handleSubmit, control, reset } = form

  const onSubmit = (values: AddClientSchemaValues) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      submitHandler(values).then((res) => {
        setError(res?.error)
        setSuccess(res?.success)
      })
    })
    reset()
    success && toggleModal && toggleModal()
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

export default AddClientForm

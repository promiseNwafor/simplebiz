'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { PartialPaymentSchema, PartialPaymentSchemaValues } from '@/schemas'
import { addPartialPayment } from '@/actions/partial-payments'
import { ngnFormatter } from '@/lib'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type PartialPaymentFormProps = {
  invoiceId: string
  invoiceAmount: number
  currentPaidAmount: number
  onSuccess?: () => void
}

const paymentMethods = [
  { value: 'ONLINE', label: 'Online Payment (Paystack)' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CASH', label: 'Cash' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'OTHER', label: 'Other' },
]

export default function PartialPaymentForm({
  invoiceId,
  invoiceAmount,
  currentPaidAmount,
  onSuccess,
}: PartialPaymentFormProps) {
  const [isPending, setIsPending] = useState(false)
  const outstandingBalance = invoiceAmount - currentPaidAmount

  const form = useForm<PartialPaymentSchemaValues>({
    resolver: zodResolver(PartialPaymentSchema),
    defaultValues: {
      invoiceId,
      amount: outstandingBalance, // Default to full outstanding balance
      paymentMethod: 'ONLINE',
      notes: '',
    },
  })

  const onSubmit = async (values: PartialPaymentSchemaValues) => {
    if (values.amount > outstandingBalance) {
      form.setError('amount', {
        message: `Amount cannot exceed outstanding balance of ${ngnFormatter.format(outstandingBalance)}`,
      })
      return
    }

    if (values.amount <= 0) {
      form.setError('amount', {
        message: 'Amount must be greater than 0',
      })
      return
    }

    setIsPending(true)
    try {
      const result = await addPartialPayment(values)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(result.success || 'Payment added successfully')
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting partial payment:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  const handleQuickFill = (percentage: number) => {
    const amount = (outstandingBalance * percentage) / 100
    form.setValue('amount', Math.round(amount * 100) / 100)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='bg-secondary p-4 rounded-lg space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Invoice Total:</span>
            <span className='font-semibold'>{ngnFormatter.format(invoiceAmount)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Amount Paid:</span>
            <span className='font-semibold'>{ngnFormatter.format(currentPaidAmount)}</span>
          </div>
          <div className='flex justify-between text-sm border-t pt-2'>
            <span className='text-muted-foreground'>Outstanding Balance:</span>
            <span className='font-semibold text-primary'>
              {ngnFormatter.format(outstandingBalance)}
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Amount</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  min='0.01'
                  max={outstandingBalance}
                  placeholder='Enter payment amount'
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
              <div className='flex gap-2 mt-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleQuickFill(25)}
                >
                  25%
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleQuickFill(50)}
                >
                  50%
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleQuickFill(75)}
                >
                  75%
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleQuickFill(100)}
                >
                  Full
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='paymentMethod'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select payment method' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Add any notes about this payment...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? 'Processing...' : 'Add Payment'}
        </Button>
      </form>
    </Form>
  )
}

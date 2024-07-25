import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CirclePlus, SquarePen } from 'lucide-react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentDetail } from '@prisma/client'
import { PaymentWithdrawalSchema } from '@/schemas'
import { useRequestWithdrawal } from '@/store/useStoreData'
import { ngnFormatter } from '@/lib'
import { Form } from '@/components/ui/form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AuthError } from '@/components/auth/AuthError'
import { displayDetails, ModalScreen } from './PaymentDetails'

type PaymentAccountProps = {
  toggleModal: (screen?: ModalScreen) => void
  balance: number
  pendingAmount: number | undefined | null
  accountDetails: PaymentDetail | undefined
}

const PaymentWithdrawal: React.FC<PaymentAccountProps> = ({
  balance,
  accountDetails,
  toggleModal,
  pendingAmount,
}) => {
  const [inputError, setInputError] = useState('')

  const { mutateAsync: withdraw, isPending } = useRequestWithdrawal()

  const form = useForm({
    resolver: zodResolver(PaymentWithdrawalSchema),
    defaultValues: {
      amount: undefined as unknown as number,
      paymentDetailId: accountDetails?.id || undefined,
    },
  })

  const { handleSubmit, control, setValue } = form

  const onSubmit = async (values: any) => {
    try {
      const res = await withdraw({ values, balance })
      if (res.error) {
        return toast.error(res.error)
      }
      toggleModal()
      return toast.success(res?.success)
    } catch (error) {
      console.error(error)
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputError('')

    const value = +e.target.value
    setValue('amount', value)

    if (value > balance) {
      setInputError('Amount exceeds your wallet balance!')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-1'>
          <small className='font-medium'>Available balance</small>
          <p>{ngnFormatter.format(balance - (pendingAmount || 0))}</p>
        </div>
        <div className='bg-white flex flex-col justify-between rounded-lg min-h-[60px]'>
          <small className='font-medium'>Account information</small>
          {accountDetails ? (
            <small>{displayDetails(accountDetails)}</small>
          ) : (
            <div className='opacity-50 text-sm py-2'>
              Account information not added yet
            </div>
          )}
          <Button
            variant='ghost'
            size='icon'
            className='text-primary hover:text-primary hover:bg-transparent'
            onClick={() => toggleModal(ModalScreen.DETAILS)}
          >
            {accountDetails ? (
              <div className='flex items-center gap-1 ml-2'>
                <SquarePen /> Edit
              </div>
            ) : (
              <div className='flex items-center gap-1 ml-2'>
                <CirclePlus /> Add
              </div>
            )}
          </Button>
        </div>

        <FormField
          control={control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>Amount to withdraw</FormLabel>
              <FormControl>
                <Input
                  placeholder='0'
                  type='number'
                  {...field}
                  onChange={onChange}
                />
              </FormControl>
              <FormMessage />
              <AuthError message={inputError} />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isPending || !!inputError}>
          Save
        </Button>
      </form>
    </Form>
  )
}

export default PaymentWithdrawal
